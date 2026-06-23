# AI CRM Fullstack Platform

This repository houses the AI-Powered Customer Relationship Management (CRM) platform. It has been structured into a clear separation of concerns, providing both a backend intelligence API and a frontend client interface.

## Architecture

*   **`server/`**: Contains the monolithic FastAPI backend. It handles all business logic, machine learning inference (Sentiment & Ticket classification), and Retrieval-Augmented Generation (RAG) using Hugging Face models and Qdrant. This folder is automatically synced to our Hugging Face Space for serverless API deployment.
*   **`client/`**: Contains the upcoming React + TypeScript frontend interface that will consume the backend API.

## Getting Started

To run the backend API locally, navigate into the `server/` directory:

```bash
cd server
python -m venv .venv
.\.venv\Scripts\activate  # On Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

> Note: Ensure you have your `.env` configured inside the `server/` directory with your `HF_TOKEN`, `QDRANT_URL`, and `QDRANT_API_KEY`.
