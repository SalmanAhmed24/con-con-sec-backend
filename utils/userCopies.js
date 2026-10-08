// Keeps the copies stored on user documents in step with their sources.
//
//   users.userTasks             <- tasks            (assignee by email, else fullname)
//   users.userToolTracks        <- toolsTrack       (techAssigned == fullname)
//   users.userServiceToolTracks <- serviceToolsTrack(techAssigned == fullname)
//   users.userLabor             <- manpowers.assignedEmp (+ recorded hours, which
//                                  live only on the user and are never discarded)
//
// Rather than pushing/pulling individual items (which drifted whenever a write
// failed, ran out of order, or touched the wrong user), each affected user's
// copy is rebuilt from the source collection. Rebuilding is idempotent, so a
// copy that has drifted for any reason is corrected the next time it is
// touched, and scripts/rebuild-user-copies.js can repair everything at once.
const moment = require("moment");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const toolTrackModel = require("../models/toolTrackModel");
const serviceToolTrackModel = require("../models/serviceToolTrackModel");
const manpowerModel = require("../models/manpowerModel");

const clean = (v) => (v == null ? "" : String(v).trim());
const uniq = (arr) => [...new Set(arr.filter(Boolean))];

// ---------------------------------------------------------------- tasks

// People named in a task's assignedTo list, as { email, fullname }.
const taskAssignees = (task) =>
  task && Array.isArray(task.assignedTo)
    ? task.assignedTo.map((a) => ({ email: clean(a.email), fullname: clean(a.fullname) }))
    : [];

const findUsersForPeople = async (people) => {
  const emails = uniq(people.map((p) => p.email));
  const names = uniq(people.filter((p) => !p.email).map((p) => p.fullname));
  if (!emails.length && !names.length) return [];
  const or = [];
  if (emails.length) or.push({ email: { $in: emails } });
  if (names.length) or.push({ fullname: { $in: names } });
  return userModel.find({ $or: or }, { email: 1, fullname: 1 }).lean();
};

// Same rule addTask always used: match by email when the assignee has one,
// otherwise by full name.
const tasksForUser = async (user) => {
  const or = [];
  if (user.email) or.push({ "assignedTo.email": user.email });
  if (user.fullname) or.push({ "assignedTo.fullname": user.fullname });
  if (!or.length) return [];
  const candidates = await taskModel.find({ $or: or });
  return candidates.filter((t) =>
    (t.assignedTo || []).some((a) =>
      clean(a.email)
        ? clean(a.email) === clean(user.email)
        : clean(a.fullname) === clean(user.fullname)
    )
  );
};

const rebuildUserTasks = async (user) => {
  const tasks = await tasksForUser(user);
  await userModel.updateOne(
    { _id: user._id },
    { $set: { userTasks: tasks.map((t) => t.toObject()) } }
  );
};

// Call after any change to a task, with its state before and after (either
// may be null for create/delete). Rebuilds every affected user's userTasks.
const syncTaskCopies = async (before, after) => {
  const people = [...taskAssignees(before), ...taskAssignees(after)];
  const users = await findUsersForPeople(people);
  for (const user of users) await rebuildUserTasks(user);
  return users.length;
};

// ------------------------------------------------------------ tool tracks

const TRACK_KINDS = {
  tool: { model: toolTrackModel, field: "userToolTracks" },
  service: { model: serviceToolTrackModel, field: "userServiceToolTracks" },
};

// Rebuilds userToolTracks (kind "tool") or userServiceToolTracks ("service")
// for the given technician names.
const syncToolTrackCopies = async (kind, techNames) => {
  const { model, field } = TRACK_KINDS[kind];
  const names = uniq(techNames.map(clean));
  for (const name of names) {
    const tracks = await model.find({ techAssigned: name });
    await userModel.updateOne(
      { fullname: name },
      { $set: { [field]: tracks.map((t) => t.toObject()) } }
    );
  }
  return names.length;
};

// ------------------------------------------------------------------ labor

const ROLES = ["foreman", "journeyman", "apprentice", "construction"];

// Same day key the check-in/out endpoints use to find a day's entry.
const dayKey = (d) => moment(d).format("MM-DD-YYYY");

const daysBetween = (start, end) => {
  const days = [];
  if (!start || !end) return days;
  const last = new Date(end);
  for (const dt = new Date(start); dt <= last; dt.setDate(dt.getDate() + 1)) {
    days.push(new Date(dt));
    if (days.length > 3660) break; // guard against bad dates
  }
  return days;
};

const blankDay = (date) => ({
  date,
  checkedIn: "",
  checkedOut: "",
  lunchTimeStart: "",
  lunchTimeEnd: "",
  notes: "",
  dayFlag: false,
  dayName: moment(date).format("dddd"),
  reimbursal: [],
});

const dayHasData = (e) =>
  !!(
    e &&
    (e.dayFlag ||
      clean(e.checkedIn) ||
      clean(e.checkedOut) ||
      clean(e.lunchTimeStart) ||
      clean(e.lunchTimeEnd) ||
      clean(e.notes) ||
      (Array.isArray(e.reimbursal) && e.reimbursal.length) ||
      e.spectrum)
  );

