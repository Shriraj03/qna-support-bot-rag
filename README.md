# Q&A Support Bot (RAG-based)

## 📌 Project Overview

This project is a **Retrieval-Augmented Generation (RAG) based Q&A Support Bot**.

The system:
- Crawls a given website
- Cleans and extracts visible content
- Splits content into chunks
- Generates embeddings
- Stores them in a vector database
- Retrieves relevant content for user queries
- Answers questions **only using retrieved context**
- Exposes REST APIs for crawling and question answering

The project demonstrates the **complete RAG pipeline** end-to-end.

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **Cheerio** (HTML parsing)
- **Axios** (HTTP requests)
- **Local embeddings** (for development)
- **Cosine similarity** (vector search)

---

## 📂 Project Structure

```
qna-support-bot/
│
├── crawler/          # Website crawling
├── extractor/        # HTML cleaning & text extraction
├── chunker/          # Text chunking
├── embeddings/       # Embedding generation
├── vector_store/     # Vector similarity utilities
├── retrieval/        # Retrieval logic
├── api/              # REST API (server & answer logic)
├── data/             # Stored pages, chunks, vectors
├── index.js          # Entry point
├── package.json
└── README.md
```

---

## 🚀 Steps to Run the Project

### 1️⃣ Install dependencies

```bash
npm install
```

---

### 2️⃣ Start the API server

```bash
npm start
```

Server will run at:

```
http://localhost:3000
```

---

## 🌐 Crawling a Website

### Endpoint
```
POST /crawl
```

### Request Body
```json
{
  "baseUrl": "https://example.com"
}
```

### What this does
- Crawls internal pages of the website
- Cleans HTML content
- Chunks text
- Generates embeddings
- Indexes everything in the vector store

### Expected Response
```json
{
  "message": "Website indexed successfully"
}
```

---

## ❓ Asking Questions (`/ask` endpoint)

### Endpoint
```
POST /ask
```

### Request Body
```json
{
  "question": "What is this website about?"
}
```

### Response Format
```json
{
  "answer": "Based on the available information...",
  "sources": [
    "https://example.com"
  ]
}
```

The answer is generated **only from retrieved content**, preventing hallucinations.

---

## 🧪 How to Test the APIs

### Option 1: Postman (Recommended)

1. Create a **POST** request to `/crawl`
2. Send the base URL
3. After success, create a **POST** request to `/ask`
4. Send a question

---

### Option 2: curl (PowerShell)

#### Crawl
```powershell
curl http://localhost:3000/crawl `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "baseUrl": "https://example.com" }'
```

#### Ask
```powershell
curl http://localhost:3000/ask `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "question": "What is this website about?" }'
```

---

## 💡 Example Questions & Answers

### Question
```
What is this website about?
```

### Answer
```
This domain is used for illustrative examples in documentation and does not require prior permission.
```

### Source
```
https://example.com
```

---

## ⚠️ Limitations

- Uses **local embeddings** instead of a production-grade model
- Simple vector store (JSON-based)
- No authentication or rate limiting
- Designed for small-to-medium websites

---

## 🚀 Future Improvements

- Replace local embeddings with OpenAI / HuggingFace models
- Integrate vector databases like **Pinecone**, **Chroma**, or **Qdrant**
- Add pagination and depth control for crawling
- Improve answer generation using LLMs
- Add UI frontend for users
- Add caching and performance optimizations

---

## 🏁 Conclusion

This project demonstrates a **complete, working RAG pipeline** with crawling, embeddings, retrieval, and REST APIs.  
It is designed to be **simple, extensible, and interview-ready**.


## Submission Note

This pull request is created for assignment submission and review.
