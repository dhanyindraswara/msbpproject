export default function BoardView({ cols, onAllowDrop }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, alignItems: 'start' }}>
      {cols.map((col) => (
        <div
          key={col.status}
          onDragOver={onAllowDrop}
          onDrop={col.onDrop}
          style={{
            background: 'rgba(255,255,255,.55)',
            backdropFilter: 'blur(18px)',
            border: '1px solid #E6E8EC',
            borderRadius: 18,
            padding: 12,
            minHeight: 130,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '4px 6px 13px',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                fontWeight: 800,
                color: col.c,
                letterSpacing: '-.01em',
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: col.c }} />
              {col.status}
            </span>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: '#94a0ae',
                background: '#fff',
                borderRadius: 999,
                padding: '2px 10px',
              }}
            >
              {col.count}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {col.cards.map((r) => (
              <div
                key={r.id}
                className="msbp-card"
                draggable="true"
                onDragStart={r.onDragStart}
                onClick={r.onOpen}
                style={{
                  background: '#fff',
                  border: '1px solid #EBEEF2',
                  borderRadius: 14,
                  padding: '12px 13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(20,50,90,.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 7,
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#3581E1', fontSize: 11 }}>{r.code}</span>
                  <span
                    style={{
                      fontSize: 9.5,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 999,
                      color: r.catC,
                      background: r.catBg,
                    }}
                  >
                    {r.category}
                  </span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.35, color: '#1F1F1F', letterSpacing: '-.01em' }}>
                  {r.name}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9aa3af', marginTop: 5 }}>{r.ownerLine}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
                  <span
                    style={{
                      width: 23,
                      height: 23,
                      borderRadius: '50%',
                      background: r.leadBg,
                      color: r.leadC,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 9,
                      fontWeight: 800,
                      flex: 'none',
                    }}
                  >
                    {r.lead}
                  </span>
                  <div style={{ flex: 1, height: 6, borderRadius: 6, background: '#E9EDF1', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 6, background: r.barColor, width: r.progressW }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: r.barColor }}>{r.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
