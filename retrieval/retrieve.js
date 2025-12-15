// retrieval/retrieve.js

import { loadVectors, cosineSimilarity } from "../vector_store/store.js";

// Generate query embedding (same logic as chunk embedding)
function generateQueryEmbedding(text, dim = 128) {
  const vector = [];
  for (let i = 0; i < dim; i++) {
    vector.push((text.charCodeAt(i % text.length) || 0) / 255);
  }
  return vector;
}

export function retrieveRelevantChunks(query, topK = 3) {
  const vectors = loadVectors();
  const queryEmbedding = generateQueryEmbedding(query);

  const scoredChunks = vectors.map(chunk => ({
    chunkId: chunk.chunkId,
    url: chunk.url,
    title: chunk.title,
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding)
  }));

  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
