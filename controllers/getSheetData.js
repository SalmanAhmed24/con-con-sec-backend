const { google } = require("googleapis");
const dotenv = require("dotenv");
// type: "service_account",
//     project_id: `${process.env.GOOGLE_SHEET_PROJECT_ID}`,
//     private_key_id: `${process.env.GOOGLE_SHEET_KEY_ID}`,
//     private_key: `${process.env.GOOGLE_SHEET_KEY}`,
//     client_email: `${process.env.GOOGLE_SHEET_CLIENT_EMAIL}`,
//     client_id: `${process.env.GOOGLE_SHEET_CLIENT_ID}`,
//     auth_uri: "https://accounts.google.com/o/oauth2/auth",
//     token_uri: "https://oauth2.googleapis.com/token",
//     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//     client_x509_cert_url:
//       "https://www.googleapis.com/robot/v1/metadata/x509/sheettesting%40crested-studio-429304-f7.iam.gserviceaccount.com",
//     universe_domain: "googleapis.com",
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: `${process.env.GOOGLE_SHEET_PROJECT_ID}`,
    private_key_id: `${process.env.GOOGLE_SHEET_KEY_ID}`,
    private_key: `${process.env.GOOGLE_SHEET_KEY}`,
    client_email: `${process.env.GOOGLE_SHEET_CLIENT_EMAIL}`,
    client_id: `${process.env.GOOGLE_SHEET_CLIENT_ID}`,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/sheettesting%40crested-studio-429304-f7.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const jobNumberModel = require("../models/jobNumber");
