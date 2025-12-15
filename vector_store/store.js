// vector_store/store.js

import fs from "fs";

let vectors = [];

export function loadVectors() {
  if (!vectors.length) {
    vectors = JSON.parse(
      fs.readFileSync("data/vectors.json", "utf-8")
    );
  }
  return vectors;
}

function dot(a, b) {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function magnitude(v) {
  return Math.sqrt(dot(v, v));
}

export function cosineSimilarity(a, b) {
  return dot(a, b) / (magnitude(a) * magnitude(b));
}
