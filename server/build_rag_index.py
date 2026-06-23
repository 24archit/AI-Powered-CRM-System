import sys
import os
import glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core import config
from engine.vector_store import CRMVectorStore

def chunk_text(text: str, chunk_size: int, chunk_overlap: int):
    """Simple sliding window text chunker."""
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - chunk_overlap
    return chunks

def build_vector_store():
    try:
        print(f"\n--- Loading documents from: {config.RAG_DOCS_PATH} ---")
        
        md_files = glob.glob(os.path.join(config.RAG_DOCS_PATH, "**", "*.md"), recursive=True)
        
        if not md_files:
            print(f"❌ No markdown documents found at {config.RAG_DOCS_PATH}. Please check the directory.")
            return
            
        all_chunks = []
        all_metadata = []

        # Assuming standard average of ~5 characters per word
        word_chunk_size = config.CHUNK_SIZE // 5
        word_chunk_overlap = config.CHUNK_OVERLAP // 5

        print("\n--- Processing and splitting documents into chunks ---")
        for file_path in md_files:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            chunks = chunk_text(content, word_chunk_size, word_chunk_overlap)
            for chunk in chunks:
                if chunk.strip():  # ignore empty chunks
                    all_chunks.append(chunk)
                    all_metadata.append({"source": os.path.basename(file_path)})

        print(f"✅ Extracted {len(all_chunks)} chunks from {len(md_files)} files.")

        print("\n--- Initializing Qdrant Vector Store ---")
        store = CRMVectorStore()

        print("\n--- Encoding and uploading chunks to Qdrant ---")
        store.add_texts(all_chunks, all_metadata)

        print(f"\n✅ Vector store indexing complete in Qdrant collection: {config.QDRANT_COLLECTION_NAME}")

    except Exception as e:
        print(f"\n❌ An error occurred during the build process: {e}")

if __name__ == "__main__":
    build_vector_store()
