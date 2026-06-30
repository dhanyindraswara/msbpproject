// Pure presentation/logic helpers ported 1:1 from the design prototype.

export const STATUSES = ['Open', 'Progress', 'Hold', 'Completed']
export const ACCENT = '#02A0C1'

export const statusMeta = {
  Open: { c: '#3581E1', bg: '#E7F0FC' },
  Progress: { c: '#0284A8', bg: '#D9F2F8' },
  Hold: { c: '#B5791C', bg: '#FBEFD6' },
  Completed: { c: '#1F9D6B', bg: '#DBF3E8' },
}

const CAT_META = {
  'Management System': { c: '#0284A8', bg: '#D9F2F8' },
  'Business Process': { c: '#3581E1', bg: '#E7F0FC' },
  'Continuous Improvement': { c: '#5E8C2E', bg: '#EAF7DC' },
  'Change Management': { c: '#8B5BC4', bg: '#F1E9FB' },
  'MSBP System Enhancement': { c: '#B5791C', bg: '#FBEFD6' },
  'Management System & Business Process': { c: '#0E7C8B', bg: '#DDF1F2' },
}

export function catMeta(cat) {
  return CAT_META[cat] || { c: '#5b6472', bg: '#EDEFF2' }
}

export function leadColor(code) {
  const palette = ['#02A0C1', '#3581E1', '#5E8C2E', '#8B5BC4', '#B5791C', '#0E7C8B', '#C0567B', '#477BD1']
  let h = 0
  for (const ch of code || '?') h = (h * 31 + ch.charCodeAt(0)) >>> 0
  const c = palette[h % palette.length]
  return { c, bg: c + '1f' }
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function fmtDate(iso) {
  if (!iso) return ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  const [y, m, dd] = iso.split('-')
  return parseInt(dd, 10) + ' ' + MONTHS[+m - 1] + ' ' + y
}

export function barColor(p, status, accent = ACCENT) {
  if (status === 'Completed' || p >= 100) return '#1F9D6B'
  if (status === 'Hold') return '#B5791C'
  if (p === 0) return '#9aa3af'
  return accent || ACCENT
}

export function parseHistory(text) {
  if (!text) return []
  const lines = String(text)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
  return lines.map((l, i) => ({
    id: 'a' + Date.now().toString(36) + i + Math.random().toString(36).slice(2, 5),
    date: '',
    text: l.replace(/^[\-•\d.\)\s]+/, '').trim() || l,
  }))
}

export function normalize(p) {
  return {
    owner: p.owner || '',
    ownerEmail: p.ownerEmail || '',
    ...p,
    activities: Array.isArray(p.activities) ? p.activities : parseHistory(p.history),
  }
}

export function newActivityId() {
  return 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

export function syncHistory(activities = []) {
  return activities.map((a) => (a.date ? '[' + a.date + '] ' : '') + a.text).join('\n')
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function isOverdue(p, today = new Date(todayISO())) {
  return (
    p.status !== 'Completed' &&
    /^\d{4}-\d{2}-\d{2}$/.test(p.endDate || '') &&
    new Date(p.endDate) < today
  )
}

export function hasOpenIssue(p) {
  return !!(p.issue && p.issue.trim() && p.issue.trim().toUpperCase() !== 'N/A')
}

// Decorate a project with everything the row/card views need.
export function decorate(p, { accent = ACCENT, handlers = {} } = {}) {
  const sm = statusMeta[p.status] || statusMeta.Open
  const cm = catMeta(p.category)
  const lc = leadColor(p.lead)
  const prog = Math.max(0, Math.min(100, p.progress || 0))
  const overdue = isOverdue(p)
  const target = p.targetDate ? fmtDate(p.targetDate) : p.endDate ? fmtDate(p.endDate) : '—'
  return {
    ...p,
    progress: prog,
    progressW: prog + '%',
    barColor: barColor(prog, p.status, accent),
    statusC: sm.c,
    statusBg: sm.bg,
    catC: cm.c,
    catBg: cm.bg,
    leadC: lc.c,
    leadBg: lc.bg,
    team: p.team || '—',
    owner: p.owner || '—',
    ownerLine: p.owner ? 'Owner · ' + p.owner : 'No owner set',
    target,
    targetC: overdue ? '#C0392B' : '#374151',
    overdue,
    hasIssue: hasOpenIssue(p),
    ...handlers,
  }
}

// Build the stakeholder email from a project + people directory.
export function buildEmail(p, dir = {}) {
  const emailFor = (code) => dir[code] || ''
  const to = p.ownerEmail || emailFor(p.lead) || ''
  const teamCodes = (p.team || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const ccList = [emailFor(p.lead), ...teamCodes.map((c) => emailFor(c))].filter(Boolean)
  const cc = [...new Set(ccList)].join(', ')
  const subject = '[MSBP Update] ' + (p.code ? p.code + ' — ' : '') + p.name + ' (' + (p.progress || 0) + '%)'
  const acts =
    (p.activities || [])
      .slice(-5)
      .map((a) => '  • ' + (a.date ? '[' + fmtDate(a.date) + '] ' : '') + a.text)
      .join('\n') || '  • (no activity logged yet)'
  const plan = (p.plan || '').trim() || '(none)'
  const issue = (p.issue || '').trim() || '(none)'
  const body = `Hi ${p.owner || 'team'},

Here is the latest update for this project.

Project   : ${p.name}
Code      : ${p.code || '-'}
Category  : ${p.category || '-'}
Lead      : ${p.lead || '-'}   |   Team: ${p.team || '-'}
Owner     : ${p.owner || '-'}
Status    : ${p.status}
Progress  : ${p.progress || 0}%
Target    : ${p.targetDate || fmtDate(p.endDate) || '-'}

Recent activity:
${acts}

Next plan:
${plan}

Open issues / risk:
${issue}
${p.folder ? '\nDocuments: ' + p.folder : ''}

— Sent via MSBP Project Manager`
  return { to, cc, subject, body }
}

export function buildCsv(projects) {
  const cols = [
    'no', 'year', 'category', 'task', 'code', 'name', 'lead', 'team', 'owner', 'ownerEmail',
    'progress', 'status', 'startDate', 'endDate', 'targetDate', 'history', 'plan', 'issue', 'folder',
  ]
  const esc = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"'
  const lines = [cols.join(',')]
  for (const p of projects) {
    const row = { ...p, history: syncHistory(p.activities) }
    lines.push(cols.map((c) => esc(row[c])).join(','))
  }
  return lines.join('\n')
}
