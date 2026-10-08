// One-time (and safe to repeat) repair of the copies stored on user records.
//
// Usage, from the backend folder with MONGO_DB_KEY in .env or the shell:
//   node scripts/rebuild-user-copies.js           # dry run: reports drift, changes nothing
//   node scripts/rebuild-user-copies.js --apply   # fix it
//
// What it does:
//   * users.userTasks, userToolTracks, userServiceToolTracks are rebuilt from
//     the tasks / toolsTrack / serviceToolsTrack collections.
//   * users.userLabor: every employee listed on a manpower record gets an
//     entry if they are missing one, and entries get that record's current
//     job, dates and shift. Days with recorded hours are always kept.
//     Entries that are NOT on the manpower record (or whose manpower record
//     no longer exists) are only reported, never removed, because they may
//     hold hours that payroll still needs.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const manpowerModel = require("../models/manpowerModel");
const toolTrackModel = require("../models/toolTrackModel");
const serviceToolTrackModel = require("../models/serviceToolTrackModel");
const {
  rebuildUserTasks,
  tasksForUser,
  syncToolTrackCopies,
  syncManpowerLabor,
  dayHasData,
  ROLES,
} = require("../utils/userCopies");

const apply = process.argv.includes("--apply");

const ids = (arr) => (arr || []).map((x) => String(x && x._id)).sort().join(",");

(async () => {
  if (!process.env.MONGO_DB_KEY) {
    console.error("MONGO_DB_KEY is not set");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_DB_KEY);
  console.log(apply ? "APPLYING FIXES\n" : "DRY RUN (nothing will be changed)\n");

  // ---- tasks and tool tracks
  const users = await userModel
    .find({}, { email: 1, fullname: 1, userTasks: 1, userToolTracks: 1, userServiceToolTracks: 1 })
    .lean();
  let taskDrift = 0;
  let trackDrift = 0;
  let serviceDrift = 0;
  for (const u of users) {
    const tasks = await tasksForUser(u);
    if (ids(tasks) !== ids(u.userTasks)) {
      taskDrift++;
      if (apply) await rebuildUserTasks(u);
    }
    const tracks = await toolTrackModel.find({ techAssigned: u.fullname }, { _id: 1 }).lean();
    if (ids(tracks) !== ids(u.userToolTracks)) {
      trackDrift++;
      if (apply) await syncToolTrackCopies("tool", [u.fullname]);
    }
    const sTracks = await serviceToolTrackModel.find({ techAssigned: u.fullname }, { _id: 1 }).lean();
    if (ids(sTracks) !== ids(u.userServiceToolTracks)) {
      serviceDrift++;
      if (apply) await syncToolTrackCopies("service", [u.fullname]);
    }
  }
  console.log(`Tasks: ${taskDrift} of ${users.length} users have an out-of-date task list${apply ? " (rebuilt)" : ""}.`);
  console.log(`Tool tracks: ${trackDrift} users out of date${apply ? " (rebuilt)" : ""}.`);
  console.log(`Service tool tracks: ${serviceDrift} users out of date${apply ? " (rebuilt)" : ""}.`);

  // ---- labor
  const manpowers = await manpowerModel.find({});
  const manpowerIds = new Set(manpowers.map((m) => String(m._id)));
  let added = 0;
  let updated = 0;
  let extra = 0;
  const unknown = new Set();
  for (const m of manpowers) {
    if (apply) {
      const s = await syncManpowerLabor(m, { removeUnassigned: false });
      added += s.added;
      updated += s.updated;
      extra += s.keptWithHours;
      s.unknownNames.forEach((n) => unknown.add(`${n} (job ${m.job})`));
    } else {
      // Report only: who is listed on the record but has no labor entry.
      for (const role of ROLES) {
        for (const e of (m.assignedEmp[role] && m.assignedEmp[role].employees) || []) {
          if (!e || !e.fullname) continue;
          const u = await userModel.findOne(
            { fullname: e.fullname },
            { userLabor: 1 }
          );
          if (!u) unknown.add(`${e.fullname} (job ${m.job})`);
          else if (!u.userLabor.some((l) => String(l.manpowerId) === String(m._id) && l[role] === true)) added++;
        }
      }
    }
  }
  const withLabor = await userModel.find({ "userLabor.0": { $exists: true } }, { fullname: 1, userLabor: 1 });
  const orphans = [];
  for (const u of withLabor) {
    for (const l of u.userLabor) {
      if (!manpowerIds.has(String(l.manpowerId))) {
        orphans.push(`${u.fullname}: job ${l.job} (${l.timeEntries.filter(dayHasData).length} days with hours)`);
      }
    }
  }
  console.log(`Labor: ${added} missing entries ${apply ? "added" : "would be added"}${apply ? `, ${updated} entries updated to match their job's dates/shift` : ""}.`);
  if (extra) console.log(`  ${extra} entries belong to people no longer listed on their job and hold recorded hours (kept).`);
  if (unknown.size) console.log(`  Listed on a job but no user with that exact name: ${[...unknown].join("; ")}`);
  if (orphans.length) {
    console.log(`  ${orphans.length} labor entries point to a deleted job (kept, review manually):`);
    orphans.slice(0, 50).forEach((o) => console.log(`    - ${o}`));
  }
  if (!apply) console.log("\nRe-run with --apply to fix.");
  await mongoose.disconnect();
})().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});
