const MARQUEE_ITEMS = [
  'PLAY NO MATTER THE DAY',
  '✦',
  'NYC BORN',
  '✦',
  'SUSTAINABLE COTTON',
  '✦',
  'FREE GROUND SHIPPING',
  '✦',
  'ART × FASHION × LIFE',
  '✦',
];

export function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div style={{
      overflow: 'hidden',
      background: '#d4440f',
      padding: '10px 0',
      position: 'relative',
      zIndex: 100,
    }}>
      <div style={{
        display: 'flex',
        gap: '24px',
        whiteSpace: 'nowrap',
        animation: 'marquee 25s linear infinite',
        width: 'max-content',
      }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: '#0a0a0a',
          }}>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
