const { Router } = require("express");
const nodeMailer = require("nodemailer");
require("dotenv").config();
const path = require("path");
const user = require("../database/schemas/User");

const router = Router();

const host_password = process.env.APP_PASSWORD;
const lex_username = process.env.LEX_USERNAME;

let otp = parseInt(Math.random() * 10000);
let username = "";
let email = "";
let password = "";

async function mailer(mail) {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: lex_username,
      pass: host_password,
    },
  });

  const info = await transporter.sendMail({
    from: "Lexiverse <${lex_username}>",
    to: mail,
    subject: "OTP for Lexiverse authentication " + otp,
    text:
      "Dear user your OTP for Lexiverse Authentication is " +
      otp +
      ". Please do not share this OTP with anyone",
  });
  console.log("Message sent" + info.messageId);
}

router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/index");
  } else {
    res.sendFile(path.join(__dirname, "../templates/login.html"));
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDB = await user.findOne({ username: username });
  if (!userDB) {
    res.json({ success: false, message: "User Doesn't exist" });
  } else {
    if (userDB.password == password) {
      req.session.user = {
        username: username,
        password: password,
      };
      res.json({ success: true, message: "done" });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  }
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    res.redirect("/index");
  } else {
    res.sendFile(path.join(__dirname, "../templates/register.html"));
  }
});

router.get("/checkpost", (req, res) => {
  if (req.session.user) {
    res.redirect("/index");
  } else {
    res.sendFile(path.join(__dirname, "../templates/auth.html"));
  }
});

router.post("/checkpost", async (req, res) => {
  if (parseInt(req.body.otp) == otp) {
    console.log("Matched");
    console.log(username, password, email);
    await user.create({ username, password, email });
    res.json({ success: true, message: "done" });
  }
});

router.post("/register", async (req, res) => {
  const { gusername, gpassword, gemail } = req.body;
  password = gpassword;
  email = gemail;
  username = gusername;
  const userDB = await user.findOne({
    $or: [{ username: gusername }, { email: gemail }],
  });
  if (userDB) {
    console.log(gusername, gpassword, gemail);
    console.log(userDB);
    res.json({ success: false, message: "User already exists" });
  } else {
    console.log(gusername, gpassword, gemail);
    await mailer(gemail).catch((e) => console.log(e));
    res.json({ success: true, message: "done" });
  }
});

module.exports = router;
