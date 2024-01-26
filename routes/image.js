const { Router } = require("express");
const path = require("path");
const OpenAI = require("openai");
require("dotenv").config();

const apiKey = process.env.API_KEY;

const router = Router();
const Openaikey = apiKey;

const openai = new OpenAI({
  apiKey: Openaikey, // defaults to process.env["OPENAI_API_KEY"]
});

async function imagegen(input) {
  try {
    const image = await openai.images.generate({
      prompt: input,
      n: 3,
      size: "1024x1024",
    });

    return { success: true, message: image.data };
  } catch (error) {
    console.log(error.error.message);
    return { success: false, message: error.error.message };
  }
}

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/image.html"));
});

router.post("/", async function (req, res, next) {
  console.log(req.body);
  const images = await imagegen(req.body.input);
  res.json(images);
});

module.exports = router;
