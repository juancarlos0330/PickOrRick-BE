const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const smtpTransport = require("nodemailer-smtp-transport");

// Verify model
const Verify = require("../models/Verify");

// Generate random string by length
const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// @route   POST api/verifies/send-mail
// @desc    Send verify code to mail
// @access  Public
router.post("/send-mail", (req, res) => {
  const timezone = "Europe/Paris";

  // get the current time in the GMT+1 timezone
  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: timezone,
  });

  // Get Verifycode
  var code = generateRandomString(40);

  var transport = nodemailer.createTransport(
    smtpTransport({
      service: "Gmail",
      auth: {
        user: "stanislav.kogutstt2@gmail.com",
        pass: "phlbvyefyuiddptp",
      },
    })
  );

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: "stanislav.kogutstt2@gmail.com", // sender address
    to: req.body.useremail, // list of receivers
    subject: "Verify Code", // Subject line
    html:
      `<html>
      <body>
        <div>
          Verification Link
          <p style="font-size: 32px; font-weight: bolder">
            <a
              href="https://pickorrick-build.vercel.app/verify-email?email=` +
      req.body.useremail +
      `&code=` +
      code +
      `"
              target="_blank"
              style="
                text-decoration: none;
                color: #fff;
                background: rgb(73, 144, 0);
                font-size: 24px;
                padding: 20px 30px;
                border-radius: 10px;
              "
            >
              Verification
            </a>
          </p>
        </div>
      </body>
    </html>`,
  };

  // send mail with defined transport object
  transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.send({ error: "Something wrong!" });
      console.log(error);
    } else {
      console.log("Suceess");
      const newVerify = new Verify({
        useremail: req.body.useremail,
        code: code,
        created_at: new Date(currentTime),
      });

      newVerify
        .save()
        .then((verify) => {
          res.json({ msg: "Code sent success!" });
        })
        .catch((err) => res.status(404).json(err));
    }
  });
});

// @route   POST api/verifies/confirm
// @desc    Save verify history
// @access  Public
router.post("/confirm", (req, res) => {
  Verify.find({ useremail: req.body.useremail })
    .sort({ created_at: -1 })
    .limit(1)
    .then((verify) => {
      if (verify.length === 0) {
        res.json({ msg: "error", token: "" });
      } else {
        if (verify[0].code === req.body.code) {
          const payload = { useremail: verify[0].useremail }; // create JWT payload

          jwt.sign(payload, "secret", { expiresIn: 36000 }, (err, token) => {
            res.json({ msg: "success", token: "Bearer " + token });
          });
        } else {
          res.json({ msg: "error", token: "" });
        }
      }
    })
    .catch((err) => {
      res.status(404).json({ msg: err });
    });
});

module.exports = router;
