# Policy Helper ML Module 🤖

This module uses the Google Gemini API to check if a user query complies with a given policy document (PDF).

-----

## Setup Instructions

Follow these steps to get the module running on your local machine.

### 1\. Install Dependencies

Navigate into this directory in your terminal and run the following command to install the required Python libraries:

```bash
pip install google-generativeai PyMuPDF
```

### 2\. Set the API Key

This project uses an **environment variable** to handle the API key securely. This means the key is stored on your local machine for your current terminal session, not in the code.

**You must set this variable before running the script.**

#### On macOS or Linux:

Open your terminal and run this command, pasting your key in place of the placeholder.

```bash
export GOOGLE_API_KEY="PASTE_YOUR_API_KEY_HERE"
```

#### On Windows (Command Prompt):

Open Command Prompt and run this command, pasting your key in place of the placeholder.

```bash
set GOOGLE_API_KEY="PASTE_YOUR_API_KEY_HERE"
```

-----

## How to Test

After completing the setup steps, you can test the module by running:

```bash
python policy_checker.py
```

This will use the `hackathon-policy.pdf` file in this directory and run the sample test cases at the bottom of the script.

-----

## How to Use in the Backend

The backend can import and use the functions from `policy_checker.py`.

  - `extract_text_from_pdf(pdf_path)`: Reads all text from a PDF.
  - `get_policy_decision(policy_text, user_query)`: Analyzes the text and query.

**Example backend usage:**

```python
from policy_checker import extract_text_from_pdf, get_policy_decision

policy_text = extract_text_from_pdf("path/to/user_uploaded.pdf")
decision = get_policy_decision(policy_text, "user query from frontend")
```