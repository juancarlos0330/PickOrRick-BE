const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AdminstateSchema = new Schema({
  status: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Adminstate = mongoose.model("adminstates", AdminstateSchema);
