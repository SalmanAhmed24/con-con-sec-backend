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
const vendorModel = require("../models/vendors");
const {
  mapRowsByHeader,
  mergeRowsIntoCollection,
  describeSummary,
} = require("../utils/sheetSync");
const VENDOR_COLUMNS = [
  { field: "name", headers: ["Vendor Name", "Name"] },
  { field: "vendorCategory", headers: ["Vendor Category", "Category"] },
  { field: "companyName", headers: ["Company Name"] },
  { field: "address", headers: ["Address"] },
  { field: "city", headers: ["City"] },
  { field: "state", headers: ["State"] },
  { field: "zipCode", headers: ["Zip Code", "Zip"] },
  { field: "primaryContact", headers: ["Primary Contact"] },
  { field: "phone", headers: ["Phone"] },
  { field: "email", headers: ["Email"] },
  { field: "website", headers: ["Website"] },
  { field: "preferred", headers: ["Preferred"], type: "boolean" },
];
const getSheetsData = async (req, res, next) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1H6Qan_lReHNT8Q6-vxPGVTiNaOFgLoMQEJeYqUhiiOc";
  const range = "Sheet1";
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    // Map columns by header name so reading matches what the app writes.
    const { rows, headerRow } = mapRowsByHeader(response.data.values, VENDOR_COLUMNS);
    const out = rows.map(({ __sheetRow, ...row }) => row);
    out.hasHeader = headerRow.some((h) => h !== "");
    return out;
  } catch (error) {
    console.log(error);
  }
};
// Pull vendors from the sheet. Updates matching vendors (by Vendor Name) in
// place and adds new ones. Vendor locations and vendors missing from the sheet
// are never touched (see utils/sheetSync.js).
const syncDataFromSheet = async (req, res, next) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1H6Qan_lReHNT8Q6-vxPGVTiNaOFgLoMQEJeYqUhiiOc";
  const range = "Sheet1";
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const { rows, missingFields } = mapRowsByHeader(
      response.data.values,
      VENDOR_COLUMNS
    );
    if (missingFields.includes("name")) {
      return res.json({
        error: true,
        message:
          'Sync cancelled: the sheet has no "Vendor Name" column. Nothing was changed.',
      });
    }
    const summary = await mergeRowsIntoCollection(vendorModel, rows, "name");
    res.json({
      error: false,
      message: describeSummary(summary, "vendors"),
      summary,
      ignoredMissingColumns: missingFields,
    });
  } catch (error) {
    console.log("vendor sheet sync failed", error.message);
    res.json({
      message: "Sync failed. Nothing was deleted.",
      error: true,
    });
  }
};
const addSingleData = async (req, res, next) => {
  const {
    name,
          vendorCategory,
          companyName,
          address,
          city,
          state,
          zipCode,
          primaryContact,
          phone,
          email,
          website,
          preferred,
  } = req.body;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1H6Qan_lReHNT8Q6-vxPGVTiNaOFgLoMQEJeYqUhiiOc";
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
            `${name}`,
            `${vendorCategory}`,
            `${companyName}`,
            `${address}`,
            `${city}`,
            `${state}`,
            `${zipCode}`,
            `${primaryContact}`,
            `${phone}`,
            `${email}`,
            `${website}`,
            `${preferred}`,
          ],
        ],
      };
    } else {
      console.log("first time sheets");
      resource = {
        values: [
          [
             "Vendor Name",
          "Vendor Category",
          "Company Name",
          "Address",
          "City",
          "State",
          "Zip Code",
          "Primary Contact",
          "Phone",
          "Email",
          "Website",
          "Preferred",
          ],
          [
            `${name}`,
            `${vendorCategory}`,
            `${companyName}`,
            `${address}`,
            `${city}`,
            `${state}`,
            `${zipCode}`,
            `${primaryContact}`,
            `${phone}`,
            `${email}`,
            `${website}`,
            `${preferred}`,
          ],
        ],
      };
    }
  } else {
    console.log("sheets is undefined and in second else");
    resource = {
      values: [
        [
          "Vendor Name",
          "Vendor Category",
          "Company Name",
          "Address",
          "City",
          "State",
          "Zip Code",
          "Primary Contact",
          "Phone",
          "Email",
          "Website",
          "Preferred",
        ],
        [
          `${name}`,
            `${vendorCategory}`,
            `${companyName}`,
            `${address}`,
            `${city}`,
            `${state}`,
            `${zipCode}`,
            `${primaryContact}`,
            `${phone}`,
            `${email}`,
            `${website}`,
            `${preferred}`,
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
  const { name } = req.params;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1H6Qan_lReHNT8Q6-vxPGVTiNaOFgLoMQEJeYqUhiiOc";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";
  console.log(name);
  const allSheets = await getSheetsData();
  if (!Array.isArray(allSheets)) {
    return res.json({ message: "Could not read the Google Sheet. Nothing was changed.", error: true });
  }
  const filteredSheets = allSheets.filter(
    (item) => item.name !== name
  );
  //   const data = {
  //     values: [getKeyValues(filteredSheets)],
  //   };
  var resource;
  const data = filteredSheets.map((inner) => {
    return [
      inner.name,
         inner.vendorCategory,
          inner.companyName,
          inner.address,
          inner.city,
          inner.state,
          inner.zipCode,
          inner.primaryContact,
          inner.phone,
          inner.email,
          inner.website,
          inner.preferred,
    ];
  });
  if (data && data.length) {
    resource = {
      values: [
        [
          "Vendor Name",
          "Vendor Category",
          "Company Name",
          "Address",
          "City",
          "State",
          "Zip Code",
          "Primary Contact",
          "Phone",
          "Email",
          "Website",
          "Preferred",
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
  const spreadsheetId = "1H6Qan_lReHNT8Q6-vxPGVTiNaOFgLoMQEJeYqUhiiOc";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";
  const allSheets = await getSheetsData();
  if (!Array.isArray(allSheets)) {
    return res.json({ message: "Could not read the Google Sheet. Nothing was changed.", error: true });
  }
  console.log("all sheets before edit", allSheets);
  const allSheetsAfterUpdate = allSheets.map((item) => {
    if (item.name == oldEntry.name) {
      item.name = newEntry.name;
      item.vendorCategory = newEntry.vendorCategory;
      item.companyName = newEntry.companyName;
      item.address = newEntry.address;
      item.city = newEntry.city;
      item.state = newEntry.state;
      item.zipCode = newEntry.zipCode;
      item.primaryContact = newEntry.primaryContact;
      item.phone = newEntry.phone;
      item.email = newEntry.email;
      item.website = newEntry.website;
      item.preferred = newEntry.preferred;
      return item;
    } else {
      return item;
    }
  });
  const data = allSheetsAfterUpdate.map((inner) => {
    return [
      inner.name,
         inner.vendorCategory,
          inner.companyName,
          inner.address,
          inner.city,
          inner.state,
          inner.zipCode,
          inner.primaryContact,
          inner.phone,
          inner.email,
          inner.website,
          inner.preferred,
    ];
  });
  if (data && data.length) {
    resource = {
      values: [
        [
          "Vendor Name",
          "Vendor Category",
          "Company Name",
          "Address",
          "City",
          "State",
          "Zip Code",
          "Primary Contact",
          "Phone",
          "Email",
          "Website",
          "Preferred",
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
  const spreadsheetId = "1H6Qan_lReHNT8Q6-vxPGVTiNaOFgLoMQEJeYqUhiiOc";
  const range = "Sheet1";
  var valueInputOption = "USER_ENTERED";

  var resource;
  var allJobNumbers;
  try {
    allJobNumbers = await vendorModel.find({});
  } catch (error) {
    res.json({ error: true, message: "Sync Failed" });
  }
  const customizedValues = allJobNumbers.map((inner) => {
    return [
      inner.name,
         inner.vendorCategory,
          inner.companyName,
          inner.address,
          inner.city,
          inner.state,
          inner.zipCode,
          inner.primaryContact,
          inner.phone,
          inner.email,
          inner.website,
          inner.preferred,
    ];
  });
  resource = {
    values: [
      [
        "Vendor Name",
          "Vendor Category",
          "Company Name",
          "Address",
          "City",
          "State",
          "Zip Code",
          "Primary Contact",
          "Phone",
          "Email",
          "Website",
          "Preferred",
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
