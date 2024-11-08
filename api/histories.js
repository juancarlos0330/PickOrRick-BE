const express = require("express");
const router = express.Router();

// History model
const History = require("../models/History");

// @route   POST api/histories/new
// @desc    Create new History
// @access  Public
router.post("/new", (req, res) => {
  const timezone = "Europe/Paris";

  // get the current time in the GMT+1 timezone
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });

  const newHistory = new History({
    pot: req.body.pot_id,
    amount: req.body.amount,
    useremail: req.body.useremail,
    type: req.body.type,
    created_at: new Date(currentTime),
  });

  newHistory
    .save()
    .then((history) => {
      res.json(history);
    })
    .catch((err) => res.status(404).json(err));
});

module.exports = router;
