import React from 'react';
import styles from './page.module.css';

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
  T02: { namepl: 'Wybiórcze fakty', category: 'narracyjna' },
  T03: { namepl: 'Pominięcie', category: 'narracyjna' },
  T04: { namepl: 'Sensacjonalizm', category: 'narracyjna' },
  T05: { namepl: 'Nacechowany jezyk', category: 'narracyjna' },
  T06: { namepl: 'Fałszywa równowaga', category: 'narracyjna' },
  T07: { namepl: 'Whataboutism', category: 'narracyjna' },
  T08: { namepl: 'Atak personalny', category: 'atak' },
  T09: { namepl: 'Chochoł', category: 'atak' },
  T10: { namepl: 'Wina przez skojarzenie', category: 'atak' },
  T11: { namepl: 'Etykietowanie', category: 'atak' },
  T12: { namepl: 'Apel do strachu', category: 'emocjonalna' },
  T13: { namepl: 'Apel do oburzenia', category: 'emocjonalna' },
  T14: { namepl: 'Apel do współczucia', category: 'emocjonalna' },
  T15: { namepl: 'Apel do dumy/wstydu', category: 'emocjonalna' },
  L01: { namepl: 'Fałszywa dychotomia', category: 'błąd logiczny' },
  L02: { namepl: 'Równia pochyła', category: 'błąd logiczny' },
  L03: { namepl: 'Błąd przyczynowy', category: 'błąd logiczny' },
  L04: { namepl: 'Pochopne uogólnienie', category: 'błąd logiczny' },
  L05: { namepl: 'Błędne koło', category: 'błąd logiczny' },
  L06: { namepl: 'Autorytet', category: 'błąd logiczny' },
  L07: { namepl: 'Owczy pęd', category: 'błąd logiczny' },
  L08: { namepl: 'Nie wynika', category: 'błąd logiczny' },
};

const TECH_CAT_COLORS: Record<string, string> = {
  narracyjna: '#B08030',
  atak: '#A83A3A',
  emocjonalna: '#7B3FA0',
  // Backwards-compat keys for any older/typoed category strings.
  'błąd logiczny': '#2A7B6F',
  'blad logiczny': '#2A7B6F',
  'bląd logiczny': '#2A7B6F',
};

export default function ONas() {
  return (
    <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: '820px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 400, marginBottom: '20px' }}>O projekcie</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '15px', lineHeight: 1.75 }}>
        <p><strong style={{ color: 'var(--fg)' }}>Obiektyw</strong> to polska platforma do analizy mediów, która pomaga użytkownikom rozwijać świadomość medialną i krytyczne myślenie.</p>
        <p>Pokazujemy, jak różne źrodła informują o tych samych wydarzeniach, jakich technik narracyjnych używaja, jakie fakty pomijaja aby kreować opinię publiczną.</p>
        <p>Nie oceniamy, która strona polityczna jest lepsza czy gorsza. Naszym celem jest transparentność poprzez dostarczenie narzędzi, dzięki którym każdy czytelnik może samodzielnie ocenić jakość informacji.</p>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '14px' }}>Jak to dziala</span>
          {[['01', 'Zbieramy artykuły z różnych źrodeł na ten sam temat'], ['02', 'AI analizuje każdy artykuł pod kątem stronniczości i technik narracyjnych'], ['03', 'Prezentujemy przejrzysty raport porównawczy']].map(([n, t]) => (
            <div key={n} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '12px' }}>{n}</span>
              <span style={{ fontSize: '14px', color: 'var(--fg)' }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '14px' }}>Wskaznik kreowania narracji</span>
          <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
            Każdy artykuł otrzymuje wynik od 0 do 100, oparty na trzech skladnikach: stronniczosci (waga 40%), sensacyjnosci (30%)
            i odejsciu od faktów (30%).
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              ['0-15', '#1A7A3A', 'Rzetelne dziennikarstwo'],
              ['16-35', '#6A8A20', 'Lekkie nachylenie'],
              ['36-55', '#A08018', 'Kreowanie narracji'],
              ['56-75', '#B85A1A', 'Wyraźna manipulacja'],
              ['76-100', '#A02020', 'Propaganda'],
            ].map(([range, color, label]) => (
              <div key={range} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-archivo)', fontSize: '12px', width: '52px', textAlign: 'right' }}>{range}</span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color as string, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--fg)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '14px' }}>Spektrum orientacji politycznej</span>
          <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
            Każde źrodło jest klasyfikowane na osmiopunktowej skali — od skrajnej lewicy po skrajną prawicę, z opcją oznaczenia jako
            neutralne. Klasyfikacja opiera sie na analizie doboru słów, cytowanych źrodeł i ogólnego nachylenia narracyjnego.
          </p>
          <div>
            <div className={styles.politicalSpectrumBar} aria-label="Spektrum orientacji politycznej">
              {Object.entries(POLITICAL_LABELS).map(([key, info]) => (
                <div key={key} className={styles.politicalSpectrumSegment}>
                  <div className={styles.politicalSpectrumStripe} style={{ background: info.color }} />
                  <span className={styles.politicalSpectrumLabel} title={info.label}>
                    {info.label}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.politicalSpectrumLegend} aria-label="Legenda spektrum">
              {Object.entries(POLITICAL_LABELS).map(([key, info]) => (
                <div key={key} className={styles.politicalSpectrumLegendItem}>
                  <span className={styles.politicalSpectrumDot} style={{ background: info.color }} />
                  <span className={styles.politicalSpectrumLegendLabel}>{info.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px', marginTop: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block', marginBottom: '14px' }}>Katalog technik manipulacji</span>
          <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
            System rozpoznaje 23 techniki manipulacji w czterech kategoriach. Każda wykryta technika jest poparta cytatem z artykułu
            i wyjaśnieniem.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              ['Narracyjne', 'narracyjna', 'Techniki kształtujace sposób, w jaki odbiorca postrzega wydarzenie — poprzez dobór faktow, języka i kontekstu.'],
              ['Atakujace', 'atak', 'Techniki skierowane przeciwko osobom lub grupom, majace na celu podważenie ich wiarygodności zamiast merytorycznej dyskusji.'],
              ['Emocjonalne', 'emocjonalna', 'Techniki odwołujace się do emocji czytelnika zamiast do logiki i faktów.'],
              ['Błędy logiczne', 'błąd logiczny', 'Niepoprawne rozumowania, które mogą wygladać przekonująco, ale nie są logicznie uzasadnione.'],
            ].map(([catLabel, catKey, catDesc]) => (
              <div key={catKey}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: TECH_CAT_COLORS[catKey as string], flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fg)' }}>{catLabel}</span>
                </div>
                <p style={{ fontSize: '12px', lineHeight: 1.5, marginBottom: '8px', paddingLeft: '16px' }}>{catDesc}</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', paddingLeft: '16px' }}>
                  {Object.entries(MANIPULATION_TECHNIQUES)
                    .filter(([, t]) => t.category === catKey)
                    .map(([id, t]) => (
                      <span
                        key={id}
                        style={{
                          background: 'var(--hover)',
                          border: '1px solid var(--border)',
                          padding: '3px 8px',
                          borderRadius: '3px',
                          fontSize: '11px',
                        }}
                      >
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
