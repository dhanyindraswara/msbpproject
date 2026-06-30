const card = {
  background: 'rgba(255,255,255,.6)',
  backdropFilter: 'blur(24px) saturate(140%)',
  border: '1px solid rgba(255,255,255,.75)',
  borderRadius: 20,
  padding: '17px 19px',
  boxShadow: '0 10px 30px rgba(20,50,90,.07)',
}
const label = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
}
const num = { fontSize: 31, fontWeight: 800, letterSpacing: '-.03em', marginTop: 7, lineHeight: 1 }
const sub = { fontSize: 11.5, fontWeight: 600, color: '#7A8696', marginTop: 6 }

export default function KpiCards({ kpi, cols }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 14, marginBottom: 22 }}>
      <div style={card}>
        <div style={{ ...label, color: '#02A0C1' }}>Total projects</div>
        <div style={num}>{kpi.total}</div>
        <div style={sub}>{kpi.shown} shown now</div>
      </div>
      <div style={card}>
        <div style={{ ...label, color: '#7A8696' }}>Avg progress</div>
        <div style={num}>
          {kpi.avg}
          <span style={{ fontSize: 15, color: '#aab2bd', fontWeight: 700 }}>%</span>
        </div>
        <div
          style={{
            height: 6,
            borderRadius: 6,
            background: '#E9EDF1',
            marginTop: 11,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 6,
              background: 'linear-gradient(90deg,#02A0C1,#3581E1)',
              width: kpi.avgW,
            }}
          />
        </div>
      </div>
      <div style={card}>
        <div style={{ ...label, color: '#1F9D6B' }}>Completed</div>
        <div style={num}>{kpi.completed}</div>
        <div style={sub}>{kpi.completedPct}% of total</div>
      </div>
      <div style={card}>
        <div style={{ ...label, color: '#0284A8' }}>In progress</div>
        <div style={num}>{kpi.progress}</div>
        <div style={sub}>
          {kpi.open} open · {kpi.hold} hold
        </div>
      </div>
      <div style={card}>
        <div style={{ ...label, color: '#C0392B' }}>At risk / overdue</div>
        <div style={num}>{kpi.risk}</div>
        <div style={sub}>need attention</div>
      </div>
    </div>
  )
}