const {
  mapRowsByHeader,
  mergeRowsIntoCollection,
  describeSummary,
} = require("../utils/sheetSync");
const JOB_NUMBER_COLUMNS = [
  { field: "jobNumber", headers: ["Job Number", "Job No", "Job #"] },
  { field: "jobName", headers: ["Job Name"] },
  { field: "generalContractor", headers: ["General Contractor", "GC"] },
  { field: "jobPM", headers: ["Job PM", "PM", "Project Manager"] },
  { field: "dateCreated", headers: ["Date Created"] },
  { field: "dateBilled", headers: ["Date Billed"] },
  { field: "contractTM", headers: ["Contract/TM", "Contract TM"] },
  { field: "amount", headers: ["Amount"] },
  { field: "PO", headers: ["PO"] },
  { field: "CO", headers: ["CO"] },
  { field: "percentageBilled", headers: ["Percentage Billed", "% Billed"] },
  { field: "notes", headers: ["Notes"] },
  { field: "projectChecklist", headers: ["Project Checklist"] },
  { field: "QBW", headers: ["QBW"], type: "boolean" },
  { field: "PAY", headers: ["PAY"], type: "boolean" },
];
const getSheetsData = async (req, res, next) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    // Map columns by header name so reading matches what the app writes.
    const { rows, headerRow } = mapRowsByHeader(response.data.values, JOB_NUMBER_COLUMNS);
    const out = rows.map(({ __sheetRow, ...row }) => row);
    out.hasHeader = headerRow.some((h) => h !== "");
    return out;
  } catch (error) {
    console.log(error);
  }
};
// Pull job numbers from the sheet. Updates matching job numbers in place and
// adds new ones; never deletes (see utils/sheetSync.js).
const syncDataFromSheet = async (req, res, next) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const { rows, missingFields } = mapRowsByHeader(
      response.data.values,
      JOB_NUMBER_COLUMNS
    );
    if (missingFields.includes("jobNumber")) {
      return res.json({
        error: true,
        message:
          'Sync cancelled: the sheet has no "Job Number" column. Nothing was changed.',
      });
    }
    const summary = await mergeRowsIntoCollection(
      jobNumberModel,
      rows,
      "jobNumber"
    );
    res.json({
      error: false,
      message: describeSummary(summary, "job numbers"),
      summary,
      ignoredMissingColumns: missingFields,
    });
  } catch (error) {
    console.log("job number sheet sync failed", error.message);
    res.json({
      message: "Sync failed. Nothing was deleted.",
      error: true,
    });
  }
};
const addSingleData = async (req, res, next) => {
  const {
    jobNumber,
    jobName,
    initials,
    generalContractor,
    contractTM,
    amount,
    PO,
    CO,
    percentageBilled,
    notes,
    projectChecklist,
    dateCreated,
    dateBilled,
    jobPM,
    QBW,
    PAY,
  } = req.body;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";
  const sheetData = await getSheetsData();
  if (sheetData === undefined) {
    return res.json({
      message: "Could not read the Google Sheet, so the row was not added.",
      error: true,
    });
  }
  var resource;
  if (sheetData !== undefined) {
    console.log("here in not undefined");
    if (sheetData.length || sheetData.hasHeader) {
      resource = {
        values: [
          [
            `${jobNumber}`,
            `${jobName}`,
            `${generalContractor}`,
            `${jobPM}`,
            `${dateCreated}`,
            `${dateBilled}`,
            `${contractTM}`,
            `${amount}`,
            `${PO}`,
            `${CO}`,
            `${percentageBilled}`,
            `${notes}`,
            `${projectChecklist}`,
            `${QBW}`,
            `${PAY}`,
          ],
        ],
      };
    } else {
      console.log("first time sheets");
      resource = {
        values: [
          [
            "Job Number",
            "Job Name",
            "General Contractor",
            "Job PM",
            "Date Created",
            "Date Billed",
            "Contract/TM",
            "Amount",
            "PO",
            "CO",
            "Percentage Billed",
            "Notes",
            "Project Checklist",
            "QBW",
            "PAY",
          ],
          [
            `${jobNumber}`,
            `${jobName}`,
            `${generalContractor}`,
            `${jobPM}`,
            `${dateCreated}`,
            `${dateBilled}`,
            `${contractTM}`,
            `${amount}`,
            `${PO}`,
            `${CO}`,
            `${percentageBilled}`,
            `${notes}`,
            `${projectChecklist}`,
            `${QBW}`,
            `${PAY}`,
          ],
        ],
      };
    }
  } else {
    console.log("sheets is undefined and in second else");
    resource = {
      values: [
        [
          "Job Number",
          "Job Name",
          "General Contractor",
          "Job PM",
          "Date Created",
          "Date Billed",
          "Contract/TM",
          "Amount",
          "PO",
          "CO",
          "Percentage Billed",
          "Notes",
          "Project Checklist",
          "QBW",
          "PAY",
        ],
        [
          `${jobNumber}`,
          `${jobName}`,
          `${generalContractor}`,
          `${jobPM}`,
          `${dateCreated}`,
          `${dateBilled}`,
          `${contractTM}`,
          `${amount}`,
          `${PO}`,
          `${CO}`,
          `${percentageBilled}`,
          `${notes}`,
          `${projectChecklist}`,
          `${QBW}`,
          `${PAY}`,
        ],
      ],
    };
  }
  try {
    // await sheets.spreadsheets.values.clear({
    //   spreadsheetId,
    //   range,
    // });
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    if (response.status >= 200 && response.status < 300) {
      return res.json({
        message: "Data added into spreadSheet",
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "Google Sheet update failed", error: true });
  }
  if (!res.headersSent) {
    res.json({ message: "Google Sheet update failed", error: true });
  }
};

const deleteResult = async (req, res, next) => {
  const { jobNumber } = req.params;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";
  console.log(jobNumber);
  const allSheets = await getSheetsData();
  if (!Array.isArray(allSheets)) {
    return res.json({ message: "Could not read the Google Sheet. Nothing was changed.", error: true });
  }
  const filteredSheets = allSheets.filter(
    (item) => item.jobNumber !== jobNumber
  );
  //   const data = {
  //     values: [getKeyValues(filteredSheets)],
  //   };
  var resource;
  const data = filteredSheets.map((inner) => {
    return [
      inner.jobNumber,
      inner.jobName,
      inner.generalContractor,
      inner.jobPM,
      inner.dateCreated,
      inner.dateBilled,
      inner.contractTM,
      inner.amount,
      inner.PO,
      inner.CO,
      inner.percentageBilled,
      inner.notes,
      inner.projectChecklist,
      inner.QBW,
      inner.PAY,
    ];
  });
  if (data && data.length) {
    resource = {
      values: [
        [
          "Job Number",
          "Job Name",
          "General Contractor",
          "Job PM",
          "Date Created",
          "Date Billed",
          "Contract/TM",
          "Amount",
          "PO",
          "CO",
          "Percentage Billed",
          "Notes",
          "Project Checklist",
          "QBW",
          "PAY",
        ],
        ...data,
      ],
    };
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
      });
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });
      if (response.status >= 200 && response.status < 300) {
        return res.json({
          message: "SpreadSheet updated successfully",
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({ message: "Google Sheet update failed", error: true });
    }
  } else {
    try {
      const response = await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
      });
      if (response.status >= 200 && response.status < 300) {
        return res.json({
          message: "Spreadsheet Updated Successfully",
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({ message: "Google Sheet update failed", error: true });
    }
  }
  if (!res.headersSent) {
    res.json({ message: "Google Sheet update failed", error: true });
  }
};

const editResult = async (req, res, next) => {
  const { newEntry, oldEntry } = req.body;
  console.log("old", oldEntry);
  console.log("newEntry", newEntry);
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";
  const allSheets = await getSheetsData();
  if (!Array.isArray(allSheets)) {
    return res.json({ message: "Could not read the Google Sheet. Nothing was changed.", error: true });
  }
  console.log("all sheets before edit", allSheets);
  const allSheetsAfterUpdate = allSheets.map((item) => {
    if (item.jobNumber == oldEntry.jobNumber) {
      item.jobNumber = newEntry.jobNumber;
      item.jobName = newEntry.jobName;
      item.generalContractor = newEntry.generalContractor;
      item.jobPM = newEntry.jobPM;
      item.dateCreated = newEntry.dateCreated;
      item.dateBilled = newEntry.dateBilled;
      item.contractTM = newEntry.contractTM;
      item.amount = newEntry.amount;
      item.PO = newEntry.PO;
      item.CO = newEntry.CO;
      item.percentageBilled = newEntry.percentageBilled;
      item.notes = newEntry.notes;
      item.projectChecklist = newEntry.projectChecklist;
      item.QBW = newEntry.QBW;
      item.PAY = newEntry.PAY;
      return item;
    } else {
      return item;
    }
  });
  const data = allSheetsAfterUpdate.map((inner) => {
    return [
      inner.jobNumber,
      inner.jobName,
      inner.generalContractor,
      inner.jobPM,
      inner.dateCreated,
      inner.dateBilled,
      inner.contractTM,
      inner.amount,
      inner.PO,
      inner.CO,
      inner.percentageBilled,
      inner.notes,
      inner.projectChecklist,
      inner.QBW,
      inner.PAY,
    ];
  });
  if (data && data.length) {
    resource = {
      values: [
        [
          "Job Number",
          "Job Name",
          "General Contractor",
          "Job PM",
          "Date Created",
          "Date Billed",
          "Contract/TM",
          "Amount",
          "PO",
          "CO",
          "Percentage Billed",
          "Notes",
          "Project Checklist",
          "QBW",
          "PAY",
        ],
        ...data,
      ],
    };
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range,
      });
      const response = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption,
        resource,
      });
      if (response.status >= 200 && response.status < 300) {
        return res.json({
          message: "SpreadSheet updated successfully",
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({ message: "Google Sheet update failed", error: true });
    }
  }
  if (!res.headersSent) {
    res.json({ message: "Google Sheet update failed", error: true });
  }
};

