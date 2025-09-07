<!DOCTYPE html>
<html>

<body>

<h1>AI-Powered E-commerce CRM System</h1>

<p>A microservices-based AI backend designed to automate and enhance customer service for e-commerce platforms. This system analyzes customer feedback in real-time, classifies issues for efficient routing, and provides automated, context-aware answers to user queries from a custom knowledge base.</p>

<h2>🏛️ Architecture: A Robust Microservices Approach</h2>

<p>This project is architected as two independent microservices to resolve critical dependency conflicts between the older ML stack (<code>TensorFlow 2.12</code>, <code>numpy &lt; 1.24</code>) and the modern RAG stack (<code>LangChain</code>, <code>numpy &gt;= 1.25</code>). This professional architecture ensures stability, scalability, and independent deployment, managed seamlessly by Docker Compose.</p>

<br>

<p><em><strong>[Placeholder for your Architecture Diagram - a simple diagram showing the two services would be very effective here]</strong></em></p>

<br>

<ol>
<li><strong>Classifier Service</strong> (<code>Port 8000</code>): A dedicated FastAPI service running a stable TensorFlow environment. It handles all classification tasks.</li>
<li><strong>RAG Service</strong> (<code>Port 8001</code>): A modern FastAPI service running the latest LangChain and Gemini libraries. It handles all generative AI tasks, including Q&A and summarization.</li>
</ol>

<h2>✨ Key Features</h2>

<ul>
<li><strong>Sentiment Analysis:</strong> Automatically classifies customer feedback as <code>Positive</code> or <code>Negative</code> with a <strong>94% F1-score</strong>.</li>
<li><strong>Automated Ticket Classification:</strong> Routes incoming tickets to one of six categories (e.g., "Returns & Refunds," "Delivery & Tracking") with an <strong>86% F1-score</strong>.</li>
<li><strong>Retrieval-Augmented Generation (RAG):</strong> Answers user questions based on a custom knowledge base of company documents, providing a semantic confidence score for each response.</li>
<li><strong>AI-Powered Summarization:</strong> Generates concise, one-sentence summaries of long customer complaints.</li>
<li><strong>Fully Containerized:</strong> Both services are packaged with <strong>Docker</strong> and orchestrated with <strong>Docker Compose</strong> for a reproducible, one-command setup.</li>
</ul>

<h2>🚀 Getting Started</h2>

<p>Follow these instructions to set up and run the entire backend on your local machine.</p>

<h3>Prerequisites</h3>

<ul>
<li>Docker & Docker Compose</li>
<li>Python 3.10+</li>
<li>Git</li>
</ul>

<h3>1. Clone the Repository</h3>

<pre><code>git clone https://github.com/24archit/AI-Powered-CRM-System.git
cd your-repo-name</code></pre>

<h3>2. Set Up Environment Variables</h3>

<p>The RAG service requires a Google Gemini API key.</p>

<ul>
<li>Navigate to the <code>rag_service</code> directory.</li>
<li>Create a file named <code>.env</code>.</li>
<li>Add your API key to the file:</li>
</ul>

<pre><code>GOOGLE_API_KEY="AIzaSy...your...key...here"</code></pre>

<h3>3. Build the Knowledge Base</h3>

<p>The RAG engine needs a searchable index of your <code>rag_docs</code>. This is a one-time setup step.</p>

<ul>
<li>Navigate to the <code>rag_service</code> directory.</li>
<li>Create and activate a virtual environment and install the requirements.</li>
<li>Run the build script:</li>
</ul>

<pre><code>python build_rag_index.py</code></pre>

<p>This will create a <code>faiss_index</code> folder.</p>

<h3>4. Run the Application with Docker Compose</h3>

<p>From the <strong>root directory</strong> of the project (the one containing <code>docker-compose.yml</code>), run the following command:</p>

<pre><code>docker-compose up --build</code></pre>

<p>This single command will:</p>

<ol>
<li>Build the Docker images for both the <code>classifier-service</code> and the <code>rag-service</code>.</li>
<li>Start both services in their respective containers.</li>
</ol>

<p>You can now access your running services:</p>

<ul>
<li><strong>Classifier Service:</strong> <code>http://localhost:8000/docs</code></li>
<li><strong>RAG & Summarization Service:</strong> <code>http://localhost:8001/docs</code></li>
</ul>

<h2>🛠️ Tech Stack</h2>

<ul>
<li><strong>Backend:</strong> FastAPI, Uvicorn</li>
<li><strong>Machine Learning:</strong> TensorFlow, Keras, Scikit-learn, Pandas</li>
<li><strong>NLP & Generative AI:</strong> Transformers (BERT), LangChain, Google Gemini, Sentence-Transformers, FAISS</li>
<li><strong>Containerization & Deployment:</strong> Docker, Docker Compose</li>
</ul>

</body>
</html>
