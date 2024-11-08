const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const HistorySchema = new Schema({
  pot: {
    type: Schema.Types.ObjectId,
    ref: "pots",
  },
  amount: {
    type: Number,
    required: true,
  },
  useremail: {
    type: String,
    required: true,
  },
  type: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

module.exports = History = mongoose.model("histories", HistorySchema);
