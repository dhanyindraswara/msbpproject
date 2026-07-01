import { useState } from 'react'
import { fmtDate } from '../lib/helpers.js'

const secLabel = {
  fontSize: 10.5,
  fontWeight: 800,
  textTransform: 'uppercase',
  letterSpacing: '.06em',
  color: '#94a0ae',
  marginBottom: 7,
}

// Editable "Next to do" note, saved on demand so typing never fights realtime.
function NoteEditor({ initial, onSave }) {
  const [val, setVal] = useState(initial || '')
  const [dirty, setDirty] = useState(false)
  return (
    <div>
      <textarea
        value={val}
        onChange={(e) => {
          setVal(e.target.value)
          setDirty(true)
        }}
        placeholder="Type the next action / to-do here…"
        style={{
          width: '100%',
          minHeight: 62,
          padding: '10px 12px',
          border: '1px solid #E6E8EC',
          borderRadius: 10,
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.5,
          outline: 'none',
          background: '#fff',
          resize: 'vertical',
          color: '#374151',
        }}
      />
      <button
        onClick={() => {
          onSave(val)
          setDirty(false)
        }}
        disabled={!dirty}
        className="msbp-btn"
        style={{
          marginTop: 8,
          cursor: dirty ? 'pointer' : 'default',
          opacity: dirty ? 1 : 0.45,
          color: '#fff',
          fontSize: 12,
          fontWeight: 700,
          padding: '7px 15px',
          borderRadius: 999,
          border: 'none',
          background: 'linear-gradient(135deg,#02A0C1,#3581E1)',
        }}
      >
        {dirty ? 'Save note' : 'Saved'}
      </button>
    </div>
  )
}

export default function SummaryView({ rows, onSaveNote, onExport, empty }) {
  const total = rows.length
  const avg = total ? Math.round(rows.reduce((s, r) => s + (r.progress || 0), 0) / total) : 0
  const done = rows.filter((r) => r.status === 'Completed').length
  const activitiesTotal = rows.reduce((s, r) => s + (r.activities?.length || 0), 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {total > 0 && (
        <div
          style={{
            background: 'linear-gradient(135deg,#02A0C1,#3581E1)',
            color: '#fff',
            borderRadius: 18,
            padding: '18px 22px',
            boxShadow: '0 10px 30px rgba(2,160,193,.28)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.85 }}>
                Activity report
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 24px', marginTop: 8, fontSize: 13.5, fontWeight: 700 }}>
                <span>{total} projects</span>
                <span>· {avg}% avg progress</span>
                <span>· {done} completed</span>
                <span>· {activitiesTotal} activities logged</span>
              </div>
            </div>
            <button
              onClick={onExport}
              className="msbp-btn"
              style={{
                flex: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                color: '#0a6f86',
                background: '#fff',
                fontSize: 12.5,
                fontWeight: 800,
                padding: '9px 15px',
                borderRadius: 999,
                border: 'none',
                boxShadow: '0 4px 12px rgba(10,50,80,.18)',
                whiteSpace: 'nowrap',
              }}
            >
              ⬇ Export Excel
            </button>
          </div>
        </div>
      )}

      {rows.map((r) => (
        <div
          key={r.id}
          className="msbp-card"
          style={{
            background: '#fff',
            border: '1px solid #EBEEF2',
            borderRadius: 16,
            padding: 18,
            boxShadow: '0 2px 9px rgba(20,50,90,.05)',
          }}
        >
          {/* title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: '#3581E1', fontSize: 12 }}>{r.code}</span>
            <span
              onClick={r.onOpen}
              style={{ fontWeight: 800, fontSize: 15, color: '#1F1F1F', letterSpacing: '-.015em', cursor: 'pointer', flex: 1, minWidth: 160 }}
            >
              {r.name}
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                padding: '4px 11px',
                borderRadius: 999,
                color: r.statusC,
                background: r.statusBg,
              }}
            >
              {r.status}
            </span>
            <span style={{ fontWeight: 800, fontSize: 15, color: r.barColor, minWidth: 44, textAlign: 'right' }}>
              {r.progress}%
            </span>
          </div>

          {/* lead / owner line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, fontSize: 11.5, fontWeight: 600, color: '#7A8696' }}>
            <span
              style={{
                width: 22,
                height: 22,
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
            <span>
              {r.team ? 'Team ' + r.team + ' · ' : ''}
              {r.ownerLine}
              {r.overdue ? ' · ' : ''}
            </span>
            {r.overdue && (
              <span style={{ fontSize: 9.5, fontWeight: 800, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Overdue
              </span>
            )}
          </div>

          {/* two-column body */}
          <div className="msbp-summary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 15 }}>
            {/* activity timeline */}
            <div>
              <div style={secLabel}>What was done</div>
              {r.activities && r.activities.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {r.activities.map((a) => (
                    <div key={a.id} style={{ display: 'flex', gap: 9 }}>
                      <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', background: '#02A0C1', flex: 'none' }} />
                      <div>
                        {a.date && (
                          <div style={{ fontSize: 10.5, fontWeight: 700, color: '#02A0C1' }}>{fmtDate(a.date)}</div>
                        )}
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#374151', lineHeight: 1.45 }}>{a.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12.5, fontWeight: 600, color: '#a3abb6' }}>No activity logged yet.</div>
              )}
            </div>

            {/* plan / issue / next-to-do */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <div style={secLabel}>Next plan</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: r.plan ? '#374151' : '#a3abb6', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                  {r.plan || '—'}
                </div>
              </div>
              <div>
                <div style={secLabel}>Open issues / risk</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: r.hasIssue ? '#C0392B' : '#a3abb6', lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>
                  {r.issue && r.issue.trim() ? r.issue : '—'}
                </div>
              </div>
              <div>
                <div style={secLabel}>Next to do</div>
                <NoteEditor initial={r.nextTodo} onSave={(t) => onSaveNote(r.id, t)} />
              </div>
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
