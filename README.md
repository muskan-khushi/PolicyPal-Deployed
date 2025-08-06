# ✨ PolicyPal: AI-Powered Policy Document Q&A ✨
**Demystifying Insurance Policies with AI**

PolicyPal is an intelligent web application designed to decode complex insurance documents using the power of artificial intelligence. Upload any policy PDF, ask your question in plain English, and receive a clear, fact-grounded answer — instantly, accurately, and transparently.

🔗 **Live Demo:** [Try PolicyPal Now](https://policypal-client-uzhx.vercel.app/)

---

## ✨ Why PolicyPal?

Understanding insurance policies shouldn't require legal expertise. PolicyPal bridges the gap between dense insurance jargon and everyday clarity, powered by Retrieval-Augmented Generation (RAG) and best-in-class LLM APIs.

---

## 📖 The Story: From Ambition to Reality

This repository contains the fully deployed version of PolicyPal — a refined result of technical agility and architectural decisions made during development.

Our original vision centered around a fully self-hosted AI pipeline powered by Google's open-source **Gemma** model. While we successfully built this system (available [here](https://github.com/Rupali2507/PolicyPal)), deployment limitations on available infrastructure prompted a strategic pivot.

To ensure a seamless user experience, we transitioned to cloud-based APIs for inference and embeddings, allowing us to showcase the application's full potential — without compromising its logic, responsiveness, or integrity.

> 💡 Our self-hosted version remains the technical foundation of this project. Explore it here:  
> [🔗 Gemma Architecture (Self-Hosted)](https://github.com/Rupali2507/PolicyPal)

---

## 🏗️ Architecture Overview (Deployed Version)

This version follows a clean, modular, three-tier microservice architecture:

### 🌐 Frontend (Client)
- **Framework:** React.js  
- **Role:** Provides a responsive, elegant interface for file uploads and user queries  
- **Hosting:** Vercel  

### 🛠️ Backend (Server)
- **Framework:** Node.js (Express.js)  
- **Role:** Serves as a secure API gateway between the client and the AI service  
- **Hosting:** Render  

### 🧠 AI Service (doc_qa_backend)
- **Framework:** FastAPI (Python)  
- **Role:** Core document question-answering logic using RAG  
- **APIs Used:**  
  - **Inference:** Groq (Llama 3)  
  - **Embeddings:** Cohere  
- **Hosting:** Render  

---

## 🌟 Key Features

| Feature | Description |
|--------|-------------|
| 📄 **PDF Analysis** | Parses and processes complex insurance policy documents |
| 🗣️ **Natural Language Q&A** | Accepts user queries in plain English — no jargon required |
| 🛡️ **Fact-Grounded Answers** | Each response is backed by actual excerpts from the document |
| 🔍 **Transparent Reasoning** | Reveals which parts of the policy informed the answer |
| 🧱 **Structured Output** | Uses Pydantic models for predictable, validated AI output |
| 💻 **Modern UI** | Clean, responsive, and intuitive design |

---

## 🧪 Running Locally

Set up the entire system on your machine in minutes.

### 🧰 Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)  
- [Python](https://www.python.org/) (v3.10 or later)  
- API Keys from:
  - [Groq](https://groq.com/)
  - [Cohere](https://cohere.com/)

---

### 🔧 Step 1: Clone the Repository

```bash
git clone https://github.com/muskan-khushi/PolicyPal-Deployed.git
cd PolicyPal-Deployed
```

Create an environment file for the AI service:

```env
# /doc_qa_backend/.env
GROQ_API_KEY="your_groq_api_key"
COHERE_API_KEY="your_cohere_api_key"
```

---

### 🧠 Step 2: Start the AI Service (FastAPI)

```bash
cd doc_qa_backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

> Service runs at: `http://localhost:8000`

---

### 🛡️ Step 3: Start the Backend Server (Express.js)

```bash
cd ../server
npm install
npm start
```

> Server runs at: `http://localhost:5000`

---

### 💻 Step 4: Start the Frontend Client (React)

```bash
cd ../client
npm install
npm start
```

> App opens at: `http://localhost:1234`

## 🎯 Conclusion
PolicyPal represents the intersection of practical AI engineering and real-world problem solving. What started as an ambitious self-hosted AI project evolved into a production-ready application that demonstrates both technical depth and deployment pragmatism.
Key Achievements:

✅ End-to-end RAG implementation from document processing to response generation
✅ Production deployment across multiple cloud platforms
✅ Architectural flexibility - seamless transition from self-hosted to cloud APIs
✅ User-centric design - complex insurance logic translated into clear, actionable insights

This project showcases not just the ability to build sophisticated AI systems, but the engineering judgment to adapt and deploy them effectively in real-world constraints. PolicyPal makes insurance accessible, one query at a time.

## 🚀 The Visionary Team

| Name | Role | GitHub |
|------|------|--------|
| [Rupali Kumari](https://github.com/Rupali2507) | Team Leader & Backend Developer | 🔗 [@Rupali2507](https://github.com/Rupali2507) |
| [Shanvi Dixit](https://github.com/shanvid19)   | Frontend Developer              | 🔗 [@shanvid19](https://github.com/shanvid19)   |
| [Prisha Garg](https://github.com/prishagarg)   | ML Engineer                     | 🔗 [@prishagarg](https://github.com/prishagarg) |
| [Muskan](https://github.com/muskan-khushi)     | ML Engineer (yours truly) 💫     | 🔗 [@muskan-khushi](https://github.com/muskan-khushi) |


Built with ❤️ and lots of ☕
