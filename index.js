const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
const moment = require("moment");
const { Resend } = require("resend");
const { CronJob } = require("cron");
const cron = require("node-cron");
const instanceResend = new Resend(process.env.RESEND_API_KEY);
const vehicleInspectionModel = require("./models/vehicleInspection");
const userModel = require("./models/userModel");

const vehicleModel = require("./models/vehicle");
const ToolReturnModel = require("./models/toolReturn");

const usersRoutes = require("./routes/users");
const badgeListRoute = require("./routes/badgeList");
const badgeTypeRoute = require("./routes/badgeType");
const badgeStatusRoute = require("./routes/badgeStatus");
const usersTypeRoutes = require("./routes/userType");
const reimbursalTypeRoutes = require("./routes/reimbursalType");
const phaseRoutes = require("./routes/phase");
const jobTypeRoutes = require("./routes/jobType");
const laborTypeRoutes = require("./routes/laborType");
const jobTagRoutes = require("./routes/jobTag");
const jobPMRoutes = require("./routes/jobPM");
const jobStatusRoutes = require("./routes/jobStatus");
const jobSourcesRoutes = require("./routes/jobSources");
const jobCTMRoutes = require("./routes/jobCTM");
const POStatusRoutes = require("./routes/POStatus");
const jobRoutes = require("./routes/job");
const taxCodeRoutes = require("./routes/taxCode");
const customerTypeRoutes = require("./routes/customerType");
const materialLevelRoutes = require("./routes/materialLevel");
const laborLevelRoutes = require("./routes/laborLevel");
const customerTermRoutes = require("./routes/customerTerm");
const positionRoutes = require("./routes/position");
const deviceRoutes = require("./routes/devices");
const vehicleRoutes = require("./routes/vehicle");
const toolsRoutes = require("./routes/tools");
const allToolsRoutes = require("./routes/allTools");
const toolHistoryRoutes = require("./routes/toolHistory");
const serviceToolsRoutes = require("./routes/serviceTools");
const jobTicketRoutes = require("./routes/jobTicket");
const toolsCategoryRoutes = require("./routes/toolCategory");
const deviceCategoryRoutes = require("./routes/deviceCategory");
const taskCategoryRoutes = require("./routes/taskCategory");
const taskStatusRoutes = require("./routes/taskStatus");
const notesStatusRoutes = require("./routes/notesStatus");
const notesCategoryRoutes = require("./routes/notesCategory");
const salesPersonRoutes = require("./routes/salesPerson");
const subtoolsCategoryRoutes = require("./routes/subtoolCategory");
const toolDescriptionRoutes = require("./routes/toolDescription");
const clientRoutes = require("./routes/client");
const timeTrackRoutes = require("./routes/timeTrack");
const vehicleInspectionRoutes = require("./routes/vehicleInspection");
const accidentReportRoutes = require("./routes/accidentReport");
const taskRoutes = require("./routes/task");
const tagoutRoutes = require("./routes/tagout");
const taskPriorityRoutes = require("./routes/taskPriority");
const needTagRoutes = require("./routes/needTag");
const toolDamageRoutes = require("./routes/toolDamage");
const chatRoutes = require("./routes/chat");
const messageRoutes = require("./routes/message");
const checkedOutRoutes = require("./routes/checkedOut");
const jobNumberRoutes = require("./routes/jobNumber");
const generalContractRoutes = require("./routes/generalContract");
const jobEstimateRoutes = require("./routes/jobEstimates");
const servicesRoutes = require("./routes/service");
const termsRoutes = require("./routes/terms");
const buildingRoutes = require("./routes/building");
const storageIdRoutes = require("./routes/storageId");
const storageLocationRoutes = require("./routes/storageLocation");
const globalTaxRoutes = require("./routes/globalTax");
const vendorRoutes = require("./routes/vendor");
const trackingRoutes = require("./routes/tracking");
const overstockCatRoutes = require("./routes/overstockCategories");
const overstockRoutes = require("./routes/overstock");
const purchaseOrderRoutes = require("./routes/purchaseOrder");
const trainingRoutes = require("./routes/training");
const trainAssignmentRoutes = require("./routes/trainingAssignment");
const trainingCategoryRoutes = require("./routes/trainingCategory");
const sheetsDataRoutes = require("./routes/getSheetData");
const vendorSheetsRoutes = require("./routes/vendorSheets");
const writeUpRoutes = require("./routes/writeUp");
const warningRoutes = require("./routes/warning");
const offenceRoutes = require("./routes/offence");
const toolTrackRoutes = require("./routes/toolTracks");
const serviceToolTrackRoutes = require("./routes/serviceToolTrack");
const timeoutRoutes = require("./routes/timeout");
const timeoutReasonRoutes = require("./routes/timeoutReason");
const manpowerRoutes = require("./routes/manpower");
const serviceNumberRoutes = require("./routes/serviceNumbers");
const manpowerUsersRoutes = require("./routes/manpowerUsers");
const brandRoutes = require("./routes/brand");
const vendorCategoryRoutes = require("./routes/vendorCategory");
const badgeRoutes = require("./routes/badge");
const toolPartRoutes = require("./routes/toolPart");
const toolAttachmentsRoutes = require("./routes/toolAttachments");
const customerSheetRoutes = require("./routes/customerSheets");
const toolRequestRoutes = require("./routes/toolRequest");
const toolReturnRoutes = require("./routes/toolReturn");
const toolTransferRoutes = require("./routes/toolTransfer");
const tagTaskRoutes = require("./routes/taskTag");
const toolReturn = require("./models/toolReturn");
const certifiedPayRoutes = require("./routes/certifiedPay");
const { authenticate, getJwtSecret, AUTH_MODE } = require("./utils/auth");
try {
  getJwtSecret();
} catch (err) {
  console.error(`[auth] ${err.message} Logins will fail until it is set.`);
}
if (AUTH_MODE === "optional") {
  console.warn(
    "[auth] AUTH_MODE=optional: requests without a token are allowed. Switch back to enforce as soon as all clients send tokens."
  );
}
const url = process.env.MONGO_DB_KEY;
mongoose
  .connect(url)
  .then(() => {
    console.log("Connection Established");
  })
  .catch((err) => {
    console.log("error occured while connecting to database", err);
  });

