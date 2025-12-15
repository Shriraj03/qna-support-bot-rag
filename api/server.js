import express from "express";
import dotenv from "dotenv";

import { crawl } from "../crawler/crawl.js";
import "../extractor/clean.js";
import "../chunker/chunk.js";
import "../embeddings/embed.js";
import { generateAnswer } from "./answer.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * POST /crawl
 * Runs full indexing pipeline
 */
app.post("/crawl", async (req, res) => {
  try {
    const { baseUrl } = req.body;

    if (!baseUrl) {
      return res.status(400).json({ error: "baseUrl is required" });
    }

    // Update env base URL dynamically
    process.env.BASE_URL = baseUrl;

    console.log("🔄 Starting full crawl pipeline...");

    await crawl(baseUrl);           // Step 2
    await import("../extractor/clean.js");   // Step 3
    await import("../chunker/chunk.js");     // Step 4
    await import("../embeddings/embed.js");  // Step 5

    res.json({
      message: "Website indexed successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Crawling failed" });
  }
});

/**
 * POST /ask
 * Answers user questions using RAG
 */
app.post("/ask", (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  const result = generateAnswer(question);

  res.json({
    answer: result.answer,
    sources: result.sources
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running at http://localhost:${PORT}`);
});
