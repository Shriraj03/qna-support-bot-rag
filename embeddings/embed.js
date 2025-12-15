// embeddings/embed.js (LOCAL EMBEDDINGS)

import fs from "fs";
import crypto from "crypto";

// Load chunks
const chunks = JSON.parse(
  fs.readFileSync("data/chunks.json", "utf-8")
);

// Simple local embedding function
function generateEmbedding(text, dim = 128) {
  const hash = crypto.createHash("sha256").update(text).digest();
  const embedding = [];

  for (let i = 0; i < dim; i++) {
    embedding.push(hash[i % hash.length] / 255);
  }

  return embedding;
}

const vectors = [];

console.log("🚀 Generating LOCAL embeddings...");

for (const chunk of chunks) {
  vectors.push({
    chunkId: chunk.chunkId,
    url: chunk.url,
    title: chunk.title,
    text: chunk.text,
    embedding: generateEmbedding(chunk.text)
  });
}

// Save vector store
fs.writeFileSync(
  "data/vectors.json",
  JSON.stringify(vectors, null, 2)
);

console.log(`✅ Stored ${vectors.length} embeddings locally`);
