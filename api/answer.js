// api/answer.js

import { retrieveRelevantChunks } from "../retrieval/retrieve.js";

export function generateAnswer(question) {
  const chunks = retrieveRelevantChunks(question, 3);

  if (chunks.length === 0) {
    return {
      answer: "No relevant information found.",
      sources: []
    };
  }

  // Build context
  const contextText = chunks.map(c => c.text).join(" ");

  // Simple answer logic (context-only)
  const answer = `
Based on the available information:

${contextText.substring(0, 500)}...
`.trim();

  const sources = [...new Set(chunks.map(c => c.url))];

  return {
    answer,
    sources
  };
}
