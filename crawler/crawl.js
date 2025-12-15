// crawler/crawl.js

import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import dotenv from "dotenv";
import { URL } from "url";

dotenv.config();

// ---------------- CONFIG ----------------
const MAX_PAGES = Number(process.env.MAX_PAGES || 30);
const DELAY_MS = Number(process.env.DELAY_MS || 300);
const USER_AGENT = process.env.USER_AGENT || "qna-support-bot/1.0";

// pages we do NOT want to crawl
const BLOCKED_KEYWORDS = [
  "login",
  "signup",
  "register",
  "cart",
  "checkout",
  "account",
  "payment"
];

// ---------------- HELPERS ----------------
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function isInternal(url, baseUrl) {
  try {
    return new URL(url).origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
}

function isBlocked(url) {
  return BLOCKED_KEYWORDS.some(keyword =>
    url.toLowerCase().includes(keyword)
  );
}

function normalize(url) {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

async function fetchPage(url) {
  try {
    const res = await axios.get(url, {
      headers: { "User-Agent": USER_AGENT },
      timeout: 10000
    });

    if (res.headers["content-type"]?.includes("text/html")) {
      return res.data;
    }
  } catch (err) {
    console.log("❌ Failed:", url);
  }
  return null;
}

// ---------------- MAIN CRAWLER ----------------
export async function crawl(baseUrl) {
  const visited = new Set();
  const queue = [baseUrl];
  const pages = [];

  console.log(`🚀 Starting crawl on: ${baseUrl}`);

  while (queue.length && visited.size < MAX_PAGES) {
    const currentUrl = normalize(queue.shift());
    if (!currentUrl) continue;
    if (visited.has(currentUrl)) continue;
    if (isBlocked(currentUrl)) continue;

    visited.add(currentUrl);
    console.log(`📄 Crawling: ${currentUrl}`);

    const html = await fetchPage(currentUrl);
    await delay(DELAY_MS);

    if (!html) continue;

    const $ = cheerio.load(html);
    const title = $("title").text().trim();

    // store page
    pages.push({
      url: currentUrl,
      title,
      html
    });

    // extract links
    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      try {
        const absoluteUrl = normalize(new URL(href, currentUrl).href);

        if (
          absoluteUrl &&
          isInternal(absoluteUrl, baseUrl) &&
          !visited.has(absoluteUrl) &&
          !queue.includes(absoluteUrl) &&
          !isBlocked(absoluteUrl)
        ) {
          queue.push(absoluteUrl);
        }
      } catch {}
    });
  }

  // ensure data folder exists
  if (!fs.existsSync("data")) fs.mkdirSync("data");

  fs.writeFileSync(
    "data/pages.json",
    JSON.stringify(pages, null, 2)
  );

  console.log("\n✅ Crawl finished");
  console.log("📌 Crawled URLs:");
  pages.forEach(p => console.log(" -", p.url));
}

// -------- RUN DIRECTLY --------
if (process.argv[1].includes("crawl.js")) {
  const BASE_URL = process.env.BASE_URL;
  if (!BASE_URL) {
    console.error("❌ BASE_URL not found in .env");
    process.exit(1);
  }
  crawl(BASE_URL);
}
