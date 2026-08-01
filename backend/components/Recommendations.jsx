import React from 'react';

export default function Recommendations({ data }) {
  if (!data) return null;

  const { detected_item, recommendations } = data;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>AI Detection Analysis</h2>
      <p><strong>Type:</strong> {detected_item.subcategory} ({detected_item.category})</p>
      <p><strong>Color Family:</strong> {detected_item.color_family}</p>

      <hr style={{ margin: '20px 0' }} />

      <h2>Recommended Matching Outfit</h2>
      
      <h3>Suggested Bottoms</h3>
      <div style={{ display: 'flex', gap: '15px' }}>
        {recommendations.bottoms?.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '6px' }}>
            <img src={item.image_url} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <p style={{ fontSize: '14px', margin: '5px 0' }}>{item.name}</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: '20px' }}>Suggested Shoes</h3>
      <div style={{ display: 'flex', gap: '15px' }}>
        {recommendations.shoes?.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '6px' }}>
            <img src={item.image_url} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            <p style={{ fontSize: '14px', margin: '5px 0' }}>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}