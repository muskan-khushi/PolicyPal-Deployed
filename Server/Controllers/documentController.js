import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import the necessary function

// --- THIS IS THE FIX for '__dirname is not defined' ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// ----------------------------------------------------

// Define the absolute paths using the corrected folder name
const pythonExecutable = path.resolve(__dirname, '../../doc_qa_backend/venv/Scripts/python.exe');
const pythonScript = path.resolve(__dirname, '../../doc_qa_backend/runner.py');

export const processDocument = async (req, res) => {
  if (!req.file || !req.body.query) {
    return res.status(400).json({ message: 'A PDF file and a query string are required.' });
  }

  const { file } = req;
  const { query } = req.body;
  
  const tempFilePath = path.join(__dirname, `../temp_${Date.now()}_${file.originalname}`);

  fs.writeFile(tempFilePath, file.buffer, async (err) => {
    if (err) {
      console.error("Error writing temp file:", err);
      return res.status(500).json({ message: "Failed to process file." });
    }

    console.log('[Node.js] File saved temporarily. Executing Python script directly...');
    
    const pythonProcess = spawn(pythonExecutable, [pythonScript, tempFilePath, query]);

    let resultData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      fs.unlink(tempFilePath, (deleteErr) => {
        if (deleteErr) console.error("Error deleting temp file:", deleteErr);
      });

      if (code === 0) {
        console.log('[Node.js] Python script finished successfully.');
        try {
          const resultJson = JSON.parse(resultData);
          res.status(200).json(resultJson);
        } catch (parseError) {
            console.error("[Node.js] Error parsing JSON from Python:", resultData);
            res.status(500).json({ message: "Failed to parse Python response." });
        }
      } else {
        console.error(`[Node.js] Python script exited with error code ${code}:`, errorData);
        res.status(500).json({ message: "An error occurred during AI processing.", details: errorData });
      }
    });
  });
};