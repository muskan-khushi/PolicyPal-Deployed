from flask import Flask, request, jsonify
import google.generativeai as genai
import fitz
import json
import os

app = Flask(__name__)

API_KEY = os.getenv("GOOGLE_API_KEY")
if not API_KEY:
    raise ValueError("API key not found.")
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = "".join([page.get_text() for page in doc])
    doc.close()
    return text

@app.route("/api/policy-check", methods=["POST"])
def policy_check():
    data = request.json
    user_query = data.get("query")
    pdf_path = data.get("pdf_path", "hackathon-policy.pdf")  # default

    if not user_query:
        return jsonify({"error": "Missing 'query' field"}), 400

    policy_text = extract_text_from_pdf(pdf_path)

def get_policy_decision(policy_doc: str, user_query: str) -> dict:
    """
    This function sends the policy text and a user query to the AI using a highly-detailed prompt
    to get an expert-level decision.
    """
    prompt_template = f"""
    You are an expert AI claims adjudicator for Bajaj Allianz, analyzing requests against the "Global Health Care" policy. Your analysis must be meticulous, strict, and based ONLY on the provided policy document.

    **Policy Document:**
    ---
    {policy_text}
    ---

    **User's Request:**
    ---
    {user_query}
    ---

    **Your Adjudication Process (Follow these steps):**

    1.  **Initial Triage & Keyword Extraction:** Identify the core medical procedure or condition in the user's request (e.g., "cataract surgery," "hospitalization for accident," "physiotherapy," "maternity"). Also, extract any contextual details like policy duration ("I've had the policy for 1 year"), cause ("due to an accident"), or setting ("out-patient").

    2.  **Check Waiting Periods:** This is your most critical check.
        * **30-Day Initial Wait:** Does the request concern an illness within the first 30 days of a new policy? [cite_start]If so, it's excluded unless it's due to an Accident[cite: 405, 481].
        * **24-Month Specific Disease Wait:** Is the condition one of the specified diseases listed in the policy (e.g., Cataracts, Hernia, Joint replacement)? [cite_start]If so, treatment is excluded for the first 24 months, unless caused by an accident[cite: 396, 404, 469].
        * **36-Month Pre-Existing Disease (PED) Wait:** Does the query hint at a pre-existing condition? [cite_start]If so, it's excluded for the first 36 months[cite: 391, 465].

    3.  **Verify Coverage & Scan Exclusions:**
        * Confirm if the treatment is a listed benefit under In-patient, Day Care, or Out-patient sections.
        * Check for major specific exclusions. [cite_start]For example, maternity expenses (childbirth) are generally excluded [cite: 435, 512][cite_start], and cosmetic surgery is excluded unless for reconstruction after an accident/cancer[cite: 421, 498]. [cite_start]Out-patient dental care is only covered under the optional Dental Plan[cite: 362, 557].

    4.  **Synthesize and Decide Final Status:** Based on your analysis, choose one of the following four statuses.
        * **CLEARLY APPROVED:** The request is a covered benefit, and the user's information confirms that no waiting periods or exclusions apply (e.g., an accident claim).
        * [cite_start]**NEEDS CLARIFICATION:** The request is for a potentially covered benefit, but critical information is missing (e.g., "I need physiotherapy" without stating if it was prescribed by a doctor as required [cite: 172, 363]).
        * **LIKELY DENIED:** The request is for a treatment that clearly violates a waiting period (e.g., cataract surgery after 1 year) or is a listed exclusion (e.g., asking about cosmetic surgery for appearance).
        * [cite_start]**LIKELY APPROVED (NEEDS PRE-AUTHORIZATION):** The request is for a major planned procedure (like In-patient Hospitalization or Day Care) that is covered but requires mandatory pre-approval from the insurer before admission[cite: 381, 791, 795].

    **Final Output:**
    Respond ONLY with a JSON object in the following format, providing a concise, one-sentence explanation for your decision.
    {{
      "status": "CLEARLY APPROVED | NEEDS CLARIFICATION | LIKELY DENIED | LIKELY APPROVED (NEEDS PRE-AUTHORIZATION)",
      "reason": "Your one-sentence explanation based on the policy rules."
    }}
    """
  
    try:
        response = model.generate_content(prompt_template)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        result = json.loads(cleaned_response)
        return jsonify({
            "reply": f"{result['status']}: {result['reason']}"
        })

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
