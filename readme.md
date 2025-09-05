# AI-powered CRM System

An intelligent customer relationship management system that automates customer feedback analysis for e-commerce platforms using AI and machine learning.

## Features

- **Automated Classification**: Sentiment analysis and ticket categorization using fine-tuned BERT models
- **Intelligent Q&A**: RAG-powered system answers customer questions using company knowledge base
- **Topic Discovery**: Identifies trends and patterns in customer feedback
- **Microservices Architecture**: Scalable design with separate FastAPI services
- **High Accuracy**: Fine-tuned models for precise classification results

## Architecture

The system uses a microservices architecture with two main components:

1. **Classifier Service** (Port 8000): Handles sentiment analysis and ticket categorization
2. **RAG Service** (Port 8001): Manages Q&A and text summarization
3. **Main Backend** (Not included): Node.js/Express server for database operations

## Tech Stack

**AI/ML**: TensorFlow, Keras, Hugging Face Transformers, LangChain, Google Gemini, FAISS, BERTopic

**Backend**: FastAPI, Uvicorn, Python 3.10+

**Other**: Pydantic, scikit-learn, python-dotenv

## Installation

### Prerequisites

- Python 3.10+
- Google API Key for Gemini API

### 1. Classifier Service

```bash
cd classifier_service
python -m venv venv_tf
venv_tf\Scripts\activate  # Windows
# source venv_tf/bin/activate  # macOS/Linux
pip install -r requirements.txt
python run.py
```

Service runs at: `http://127.0.0.1:8000`

### 2. RAG Service

```bash
cd rag_service
python -m venv venv_rag
venv_rag\Scripts\activate  # Windows
# source venv_rag/bin/activate  # macOS/Linux
pip install -r requirements.txt
echo 'GOOGLE_API_KEY="your_api_key_here"' > .env
python build_rag_index.py
python run.py
```

Service runs at: `http://127.0.0.1:8001`

## API Endpoints

### Classifier Service (localhost:8000)

**POST /api/analyze** - Analyze customer feedback

Request:
```json
{
  "text": "My order arrived broken, I need a replacement."
}
```

Response:
```json
{
  "sentiment": {
    "label": "negative",
    "confidence": 0.92
  },
  "category": {
    "label": "product_quality",
    "confidence": 0.87
  }
}
```

### RAG Service (localhost:8001)

**POST /api/ask-rag** - Get answers from knowledge base

Request:
```json
{
  "question": "How long do I have to return a damaged item?"
}
```

**POST /api/summarize** - Summarize long text

Request:
```json
{
  "text": "Long customer feedback text..."
}
```

## Models

The system includes two fine-tuned BERT models:
- Sentiment Analysis Model
- Ticket Category Classifier

Models can be downloaded from Hugging Face Hub or trained from scratch using the provided Jupyter notebooks.

## Project Structure

```
ai-crm-system/
├── classifier_service/
│   ├── models/
│   ├── requirements.txt
│   └── run.py
├── rag_service/
│   ├── rag_docs/
│   ├── requirements.txt
│   ├── build_rag_index.py
│   └── run.py
└── README.md
```

## Future Development

- Integration with MongoDB database
- Complete MERN stack admin dashboard
- Docker containerization
- Extended e-commerce platform support

## License

This project is licensed under the MIT License.
