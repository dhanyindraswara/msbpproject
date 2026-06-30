const BASE = import.meta.env.BASE_URL

export default function Header({ onExport, onAddNew, shared }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(20px) saturate(150%)',
        background: 'rgba(247,248,250,.84)',
        borderBottom: '1px solid #E6E8EC',
      }}
    >
      <div
        className="msbp-header-inner"
        style={{
          maxWidth: 1500,
          margin: '0 auto',
          padding: '13px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: 15,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 13,
            background: 'linear-gradient(135deg,#02A0C1,#3581E1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 16,
            boxShadow: '0 6px 18px rgba(2,160,193,.34)',
            flex: 'none',
            letterSpacing: '-.02em',
          }}
        >
          M
        </div>
        <div style={{ flex: 'none' }}>
          <div className="msbp-h-title" style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.15 }}>
            MSBP Project Manager
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: '#7A8696', letterSpacing: '.01em' }}>
            Consolidated plan · {shared ? 'live tracker' : 'local tracker'}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div className="msbp-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <a
            href={BASE + 'data/source.xlsx'}
            download="MSBP Project Consolidated.xlsx"
            className="msbp-ghost"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              textDecoration: 'none',
              color: '#374151',
              fontSize: 12.5,
              fontWeight: 600,
              padding: '9px 14px',
              borderRadius: 999,
              border: '1px solid #E6E8EC',
              background: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            Source Excel
          </a>
          <button
            onClick={onExport}
            className="msbp-ghost"
            style={{
              cursor: 'pointer',
              color: '#374151',
              fontSize: 12.5,
              fontWeight: 600,
              padding: '9px 14px',
              borderRadius: 999,
              border: '1px solid #E6E8EC',
              background: '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            Export CSV
          </button>
          <button
            onClick={onAddNew}
            className="msbp-btn"
            style={{
              cursor: 'pointer',
              color: '#fff',
              fontSize: 12.5,
              fontWeight: 700,
              padding: '9px 17px',
              borderRadius: 999,
              border: 'none',
              background: 'linear-gradient(135deg,#02A0C1,#3581E1)',
              boxShadow: '0 6px 16px rgba(2,160,193,.34)',
              whiteSpace: 'nowrap',
            }}
          >
            + New project
          </button>
        </div>
      </div>
    </header>
  )
}
