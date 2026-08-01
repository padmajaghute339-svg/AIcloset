import React, { useState } from 'react';

export default function ImageUploader({ onAnalysisComplete }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/analyze-and-recommend', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      onAnalysisComplete(data);
    } catch (err) {
      console.error("Error analyzing image:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', borderRadius: '8px' }}>
      <input type="file" accept="image/*" onChange={handleFileChange} id="upload-input" style={{ display: 'none' }} />
      <label htmlFor="upload-input" style={{ cursor: 'pointer', fontWeight: 'bold' }}>
        {loading ? "AI is analyzing your item..." : "Upload Photo of Top or Jeans"}
      </label>
      {preview && <img src={preview} alt="Upload preview" style={{ width: '150px', marginTop: '15px', borderRadius: '8px' }} />}
    </div>
  );
}