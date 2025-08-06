import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/generate", async (req, res) => {
  const { prompt, aspect, style, count } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const finalPrompt = `${prompt}, style: ${style}`;
    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: finalPrompt,
      size: aspect || "1024x1024",
      n: count || 1,
      response_format: "b64_json"
    });

    res.json({
      success: true,
      prompt: finalPrompt,
      images: response.data.map(img => `data:image/png;base64,${img.b64_json}`)
    });
  } catch (error) {
    res.status(500).json({ error: "Image generation failed" });
  }
});

app.get("/api/status", (req, res) => {
  res.json({ status: "API is running ✅" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
