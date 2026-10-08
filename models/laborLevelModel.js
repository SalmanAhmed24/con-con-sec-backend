const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");
const laborLevelSchema = new mongoose.Schema({
  laborLevel: { type: String },
});
module.exports = mongoose.model("laborLevels", laborLevelSchema);
