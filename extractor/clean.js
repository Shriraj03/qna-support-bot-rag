// extractor/clean.js

import fs from "fs";
import * as cheerio from "cheerio";

// Load crawled pages
const pages = JSON.parse(
  fs.readFileSync("data/pages.json", "utf-8")
);

const cleanedPages = [];

for (const page of pages) {
  const $ = cheerio.load(page.html);

  // Remove noise elements
  $(
    "script, style, nav, footer, header, noscript, iframe"
  ).remove();

  // Remove common cookie banners (best-effort)
  $(
    "[id*='cookie'], [class*='cookie'], [id*='consent'], [class*='consent']"
  ).remove();

  // Extract title
  const title = $("title").text().trim();

  // Extract visible text
  let text = $("body").text();

  // Clean text (remove noise)
  text = text
    .replace(/\s+/g, " ")     // collapse spaces
    .replace(/\n+/g, " ")     // remove newlines
    .trim();

  // Skip empty pages
  if (!text) continue;

  cleanedPages.push({
    url: page.url,
    title,
    text
  });
}

// Save cleaned content
fs.writeFileSync(
  "data/pages_clean.json",
  JSON.stringify(cleanedPages, null, 2)
);

// -------- TEST OUTPUT --------
console.log("✅ Content extraction complete.");
console.log("📌 Sample cleaned text:\n");

cleanedPages.slice(0, 2).forEach((p, i) => {
  console.log(`--- Page ${i + 1} ---`);
  console.log("URL:", p.url);
  console.log("TITLE:", p.title);
  console.log("TEXT:", p.text.substring(0, 300), "...\n");
});