// Every /api route needs a valid JWT except POST /api/users/login.
app.use("/api", authenticate);
app.use("/api/users", usersRoutes);
app.use("/api/tagTask", tagTaskRoutes);
app.use("/api/badgeList", badgeListRoute);
app.use("/api/badgeType", badgeTypeRoute);
app.use("/api/badgeStatus", badgeStatusRoute);
app.use("/api/userType", usersTypeRoutes);
app.use("/api/reimbursalType", reimbursalTypeRoutes);
app.use("/api/customerType", customerTypeRoutes);
app.use("/api/materialLevel", materialLevelRoutes);
app.use("/api/laborLevel", laborLevelRoutes);
app.use("/api/customerTerm", customerTermRoutes);
app.use("/api/position", positionRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/allTools", allToolsRoutes);
app.use("/api/toolHistory", toolHistoryRoutes);
app.use("/api/serviceTools", serviceToolsRoutes);
app.use("/api/toolCategory", toolsCategoryRoutes);
app.use("/api/deviceCategory", deviceCategoryRoutes);
app.use("/api/taskCategory", taskCategoryRoutes);
app.use("/api/notesCategory", notesCategoryRoutes);
app.use("/api/taskStatus", taskStatusRoutes);
app.use("/api/taskPriority", taskPriorityRoutes);
app.use("/api/notesStatus", notesStatusRoutes);
app.use("/api/taxCode", taxCodeRoutes);
app.use("/api/subtoolCategory", subtoolsCategoryRoutes);
app.use("/api/toolDescription", toolDescriptionRoutes);
app.use("/api/salesPersonCode", salesPersonRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/jobType", jobTypeRoutes);
app.use("/api/laborType", laborTypeRoutes);
app.use("/api/jobTag", jobTagRoutes);
app.use("/api/jobPM", jobPMRoutes);
app.use("/api/jobStatus", jobStatusRoutes);
app.use("/api/jobSources", jobSourcesRoutes);
app.use("/api/jobCTM", jobCTMRoutes);
app.use("/api/POStatus", POStatusRoutes);
app.use("/api/phase", phaseRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/timeTrack", timeTrackRoutes);
app.use("/api/vehicleInspection", vehicleInspectionRoutes);
app.use("/api/accidentReport", accidentReportRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/tagout", tagoutRoutes);
app.use("/api/needTag", needTagRoutes);
app.use("/api/toolDamage", toolDamageRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/checkedOut", checkedOutRoutes);
app.use("/api/jobNumber", jobNumberRoutes);
app.use("/api/generalContract", generalContractRoutes);
app.use("/api/jobEstimate", jobEstimateRoutes);
app.use("/api/service", servicesRoutes);
app.use("/api/jobTicket", jobTicketRoutes);
app.use("/api/term", termsRoutes);
app.use("/api/building", buildingRoutes);
app.use("/api/storageId", storageIdRoutes);
app.use("/api/storageLocation", storageLocationRoutes);
app.use("/api/globalTax", globalTaxRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/overstockCategories", overstockCatRoutes);
app.use("/api/overstock", overstockRoutes);
app.use("/api/purchaseOrder", purchaseOrderRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/trainAssignment", trainAssignmentRoutes);
app.use("/api/trainingCategory", trainingCategoryRoutes);
app.use("/api/sheetsData", sheetsDataRoutes);
app.use("/api/writeUp", writeUpRoutes);
app.use("/api/warning", warningRoutes);
app.use("/api/offence", offenceRoutes);
app.use("/api/toolTrack", toolTrackRoutes);
app.use("/api/serviceToolTrack", serviceToolTrackRoutes);
app.use("/api/timeout", timeoutRoutes);
app.use("/api/timeoutReason", timeoutReasonRoutes);
app.use("/api/manpower", manpowerRoutes);
app.use("/api/serviceNumbers", serviceNumberRoutes);
app.use("/api/manpowerUsers", manpowerUsersRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/vendorCategory", vendorCategoryRoutes);
app.use("/api/badge", badgeRoutes);
app.use("/api/toolPart", toolPartRoutes);
app.use("/api/vendorSheets", vendorSheetsRoutes);
app.use("/api/customerSheets", customerSheetRoutes);
app.use("/api/toolAttachments", toolAttachmentsRoutes);
app.use("/api/toolRequest", toolRequestRoutes);
app.use("/api/toolReturn", toolReturnRoutes);
app.use("/api/toolTransfer", toolTransferRoutes);
app.use("/api/certifiedPay", certifiedPayRoutes);
// app.use("/api/toolTransfer", toolTransferRoutes);

// cron job code here

var job = new CronJob(
  "0 5 * * *",
  async function () {
    let allUsers;
    try {
      allUsers = await userModel.find({ taskEmailNotification: true });
    } catch (error) {
      console.log(error);
    }
    const filteredUserTasks = allUsers.map((i) => {
      return {
        email: i.email,
        userTasks: i.userTasks.filter(
          (inner) => inner.taskStatus !== "Completed"
        ),
      };
    });
    try {
      var emailArr = [];
      filteredUserTasks.forEach(async (element) => {
        emailArr = [element.email];
        const { data, error } = await instanceResend.emails.send({
          from: "JsElectric <jselectric@contractorcontroller.com>",
          to: emailArr,
          subject: "Incomplete Tasks from J.S. Electric",
          html:
            "<table style='border: 1px solid white;border-collapse: collapse;'><tr><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Task Category</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Task Status</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Due Date</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Assigned By</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Assigned To</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Description</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Last Updated</th></tr><tbody>" +
            element.userTasks.map((i) => {
              return (
                `<tr key={${
                  i._id
                }}><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                  i.taskCategory
                }</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                  i.taskStatus
                }</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${moment(
                  i.dueDate
                ).format(
                  "MM/DD/YYYY"
                )}</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                  i.user
                }</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${i.assignedTo.map(
                  (i) => i.fullname
                )}</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                  i.description
                }</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${moment(
                  i.lastUpdated
                ).format("MM/DD/YYYY")}</td></tr>` + "</tbody></table>"
              );
            }),
        });
        if (error) {
          console.log("error", error);
        }
        console.log("called success", data);
      });
    } catch (error) {
      console.log("error", error);
    }
  },
  null,
  true,
  "America/Chicago"
);
job.start();
var jobNew = new CronJob(
  "0 10 * * *",
  async function () {
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
          !allVehicleIns.find(({ vehicle }) => elem.vehicleNo === vehicle)
      );
      console.log("wow", r);
      var withEmails = r.filter(
        (ele) => ele.email !== "" && ele.email !== undefined
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
  },
  null,
  true,
  "America/Chicago"
);
jobNew.start();
// const dateCalculator = (dateVal, checkedOut) => {
//   var date = new Date(dateVal);
//   date.setDate(date.getDate() + Number(checkedOut));
//   var finalDate =
//     date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear();
//   var checkedOutDate = new Date(finalDate);
//   var currentDate = new Date();
//   var currentDateMS = currentDate.getTime();
//   if (checkedOutDate.getTime() < currentDateMS) {
//     return true;
//   } else {
//     return false;
//   }
// };
// const userUpdaterToolTrack = async () => {
//   var allToolTrack;
//   var allUsers;
//   console.log("called");
//   try {
//     allToolTrack = await toolTrackModel.find({});
//   } catch (error) {
//     console.log(error);
//   }
//   allToolTrack.forEach(async (el) => {
//     try {
//       await userModel.updateOne(
//         { fullname: el.techAssigned },
//         {
//           $push: {
//             userToolTracks: el,
//           },
//         }
//       );
//       console.log("success");
//     } catch (error) {
//       console.log("error occured", error);
//     }
//   });
// };
// userUpdaterToolTrack();
var checkoutJob = new CronJob(
  "0 5 * * *",
  async function () {
    var allUsers;
    var filteredUsers;
    var mappedUser;
    var mappedUserToolsWithCheckout = [];
    try {
      allUsers = await userModel.find({});
      filteredUsers = allUsers.filter((i) => i.userToolTracks.length);
      mappedUser = filteredUsers.map((i) => {
        return { email: i.email, userToolTracks: i.userToolTracks };
      });
      mappedUserToolsWithCheckout = mappedUser.map((inner) => {
        return {
          email: inner.email,
          userToolTracks: inner.userToolTracks
            .filter((el) => el.checkedOut !== "" && el.checkedOut !== undefined)
            .filter((i) => dateCalculator(i.date, i.checkedOut) == true),
        };
      });
      try {
        var emailArr = [];
        mappedUserToolsWithCheckout.forEach(async (element) => {
          emailArr = [element.email];
          const { data, error } = await instanceResend.emails.send({
            from: "JsElectric <jselectric@contractorcontroller.com>",
            to: emailArr,
            subject: "CheckOut Notification",
            html:
              "<table style='border: 1px solid white;border-collapse: collapse;'><tr><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Tool Number</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Tech Assigned</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Checked Out</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Location</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Date</th><th style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #96D4D4'>Employee</th></tr><tbody>" +
              element.userToolTracks.map((i) => {
                return `<tr style={${
                  i.location == "shop" || i.location == "Shop"
                    ? "background:green;"
                    : "background:red;"
                }} key={${i._id}}>
                  <td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                    i.toolNumber
                  }</td>
                  <td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                    i.techAssigned
                  }</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                  i.checkedOut
                }</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                  i.location
                }</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                  i.date
                }</td><td style='min-width:150px;border: 1px solid white;border-collapse: collapse;background-color: #FAF9F6'>${
                  i.user
                }</td></tr>`;
              }) +
              "</tbody></table>",
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
      console.log(error);
    }
  },
  null,
  true,
  "America/Chicago"
);
checkoutJob.start();

// const remainValueUpdated = async () => {
//   try {
//     await servicesModel
//       .updateMany({ remaining: 0 }, [
//         {
//           $set: {
//             remaining: "$total",
//           },
//         },
//       ])
//       .then((res) => console.log(res))
//       .catch((err) => console.log(err));
//     console.log("success");
//   } catch (error) {
//     console.log("error occured", error);
//   }
// };
// remainValueUpdated();
// async function updateToolReturns() {
//   try {
//     await ToolReturnModel.updateMany(
//       {}, // Query for documents to update
//       { $set: { "toolRequest.$[elem].broken": false } },
//       {
//         arrayFilters: [{ "elem.broken": { $exists: false } }],
//       }
//     );
//     console.log("done");
//   } catch (error) {
//     console.log("error", error);
//   }
// }
// updateToolReturns();
const PORT = process.env.PORT || 9000;
app
  .listen(PORT, () => {
    console.log(`API listening on PORT ${PORT} `);
  })
  .setTimeout(1200000);
