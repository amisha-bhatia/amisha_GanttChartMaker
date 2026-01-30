// src/api/ocrRecords.js

const API_URL = "http://localhost:5000/api/ocr_records";

/**
 * Fetch OCR records from the API
 * @returns {Promise<Array>} Array of OCR record objects
 */
export const fetchOcrRecords = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch OCR records:", err);
    return []; 
  }
};
