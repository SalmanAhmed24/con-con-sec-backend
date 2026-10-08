// Safe "pull from Google Sheets" for collections that mirror a sheet.
//
// Previous behaviour was deleteMany({}) + insertMany(sheetRows), which wiped
// every field the sheet does not hold (invoices, payments, attachments, notes,
// vendor locations), every record missing from the sheet, and changed every
// _id. This helper instead:
//   * matches columns by header name, not position, so a moved or extra
//     column cannot shift data into the wrong field;
//   * updates existing records in place, matched on a key column, touching
//     only the fields that come from the sheet;
//   * inserts records that are new in the sheet;
//   * never deletes anything. Records missing from the sheet are reported.

const normalizeHeader = (h) =>
  String(h == null ? "" : h)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const cellToString = (v) => (v == null ? "" : String(v).trim());

const toBoolean = (v) => {
  const s = cellToString(v).toLowerCase();
  return ["true", "yes", "y", "1", "x", "✓"].includes(s);
};

// columns: [{ field, headers: ["Header", "alias"...], type?: "boolean" }]
// Returns { rows, missingFields, headerRow }.
const mapRowsByHeader = (values, columns, { tab } = {}) => {
  if (!Array.isArray(values) || values.length === 0) {
    return { rows: [], missingFields: columns.map((c) => c.field), headerRow: [] };
  }
  const headerRow = values[0].map(cellToString);
  const index = new Map();
  headerRow.forEach((h, i) => {
    const key = normalizeHeader(h);
    if (key && !index.has(key)) index.set(key, i);
  });

  const located = [];
  const missingFields = [];
  for (const col of columns) {
    const i = col.headers
      .map(normalizeHeader)
      .map((h) => index.get(h))
      .find((x) => x !== undefined);
    if (i === undefined) missingFields.push(col.field);
    else located.push({ ...col, i });
  }

  const rows = [];
  for (let r = 1; r < values.length; r++) {
    const raw = values[r] || [];
    if (raw.every((c) => cellToString(c) === "")) continue; // blank line
    const row = { __sheetRow: tab ? `${tab} ${r + 1}` : r + 1 };
    for (const col of located) {
      // The Sheets API drops trailing empty cells, so a missing cell is blank.
      const cell = raw[col.i];
      row[col.field] = col.type === "boolean" ? toBoolean(cell) : cellToString(cell);
    }
    rows.push(row);
  }
  return { rows, missingFields, headerRow };
};

const sameValue = (a, b) => {
  if (typeof b === "boolean") return Boolean(a) === b;
  return cellToString(a) === cellToString(b);
};

// Upserts sheet rows into `model` matched on `keyField`. Never deletes.
const mergeRowsIntoCollection = async (model, rows, keyField, { dryRun = false } = {}) => {
  const summary = {
    sheetRows: rows.length,
    created: 0,
    updated: 0,
    unchanged: 0,
    skippedNoKey: [],
    skippedDuplicateKey: [],
    notInSheet: 0,
    notInSheetSample: [],
  };

  // Rows without a key cannot be matched safely. Keys repeated in the sheet are
  // ambiguous (which row wins?), so all copies are skipped and reported.
  const byKey = new Map();
  const dupes = new Set();
  for (const row of rows) {
    const key = row[keyField];
    if (!key) {
      summary.skippedNoKey.push(row.__sheetRow);
      continue;
    }
    if (byKey.has(key)) dupes.add(key);
    else byKey.set(key, row);
  }
  for (const key of dupes) {
    byKey.delete(key);
    summary.skippedDuplicateKey.push(key);
  }

  const projection = { [keyField]: 1 };
  for (const row of rows) {
    for (const f of Object.keys(row)) if (f !== "__sheetRow") projection[f] = 1;
  }
  const existing = await model.find({}, projection).lean();
  const existingByKey = new Map();
  for (const doc of existing) {
    const key = cellToString(doc[keyField]);
    if (!existingByKey.has(key)) existingByKey.set(key, []);
    existingByKey.get(key).push(doc);
  }

  const ops = [];
  for (const [key, row] of byKey) {
    const { __sheetRow, ...fields } = row;
    const docs = existingByKey.get(key);
    if (!docs) {
      ops.push({ insertOne: { document: fields } });
      summary.created++;
      continue;
    }
    const changed = docs.some((doc) =>
      Object.entries(fields).some(([f, v]) => !sameValue(doc[f], v))
    );
    if (!changed) {
      summary.unchanged++;
      continue;
    }
    // Only fields that come from the sheet are written; everything else on the
    // record (embedded arrays, notes, files, _id) is left as it is.
    ops.push({
      updateMany: { filter: { [keyField]: key }, update: { $set: fields } },
    });
    summary.updated++;
  }

  for (const [key] of existingByKey) {
    if (!byKey.has(key) && !dupes.has(key)) {
      summary.notInSheet++;
      if (summary.notInSheetSample.length < 25) summary.notInSheetSample.push(key || "(blank)");
    }
  }

  if (!dryRun && ops.length) {
    await model.bulkWrite(ops, { ordered: false });
  }
  return summary;
};

const describeSummary = (s, label) => {
  const parts = [
    `${s.created} new`,
    `${s.updated} updated`,
    `${s.unchanged} unchanged`,
  ];
  let msg = `Sync from Google Sheet done: ${parts.join(", ")} ${label}.`;
  if (s.skippedDuplicateKey.length)
    msg += ` Skipped ${s.skippedDuplicateKey.length} repeated in the sheet (${s.skippedDuplicateKey.slice(0, 10).join(", ")}).`;
  if (s.skippedNoKey.length)
    msg += ` Skipped ${s.skippedNoKey.length} rows with no key (sheet rows ${s.skippedNoKey.slice(0, 10).join(", ")}).`;
  if (s.notInSheet)
    msg += ` ${s.notInSheet} records in the app are not in the sheet and were kept.`;
  return msg;
};

module.exports = {
  mapRowsByHeader,
  mergeRowsIntoCollection,
  describeSummary,
  normalizeHeader,
  toBoolean,
};
