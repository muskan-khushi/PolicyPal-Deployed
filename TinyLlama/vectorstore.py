from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class VectorStore:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = None
        self.texts = []

    def build_index(self, texts):
        self.texts = texts
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        self.index = faiss.IndexFlatL2(embeddings.shape[1])
        self.index.add(embeddings)

    def search(self, query, top_k=3):
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        scores, indices = self.index.search(query_embedding, top_k)
        return [self.texts[i] for i in indices[0]]
