import google.generativeai as genai

from langchain_community.document_loaders import DirectoryLoader, UnstructuredMarkdownLoader
from langchain_community.vectorstores import FAISS

from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from app import config


try:
    genai.configure(api_key=config.GOOGLE_API_KEY)
    print("✅ Gemini API Key configured successfully.")
except (TypeError, AttributeError):
    print("❌ ERROR: Could not find GOOGLE_API_KEY. Please check your config.py and .env file.")
    exit()


def build_vector_store():
 
    try:
        print(f"\n--- Loading documents from: {config.RAG_DOCS_PATH} ---")
        loader = DirectoryLoader(
            config.RAG_DOCS_PATH,
            glob="**/*.md",
            loader_cls=UnstructuredMarkdownLoader,
            show_progress=True,
            use_multithreading=True
        )
        documents = loader.load()

        if not documents:
            print(f"❌ No documents found at {config.RAG_DOCS_PATH}. Please check the directory.")
            return

        print(f"✅ Loaded {len(documents)} documents.")

        print("\n--- Splitting documents into chunks ---")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.CHUNK_SIZE,
            chunk_overlap=config.CHUNK_OVERLAP
        )
        chunks = text_splitter.split_documents(documents)
        print(f"✅ Split documents into {len(chunks)} chunks.")

        print(f"\n--- Creating embeddings with Gemini ({config.RAG_EMBEDDING_MODEL}) ---")
        embedding_model = GoogleGenerativeAIEmbeddings(
            model=config.RAG_EMBEDDING_MODEL,
            task_type="RETRIEVAL_DOCUMENT"
        )

        print("\n--- Building FAISS vector store ---")
        vector_store = FAISS.from_documents(chunks, embedding_model)
        vector_store.save_local(config.VECTOR_STORE_PATH)

        print(f"\n✅ Vector store created and saved successfully at: {config.VECTOR_STORE_PATH}")

    except Exception as e:
        print(f"\n❌ An error occurred during the build process: {e}")

if __name__ == "__main__":
    build_vector_store()

