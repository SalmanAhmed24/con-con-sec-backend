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
const clientModel = require("../models/client");
const {
  mapRowsByHeader,
  mergeRowsIntoCollection,
  describeSummary,
} = require("../utils/sheetSync");
const CUSTOMER_COLUMNS = [
  { field: "customerCode", headers: ["Customer Code", "Cust Code", "Code"] },
  { field: "customerName", headers: ["Customer Name", "Name"] },
  { field: "alphaCode", headers: ["Alpha Code"] },
  { field: "address", headers: ["Address"] },
  { field: "city", headers: ["City"] },
  { field: "state", headers: ["State"] },
  { field: "zipCode", headers: ["Zip Code", "Zip"] },
  { field: "phone", headers: ["Phone"] },
  { field: "fax", headers: ["Fax"] },
  { field: "primaryContact", headers: ["Primary Contact"] },
  { field: "primaryEmail", headers: ["Primary Email"] },
  { field: "secondaryEmail", headers: ["Secondary Email"] },
  { field: "customerType", headers: ["Customer Type"] },
  { field: "balance", headers: ["Balance"] },
  { field: "taxable", headers: ["Taxable"] },
  { field: "status", headers: ["Status"] },
  { field: "customerTerm", headers: ["Customer Term", "Terms"] },
  { field: "taxCode", headers: ["Tax Code"] },
  { field: "retailCertificate", headers: ["Retail Certificate"] },
  { field: "resaleExpDate", headers: ["Resale Exp Date"] },
  { field: "salesPersonCode", headers: ["Sales Person Code", "Salesperson Code"] },
  { field: "receiveStatements", headers: ["Receive Statements"] },
  { field: "financeCharge", headers: ["Finance Charge"] },
  { field: "retention", headers: ["Retention"] },
  { field: "lastDateBilled", headers: ["Last Date Billed"] },
  { field: "lastDatePaid", headers: ["Last Date Paid"] },
  { field: "dateEstablished", headers: ["Date Established"] },
  { field: "creditLimit", headers: ["Credit Limit"] },
  { field: "materialLevel", headers: ["Material Level"] },
  { field: "laborLevel", headers: ["Labor Level"] },
];
const getSheetsData = async (req, res, next) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1A8RoV29BFy5UIVdGqXknIW3BN1oO4vbveVyoi574Vq4";
  const range = "Active";
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    // Map columns by header name so reading matches what the app writes.
    const { rows, headerRow } = mapRowsByHeader(response.data.values, CUSTOMER_COLUMNS);
    const out = rows.map(({ __sheetRow, ...row }) => row);
    out.hasHeader = headerRow.some((h) => h !== "");
    return out;
  } catch (error) {
    console.log(error);
  }
};
// The app writes active customers to the "Active" tab and inactive ones to
// "In Active" (see syncDataToSheet), so both are read back.
const CUSTOMER_TABS = [
  { range: "Active", status: "Active", required: true },
  { range: "In Active", status: "Inactive", required: false },
];
// Pull customers from the sheet. Updates matching customers (by Customer Code)
// in place and adds new ones. Invoices, payments, attachments and customers
// missing from the sheet are never touched (see utils/sheetSync.js).
const syncDataFromSheet = async (req, res, next) => {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1A8RoV29BFy5UIVdGqXknIW3BN1oO4vbveVyoi574Vq4";
  try {
    let rows = [];
    let ignoredMissingColumns = [];
    for (const tab of CUSTOMER_TABS) {
      let values;
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: tab.range,
        });
        values = response.data.values;
      } catch (error) {
        if (tab.required) throw error;
        continue; // optional tab does not exist
      }
      if (!values || values.length === 0) continue;
      const mapped = mapRowsByHeader(values, CUSTOMER_COLUMNS, { tab: tab.range });
      if (mapped.missingFields.includes("customerCode")) {
        return res.json({
          error: true,
          message: `Sync cancelled: the "${tab.range}" tab has no "Customer Code" column. Nothing was changed.`,
        });
      }
      ignoredMissingColumns = [
        ...new Set([...ignoredMissingColumns, ...mapped.missingFields]),
      ];
      rows = rows.concat(
        mapped.rows.map((r) => ({ ...r, status: r.status || tab.status }))
      );
    }
    const summary = await mergeRowsIntoCollection(clientModel, rows, "customerCode");
    res.json({
      error: false,
      message: describeSummary(summary, "customers"),
      summary,
      ignoredMissingColumns,
    });
  } catch (error) {
    console.log("customer sheet sync failed", error.message);
    res.json({
      message: "Sync failed. Nothing was deleted.",
      error: true,
    });
  }
};
const addSingleData = async (req, res, next) => {
  const {
    customerCode,
    customerName,
    alphaCode,
    address,
    city,
    state,
    zipCode,
    phone,
    fax,
    primaryContact,
    primaryEmail,
    secondaryEmail,
    customerType,
    balance,
    taxable,
    status,
    customerTerm,
    taxCode,
    retailCertificate,
    resaleExpDate,
    salesPersonCode,
    receiveStatements,
    financeCharge,
    retention,
    lastDateBilled,
    lastDatePaid,
    dateEstablished,
    creditLimit,
    materialLevel,
    laborLevel,
  } = req.body;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1A8RoV29BFy5UIVdGqXknIW3BN1oO4vbveVyoi574Vq4";
  const range = "Active";
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
            `${customerCode}`,
            `${customerName}`,
            `${alphaCode}`,
            `${address}`,
            `${city}`,
            `${state}`,
            `${zipCode}`,
            `${phone}`,
            `${fax}`,
            `${primaryContact}`,
            `${primaryEmail}`,
            `${secondaryEmail}`,
            `${customerType}`,
            `${balance}`,
            `${taxable}`,
            `${status}`,
            `${customerTerm}`,
            `${taxCode}`,
            `${retailCertificate}`,
            `${resaleExpDate}`,
            `${salesPersonCode}`,
            `${receiveStatements}`,
            `${financeCharge}`,
            `${retention}`,
            `${lastDateBilled}`,
            `${lastDatePaid}`,
            `${dateEstablished}`,
            `${creditLimit}`,
            `${materialLevel}`,
            `${laborLevel}`,
          ],
        ],
      };
    } else {
      console.log("first time sheets");
      resource = {
        values: [
          [
            "Customer Code",
            "Customer Name",
            "Alpha Code",
            "Address",
            "City",
            "State",
            "Zip Code",
            "Phone",
            "Fax",
            "Primary Contact",
            "Primary Email",
            "Secondary Email",
            "Customer Type",
            "Balance",
            "Taxable",
            "Status",
            "Customer Term",
            "Tax Code",
            "Retail Certificate",
            "Resale Exp Date",
            "Sales Person Code",
            "Receive Statements",
            "Finance Charge",
            "Retention",
            "Last Date Billed",
            "Last Date Paid",
            "Date Established",
            "Credit Limit",
            "Material Level",
            "Labor Level",
          ],
          [
            `${customerCode}`,
            `${customerName}`,
            `${alphaCode}`,
            `${address}`,
            `${city}`,
            `${state}`,
            `${zipCode}`,
            `${phone}`,
            `${fax}`,
            `${primaryContact}`,
            `${primaryEmail}`,
            `${secondaryEmail}`,
            `${customerType}`,
            `${balance}`,
            `${taxable}`,
            `${status}`,
            `${customerTerm}`,
            `${taxCode}`,
            `${retailCertificate}`,
            `${resaleExpDate}`,
            `${salesPersonCode}`,
            `${receiveStatements}`,
            `${financeCharge}`,
            `${retention}`,
            `${lastDateBilled}`,
            `${lastDatePaid}`,
            `${dateEstablished}`,
            `${creditLimit}`,
            `${materialLevel}`,
            `${laborLevel}`,
          ],
        ],
      };
    }
  } else {
    console.log("sheets is undefined and in second else");
    resource = {
      values: [
        [
          "Customer Code",
          "Customer Name",
          "Alpha Code",
          "Address",
          "City",
          "State",
          "Zip Code",
          "Phone",
          "Fax",
          "Primary Contact",
          "Primary Email",
          "Secondary Email",
          "Customer Type",
          "Balance",
          "Taxable",
          "Status",
          "Customer Term",
          "Tax Code",
          "Retail Certificate",
          "Resale Exp Date",
          "Sales Person Code",
          "Receive Statements",
          "Finance Charge",
          "Retention",
          "Last Date Billed",
          "Last Date Paid",
          "Date Established",
          "Credit Limit",
          "Material Level",
          "Labor Level",
        ],
        [
          `${customerCode}`,
          `${customerName}`,
          `${alphaCode}`,
          `${address}`,
          `${city}`,
          `${state}`,
          `${zipCode}`,
          `${phone}`,
          `${fax}`,
          `${primaryContact}`,
          `${primaryEmail}`,
          `${secondaryEmail}`,
          `${customerType}`,
          `${balance}`,
          `${taxable}`,
          `${status}`,
          `${customerTerm}`,
          `${taxCode}`,
          `${retailCertificate}`,
          `${resaleExpDate}`,
          `${salesPersonCode}`,
          `${receiveStatements}`,
          `${financeCharge}`,
          `${retention}`,
          `${lastDateBilled}`,
          `${lastDatePaid}`,
          `${dateEstablished}`,
          `${creditLimit}`,
          `${materialLevel}`,
          `${laborLevel}`,
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
  const { customerCode } = req.params;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1A8RoV29BFy5UIVdGqXknIW3BN1oO4vbveVyoi574Vq4";
  const range = "Active";
  var valueInputOption = "USER_ENTERED";
  
  const allSheets = await getSheetsData();
  if (!Array.isArray(allSheets)) {
    return res.json({ message: "Could not read the Google Sheet. Nothing was changed.", error: true });
  }
  const filteredSheets = allSheets.filter((item) => item.customerCode !== customerCode);
  //   const data = {
  //     values: [getKeyValues(filteredSheets)],
  //   };
  var resource;
  const data = filteredSheets.map((inner) => {
    return [
      inner.customerCode,
      inner.customerName,
      inner.alphaCode,
      inner.address,
      inner.city,
      inner.state,
      inner.zipCode,
      inner.phone,
      inner.fax,
      inner.primaryContact,
      inner.primaryEmail,
      inner.secondaryEmail,
      inner.customerType,
      inner.balance,
      inner.taxable,
      inner.status,
      inner.customerTerm,
      inner.taxCode,
      inner.retailCertificate,
      inner.resaleExpDate,
      inner.salesPersonCode,
      inner.receiveStatements,
      inner.financeCharge,
      inner.retention,
      inner.lastDateBilled,
      inner.lastDatePaid,
      inner.dateEstablished,
      inner.creditLimit,
      inner.materialLevel,
      inner.laborLevel,
    ];
  });
  if (data && data.length) {
    resource = {
      values: [
        [
          "Customer Code",
          "Customer Name",
          "Alpha Code",
          "Address",
          "City",
          "State",
          "Zip Code",
          "Phone",
          "Fax",
          "Primary Contact",
          "Primary Email",
          "Secondary Email",
          "Customer Type",
          "Balance",
          "Taxable",
          "Status",
          "Customer Term",
          "Tax Code",
          "Retail Certificate",
          "Resale Exp Date",
          "Sales Person Code",
          "Receive Statements",
          "Finance Charge",
          "Retention",
          "Last Date Billed",
          "Last Date Paid",
          "Date Established",
          "Credit Limit",
          "Material Level",
          "Labor Level",
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
  const spreadsheetId = "1A8RoV29BFy5UIVdGqXknIW3BN1oO4vbveVyoi574Vq4";
  const range = "Active";
  var valueInputOption = "USER_ENTERED";
  const allSheets = await getSheetsData();
  if (!Array.isArray(allSheets)) {
    return res.json({ message: "Could not read the Google Sheet. Nothing was changed.", error: true });
  }
  console.log("all sheets before edit", allSheets);
  const allSheetsAfterUpdate = allSheets.map((item) => {
    if (item.name == oldEntry.name) {
      item.customerCode = newEntry.customerCode;
      item.customerName = newEntry.customerName;
      item.alphaCode = newEntry.alphaCode;
      item.address = newEntry.address;
      item.city = newEntry.city;
      item.state = newEntry.state;
      item.zipCode = newEntry.zipCode;
      item.phone = newEntry.phone;
      item.fax = newEntry.fax;
      item.primaryContact = newEntry.primaryContact;
      item.primaryEmail = newEntry.primaryEmail;
      item.secondaryEmail = newEntry.secondaryEmail;
      item.customerType = newEntry.customerType;
      item.balance = newEntry.balance;
      item.taxable = newEntry.taxable;
      item.status = newEntry.status;
      item.customerTerm = newEntry.customerTerm;
      item.taxCode = newEntry.taxCode;
      item.retailCertificate = newEntry.retailCertificate;
      item.resaleExpDate = newEntry.resaleExpDate;
      item.salesPersonCode = newEntry.salesPersonCode;
      item.receiveStatements = newEntry.receiveStatements;
      item.financeCharge = newEntry.financeCharge;
      item.retention = newEntry.retention;
      item.lastDateBilled = newEntry.lastDateBilled;
      item.lastDatePaid = newEntry.lastDatePaid;
      item.dateEstablished = newEntry.dateEstablished;
      item.creditLimit = newEntry.creditLimit;
      item.materialLevel = newEntry.materialLevel;
      item.laborLevel = newEntry.laborLevel;
      return item;
    } else {
      return item;
    }
  });
  const data = allSheetsAfterUpdate.map((inner) => {
    return [
      inner.customerCode,
      inner.customerName,
      inner.alphaCode,
      inner.address,
      inner.city,
      inner.state,
      inner.zipCode,
      inner.phone,
      inner.fax,
      inner.primaryContact,
      inner.primaryEmail,
      inner.secondaryEmail,
      inner.customerType,
      inner.balance,
      inner.taxable,
      inner.status,
      inner.customerTerm,
      inner.taxCode,
      inner.retailCertificate,
      inner.resaleExpDate,
      inner.salesPersonCode,
      inner.receiveStatements,
      inner.financeCharge,
      inner.retention,
      inner.lastDateBilled,
      inner.lastDatePaid,
      inner.dateEstablished,
      inner.creditLimit,
      inner.materialLevel,
      inner.laborLevel,
    ];
  });
  if (data && data.length) {
    resource = {
      values: [
        [
          "Customer Code",
          "Customer Name",
          "Alpha Code",
          "Address",
          "City",
          "State",
          "Zip Code",
          "Phone",
          "Fax",
          "Primary Contact",
          "Primary Email",
          "Secondary Email",
          "Customer Type",
          "Balance",
          "Taxable",
          "Status",
          "Customer Term",
          "Tax Code",
          "Retail Certificate",
          "Resale Exp Date",
          "Sales Person Code",
          "Receive Statements",
          "Finance Charge",
          "Retention",
          "Last Date Billed",
          "Last Date Paid",
          "Date Established",
          "Credit Limit",
          "Material Level",
          "Labor Level",
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
  const { status } = req.body;
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1A8RoV29BFy5UIVdGqXknIW3BN1oO4vbveVyoi574Vq4";
  var range = status == "Active" ? "Active" : "In Active";
  var valueInputOption = "USER_ENTERED";

  var resource;
  var allJobNumbers;
  try {
    allJobNumbers = await clientModel.find({ status: status });
  } catch (error) {
    res.json({ error: true, message: "Sync Failed" });
  }
  const customizedValues = allJobNumbers.map((inner) => {
    return [
      inner.customerCode,
      inner.customerName,
      inner.alphaCode,
      inner.address,
      inner.city,
      inner.state,
      inner.zipCode,
      inner.phone,
      inner.fax,
      inner.primaryContact,
      inner.primaryEmail,
      inner.secondaryEmail,
      inner.customerType,
      inner.balance,
      inner.taxable,
      inner.status,
      inner.customerTerm,
      inner.taxCode,
      inner.retailCertificate,
      inner.resaleExpDate,
      inner.salesPersonCode,
      inner.receiveStatements,
      inner.financeCharge,
      inner.retention,
      inner.lastDateBilled,
      inner.lastDatePaid,
      inner.dateEstablished,
      inner.creditLimit,
      inner.materialLevel,
      inner.laborLevel,
    ];
  });
  resource = {
    values: [
      [
        "Customer Code",
        "Customer Name",
        "Alpha Code",
        "Address",
        "City",
        "State",
        "Zip Code",
        "Phone",
        "Fax",
        "Primary Contact",
        "Primary Email",
        "Secondary Email",
        "Customer Type",
        "Balance",
        "Taxable",
        "Status",
        "Customer Term",
        "Tax Code",
        "Retail Certificate",
        "Resale Exp Date",
        "Sales Person Code",
        "Receive Statements",
        "Finance Charge",
        "Retention",
        "Last Date Billed",
        "Last Date Paid",
        "Date Established",
        "Credit Limit",
        "Material Level",
        "Labor Level",
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
