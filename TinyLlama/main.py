from fastapi import FastAPI, Query
from pdf_utils import extract_text_from_pdf
from vectorstore import VectorStore
from model import TinyLlamaQA

app = FastAPI()

pdf_path = "data/policy.pdf"
text = extract_text_from_pdf(pdf_path)
chunks = [text[i:i+512] for i in range(0, len(text), 512)]  # simple chunking

store = VectorStore()
store.build_index(chunks)

llm = TinyLlamaQA()

@app.get("/ask")
def ask_question(q: str = Query(..., alias="query")):
    relevant_chunks = store.search(q)
    context = "\n".join(relevant_chunks)
    answer = llm.generate_answer(context, q)
    return {"query": q, "answer": answer}
