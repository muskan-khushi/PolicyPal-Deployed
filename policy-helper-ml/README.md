# Policy Helper ML Module 🤖

This module uses the Google Gemini API to check if a user query complies with a given policy document (PDF).

---

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

---

### on Windows (PowerShell):

Open PowerShell and run this command, pasting your key in place of the placeholder.

```powershell
$env:GOOGLE_API_KEY="your_actual_api_key_here"
```

## How to Test

After completing the setup steps, you can test the module by running:

```bash
python policy-checker.py
```

This will use the `hackathon-policy.pdf` file in this directory and run the sample test cases at the bottom of the script.

---

```

```
