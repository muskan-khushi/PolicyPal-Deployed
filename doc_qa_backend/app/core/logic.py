import os
import json
import re
from io import BytesIO
from langchain_community.llms import Ollama
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.prompts import ChatPromptTemplate
from typing import Optional, List
from pydantic.v1 import BaseModel, Field

# --- SIMPLIFIED DATA MODELS ---

class FinalResponse(BaseModel):
    decision: str = Field(description="The final decision in simple terms")
    amount_covered: Optional[float] = Field(None, description="The approved payout amount")
    justification: List[str] = Field(description="List of clear reasons")
    narrative_response: str = Field(description="Natural, friendly explanation")

class StructuredQuery(BaseModel):
    procedure: Optional[str] = None
    age: Optional[int] = None
    policy_duration_months: Optional[int] = None


class SimpleRAGProcessor:
    def __init__(self):
        self.llm = Ollama(model="gemma:2b", temperature=0)
        self.embedding_model = HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'}
        )
        print("✅ Simple RAG Processor Ready.")

    def extract_key_info_from_query(self, query: str) -> StructuredQuery:
        """Simple extraction without complex JSON parsing"""
        # Look for age
        age_match = re.search(r'\b(\d{1,2})\s*(?:years?\s*old|yr|age)', query.lower())
        age = int(age_match.group(1)) if age_match else None
        
        # Look for procedure/condition in the query
        procedure = query.strip()
        
        return StructuredQuery(
            procedure=procedure,
            age=age,
            policy_duration_months=None
        )

    def analyze_context_simple(self, context: str, procedure: str) -> dict:
        """Simple rule-based analysis"""
        context_lower = context.lower()
        procedure_lower = procedure.lower() if procedure else ""
        
        # Look for coverage indicators
        covered_phrases = [
            "is covered", "are covered", "coverage includes", "benefits include",
            "eligible for", "reimbursed", "we pay", "covered expense"
        ]
        
        # Look for exclusion indicators  
        excluded_phrases = [
            "not covered", "excluded", "not eligible", "exception",
            "limitation", "we do not pay", "excluded from coverage"
        ]
        
        # Look for amounts
        amounts = re.findall(r'\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)', context)
        percentages = re.findall(r'(\d+)\s*%', context)
        
        coverage_found = any(phrase in context_lower for phrase in covered_phrases)
        exclusion_found = any(phrase in context_lower for phrase in excluded_phrases)
        
        return {
            "coverage_found": coverage_found,
            "exclusion_found": exclusion_found,
            "amounts": amounts,
            "percentages": percentages,
            "relevant_context": context
        }

    def generate_decision_step_by_step(self, context: str, query: str, analysis: dict) -> dict:
        """Generate decision using multiple simple prompts instead of complex JSON"""
        
        # Step 1: Determine if covered or not
        decision_prompt = f"""
You are reviewing an insurance policy for this question: {query}

Policy information:
{context}

Answer with just ONE word:
- APPROVED if the policy clearly covers this
- REJECTED if the policy clearly excludes this  
- UNCLEAR if you cannot determine from the policy

Answer:"""
        
        decision_raw = self.llm.invoke(decision_prompt).strip().upper()
        
        if "APPROVED" in decision_raw:
            decision = "Approved"
        elif "REJECTED" in decision_raw:
            decision = "Rejected" 
        else:
            decision = "Needs Review"

        # Step 2: Find the amount
        amount_prompt = f"""
Looking at this insurance policy text for: {query}

Policy text:
{context}

What dollar amount would be covered? Look for:
- Specific dollar amounts like $500, $1000
- Maximum coverage amounts
- Benefit limits

If you find a dollar amount, respond with just the number (like 500 or 1000).
If no specific amount is mentioned, respond with: 0

Amount:"""
        
        amount_raw = self.llm.invoke(amount_prompt).strip()
        amount_match = re.search(r'(\d+(?:,\d{3})*(?:\.\d{2})?)', amount_raw.replace(',', ''))
        amount_covered = float(amount_match.group(1)) if amount_match else 0.0

        # Step 3: Get the main reason
        reason_prompt = f"""
You reviewed an insurance policy for: {query}
Your decision was: {decision}

Policy text:
{context}

Explain the main reason for your decision in ONE simple sentence. Start with "Because" and use plain English.

Example good answers:
- "Because the policy covers all surgical procedures under Section 3"
- "Because dental work is specifically excluded in the policy"  
- "Because the policy doesn't mention this specific treatment"

Your reason:"""
        
        main_reason = self.llm.invoke(reason_prompt).strip()
        if not main_reason.startswith("Because"):
            main_reason = f"Because {main_reason}"

        # Step 4: Find supporting details
        details_prompt = f"""
Looking at this insurance policy for: {query}

Policy text:
{context}

Find ONE specific detail that supports the decision. Look for:
- Policy section numbers
- Specific coverage rules
- Exclusion clauses
- Benefit limits

Write it as a simple fact. Example:
- "The policy states maximum coverage is $5000 per year"
- "Section 2.1 lists dental procedures as excluded"
- "Coverage requires pre-authorization according to page 15"

Detail:"""
        
        supporting_detail = self.llm.invoke(details_prompt).strip()

        return {
            "decision": decision,
            "amount_covered": amount_covered,
            "main_reason": main_reason,
            "supporting_detail": supporting_detail
        }

    def create_natural_response(self, decision_info: dict, query: str) -> str:
        """Create a natural, conversational response"""
        
        response_prompt = f"""
Write a friendly insurance response for a customer who asked: "{query}"

Decision: {decision_info['decision']}
Amount: ${decision_info['amount_covered']}
Main reason: {decision_info['main_reason']}
Supporting detail: {decision_info['supporting_detail']}

Write a natural response that:
1. Directly answers their question
2. Explains the decision clearly
3. Mentions the coverage amount if applicable
4. Uses simple, friendly language
5. Is 2-3 sentences long

Don't use bullet points or formal language. Write like you're talking to a friend.

Response:"""
        
        narrative = self.llm.invoke(response_prompt).strip()
        return narrative

    def process_document_and_query(self, file_bytes: bytes, query: str) -> FinalResponse:
        # Load document
        temp_file_path = "temp_document_for_processing.pdf"
        with open(temp_file_path, "wb") as f:
            f.write(file_bytes)
        loader = PyPDFLoader(temp_file_path)
        documents = loader.load()
        os.remove(temp_file_path)
        
        if not documents:
            return FinalResponse(
                decision="Error",
                amount_covered=0,
                justification=["Could not read the PDF document"],
                narrative_response="I'm sorry, I couldn't read your policy document. Please make sure it's a valid PDF file and try again."
            )

        # Split and create vector store
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = text_splitter.split_documents(documents)
        vector_store = Chroma.from_documents(chunks, self.embedding_model)
        retriever = vector_store.as_retriever(search_kwargs={"k": 6})

        # Extract basic info from query
        structured_query = self.extract_key_info_from_query(query)
        
        print(f"[Processing] Looking for: {structured_query.procedure}")

        # Get relevant context - try multiple searches
        search_terms = [
            query,
            structured_query.procedure if structured_query.procedure else query,
            f"{structured_query.procedure} coverage" if structured_query.procedure else f"{query} coverage",
            f"{structured_query.procedure} excluded" if structured_query.procedure else f"{query} excluded"
        ]
        
        all_docs = []
        for term in search_terms:
            docs = retriever.invoke(term)
            all_docs.extend(docs[:3])  # Limit per search
        
        # Remove duplicates
        seen = set()
        unique_docs = []
        for doc in all_docs:
            doc_hash = hash(doc.page_content)
            if doc_hash not in seen:
                seen.add(doc_hash)
                unique_docs.append(doc)
                if len(unique_docs) >= 5:  # Limit total context
                    break
        
        if not unique_docs:
            return FinalResponse(
                decision="Needs Review",
                amount_covered=0,
                justification=["No relevant information found in the policy for this question"],
                narrative_response=f"I couldn't find specific information about '{query}' in your policy document. This might mean it's covered under a general category, or you may need to contact customer service for clarification."
            )

        context = "\n\n".join([doc.page_content for doc in unique_docs])
        
        print("[Processing] Analyzing policy context...")
        
        # Simple analysis
        analysis = self.analyze_context_simple(context, structured_query.procedure)
        
        print("[Processing] Making decision...")
        
        # Generate decision step by step
        decision_info = self.generate_decision_step_by_step(context, query, analysis)
        
        print(f"[Result] Decision: {decision_info['decision']}, Amount: ${decision_info['amount_covered']}")
        
        # Create natural response
        narrative = self.create_natural_response(decision_info, query)
        
        # Build justification list
        justifications = []
        if decision_info['main_reason']:
            justifications.append(decision_info['main_reason'])
        if decision_info['supporting_detail']:
            justifications.append(decision_info['supporting_detail'])
        
        # Add context-based reasoning
        if analysis['coverage_found'] and decision_info['decision'] == "Approved":
            justifications.append("The policy contains language indicating this type of service is covered")
        elif analysis['exclusion_found'] and decision_info['decision'] == "Rejected":
            justifications.append("The policy contains exclusion language for this type of service")
        
        if not justifications:
            justifications = [f"Based on review of the policy sections related to {structured_query.procedure or 'your question'}"]

        return FinalResponse(
            decision=decision_info['decision'],
            amount_covered=decision_info['amount_covered'],
            justification=justifications,
            narrative_response=narrative
        )

# Initialize the simple processor
rag_processor = SimpleRAGProcessor()