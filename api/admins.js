const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Admin model
const Admin = require("../models/Admin");
const Adminstate = require("../models/Adminstate");

router.post("/register", (req, res) => {
  const newAdmin = new Admin({
    adminname: req.body.adminname,
    password: req.body.password,
  });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
      if (err) throw err;
      newAdmin.password = hash;
      newAdmin
        .save()
        .then((admin) => res.json(admin))
        .catch((err) => console.log(err));
    });
  });
});

// @route   GET api/admins/getstatus
// @desc    Get status for user dashboard presale page
// @access  Public
router.get("/getstatus", (req, res) => {
  Adminstate.find()
    .then((adminstates) => {
      res.json(adminstates);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/setstatus", (req, res) => {
  Adminstate.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { status: req.body.status } },
    { new: true }
  )
    .then((adminstates) => res.json({ msg: "success" }))
    .catch((err) => console.log(err));
});

router.get("/addstatus", (req, res) => {
  const newitem = new Adminstate({
    status: 0,
  });
  newitem.save().then((newitems) => {
    res.json(newitems);
  });
});

// @route   POST api/admins/login
// @desc    Login as Admin
// @access  Public
router.post("/login", (req, res) => {
  const adminname = req.body.adminname;
  const password = req.body.password;

  Admin.findOne({ adminname })
    .then((admin) => {
      // check for admin
      if (!admin) {
        return res.status(404).json({ msg: "Admin not found" });
      }

      // Check Password
      bcrypt.compare(password, admin.password).then((isMatch) => {
        if (isMatch) {
          // Admin Matched
          // create JWT Payload
          const payload = { id: admin._id, adminname: admin.adminname };

          jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          });
        } else {
          return res.status(400).json({ msg: "Password incorrect" });
        }
      });
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

module.exports = router;
