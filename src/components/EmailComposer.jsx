const label = {
  fontSize: 10.5,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  color: '#94a0ae',
}
const input = {
  width: '100%',
  marginTop: 5,
  padding: '9px 11px',
  border: '1px solid #E6E8EC',
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
  outline: 'none',
}

export default function EmailComposer({ email, meta, onChange, onClose, onSend, onCopy }) {
  const stop = (e) => e.stopPropagation()
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(20,35,55,.42)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn .2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={stop}
        style={{
          width: 'min(640px,100%)',
          maxHeight: '90vh',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 30px 80px rgba(20,50,90,.32)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'popIn .24s cubic-bezier(.22,1,.36,1)',
        }}
      >
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #EEF0F3', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: 'linear-gradient(135deg,#02A0C1,#3581E1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 17,
              flex: 'none',
            }}
          >
            ✉
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-.02em' }}>Send update to stakeholders</div>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#7A8696' }}>{meta}</div>
          </div>
          <button
            onClick={onClose}
            className="msbp-ghost"
            style={{ cursor: 'pointer', border: '1px solid #E6E8EC', background: '#fff', width: 32, height: 32, borderRadius: 9, fontSize: 18, color: '#7A8696', lineHeight: 1 }}
          >
            ×
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 24px' }}>
          <label style={{ display: 'block', marginBottom: 13 }}>
            <span style={label}>To (process owners / customer — comma-separated)</span>
            <input value={email.to} onChange={(e) => onChange('to', e.target.value)} className="msbp-in" style={{ ...input, color: '#1F1F1F' }} />
          </label>
          <label style={{ display: 'block', marginBottom: 13 }}>
            <span style={label}>Cc (lead &amp; team)</span>
            <input value={email.cc} onChange={(e) => onChange('cc', e.target.value)} className="msbp-in" style={input} />
          </label>
          <label style={{ display: 'block', marginBottom: 13 }}>
            <span style={label}>Subject</span>
            <input value={email.subject} onChange={(e) => onChange('subject', e.target.value)} className="msbp-in" style={{ ...input, fontWeight: 700 }} />
          </label>
          <label style={{ display: 'block' }}>
            <span style={label}>Message</span>
            <textarea
              value={email.body}
              onChange={(e) => onChange('body', e.target.value)}
              rows="13"
              className="msbp-in"
              style={{
                width: '100%',
                marginTop: 5,
                padding: '12px 13px',
                border: '1px solid #E6E8EC',
                borderRadius: 12,
                fontSize: 12.5,
                fontWeight: 500,
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                color: '#374151',
                fontFamily: 'ui-monospace,Menlo,monospace',
              }}
            />
          </label>
        </div>
        <div style={{ padding: '15px 24px', borderTop: '1px solid #EEF0F3', display: 'flex', alignItems: 'center', gap: 10, background: '#FAFBFC' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94a0ae', flex: 1, lineHeight: 1.4 }}>
            Opens your email app with everything pre-filled.
          </span>
          <button
            onClick={onCopy}
            className="msbp-ghost"
            style={{ cursor: 'pointer', border: '1px solid #E6E8EC', background: '#fff', color: '#374151', fontSize: 12.5, fontWeight: 700, padding: '10px 16px', borderRadius: 11 }}
          >
            Copy text
          </button>
          <button
            onClick={onSend}
            className="msbp-btn"
            style={{ cursor: 'pointer', border: 'none', color: '#fff', fontSize: 12.5, fontWeight: 700, padding: '10px 20px', borderRadius: 11, background: 'linear-gradient(135deg,#02A0C1,#3581E1)', boxShadow: '0 6px 16px rgba(2,160,193,.34)' }}
          >
            Open in email app
          </button>
        </div>
      </div>
    </div>
  )
}
