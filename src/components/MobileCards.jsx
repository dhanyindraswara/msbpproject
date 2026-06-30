export default function MobileCards({ rows, statuses, empty }) {
  const stop = (e) => e.stopPropagation()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {rows.map((r) => (
        <div
          key={r.id}
          className="msbp-card"
          onClick={r.onOpen}
          style={{
            background: '#fff',
            border: '1px solid #EBEEF2',
            borderRadius: 16,
            padding: 15,
            boxShadow: '0 2px 9px rgba(20,50,90,.05)',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
            <span style={{ fontWeight: 700, color: '#3581E1', fontSize: 11.5 }}>{r.code}</span>
            <span
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                padding: '3px 9px',
                borderRadius: 999,
                color: r.catC,
                background: r.catBg,
              }}
            >
              {r.category}
            </span>
            <div style={{ flex: 1 }} />
            <button
              onClick={r.onMail}
              title="Email update"
              className="msbp-act"
              style={{
                cursor: 'pointer',
                border: '1px solid #E6E8EC',
                background: '#F7F9FC',
                borderRadius: 9,
                width: 34,
                height: 34,
                fontSize: 15,
                color: '#0284A8',
                lineHeight: 1,
              }}
            >
              ✉
            </button>
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.35, color: '#1F1F1F', letterSpacing: '-.015em' }}>
            {r.name}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 8,
              fontSize: 11.5,
              fontWeight: 600,
              color: '#7A8696',
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: r.leadBg,
                color: r.leadC,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9.5,
                fontWeight: 800,
                flex: 'none',
              }}
            >
              {r.lead}
            </span>
            <span>{r.ownerLine}</span>
          </div>
          <div style={{ marginTop: 13, display: 'flex', alignItems: 'center', gap: 11 }} onClick={stop}>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="msbp-rng"
              value={r.progress}
              onChange={r.onProgress}
              onInput={r.onProgress}
              style={{
                flex: 1,
                background: `linear-gradient(90deg,${r.barColor} ${r.progressW}, #E9EDF1 ${r.progressW})`,
              }}
            />
            <span style={{ fontWeight: 800, fontSize: 15, color: r.barColor, width: 46, textAlign: 'right', flex: 'none' }}>
              {r.progress}%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }} onClick={stop}>
            <select
              value={r.status}
              onChange={r.onStatus}
              style={{
                flex: 1,
                padding: '10px 30px 10px 12px',
                borderRadius: 10,
                border: `1px solid ${r.statusC}`,
                background: r.statusBg,
                color: r.statusC,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: r.targetC }}>{r.target}</div>
              {r.overdue && (
                <div
                  style={{
                    fontSize: 9.5,
                    fontWeight: 800,
                    color: '#C0392B',
                    textTransform: 'uppercase',
                    letterSpacing: '.05em',
                  }}
                >
                  Overdue
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      {empty && (
        <div style={{ padding: 50, textAlign: 'center', color: '#a3abb6', fontSize: 14, fontWeight: 600 }}>
          No projects match your filters.
        </div>
      )}
    </div>
  )
}
