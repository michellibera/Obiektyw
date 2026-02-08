import React from 'react';

export default function ONas() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '560px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: 400, marginBottom: '20px' }}>O projekcie</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', lineHeight: 1.75, color: 'var(--muted)' }}>
        <p><strong style={{ color: 'var(--fg)' }}>Obiektyw</strong> to polska platforma do analizy mediow, ktora pomaga uzytkownikom rozwijac swiadomosc medialna i krytyczne myslenie.</p>
        <p>Pokazujemy, jak rozne zrodla informuja o tych samych wydarzeniach — jakich technik narracyjnych uzywaja, jakie fakty pomijaja, i gdzie konczy sie rzetelne dziennikarstwo, a zaczyna kreowanie narracji.</p>
        <p>Nie oceniamy, ktora strona polityczna jest lepsza czy gorsza. Naszym celem jest transparentnosc — dostarczenie narzedzi, dzieki ktorym kazdy czytelnik moze samodzielnie ocenic jakosc informacji.</p>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '14px' }}>Jak to dziala</span>
          {[['01', 'Zbieramy artykuly z roznych zrodel na ten sam temat'], ['02', 'AI analizuje kazdy artykul pod katem stronniczosci i technik narracyjnych'], ['03', 'Prezentujemy przejrzysty raport porownawczy']].map(([n, t]) => (
            <div key={n} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '12px', color: 'var(--subtle)' }}>{n}</span>
              <span style={{ fontSize: '14px', color: 'var(--fg)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
