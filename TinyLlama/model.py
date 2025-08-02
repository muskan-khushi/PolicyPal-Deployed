from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class TinyLlamaQA:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
        self.model = AutoModelForCausalLM.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")

    def generate_answer(self, context, query):
        prompt = f"Context:\n{context}\n\nQuestion:\n{query}\n\nAnswer:"
        inputs = self.tokenizer(prompt, return_tensors="pt")
        outputs = self.model.generate(**inputs, max_new_tokens=200)
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
