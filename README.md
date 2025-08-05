# PolicyPal - AI-Powered Document Q\&A System

PolicyPal is a full-stack application that allows users to upload policy documents (PDFs) and ask complex, natural language questions about their content. The system uses a local Large Language Model (LLM) to read the document, understand the user's query, and provide a reasoned, human-like answer on whether a claim would be approved or rejected based on the policy's clauses.

---

## High-Level Architecture

The project is built using a modern microservice architecture:

* **Frontend (Client):** A React application that provides the user interface for authentication, file uploads, and displaying results.
* **Backend (Server):** A Node.js and Express server that acts as an API gateway. It handles user authentication and forwards document processing requests to the ML service.
* **ML Service (doc\_qa\_backend):** A Python, FastAPI, and LangChain server that performs the core AI tasks. It uses a local LLM via Ollama to handle the document analysis and response generation.

**Data Flow:** React Client → Node.js Server → Python ML Service

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

* **Node.js:** v18.0 or later ([Download](https://nodejs.org))
* **Python:** v3.10 or later ([Download](https://python.org))
* **Ollama:** Required to run the local LLM. ([Download](https://ollama.com))

---

## Setup and Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd PolicyPal
```

### 2. Set up the ML Service (doc\_qa\_backend)

This service is the AI brain of the application.

```bash
# Navigate to the ML service directory
cd doc_qa_backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Download the required LLM via Ollama (this is a one-time setup)
ollama pull gemma:2b
```

### 3. Set up the Node.js Backend (Server)

This server handles user requests and connects to the database.

```bash
# Navigate to the Node.js server directory from the root
cd ../Server 

# Install the Node.js dependencies
npm install
```

### Environment Variables

You must configure the server's environment variables.

1. In the Server folder, find the `.env.example` file.
2. Create a copy of this file and rename the copy to `.env`.
3. Open the `.env` file and fill in the following values:

```env
# Your MongoDB connection string (get this from MongoDB Atlas)
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/

# A secret key for signing JSON Web Tokens (can be any long, random string)
JWT_SECRET=your_super_secret_key_for_jwt

# The port the server will run on (5000 is a good default)
PORT=5000

# The application environment (should be 'development' for local setup)
NODE_ENV=development
```

### 4. Set up the React Frontend (Client)

This is the user interface.

```bash
# Navigate to the React client directory from the root
cd ../Client

# Install the React dependencies
npm install
```

---

## Running the Application

To run the full application, you must start all three services in three separate terminals.

### Terminal 1: Start the Python ML Service

```bash
# Navigate to the ML service directory
cd C:\path\to\PolicyPal\doc_qa_backend

# Activate the environment
venv\Scripts\activate

# Start the Uvicorn server
uvicorn app.main:app --reload
```

The ML service will be running at `http://localhost:8000`.

### Terminal 2: Start the Node.js Backend

```bash
# Navigate to the Node.js server directory
cd C:\path\to\PolicyPal\Server

# Start the server
npm start
```

The Node.js server will be running at `http://localhost:5000`.

### Terminal 3: Start the React Frontend

```bash
# Navigate to the React client directory
cd C:\path\to\PolicyPal\Client

# Start the React development server
npm start
```

The React application will open in your browser at `http://localhost:3000`.

---

## How to Use

1. Open your browser to `http://localhost:3000`
2. Sign up for a new account or log in
3. You will be redirected to the main chat screen
4. Use the "Ask Questions About a Document" form to upload a PDF and ask a question
5. Click **Get Answer** and wait for the AI-generated response

---

Happy building with PolicyPal! 🚀