// One entry per day of the job. Days already present keep their recorded
// data. Days that fall outside new dates are dropped only if nothing was
// recorded on them; recorded hours are never thrown away.
const reconcileTimeEntries = (existing, start, end) => {
  const byDay = new Map();
  for (const e of existing || []) {
    const plain = e && typeof e.toObject === "function" ? e.toObject() : e;
    if (plain && plain.date) byDay.set(dayKey(plain.date), plain);
  }
  const result = [];
  const used = new Set();
  for (const d of daysBetween(start, end)) {
    const k = dayKey(d);
    used.add(k);
    result.push(byDay.get(k) || blankDay(d));
  }
  for (const [k, e] of byDay) {
    if (!used.has(k) && dayHasData(e)) result.push(e);
  }
  return result.sort((a, b) => new Date(a.date) - new Date(b.date));
};

const assignedNames = (manpower, role) =>
  uniq(
    ((manpower.assignedEmp && manpower.assignedEmp[role] && manpower.assignedEmp[role].employees) || [])
      .map((e) => clean(e && e.fullname))
  );

// Makes every user's userLabor match manpower.assignedEmp for one manpower
// record: adds entries for newly assigned people, removes entries for people
// no longer assigned, and updates job/dates/shift for everyone else while
// keeping their recorded days. Returns a summary.
const syncManpowerLabor = async (manpowerOrId, { removeUnassigned = true } = {}) => {
  const manpower =
    typeof manpowerOrId === "object" && manpowerOrId !== null && manpowerOrId.assignedEmp
      ? manpowerOrId
      : await manpowerModel.findById(manpowerOrId);
  if (!manpower) return null;
  const manpowerId = manpower._id.toString();

  const wanted = Object.fromEntries(ROLES.map((r) => [r, new Set(assignedNames(manpower, r))]));
  const allWanted = uniq(ROLES.flatMap((r) => [...wanted[r]]));

  const users = await userModel.find({
    $or: [{ "userLabor.manpowerId": manpowerId }, { fullname: { $in: allWanted } }],
  });

  const summary = { added: 0, updated: 0, removed: 0, keptWithHours: 0, unknownNames: [] };
  const found = new Set(users.map((u) => u.fullname));
  summary.unknownNames = allWanted.filter((n) => !found.has(n));

  for (const user of users) {
    let changed = false;
    for (const role of ROLES) {
      const idx = user.userLabor.findIndex(
        (e) => String(e.manpowerId) === manpowerId && e[role] === true
      );
      const isWanted = wanted[role].has(user.fullname);
      if (idx === -1 && isWanted) {
        user.userLabor.push({
          job: manpower.job,
          startDate: manpower.startDate,
          endDate: manpower.endDate,
          shiftStartTime: manpower.shiftStartTime,
          shiftEndTime: manpower.shiftEndTime,
          manpowerId,
          [role]: true,
          timeEntries: reconcileTimeEntries([], manpower.startDate, manpower.endDate),
        });
        summary.added++;
        changed = true;
      } else if (idx !== -1 && !isWanted) {
        if (!removeUnassigned) {
          if (user.userLabor[idx].timeEntries.some(dayHasData)) summary.keptWithHours++;
          continue;
        }
        user.userLabor.splice(idx, 1);
        summary.removed++;
        changed = true;
      } else if (idx !== -1 && isWanted) {
        const entry = user.userLabor[idx];
        const nextEntries = reconcileTimeEntries(entry.timeEntries, manpower.startDate, manpower.endDate);
        const sameDates =
          nextEntries.length === entry.timeEntries.length &&
          nextEntries.every((e, i) => dayKey(e.date) === dayKey(entry.timeEntries[i].date));
        const fields = { job: manpower.job, startDate: manpower.startDate, endDate: manpower.endDate, shiftStartTime: manpower.shiftStartTime, shiftEndTime: manpower.shiftEndTime };
        const fieldsDiffer = Object.entries(fields).some(([k, v]) => String(entry[k] ?? "") !== String(v ?? ""));
        if (!sameDates || fieldsDiffer) {
          Object.assign(entry, fields);
          if (!sameDates) entry.timeEntries = nextEntries;
          summary.updated++;
          changed = true;
        }
      }
    }
    if (changed) await user.save();
  }
  return summary;
};

// Removes all labor entries for a manpower record (used when it is deleted).
const removeManpowerLabor = async (manpowerId) => {
  const id = String(manpowerId);
  const users = await userModel.find({ "userLabor.manpowerId": id });
  for (const user of users) {
    user.userLabor = user.userLabor.filter((l) => String(l.manpowerId) !== id);
    await user.save();
  }
  return users.length;
};

module.exports = {
  syncTaskCopies,
  tasksForUser,
  rebuildUserTasks,
  syncToolTrackCopies,
  syncManpowerLabor,
  removeManpowerLabor,
  reconcileTimeEntries,
  dayHasData,
  ROLES,
};
