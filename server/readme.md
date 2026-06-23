---
title: AI CRM API
emoji: 🚀
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 8000
---

# AI CRM Monolith

This project has been refactored into a single monolithic API mimicking the GoNidhi `dl-api` structure. It is designed to be deployed directly to Hugging Face Spaces using Docker.

## Structure
- `api/`: API Routers.
- `core/`: Configurations, globals, logging.
- `engine/`: Model loading, inference, and RAG execution logic.
- `services/`: Business logic.
- `models/`: Contains the sentiment model and ticket classification model.
- `data/knowledge_base/`: Contains the raw source documents (markdown, text) for the RAG ingestion pipeline.
- `schemas.py`: Pydantic validation schemas.
- `main.py`: FastAPI entrypoint.
- `modal_app.py`: Modal deployment script.

## Setup

1. Create a single virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Setup environment variables:
Update `.env` with your `GOOGLE_API_KEY`.

4. Run locally:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

