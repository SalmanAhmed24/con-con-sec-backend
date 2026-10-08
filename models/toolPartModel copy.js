const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const toolPartsSchema = new mongoose.Schema({
    toolNumber:{type:String},
      partNo: { type: String },
      description: { type: String },
});

module.exports = mongoose.model("toolParts", toolPartsSchema);
