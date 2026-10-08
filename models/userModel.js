const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const { hashPassword, isHashed } = require("../utils/auth");
const userSchema = new mongoose.Schema({
  userType: { type: String, required: true },
  position: { type: String },
  vehicle: { type: String },
  tablet: { type: String },
  city: { type: String },
  primaryAddress: { type: String },
  secondaryAddress: { type: String },
  state: { type: String },
  zipcode: { type: String },
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  personalPhone: { type: String },
  companyPhone: { type: String },
  username: { type: String, required: true, unique: true },
  // Stored as a bcrypt hash. Excluded from queries unless asked for with
  // .select("+password"), so it never leaks into API responses.
  password: { type: String, required: true, select: false },
  creditCard: { type: String },
  userStatus: { type: String },
  timeTrackFlag: { type: Boolean },
  badges: {
    AISD: { type: String },
    AISDExpDate: { type: String },
    COAWaterDep: { type: String },
    COAWaterDepExpDate: { type: String },
    TFC: { type: String },
    TFCExpDate: { type: String },
    ABIA: { type: String },
    ABIAExpDate: { type: String },
  },
  notes: [
    {
      date: { type: String },
      time: { type: String },
      user: { type: String },
      note: { type: String },
    },
  ],
  attachments: [
    {
      files: [
        {
          fileUrl: { type: String },
          filename: { type: String },
        },
      ],
      user: { type: String },
      date: { type: String },
      time: { type: String },
      note: { type: String },
      attachmentCategories: { type: String },
    },
  ],
  schedules: [
    {
      date: { type: String },
      startTime: { type: String },
      endTime: { type: String },
      title: { type: String },
    },
  ],
  chats: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "chats" }],
    default: [],
  },
  userTasks: [{ type: Object }],
  userToolTracks: [{ type: Object }],
  userServiceToolTracks: [{ type: Object }],
  taskNotification: { type: Boolean },
  taskEmailNotification: { type: Boolean },
  userLabor: [
    {
      timeEntries: [
        {
          checkedIn: { type: String },
          checkedOut: { type: String },
          lunchTimeStart: { type: String },
          lunchTimeEnd: { type: String },
          notes: { type: String },
          spectrum: { type: Boolean },
          reimbursal: [
            {
              id: { type: String },
              reimbursalType: { type: String },
              amount: { type: String },
              note: { type: String },
            },
          ],
          dayFlag: { type: Boolean },
          dayName: { type: String },
          date: { type: Date },
          working: { type: Boolean },
        },
      ],
      shiftStartTime: { type: String },
      shiftEndTime: { type: String },
      job: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      foreman: { type: Boolean },
      journeyman: { type: Boolean },
      apprentice: { type: Boolean },
      construction: { type: Boolean },
      manpowerId: { type: String },
      working: { type: Boolean },
    },
  ],
});
userSchema.plugin(validator);

// Hash the password whenever it is set or changed through .save().
userSchema.pre("save", async function () {
  if (this.isModified("password") && this.password && !isHashed(this.password)) {
    this.password = await hashPassword(this.password);
  }
});

// Never serialize the password, even if a query explicitly selected it.
const stripPassword = (doc, ret) => {
  delete ret.password;
  return ret;
};
userSchema.set("toJSON", { transform: stripPassword });
userSchema.set("toObject", { transform: stripPassword });

module.exports = mongoose.model("users", userSchema);
