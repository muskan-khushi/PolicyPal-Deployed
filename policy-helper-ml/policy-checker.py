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

    prompt_template = f"""
    You are a helpful and strict policy compliance assistant.
    Your task is to analyze a user's request based ONLY on the provided policy document.

    **Policy Document:**
    ---
    {policy_text}
    ---

    **User's Request:**
    ---
    {user_query}
    ---

    Based on the policy, decide if the request is 'CLEARLY APPROVED' or 'NEEDS CLARIFICATION'.
    A request 'NEEDS CLARIFICATION' if any information is missing or if it violates a rule.
    Provide a one-sentence explanation for your decision.

    Respond ONLY with a JSON object in the following format:
    {{
      "status": "CLEARLY APPROVED | NEEDS CLARIFICATION",
      "reason": "Your one-sentence explanation."
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
        return jsonify({"status": "ERROR", "reason": f"AI processing error: {str(e)}"}), 500
    
@app.errorhandler(404)
def not_found(error):
    return jsonify({"reply": "API endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"reply": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(port=8000)
