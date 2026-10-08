const moment = require("moment");
const dotenv = require("dotenv");
dotenv.config();
const { Resend } = require("resend");
const instanceResend = new Resend(process.env.RESEND_API_KEY);
const vehicleInspectionModel = require("./models/vehicleInspection");
const userModel = require("./models/userModel");

const vehicleModel = require("./models/vehicle");
const ToolReturnModel = require("./models/toolReturn");
export default async function handler(req, res) {
  // Secure the endpoint
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  var allVehicleIns = [];
  var filteredVehicles = [];
  var filtered = [];
  var allVehicles;
  try {
    allVehicles = await vehicleModel.find({});
  } catch (error) {
    console.log("first one", error);
  }
  try {
    var dateCus = moment().format("YYYY-MM-DD");
    console.log(dateCus);
    allVehicleIns = await vehicleInspectionModel.find({
      date: { $regex: `${dateCus}`, $options: "i" },
    });
    // filteredVehicles = allVehicles.filter(
    //   (i) => i.date.substring(0, i.date.indexOf("T")) == dateCus
    // );
    const r = allVehicles.filter(
      (elem) =>
        !allVehicleIns.find(({ vehicle }) => elem.vehicleNo === vehicle),
    );
    console.log("wow", r);
    var withEmails = r.filter(
      (ele) => ele.email !== "" && ele.email !== undefined,
    );
    try {
      var emailArr = [];
      withEmails.forEach(async (i) => {
        emailArr = [i.email];
        const { data, error } = await instanceResend.emails.send({
          from: "JsElectric <jselectric@contractorcontroller.com>",
          to: emailArr,
          subject: "Vehicle Inspection missing",
          html:
            "<div>" +
            `<div style='display:flex;flex-direction:row;flex-wrap:wrap' key={${i._id}}><div style='min-width:150px'><h3>Vehicle No</h3><p>${i.vehicleNo}</p></div><div style='min-width:150px'><h3>Driver/WexPin</h3><p>${i.driverWEXPin}</p></div><div style='min-width:180px'><h3>Vin No</h3><p>${i.vinNo}</p></div><div style='min-width:150px;'><h3>License Plate</h3><p>${i.licensePlate}</p></div><div style='min-width:150px;'><h3>Make/Model</h3><p>${i.makeModel}</p></div><div style='min-width:150px;'><h3>Color</h3><p>${i.color}</p></div></div>` +
            "</div>",
        });
        if (error) {
          console.log("error", error);
        }
        console.log("called success", data);
      });
    } catch (error) {
      console.log("error", error);
    }
  } catch (error) {
    console.log("outer most", error);
  }
}
