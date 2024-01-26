const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const imageRoute = require("./routes/image");
const authRoute = require("./routes/auth");
const chatRoute = require("./routes/chat");
const translateRoute = require("./routes/translate");
const aboutRoute = require("./routes/about");
const contactRoute = require("./routes/contact");
const app = express();
require("./database");

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "BKBKJBSIUNLAKNFUHIASUHIL",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/index");
  } else {
    res.redirect("/login");
  }
});
app.use("/", authRoute);
app.use((req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
});
app.use("/image", imageRoute);
app.use("/chat", chatRoute);
app.use("/translate", translateRoute);
app.use("/about", aboutRoute);
app.use("/contact", contactRoute);

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "/templates/index.html"));
});

app.listen(port, () => {
  console.log("The BoloGPT is Running on http://localhost:3000");
});