const syncDataToSheet = async (req, res, next) => {
  const { data } = req.body;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1bMJp23r0BzSLSN55fN_0oNWyDb0O1IV8oipMuvrh5UY";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";

  var resource;
  var allJobNumbers;
  try {
    allJobNumbers = await jobNumberModel.find({});
  } catch (error) {
    res.json({ error: true, message: "Sync Failed" });
  }
  const customizedValues = allJobNumbers.map((inner) => {
    return [
      inner.jobNumber,
      inner.jobName,
      inner.generalContractor,
      inner.jobPM,
      inner.dateCreated,
      inner.dateBilled,
      inner.contractTM,
      inner.amount,
      inner.PO,
      inner.CO,
      inner.percentageBilled,
      inner.notes,
      inner.projectChecklist,
      inner.QBW,
      inner.PAY,
    ];
  });
  resource = {
    values: [
      [
        "Job Number",
        "Job Name",
        "General Contractor",
        "Job PM",
        "Date Created",
        "Date Billed",
        "Contract/TM",
        "Amount",
        "PO",
        "CO",
        "Percentage Billed",
        "Notes",
        "Project Checklist",
        "QBW",
        "PAY",
      ],
      ...customizedValues,
    ],
  };
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range,
    });
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      resource,
    });
    if (response.status >= 200 && response.status < 300) {
      return res.json({
        message: "SpreadSheet updated successfully",
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: "Google Sheet update failed", error: true });
  }
  if (!res.headersSent) {
    res.json({ message: "Google Sheet update failed", error: true });
  }
};

exports.syncDataFromSheet = syncDataFromSheet;
exports.addSingleData = addSingleData;
exports.deleteResult = deleteResult;
exports.editResult = editResult;
exports.syncDataToSheet = syncDataToSheet;
