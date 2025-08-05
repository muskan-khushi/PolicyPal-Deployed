import axios from 'axios';
import FormData from 'form-data';

const ML_API_URL = 'http://localhost:8000/api/process';

// Use 'export const' to export the function
export const processDocument = async (req, res) => {
  try {
    if (!req.file || !req.body.query) {
      return res.status(400).json({ message: 'A PDF file and a query string are required.' });
    }

    console.log('[Node.js] Received request. Preparing to call Python ML service...');

    const formData = new FormData();
    formData.append('file', req.file.buffer, { filename: req.file.originalname });
    formData.append('query', req.body.query);

    const mlResponse = await axios.post(ML_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });

    console.log('[Node.js] Success! Received JSON response from Python.');
    res.status(200).json(mlResponse.data);

  } catch (error) {
    console.error('[Node.js] Error contacting ML service:', error.message);
    if (error.response) {
      res.status(error.response.status).json({ message: error.response.data.detail || 'Error from ML service.' });
    } else {
      res.status(500).json({ message: 'Could not connect to the ML processing service.' });
    }
  }
};