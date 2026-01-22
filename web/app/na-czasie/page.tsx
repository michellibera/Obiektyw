import React from 'react';

export default function NaCzasie() {
  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #525252',
      padding: '2rem',
      marginBottom: '2rem'
    }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: '#0a0a0a' }}>
        Na czasie
      </h2>
      <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6' }}>
        Tutaj pojawią się najpopularniejsze i najgorętsze tematy analizowane przez nasze media w ostatnich dniach.
      </p>
    </div>
  );
}
