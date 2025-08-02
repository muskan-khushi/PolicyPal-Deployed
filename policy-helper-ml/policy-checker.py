# importing stuff
import google.generativeai as genai
import json
import os
import fitz  

# ai configuration (part 1)
API_KEY = os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    raise ValueError("API key not found. Please set the GOOGLE_API_KEY environment variable.")

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# the helper functions (part 2)

def extract_text_from_pdf(pdf_path: str) -> str:
    """This function opens and reads the text from a PDF file."""
    try:
        doc = fitz.open(pdf_path)
        full_text = ""
        for page in doc:
            full_text += page.get_text()
        doc.close()
        return full_text
    except Exception as e:
        print(f"!!! ERROR: Could not read the PDF file. Make sure '{pdf_path}' exists and is not corrupted. Error details: {e}")
        return None

def get_policy_decision(policy_doc: str, user_query: str) -> dict:
    """This function sends the policy text and user query to the AI."""
    # NEW, MORE DETAILED PROMPT
    prompt_template = f"""
    You are a helpful and strict policy compliance assistant. Your task is to analyze a user's request based ONLY on the provided policy document.

    **Policy Document:**
    ---
    {policy_doc}
    ---

    **User's Request:**
    ---
    {user_query}
    ---

    Follow these steps to make your decision:
    1.  First, check if the user's request seems to fall under a covered benefit (like In-patient Hospitalization for an accident).
    2.  Second, check for any clear violations of waiting periods (e.g., a 24-month wait for cataract surgery) or other specific exclusions mentioned in the policy.

    Make your final decision based on these rules:
    -   If the request is for a covered benefit AND the query does NOT contain information that clearly violates a waiting period or exclusion, decide 'CLEARLY APPROVED'. You should assume standard conditions like "medically necessary" and "in a registered hospital" are met unless the user's query contradicts them.
    -   If the request clearly violates a waiting period (like asking for cataract surgery after only 1 year), mentions an excluded treatment, or is too vague to categorize, decide 'NEEDS CLARIFICATION'.

    Respond ONLY with a JSON object in the following format, providing a one-sentence explanation for your decision based on your analysis.
    {{
      "status": "CLEARLY APPROVED | NEEDS CLARIFICATION",
      "reason": "Your one-sentence explanation."
    }}
    """
    try:
        response = model.generate_content(prompt_template)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned_response)
    except Exception as e:
        print(f"!!! ERROR: Could not get a response from the AI. Check your API key and network connection. Error details: {e}")
        return {
            "status": "ERROR",
            "reason": "Failed to process the request due to a technical issue."
        }
    
# main execution block (part-3)
if __name__ == "__main__":
  
    pdf_file_path = 'hackathon-policy.pdf'
    
    print(f"--- Step 1: Reading text from '{pdf_file_path}' ---")
    policy_text = extract_text_from_pdf(pdf_file_path)

    if policy_text:
        print("PDF text extracted successfully!")
        
        print("\n--- Step 2: Running test queries against the policy ---")
        
        # test Case 1
        query1 = "I had an accident and was hospitalized for 3 days for a leg fracture surgery."
        print(f"\nSubmitting Query: '{query1}'")
        result1 = get_policy_decision(policy_text, query1)
        print("AI Response:", result1)

        # test Case 2
        query2 = "I have had this policy for 1.5 years and need to undergo cataract surgery."
        print(f"\nSubmitting Query: '{query2}'")
        result2 = get_policy_decision(policy_text, query2)
        print("AI Response:", result2)

        #test case 3
        query3 = "I want to claim expenses for my physiotherapy sessions."
        print(f"\nSubmitting Query: '{query3}'")
        result3 = get_policy_decision(policy_text, query3)
        print("AI Response:", result3)

    else:
        print("Could not proceed. Please check the PDF file path and name.")