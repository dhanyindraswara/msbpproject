const selectStyle = {
  padding: '11px 13px',
  borderRadius: 999,
  border: '1px solid #E6E8EC',
  background: '#fff',
  fontSize: 12.5,
  fontWeight: 600,
  cursor: 'pointer',
  outline: 'none',
}

export default function FilterBar({
  search,
  onSearch,
  fYear,
  onYear,
  fCat,
  onCat,
  fLead,
  onLead,
  fStatus,
  onStatusFilter,
  years,
  cats,
  leadCodes,
  statuses,
  showToggle,
  view,
  onView,
}) {
  const isT = view === 'table'
  const isB = view === 'board'
  const toggleBtn = (active) => ({
    cursor: 'pointer',
    border: 'none',
    borderRadius: 999,
    padding: '8px 16px',
    fontSize: 12.5,
    fontWeight: 700,
    background: active ? '#fff' : 'transparent',
    color: active ? '#02A0C1' : '#7A8696',
    boxShadow: active ? '0 2px 6px rgba(20,50,90,.12)' : 'none',
    transition: 'all .15s',
  })

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 9, marginBottom: 18 }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 230 }}>
        <span
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#a3abb6',
            fontSize: 14,
            pointerEvents: 'none',
          }}
        >
          ⌕
        </span>
        <input
          value={search}
          onInput={onSearch}
          onChange={onSearch}
          placeholder="Search project, code, lead, owner, issue…"
          className="msbp-in"
          style={{
            width: '100%',
            padding: '11px 14px 11px 35px',
            borderRadius: 999,
            border: '1px solid #E6E8EC',
            background: '#fff',
            fontSize: 13,
            fontWeight: 600,
            outline: 'none',
          }}
        />
      </div>
      <select value={fYear} onChange={onYear} className="msbp-in" style={selectStyle}>
        <option value="all">All years</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <select value={fCat} onChange={onCat} className="msbp-in" style={{ ...selectStyle, maxWidth: 240 }}>
        <option value="all">All categories</option>
        {cats.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <select value={fLead} onChange={onLead} className="msbp-in" style={selectStyle}>
        <option value="all">All leads</option>
        {leadCodes.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <select value={fStatus} onChange={onStatusFilter} className="msbp-in" style={selectStyle}>
        <option value="all">All status</option>
        {statuses.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {showToggle && (
        <div style={{ display: 'flex', background: '#E9EDF1', borderRadius: 999, padding: 3, gap: 2 }}>
          <button onClick={() => onView('table')} style={toggleBtn(isT)}>
            Table
          </button>
          <button onClick={() => onView('board')} style={toggleBtn(isB)}>
            Board
          </button>
        </div>
      )}
    </div>
  )
}
