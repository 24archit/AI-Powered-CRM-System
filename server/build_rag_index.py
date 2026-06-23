import sys
import os
import glob
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core import config
from engine.vector_store import CRMVectorStore

import re

def recursive_split_text(text: str, chunk_size: int, chunk_overlap: int) -> list:
    """Recursive markdown text splitter based on character count."""
    separators = ["\n\n", "\n", ". ", " ", ""]
    
    def split_text(txt: str, sep_index: int) -> list:
        if len(txt) <= chunk_size:
            return [txt]
            
        separator = separators[sep_index]
        if separator == "":
            return [txt[i:i+chunk_size] for i in range(0, len(txt), chunk_size - chunk_overlap)]
            
        splits = txt.split(separator)
        
        good_splits = []
        current_split = ""
        
        for s in splits:
            if current_split:
                if len(current_split) + len(separator) + len(s) <= chunk_size:
                    current_split += separator + s
                else:
                    good_splits.append(current_split)
                    current_split = s
            else:
                current_split = s
                
        if current_split:
            good_splits.append(current_split)
            
        final_splits = []
        for gs in good_splits:
            if len(gs) > chunk_size and sep_index < len(separators) - 1:
                final_splits.extend(split_text(gs, sep_index + 1))
            else:
                final_splits.append(gs)
                
        return final_splits

    return split_text(text, 0)

def build_vector_store():
    try:
        print(f"\n--- Loading documents from: {config.RAG_DOCS_PATH} ---")
        
        md_files = glob.glob(os.path.join(config.RAG_DOCS_PATH, "**", "*.md"), recursive=True)
        
        if not md_files:
            print(f"❌ No markdown documents found at {config.RAG_DOCS_PATH}. Please check the directory.")
            return
            
        all_chunks = []
        all_metadata = []

        print("\n--- Processing and splitting documents into chunks ---")
        for file_path in md_files:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            chunks = recursive_split_text(content, config.CHUNK_SIZE, config.CHUNK_OVERLAP)
            for chunk in chunks:
                if chunk.strip():  # ignore empty chunks
                    all_chunks.append(chunk)
                    all_metadata.append({"source": os.path.basename(file_path)})

        print(f"[OK] Extracted {len(all_chunks)} chunks from {len(md_files)} files.")

        print("\n--- Initializing Qdrant Vector Store ---")
        store = CRMVectorStore()

        print("\n--- Clearing existing Qdrant collection ---")
        try:
            store.client.delete_collection(store.collection_name)
            store._init_collection() # Recreate it fresh
            print("[OK] Existing collection cleared.")
        except Exception as e:
            print(f"[Warning] Could not clear collection (it may not exist yet): {e}")

        print("\n--- Encoding and uploading chunks to Qdrant ---")
        store.add_texts(all_chunks, all_metadata)

        print(f"\n[OK] Vector store indexing complete in Qdrant collection: {config.QDRANT_COLLECTION_NAME}")

    except Exception as e:
        print(f"\n[ERROR] An error occurred during the build process: {e}")

if __name__ == "__main__":
    build_vector_store()
