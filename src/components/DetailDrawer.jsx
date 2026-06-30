const fieldLabel = {
  fontSize: 10.5,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.05em',
  color: '#94a0ae',
}
const textInput = {
  width: '100%',
  marginTop: 5,
  padding: '9px 11px',
  border: '1px solid #E6E8EC',
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
  outline: 'none',
  background: '#fff',
}
const textarea = {
  width: '100%',
  marginTop: 5,
  padding: '11px 12px',
  border: '1px solid #E6E8EC',
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 500,
  lineHeight: 1.55,
  outline: 'none',
  background: '#fff',
  resize: 'vertical',
  color: '#374151',
}

export default function DetailDrawer({
  d,
  onD,
  drawerTag,
  statuses,
  cats,
  leadCodes,
  naDate,
  naText,
  onNaDate,
  onNaText,
  addActivity,
  onClose,
  onSave,
  onDelete,
  onEmail,
}) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'rgba(20,35,55,.36)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn .2s ease',
        }}
      />
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 70,
          width: 'min(600px,96vw)',
          background: '#FAFBFC',
          boxShadow: '-18px 0 64px rgba(20,50,90,.24)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'drawerIn .28s cubic-bezier(.22,1,.36,1)',
        }}
      >
        {/* header */}
        <div style={{ padding: '18px 26px', borderBottom: '1px solid #E6E8EC', background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 800,
                  letterSpacing: '.07em',
                  textTransform: 'uppercase',
                  color: '#02A0C1',
                }}
              >
                {drawerTag}
              </div>
              <input
                value={d.name}
                onChange={onD.name}
                placeholder="Project name"
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: '-.025em',
                  outline: 'none',
                  padding: '3px 0 0',
                  marginTop: 2,
                }}
              />
            </div>
            <button
              onClick={onClose}
              className="msbp-ghost"
              style={{
                cursor: 'pointer',
                border: '1px solid #E6E8EC',
                background: '#fff',
                width: 34,
                height: 34,
                borderRadius: 10,
                fontSize: 19,
                color: '#7A8696',
                flex: 'none',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
          <button
            onClick={onEmail}
            className="msbp-btn"
            style={{
              marginTop: 12,
              cursor: 'pointer',
              border: 'none',
              color: '#fff',
              fontSize: 12.5,
              fontWeight: 700,
              padding: '9px 16px',
              borderRadius: 999,
              background: 'linear-gradient(135deg,#02A0C1,#3581E1)',
              boxShadow: '0 5px 14px rgba(2,160,193,.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            ✉ Send update to stakeholders
          </button>
        </div>

        {/* body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '22px 26px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, background: '#fff', border: '1px solid #E6E8EC', borderRadius: 14, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#94a0ae' }}>
                  Progress
                </span>
                <span style={{ fontSize: 18, fontWeight: 800, color: d.barColor }}>{d.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                className="msbp-rng"
                value={d.progress}
                onChange={onD.progress}
                onInput={onD.progress}
                style={{ width: '100%', background: `linear-gradient(90deg,${d.barColor} ${d.progressW}, #E9EDF1 ${d.progressW})` }}
              />
            </div>
            <div style={{ flex: 1, background: '#fff', border: '1px solid #E6E8EC', borderRadius: 14, padding: 14 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: '#94a0ae', marginBottom: 9 }}>
                Status
              </div>
              <select
                value={d.status}
                onChange={onD.status}
                style={{
                  width: '100%',
                  padding: '9px 10px',
                  borderRadius: 10,
                  border: `1px solid ${d.statusC}`,
                  background: d.statusBg,
                  color: d.statusC,
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
            </div>
          </div>

          {/* Process owner / customer */}
          <div style={{ background: '#fff', border: '1px solid #E6E8EC', borderRadius: 14, padding: 15, marginBottom: 18 }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.06em', color: '#0284A8', marginBottom: 10 }}>
              Process owner / customer
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ display: 'block' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94a0ae' }}>Name / unit</span>
                <input value={d.owner} onChange={onD.owner} placeholder="e.g. Finance & Accounting" className="msbp-in" style={textInput} />
              </label>
              <label style={{ display: 'block' }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: '#94a0ae' }}>Email</span>
                <input value={d.ownerEmail} onChange={onD.ownerEmail} placeholder="owner@banpuindo.co.id" className="msbp-in" style={{ ...textInput, color: '#3581E1' }} />
              </label>
            </div>
          </div>

          {/* Code / year / category / lead */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
            <label style={{ display: 'block' }}>
              <span style={fieldLabel}>Code</span>
              <input value={d.code} onChange={onD.code} className="msbp-in" style={textInput} />
            </label>
            <label style={{ display: 'block' }}>
              <span style={fieldLabel}>Effective year</span>
              <select value={d.year} onChange={onD.year} className="msbp-in" style={{ ...textInput, cursor: 'pointer' }}>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </label>
            <label style={{ display: 'block' }}>
              <span style={fieldLabel}>Category</span>
              <select value={d.category} onChange={onD.category} className="msbp-in" style={{ ...textInput, cursor: 'pointer' }}>
                {cats.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ display: 'block' }}>
              <span style={fieldLabel}>Lead</span>
              <select value={d.lead} onChange={onD.lead} className="msbp-in" style={{ ...textInput, cursor: 'pointer' }}>
                {leadCodes.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label style={{ display: 'block', marginBottom: 18 }}>
            <span style={fieldLabel}>Task / programme</span>
            <input value={d.task} onChange={onD.task} className="msbp-in" style={textInput} />
          </label>
          <label style={{ display: 'block', marginBottom: 18 }}>
            <span style={fieldLabel}>Team collaboration</span>
            <input value={d.team} onChange={onD.team} placeholder="e.g. ALR, RRP" className="msbp-in" style={textInput} />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
            <label style={{ display: 'block' }}>
              <span style={fieldLabel}>Start date</span>
              <input type="date" value={d.startDate || ''} onChange={onD.startDate} className="msbp-in" style={{ ...textInput, padding: '8px 9px', fontSize: 12 }} />
            </label>
            <label style={{ display: 'block' }}>
              <span style={fieldLabel}>End date</span>
              <input type="date" value={d.endDate || ''} onChange={onD.endDate} className="msbp-in" style={{ ...textInput, padding: '8px 9px', fontSize: 12 }} />
            </label>
            <label style={{ display: 'block' }}>
              <span style={fieldLabel}>Target</span>
              <input value={d.targetDate || ''} onChange={onD.targetDate} placeholder="Q2-H1" className="msbp-in" style={{ ...textInput, padding: '8px 9px', fontSize: 12 }} />
            </label>
          </div>

          {/* Activity timeline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-.01em', color: '#1F1F1F' }}>Activity timeline</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#94a0ae' }}>{d.activityCount} entries</span>
          </div>

          <div style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid #E2E8F0', marginLeft: 5 }}>
            {/* start node */}
            <div style={{ position: 'relative', marginBottom: 18 }}>
              <span
                style={{
                  position: 'absolute',
                  left: -31,
                  top: 1,
                  width: 13,
                  height: 13,
                  borderRadius: '50%',
                  background: '#fff',
                  border: '3px solid #1F9D6B',
                  boxShadow: '0 0 0 3px #fff',
                }}
              />
              <div style={{ fontSize: 10.5, fontWeight: 800, color: '#1F9D6B', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Project start
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#374151', marginTop: 2 }}>{d.startLabel}</div>
            </div>

            {d.activities.map((a) => (
              <div
                key={a.id}
                style={{ position: 'relative', marginBottom: 14, background: '#fff', border: '1px solid #EBEEF2', borderRadius: 12, padding: '11px 12px' }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: -31,
                    top: 14,
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    background: '#02A0C1',
                    border: '2.5px solid #fff',
                    boxShadow: '0 0 0 2px #cfe9f0',
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                  <input
                    type="date"
                    value={a.date || ''}
                    onChange={a.onDate}
                    className="msbp-in"
                    style={{ border: '1px solid #E6E8EC', borderRadius: 8, padding: '4px 7px', fontSize: 11, fontWeight: 700, color: '#0284A8', outline: 'none', background: '#F7FBFC' }}
                  />
                  <div style={{ flex: 1 }} />
                  <button
                    onClick={a.onRemove}
                    className="msbp-del"
                    title="Remove"
                    style={{ cursor: 'pointer', border: 'none', background: 'transparent', color: '#b6bdc7', fontSize: 14, width: 24, height: 24, borderRadius: 7, lineHeight: 1 }}
                  >
                    🗑
                  </button>
                </div>
                <textarea
                  value={a.text}
                  onChange={a.onText}
                  rows="2"
                  className="msbp-in"
                  style={{ width: '100%', border: '1px solid #EEF0F3', borderRadius: 9, padding: '8px 10px', fontSize: 12.5, fontWeight: 500, lineHeight: 1.5, color: '#374151', outline: 'none', background: '#fff', resize: 'vertical' }}
                />
              </div>
            ))}

            {/* add entry */}
            <div style={{ position: 'relative', background: '#F4F8FD', border: '1px dashed #c2d4e6', borderRadius: 12, padding: '11px 12px' }}>
              <span
                style={{ position: 'absolute', left: -31, top: 14, width: 11, height: 11, borderRadius: '50%', background: '#fff', border: '2.5px dashed #9bb6d2' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <input
                  type="date"
                  value={naDate || ''}
                  onChange={onNaDate}
                  className="msbp-in"
                  style={{ border: '1px solid #E6E8EC', borderRadius: 8, padding: '5px 8px', fontSize: 11, fontWeight: 700, color: '#0284A8', outline: 'none', background: '#fff' }}
                />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#7A8696' }}>add what was done</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={naText}
                  onChange={onNaText}
                  onKeyDown={(e) => e.key === 'Enter' && addActivity()}
                  placeholder="e.g. Conducted BP workshop with PO"
                  className="msbp-in"
                  style={{ flex: 1, border: '1px solid #E6E8EC', borderRadius: 9, padding: '8px 11px', fontSize: 12.5, fontWeight: 600, outline: 'none', background: '#fff' }}
                />
                <button
                  onClick={addActivity}
                  className="msbp-btn"
                  style={{ cursor: 'pointer', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, padding: '8px 15px', borderRadius: 9, background: '#02A0C1', whiteSpace: 'nowrap' }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <label style={{ display: 'block', margin: '22px 0 18px' }}>
            <span style={fieldLabel}>Plan activities (weekly / next)</span>
            <textarea value={d.plan} onChange={onD.plan} rows="4" className="msbp-in" style={textarea} />
          </label>
          <label style={{ display: 'block', marginBottom: 18 }}>
            <span style={fieldLabel}>Issue / risk</span>
            <textarea value={d.issue} onChange={onD.issue} rows="2" className="msbp-in" style={textarea} />
          </label>
          <label style={{ display: 'block' }}>
            <span style={fieldLabel}>Folder link</span>
            <input value={d.folder} onChange={onD.folder} placeholder="https://…" className="msbp-in" style={{ ...textInput, color: '#3581E1' }} />
          </label>
        </div>

        {/* footer */}
        <div style={{ padding: '15px 26px', borderTop: '1px solid #E6E8EC', background: '#fff', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={onDelete}
            className="msbp-ghost"
            style={{ cursor: 'pointer', border: '1px solid #F0D4CF', background: '#fff', color: '#C0392B', fontSize: 12.5, fontWeight: 700, padding: '11px 16px', borderRadius: 11 }}
          >
            Delete
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={onClose}
            className="msbp-ghost"
            style={{ cursor: 'pointer', border: '1px solid #E6E8EC', background: '#fff', color: '#7A8696', fontSize: 12.5, fontWeight: 700, padding: '11px 18px', borderRadius: 11 }}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="msbp-btn"
            style={{ cursor: 'pointer', border: 'none', color: '#fff', fontSize: 12.5, fontWeight: 700, padding: '11px 24px', borderRadius: 11, background: 'linear-gradient(135deg,#02A0C1,#3581E1)', boxShadow: '0 6px 16px rgba(2,160,193,.34)' }}
          >
            Save changes
          </button>
        </div>
      </aside>
    </>
  )
}
