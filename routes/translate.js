const { OpenAI } = require("openai");
const { Router } = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const router = Router();
require("dotenv").config();

const apiKey = process.env.API_KEY;

const Openaikey = apiKey;
var tik = 0;

const openai = new OpenAI({
  apiKey: Openaikey, // defaults to process.env["OPENAI_API_KEY"]
});

async function transcribe(filename) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filename),
    model: "whisper-1",
  });

  return transcription.text;
}

async function translate(prompt, lang) {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You will be provided with a sentence, and your task is to translate it into ${lang}.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.choices[0].message.content;
}
var name = "";
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + tik + path.extname(file.originalname));
    name = file.fieldname + "-" + tik + path.extname(file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/translate.html"));
});

router.post("/", async (req, res) => {
  console.log(req.body);
  console.log(req.body.input, req.body.lang);
  const mess = await translate(req.body.input, req.body.lang);
  console.log(mess);
  res.json({ success: true, message: mess });
});

router.post("/transcribe", upload.single("audio"), async (req, res) => {
  console.log("File uploaded:", req.file);
  var text = await transcribe(`./uploads/${name}`);
  console.log(text);
  res.json({ message: text });
});
module.exports = router;
