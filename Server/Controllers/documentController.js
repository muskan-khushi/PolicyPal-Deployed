import axios from 'axios';
import FormData from 'form-data';

// This will get the public URL of your Python service from the cloud environment
const ML_API_URL = process.env.ML_SERVICE_URL;

export const processDocument = async (req, res) => {
  try {
    if (!req.file || !req.body.query) {
      return res.status(400).json({ message: 'A PDF file and a query string are required.' });
    }
    
    console.log('[Node.js] Forwarding request to Cloud ML Service...');
    
    const formData = new FormData();
    formData.append('file', req.file.buffer, { filename: req.file.originalname });
    formData.append('query', req.body.query);

    const mlResponse = await axios.post(ML_API_URL, formData, {
      headers: { ...formData.getHeaders() },
      timeout: 180000 // 3 minute timeout for the cloud service
    });
    
    console.log('[Node.js] Success! Received JSON response from Python.');
    res.status(200).json(mlResponse.data);

  } catch (error) {
    console.error('[Node.js] Error contacting ML service:', error.message);
    res.status(500).json({ message: 'Could not connect to the ML processing service.' });
  }
};