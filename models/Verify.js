const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const VerifySchema = new Schema({
  useremail: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

module.exports = Verify = mongoose.model("verifies", VerifySchema);
