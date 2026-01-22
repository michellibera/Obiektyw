import React from 'react';

export default function ONas() {
  return (
    <>
      <div style={{
        background: '#ffffff',
        border: '2px solid #525252',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: '#0a0a0a' }}>
          O OBIEKTYWIE
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6', marginBottom: '1rem' }}>
          Platforma agregująca polskie media i analizująca je pod kątem stronniczości oraz technik manipulacji.
          Wykorzystujemy AI do identyfikacji emocjonalnego języka, selektywnych faktów, pytań retorycznych
          i innych technik perswazji. Naszym celem jest pomoc w świadomym odbiorze informacji.
        </p>
      </div>

      <div style={{
        background: '#ffffff',
        border: '2px solid #525252',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: '#0a0a0a' }}>
          Kontakt
        </h2>
        <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6', marginBottom: '1rem' }}>
          Chcesz się skontaktować z nami? Masz uwagi lub sugestie dotyczące OBIEKTYWU?
        </p>
        <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6', marginBottom: '1rem' }}>
          Email: <strong>info@obiektyw.media</strong>
        </p>
        <p style={{ fontSize: '0.95rem', color: '#525252', lineHeight: '1.6' }}>
          Obserwuj nas na mediach społecznościowych, aby być na bieżąco z najnowszymi analizami.
        </p>
      </div>
    </>
  );
}
