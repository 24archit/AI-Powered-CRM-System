import os
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.summarize import load_summarize_chain
from langchain.prompts import PromptTemplate
from langchain_core.documents import Document
from app import config 

# --- RAG Pipeline Creation ---
def create_rag_pipeline():
    """
    Loads the FAISS index and builds the LangChain RAG pipeline.
    Returns the vector store retriever and the document chain.
    """
    if not os.path.exists(config.VECTOR_STORE_PATH):
        raise FileNotFoundError(f"FAISS index not found at {config.VECTOR_STORE_PATH}.")
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model=config.RAG_EMBEDDING_MODEL, 
        task_type="RETRIEVAL_QUERY"
    )
    
    vector_store = FAISS.load_local(
        config.VECTOR_STORE_PATH, 
        embeddings,
        allow_dangerous_deserialization=True 
    )
    retriever = vector_store.as_retriever(search_kwargs={"k": 5})
    
    llm = ChatGoogleGenerativeAI(model=config.RAG_LLM_MODEL, temperature=0.3)
    
    prompt = PromptTemplate.from_template("""
Answer the following question based only on the provided context.
Provide a detailed and comprehensive answer.
If the answer is not in the provided context, just say, "I am sorry, but I cannot find the answer in the provided documents."

<context>
{context}
</context>

Question: {question}
""")
    
    document_chain = create_stuff_documents_chain(llm, prompt)
    print("✅ RAG Pipeline created successfully.")
    return retriever, document_chain

# --- Summarization Pipeline Creation ---
def create_summarization_chain():
    """
    Creates and returns a LangChain summarization chain.
    """
    llm = ChatGoogleGenerativeAI(model=config.SUMMARIZE_LLM_MODEL, temperature=0.2)
    chain = load_summarize_chain(llm, chain_type="stuff")
    print("✅ Summarization Chain created successfully.")
    return chain

# --- Service-level Functions ---
async def get_rag_response(retriever, document_chain, question: str):
 
    retrieved_docs = await retriever.ainvoke(question)
    
  
    if retrieved_docs:
    
        docs_with_scores = await retriever.vectorstore.asimilarity_search_with_relevance_scores(question, k=1)
        if docs_with_scores:
            best_score = docs_with_scores[0][1]
            confidence = round(best_score, 2)
        else:
            confidence = 0.0
    else:
        confidence = 0.0

    response = await document_chain.ainvoke({
        "context": retrieved_docs,
        "question": question
    })

    return {"answer": response, "confidence_score": confidence}


async def get_summary_response(chain, text: str):
    """
    Generates a summary for the given text.
    """
    # LangChain summarization chains expect a list of Document objects
    docs = [Document(page_content=text)]
    summary = await chain.ainvoke(docs)
    return {"summary": summary.get("output_text", "Could not generate summary.")}
