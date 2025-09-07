# AI-powered CRM System

An intelligent, multi-model AI system designed to automate the analysis of customer feedback for e-commerce platforms like Amazon and Flipkart. This project leverages fine-tuned BERT models for high-accuracy classification and a Retrieval-Augmented Generation (RAG) engine for automated, context-aware customer support.

## Core Features

🤖 **Automated Ticket Analysis**: Instantly classifies incoming customer feedback for sentiment and ticket category with high accuracy.

🧠 **Intelligent Q&A**: A RAG engine answers customer questions using a knowledge base of company documents, providing accurate, context-aware responses.

📈 **Strategic Insights**: Discovers hidden topics and trends from customer feedback to provide actionable business intelligence.

⚡ **Scalable Microservices Architecture**: Built with two independent FastAPI services to handle ML and RAG tasks separately, ensuring robustness and resolving dependency conflicts.

✅ **Reproducible ML Pipeline**: Includes all scripts and notebooks to reproduce the fine-tuned models and RAG index from scratch.

## Architecture Overview

The backend is built on a microservices architecture to ensure stability and scalability. This professional approach resolves Python's "dependency hell" by isolating older ML libraries from modern RAG libraries.

**Classifier Service**: A dedicated FastAPI service running on a TensorFlow 2.12 stack. It handles all classification tasks (Sentiment and Ticket Category).

**RAG & Summarization Service**: A separate FastAPI service running on a modern LangChain stack. It manages the vector store and handles all generative AI tasks (Q&A and Summarization).

**Express/Node.js Backend** (Not included in this repo): The main application server that would handle database interactions and communicate with these two AI services.

## Tech Stack

### AI / Machine Learning
- **TensorFlow & Keras**: For fine-tuning classification models.
- **Hugging Face Transformers**: For leveraging pre-trained BERT models.
- **LangChain**: For orchestrating the RAG and summarization pipelines.
- **Google Gemini**: For embeddings and generative AI.
- **FAISS**: For high-speed vector storage and retrieval.
- **BERTopic**: For unsupervised topic discovery.

### Backend
- **FastAPI**: For building the high-performance, asynchronous APIs.
- **Uvicorn**: As the ASGI server.

### Python Libraries
- **Pydantic**: For data validation.
- **scikit-learn**: For model evaluation.
- **python-dotenv**: For environment variable management.

## Getting Started

This repository contains two separate services. Please follow the setup instructions for each.

### Prerequisites
- Python 3.10
- A GOOGLE_API_KEY for the Gemini API.

### 1. The Classifier Service

This service runs the Sentiment and Ticket Classifier models.

Navigate to the classifier_service directory:
```bash
cd classifier_service
```

Create and activate a virtual environment:
```bash
python -m venv venv_tf
venv_tf\Scripts\activate
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

**Get the Models:**
- **Option A (Recommended)**: Download the fine-tuned models from the Hugging Face Hub and place them in the `classifier_service/models/` directory.
- **Option B (Reproduce)**: Run the training notebooks (`Sentiment Analysis.ipynb`, `Ticket Classifier.ipynb`) to fine-tune and save the models from scratch.

Run the service:
```bash
python run.py
```

The service will be available at http://127.0.0.1:8000.

### 2. The RAG & Summarization Service

This service runs the Q&A and Summarization models.

Navigate to the rag_service directory:
```bash
cd rag_service
```

Create and activate a new virtual environment:
```bash
python -m venv venv_rag
venv_rag\Scripts\activate
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

Create a .env file in this directory and add your API key:
```
GOOGLE_API_KEY="YOUR_API_KEY_HERE"
```

Build the Knowledge Base: The source documents are in the rag_docs folder. Run the build script to create the searchable index:
```bash
python build_rag_index.py
```

Run the service:
```bash
python run.py
```

The service will be available at http://127.0.0.1:8001.

## API Endpoints

### Classifier Service (localhost:8000)

**POST /api/analyze**: Takes text and returns sentiment and ticket category predictions.

Example Request:
```json
{
  "text": "My order arrived broken, I need a replacement."
}
```

### RAG Service (localhost:8001)

**POST /api/ask-rag**: Takes a question and returns an answer from the knowledge base.

**POST /api/summarize**: Takes a long text and returns a short summary.

Example Request:
```json
{
  "question": "How long do I have to return a damaged item?"
}
```

## Future Work

- Integrate with a MongoDB database for ticket storage.
- Build a full-stack MERN admin dashboard for visualization.
- Containerize both services using Docker for easy deployment.
