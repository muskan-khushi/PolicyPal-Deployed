

````markdown
# 🧠 Policy Helper — ML Module for Insurance Query Evaluation

This module uses Google's **Gemini 1.5 API** to evaluate user queries against a health insurance policy PDF. It checks for waiting periods, exclusions, and benefit coverage, returning a structured JSON decision.

---

## ⚙️ Setup Instructions

### 1. Install Dependencies

Use the following command to install necessary Python libraries:

```bash
pip install google-generativeai PyMuPDF
````

---

### 2. Set Up the Google API Key

This project securely accesses the Gemini model using an **environment variable** named `GOOGLE_API_KEY`.

You **must set this variable every time** before running the script (or persist it).

#### 🔐 Option A: PowerShell (most common on Windows)

If you're using **PowerShell**, run:

```powershell
$env:GOOGLE_API_KEY = "your-api-key-here"
```

Then, in the **same terminal**, run:

```powershell
python policy-checker.py
```

---

#### 🔐 Option B: Command Prompt (CMD)

If using classic Command Prompt:

```cmd
set GOOGLE_API_KEY=your-api-key-here
python policy-checker.py
```

---

#### 🔐 Option C: macOS / Linux Terminal

```bash
export GOOGLE_API_KEY="your-api-key-here"
python policy-checker.py
```

> These methods only persist for the **current terminal session**. You’ll need to run them again next time unless you add them to a startup script.

---

## ✅ Run the Module

Make sure your policy PDF is named `hackathon-policy.pdf` and located in the same directory as `policy-checker.py`.

Then run:

```bash
python policy-checker.py
```

The script will:

* Load the policy
* Submit 3 sample queries
* Print structured AI responses

---

## 🔧 Backend Integration

You can reuse the ML functions in your backend like this:

```python
from policy_checker import extract_text_from_pdf, get_policy_decision

policy_text = extract_text_from_pdf("uploads/user_policy.pdf")
decision = get_policy_decision(policy_text, "I want physiotherapy after my surgery")
```

---

## 📄 Available Functions

| Function                           | Description                                              |
| ---------------------------------- | -------------------------------------------------------- |
| `extract_text_from_pdf(path)`      | Extracts raw text from the PDF                           |
| `get_policy_decision(text, query)` | Sends query + policy to Gemini and returns JSON decision |

---

## 📁 Project Structure

```
policy-helper-ml/
│
├── policy-checker.py        # Core ML logic
├── hackathon-policy.pdf     # Sample policy document
├── README.md                # You're here
└── requirements.txt         # Optional dependencies list
```

---

## 💡 Sample Output

```json
{
  "status": "LIKELY APPROVED (NEEDS PRE-AUTHORIZATION)",
  "reason": "Cataract surgery after 1.5 years is a covered benefit, but requires prior approval from the insurer."
}
```




