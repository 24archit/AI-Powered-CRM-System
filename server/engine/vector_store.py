import uuid
from typing import List, Dict
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer, CrossEncoder
from core import config

class CRMVectorStore:
    def __init__(self):
        if not config.QDRANT_URL or not config.QDRANT_API_KEY:
            raise ValueError("QDRANT_URL and QDRANT_API_KEY must be set in .env")
            
        self.client = QdrantClient(url=config.QDRANT_URL, api_key=config.QDRANT_API_KEY)
        self.collection_name = config.QDRANT_COLLECTION_NAME
        
        # --- Safety Check to prevent accidental crossover with GoNidhi ---
        if self.collection_name == "cattle_vectors_spatial" or "crm" not in self.collection_name.lower():
            raise ValueError(f"CRITICAL ERROR: Refusing to connect to collection '{self.collection_name}'. "
                             "This collection name belongs to GoNidhi or lacks the 'crm' prefix. "
                             "Safety bounds triggered to prevent data corruption.")
        # -----------------------------------------------------------------
        
        # Initialize local SentenceTransformers embedding model
        print(f"Loading local embedding model: {config.RAG_EMBEDDING_MODEL}")
        self.encoder = SentenceTransformer(config.RAG_EMBEDDING_MODEL)
        
        print(f"Loading local reranker model: {config.RAG_RERANKER_MODEL}")
        self.reranker = CrossEncoder(config.RAG_RERANKER_MODEL)
        
        # bge-base-en-v1.5 has 768 dimensions
        self.vector_size = self.encoder.get_embedding_dimension()
        
        self._init_collection()

    def _init_collection(self):
        try:
            if not self.client.collection_exists(self.collection_name):
                print(f"Collection '{self.collection_name}' not found. Creating...")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
                )
            else:
                print(f"Collection '{self.collection_name}' found and ready.")
        except Exception as e:
            print(f"Warning during collection init: {e}")

    def add_texts(self, texts: List[str], metadata: List[Dict] = None):
        """Encodes texts into vectors and upserts them into Qdrant."""
        if not texts:
            return

        if not metadata:
            metadata = [{} for _ in texts]

        # Generate embeddings locally
        print("Generating embeddings...")
        embeddings = self.encoder.encode(texts, show_progress_bar=True)
        
        # Construct points
        points = []
        for i, (text, vec) in enumerate(zip(texts, embeddings)):
            point_id = str(uuid.uuid4())
            payload = metadata[i]
            payload["text"] = text
            points.append(PointStruct(id=point_id, vector=vec.tolist(), payload=payload))
            
        # Upsert in batches to avoid overwhelming the network
        batch_size = 100
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            self.client.upsert(
                collection_name=self.collection_name,
                points=batch
            )
        print(f"Successfully upserted {len(points)} chunks into Qdrant.")

    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Searches Qdrant for the top k most similar chunks and reranks them."""
        query_vector = self.encoder.encode(query).tolist()
        
        retrieve_k = getattr(config, 'RAG_RETRIEVE_K', 15)
        
        # Stage 1: Dense Retrieval
        response = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=retrieve_k
        )
        hits = response.points
        
        if not hits:
            return []
            
        # Stage 2: Cross-Encoder Reranking
        documents = [hit.payload["text"] for hit in hits]
        sentence_pairs = [[query, doc] for doc in documents]
        
        scores = self.reranker.predict(sentence_pairs)
        
        results = []
        for i, hit in enumerate(hits):
            results.append({
                "score": float(scores[i]),
                "payload": hit.payload
            })
            
        # Sort by reranker score descending
        results = sorted(results, key=lambda x: x["score"], reverse=True)
        
        return results[:top_k]
