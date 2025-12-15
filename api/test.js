// api/test.js

import { generateAnswer } from "./answer.js";

const question = "What is this website about?";

const result = generateAnswer(question);

console.log("\n🧠 Question:");
console.log(question);

console.log("\n💬 Answer:");
console.log(result.answer);

console.log("\n🔗 Sources:");
result.sources.forEach(src => console.log("-", src));
