const th = (extra = {}) => ({
  textAlign: 'left',
  padding: '12px 14px',
  fontSize: 10.5,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.07em',
  color: '#94a0ae',
  ...extra,
})

export default function ProjectTable({ rows, statuses, tdPadV, empty }) {
  const stop = (e) => e.stopPropagation()
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #E6E8EC',
        borderRadius: 20,
        boxShadow: '0 10px 30px rgba(20,50,90,.06)',
        overflow: 'hidden',
      }}
    >
      <div className="msbp-scroll">
        <table
          className="msbp-table"
          style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1480, fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: '#F6F9FC', borderBottom: '1px solid #E6E8EC' }}>
              <th style={th({ padding: '12px 16px', width: 80 })}>Code</th>
              <th style={th({ minWidth: 300 })}>Project</th>
              <th style={th({ width: 160 })}>Category</th>
              <th style={th({ width: 160 })}>Owner / customer</th>
              <th style={th({ width: 130 })}>Lead / team</th>
              <th style={th({ width: 230 })}>Progress</th>
              <th style={th({ width: 158 })}>Status</th>
              <th style={th({ width: 118 })}>Target</th>
              <th style={th({ textAlign: 'right', padding: '12px 16px', width: 92 })}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="msbp-row"
                style={{ borderBottom: '1px solid #F0F2F5', transition: 'background .12s', cursor: 'pointer' }}
                onClick={r.onOpen}
              >
                <td style={{ padding: `${tdPadV} 16px`, verticalAlign: 'top' }}>
                  <span style={{ fontWeight: 700, color: '#3581E1', fontSize: 12, letterSpacing: '-.01em' }}>
                    {r.code}
                  </span>
                </td>
                <td style={{ padding: `${tdPadV} 14px`, verticalAlign: 'top', maxWidth: 360 }}>
                  <div style={{ fontWeight: 700, lineHeight: 1.35, color: '#1F1F1F', letterSpacing: '-.01em' }}>
                    {r.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#9aa3af',
                      lineHeight: 1.35,
                      marginTop: 3,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: 360,
                    }}
                  >
                    {r.task}
                  </div>
                </td>
                <td style={{ padding: `${tdPadV} 14px`, verticalAlign: 'top' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: 10.5,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 999,
                      color: r.catC,
                      background: r.catBg,
                      lineHeight: 1.25,
                    }}
                  >
                    {r.category}
                  </span>
                </td>
                <td style={{ padding: `${tdPadV} 14px`, verticalAlign: 'top' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', lineHeight: 1.3 }}>
                    {r.owner}
                  </div>
                </td>
                <td style={{ padding: `${tdPadV} 14px`, verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span
                      style={{
                        width: 25,
                        height: 25,
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
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#7A8696', lineHeight: 1.3 }}>
                      {r.team}
                    </span>
                  </div>
                </td>
                <td style={{ padding: `${tdPadV} 14px`, verticalAlign: 'middle' }} onClick={stop}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
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
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: 13.5,
                        color: r.barColor,
                        width: 44,
                        textAlign: 'right',
                        flex: 'none',
                      }}
                    >
                      {r.progress}%
                    </span>
                  </div>
                </td>
                <td style={{ padding: `${tdPadV} 14px`, verticalAlign: 'top' }} onClick={stop}>
                  <select
                    value={r.status}
                    onChange={r.onStatus}
                    style={{
                      width: '100%',
                      padding: '8px 30px 8px 12px',
                      borderRadius: 9,
                      border: `1px solid ${r.statusC}`,
                      background: r.statusBg,
                      color: r.statusC,
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: 'pointer',
                      outline: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: `${tdPadV} 14px`, verticalAlign: 'top' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: r.targetC }}>{r.target}</div>
                  {r.overdue && (
                    <div
                      style={{
                        fontSize: 9.5,
                        fontWeight: 800,
                        color: '#C0392B',
                        textTransform: 'uppercase',
                        letterSpacing: '.05em',
                        marginTop: 3,
                      }}
                    >
                      Overdue
                    </div>
                  )}
                </td>
                <td
                  style={{ padding: `${tdPadV} 16px`, verticalAlign: 'top', textAlign: 'right' }}
                  onClick={stop}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    {r.hasIssue && (
                      <span
                        title="Has open issue"
                        style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#E8A33D' }}
                      />
                    )}
                    <button
                      onClick={r.onMail}
                      title="Email update to stakeholders"
                      className="msbp-act"
                      style={{
                        cursor: 'pointer',
                        border: '1px solid #E6E8EC',
                        background: '#F7F9FC',
                        borderRadius: 8,
                        width: 28,
                        height: 28,
                        fontSize: 13,
                        color: '#0284A8',
                        lineHeight: 1,
                      }}
                    >
                      ✉
                    </button>
                    <span onClick={r.onOpen} style={{ color: '#c4cbd4', fontSize: 17, cursor: 'pointer' }}>
                      ›
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {empty && (
        <div style={{ padding: 60, textAlign: 'center', color: '#a3abb6', fontSize: 14, fontWeight: 600 }}>
          No projects match your filters.
        </div>
      )}
    </div>
  )
}
