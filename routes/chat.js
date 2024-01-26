const { Router } = require("express");
const path = require("path");

const OpenAI = require("openai");
const router = Router();
require("dotenv").config();

const apiKey = process.env.API_KEY;

const Openaikey = apiKey;

const openai = new OpenAI({
  apiKey: Openaikey, // defaults to process.env["OPENAI_API_KEY"]
});

async function text(input) {
  console.log(input);
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: "gpt-3.5-turbo",
    });

    return {
      success: true,
      message: chatCompletion.choices[0]?.message?.content,
    };
  } catch (e) {
    return { success: false, message: e.error.message };
  }
}

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../templates/chat.html"));
});

router.post("/", async (req, res) => {
  console.log(req.body);
  const mes = await text(req.body.input);
  res.json(mes);
});

module.exports = router;
