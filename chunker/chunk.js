// chunker/chunk.js

import fs from "fs";

const CHUNK_SIZE = 500;
const OVERLAP = 100;

// Load cleaned pages
const pages = JSON.parse(
  fs.readFileSync("data/pages_clean.json", "utf-8")
);

const chunks = [];
const chunkCountByPage = {};

for (const page of pages) {
  const { url, title, text } = page;

  let start = 0;
  let index = 0;

  while (start < text.length) {
    const end = start + CHUNK_SIZE;
    const chunkText = text.slice(start, end).trim();

    if (chunkText.length > 0) {
      const chunkId = `${url}_${index}`;

      chunks.push({
        chunkId,
        url,
        title,
        text: chunkText
      });

      index++;
    }

    start += CHUNK_SIZE - OVERLAP;
  }

  chunkCountByPage[url] = index;
}

// Save chunks
fs.writeFileSync(
  "data/chunks.json",
  JSON.stringify(chunks, null, 2)
);

// -------- TEST OUTPUT --------
console.log("✅ Chunking complete.");
console.log("📌 Chunk count per page:\n");

for (const [url, count] of Object.entries(chunkCountByPage)) {
  console.log(`${url} → ${count} chunks`);
}
