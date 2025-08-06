import React, { useState } from 'react';
import './DocumentQA.css';

const DocumentQA = () => {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- THIS IS THE FINAL FIX ---
  const API_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/documents/process`;
  // --------------------------

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file || !query) {
      setError('Please upload a file and enter a query.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('query', query);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'An unknown error occurred.');
      }
      setResult(responseData);
    } catch (err) {
      setError(err.message);
      console.error('Error processing document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="doc-qa-container">
      <div className="doc-qa-header">
        <h2>Policy Document Analysis</h2>
        <p>Upload a policy PDF to get an AI-powered analysis based on its content.</p>
      </div>
      <form onSubmit={handleSubmit} className="doc-qa-form">
        <div className="form-group">
          <label htmlFor="document-file">1. Upload Policy Document</label>
          <input type="file" id="document-file" accept=".pdf" onChange={handleFileChange} />
        </div>
        <div className="form-group">
          <label htmlFor="query-text">2. Ask a Question</label>
          <input
            type="text"
            id="query-text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Is cataract surgery covered for a 46 year old?"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Analyze Policy'}
        </button>
      </form>

      <div className="results-section">
        {error && <div className="error-message">{error}</div>}
        {result && (
          <div className={`result-display ${result.decision.toLowerCase().replace(/\s+/g, '-')}`}>
            <h3>Analysis Complete</h3>
            <p className="narrative">{result.narrative_response}</p>
            {result.justification && result.justification.length > 0 && (
              <div className="justification-section">
                <h4>Supporting Clauses from Document:</h4>
                <ul>
                  {result.justification.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentQA;
