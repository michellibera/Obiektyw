import React from 'react';

const POLITICAL_LABELS: Record<string, { label: string; color: string }> = {
  'skrajna-lewica': { label: 'Skrajna lewica', color: '#9B1D20' },
  lewica: { label: 'Lewica', color: '#C23B3B' },
  centrolewica: { label: 'Centrolewica', color: '#D4845A' },
  centrum: { label: 'Centrum', color: '#7A7A7A' },
  centroprawica: { label: 'Centroprawica', color: '#5B8FB9' },
  prawica: { label: 'Prawica', color: '#2E5A9E' },
  'skrajna-prawica': { label: 'Skrajna prawica', color: '#1B2A4A' },
  neutralny: { label: 'Neutralny', color: '#888' },
};

const MANIPULATION_TECHNIQUES: Record<string, { namepl: string; category: string }> = {
  T01: { namepl: 'Kadrowanie', category: 'narracyjna' },
  T02: { namepl: 'Wybiorcze fakty', category: 'narracyjna' },
  T03: { namepl: 'Pominiecie', category: 'narracyjna' },
  T04: { namepl: 'Sensacjonalizm', category: 'narracyjna' },
  T05: { namepl: 'Nacechowany jezyk', category: 'narracyjna' },
  T06: { namepl: 'Falszywa rownowaga', category: 'narracyjna' },
  T07: { namepl: 'Whataboutism', category: 'narracyjna' },
  T08: { namepl: 'Atak personalny', category: 'atak' },
  T09: { namepl: 'Chochol', category: 'atak' },
  T10: { namepl: 'Wina przez skojarzenie', category: 'atak' },
  T11: { namepl: 'Etykietowanie', category: 'atak' },
  T12: { namepl: 'Apel do strachu', category: 'emocjonalna' },
  T13: { namepl: 'Apel do oburzenia', category: 'emocjonalna' },
  T14: { namepl: 'Apel do wspolczucia', category: 'emocjonalna' },
  T15: { namepl: 'Apel do dumy/wstydu', category: 'emocjonalna' },
  L01: { namepl: 'Falszywa dychotomia', category: 'blad logiczny' },
  L02: { namepl: 'Rownia pochyla', category: 'blad logiczny' },
  L03: { namepl: 'Blad przyczynowy', category: 'blad logiczny' },
  L04: { namepl: 'Pochopne uogolnienie', category: 'blad logiczny' },
  L05: { namepl: 'Bledne kolo', category: 'blad logiczny' },
  L06: { namepl: 'Autorytet', category: 'blad logiczny' },
  L07: { namepl: 'Owczy ped', category: 'blad logiczny' },
  L08: { namepl: 'Nie wynika', category: 'blad logiczny' },
};

const TECH_CAT_COLORS: Record<string, string> = {
  narracyjna: '#B08030',
  atak: '#A83A3A',
  emocjonalna: '#7B3FA0',
  'blad logiczny': '#2A7B6F',
};

export default function ONas() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '820px' }}>
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
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '14px' }}>Wskaznik kreowania narracji</span>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
            Kazdy artykul otrzymuje wynik od 0 do 100, oparty na trzech skladnikach: stronniczosci (waga 40%), sensacyjnosci (30%)
            i odejsciu od faktow (30%).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              ['0-15', '#1A7A3A', 'Rzetelne dziennikarstwo'],
              ['16-35', '#6A8A20', 'Lekkie nachylenie'],
              ['36-55', '#A08018', 'Kreowanie narracji'],
              ['56-75', '#B85A1A', 'Wyrazna manipulacja'],
              ['76-100', '#A02020', 'Propaganda'],
            ].map(([range, color, label]) => (
              <div key={range} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '12px', color: 'var(--subtle)', width: '52px', textAlign: 'right' }}>{range}</span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color as string, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--fg)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '14px' }}>Spektrum orientacji politycznej</span>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
            Kazde zrodlo jest klasyfikowane na osmiopunktowej skali — od skrajnej lewicy po skrajna prawice, z opcja oznaczenia jako
            neutralne. Klasyfikacja opiera sie na analizie doboru slow, cytowanych zrodel i ogolnego nachylenia narracyjnego.
          </p>
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {Object.entries(POLITICAL_LABELS).map(([key, info]) => (
              <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', height: '4px', borderRadius: '2px', background: info.color }} />
                <span style={{ fontSize: '9px', color: 'var(--subtle)', textAlign: 'center', lineHeight: 1.2 }}>{info.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--subtle)', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '14px' }}>Katalog technik manipulacji</span>
          <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, fontFamily: 'var(--font-serif)', marginBottom: '16px' }}>
            System rozpoznaje 23 techniki manipulacji w czterech kategoriach. Kazda wykryta technika jest poparta cytatem z artykulu
            i wyjasnieniem.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              ['Narracyjne', 'narracyjna', 'Techniki ksztaltujace sposob, w jaki odbiorca postrzega wydarzenie — poprzez dobor faktow, jezyka i kontekstu.'],
              ['Atakujace', 'atak', 'Techniki skierowane przeciwko osobom lub grupom, majace na celu podwazenie ich wiarygodnosci zamiast merytorycznej dyskusji.'],
              ['Emocjonalne', 'emocjonalna', 'Techniki odwolujace sie do emocji czytelnika zamiast do logiki i faktow.'],
              ['Bledy logiczne', 'blad logiczny', 'Niepoprawne rozumowania, ktore moga wygladac przekonujaco, ale nie sa logicznie uzasadnione.'],
            ].map(([catLabel, catKey, catDesc]) => (
              <div key={catKey}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: TECH_CAT_COLORS[catKey as string], flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fg)' }}>{catLabel}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--subtle)', lineHeight: 1.5, marginBottom: '8px', paddingLeft: '16px' }}>{catDesc}</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', paddingLeft: '16px' }}>
                  {Object.entries(MANIPULATION_TECHNIQUES)
                    .filter(([, t]) => t.category === catKey)
                    .map(([id, t]) => (
                      <span
                        key={id}
                        style={{
                          background: 'var(--hover)',
                          border: '1px solid var(--border)',
                          color: 'var(--muted)',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '10px', color: TECH_CAT_COLORS[catKey as string], marginRight: '4px' }}>{id}</span>
                        {t.namepl}
                      </span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
