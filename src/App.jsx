import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from './lib/store.js'
import {
  STATUSES,
  ACCENT,
  statusMeta,
  decorate,
  barColor,
  buildEmail,
  buildCsv,
  syncHistory,
  newActivityId,
  isOverdue,
  hasOpenIssue,
  todayISO,
  fmtDate,
} from './lib/helpers.js'
import Header from './components/Header.jsx'
import KpiCards from './components/KpiCards.jsx'
import FilterBar from './components/FilterBar.jsx'
import ProjectTable from './components/ProjectTable.jsx'
import BoardView from './components/BoardView.jsx'
import MobileCards from './components/MobileCards.jsx'
import SummaryView from './components/SummaryView.jsx'
import DetailDrawer from './components/DetailDrawer.jsx'
import EmailComposer from './components/EmailComposer.jsx'
import Toast from './components/Toast.jsx'

export default function App() {
  const { loading, all, dir, saveProject, deleteProject, isShared } = useStore()

  const [view, setView] = useState('table')
  const [search, setSearch] = useState('')
  const [fYear, setFYear] = useState('all')
  const [fCat, setFCat] = useState('all')
  const [fLead, setFLead] = useState('all')
  const [fStatus, setFStatus] = useState('all')
  const [isMobile, setIsMobile] = useState(false)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [draft, setDraft] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [naDate, setNaDate] = useState('')
  const [naText, setNaText] = useState('')

  const [emailOpen, setEmailOpen] = useState(false)
  const [email, setEmail] = useState(null)
  const [emailProject, setEmailProject] = useState(null)

  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)
  const dragRef = useRef(null)

  // --- responsive ---
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const onMq = () => setIsMobile(mq.matches)
    onMq()
    mq.addEventListener ? mq.addEventListener('change', onMq) : mq.addListener(onMq)
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', onMq) : mq.removeListener(onMq)
    }
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2600)
  }, [])

  // --- mutations ---
  const updateProject = useCallback(
    (id, patch) => {
      const cur = all.find((p) => p.id === id)
      if (!cur) return
      saveProject({ ...cur, ...patch })
    },
    [all, saveProject]
  )

  const saveNote = useCallback(
    (id, text) => {
      updateProject(id, { nextTodo: text })
      showToast('Note saved')
    },
    [updateProject, showToast]
  )

  // --- filtering ---
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase()
    return all.filter((p) => {
      if (fYear !== 'all' && (p.year || '') !== fYear) return false
      if (fCat !== 'all' && p.category !== fCat) return false
      if (fLead !== 'all' && p.lead !== fLead) return false
      if (fStatus !== 'all' && p.status !== fStatus) return false
      if (s) {
        const hay = [p.name, p.code, p.task, p.lead, p.team, p.issue, p.category, p.owner]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(s)) return false
      }
      return true
    })
  }, [all, search, fYear, fCat, fLead, fStatus])

  // --- decorated rows + handlers ---
  const rows = useMemo(
    () =>
      filtered.map((p) =>
        decorate(p, {
          accent: ACCENT,
          handlers: {
            onOpen: () => openDrawer(p.id),
            onMail: (e) => {
              e.stopPropagation()
              openEmail(p)
            },
            onProgress: (e) => {
              const v = parseInt(e.target.value, 10)
              updateProject(p.id, {
                progress: v,
                status: v >= 100 && p.status !== 'Completed' ? 'Completed' : p.status,
              })
            },
            onStatus: (e) => updateProject(p.id, { status: e.target.value }),
            onDragStart: (e) => {
              dragRef.current = p.id
              if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
            },
          },
        })
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtered, updateProject]
  )

  // --- KPIs over the ACTIVE FILTER (falls back to all when no filter) ---
  const kpi = useMemo(() => {
    const src = filtered
    const counts = { completed: 0, progress: 0, open: 0, hold: 0, risk: 0 }
    let progSum = 0
    const today = new Date(todayISO())
    for (const p of src) {
      if (p.status === 'Completed') counts.completed++
      else if (p.status === 'Progress') counts.progress++
      else if (p.status === 'Open') counts.open++
      else if (p.status === 'Hold') counts.hold++
      progSum += p.progress || 0
      if (hasOpenIssue(p) || isOverdue(p, today)) counts.risk++
    }
    const avg = src.length ? Math.round(progSum / src.length) : 0
    return {
      total: src.length,
      grandTotal: all.length,
      filtered: src.length !== all.length,
      avg,
      avgW: avg + '%',
      completed: counts.completed,
      completedPct: src.length ? Math.round((counts.completed / src.length) * 100) : 0,
      progress: counts.progress,
      open: counts.open,
      hold: counts.hold,
      risk: counts.risk,
    }
  }, [filtered, all.length])

  const cats = useMemo(() => [...new Set(all.map((p) => p.category).filter(Boolean))].sort(), [all])
  const leadCodes = useMemo(() => [...new Set(all.map((p) => p.lead).filter(Boolean))].sort(), [all])
  const years = useMemo(() => [...new Set(all.map((p) => p.year).filter(Boolean))].sort(), [all])

  const boardCols = useMemo(
    () =>
      STATUSES.map((st) => {
        const cards = rows.filter((r) => r.status === st)
        return {
          status: st,
          c: statusMeta[st].c,
          count: cards.length,
          cards,
          onDrop: (e) => {
            e.preventDefault()
            if (dragRef.current) {
              updateProject(dragRef.current, { status: st })
              dragRef.current = null
            }
          },
        }
      }),
    [rows, updateProject]
  )

  // --- drawer ---
  function openDrawer(id) {
    const p = all.find((x) => x.id === id)
    if (!p) return
    setDraft(JSON.parse(JSON.stringify(p)))
    setIsNew(false)
    setNaDate(todayISO())
    setNaText('')
    setDrawerOpen(true)
  }
  function closeDrawer() {
    setDrawerOpen(false)
    setDraft(null)
    setIsNew(false)
  }
  const setDraftField = (field, value) => setDraft((d) => ({ ...d, [field]: value }))

  function addActivity() {
    const txt = naText.trim()
    if (!txt) return
    const entry = { id: newActivityId(), date: naDate || '', text: txt }
    setDraft((d) => ({ ...d, activities: [...d.activities, entry] }))
    setNaText('')
    setNaDate(todayISO())
  }
  const updateActivity = (id, field, value) =>
    setDraft((d) => ({
      ...d,
      activities: d.activities.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    }))
  const removeActivity = (id) =>
    setDraft((d) => ({ ...d, activities: d.activities.filter((a) => a.id !== id) }))

  function saveDraft() {
    if (!draft) return
    const saved = { ...draft, history: syncHistory(draft.activities) }
    saveProject(saved)
    closeDrawer()
    showToast('Saved')
  }
  function addNew() {
    const id = 'p_new_' + Date.now()
    setDraft({
      id,
      no: '',
      category: 'Management System',
      task: '',
      code: '',
      name: '',
      lead: 'DHI',
      team: '',
      owner: '',
      ownerEmail: '',
      progress: 0,
      targetDate: '',
      startDate: todayISO(),
      endDate: '',
      status: 'Open',
      history: '',
      plan: '',
      issue: '',
      folder: '',
      year: '2026',
      activities: [],
    })
    setIsNew(true)
    setNaDate(todayISO())
    setNaText('')
    setDrawerOpen(true)
  }
  function handleDelete() {
    if (!draft) return
    if (isNew) {
      closeDrawer()
      return
    }
    deleteProject(draft.id)
    closeDrawer()
    showToast('Deleted')
  }

  // --- email ---
  function openEmail(p) {
    if (!p) return
    setEmailProject(p)
    setEmail(buildEmail(p, dir.current))
    setEmailOpen(true)
  }
  function openEmailDraft() {
    if (!draft) return
    const p = { ...draft, history: syncHistory(draft.activities) }
    setEmailProject(p)
    setEmail(buildEmail(p, dir.current))
    setEmailOpen(true)
  }
  function closeEmail() {
    setEmailOpen(false)
    setEmail(null)
    setEmailProject(null)
  }
  const setEmailField = (field, value) => setEmail((e) => ({ ...e, [field]: value }))
  function sendEmail() {
    if (!email) return
    const href =
      'mailto:' +
      encodeURIComponent(email.to).replace(/%2C/g, ',') +
      '?cc=' +
      encodeURIComponent(email.cc) +
      '&subject=' +
      encodeURIComponent(email.subject) +
      '&body=' +
      encodeURIComponent(email.body)
    try {
      window.location.href = href
    } catch (err) {
      /* ignore */
    }
    showToast('Opening email app…')
    closeEmail()
  }
  function copyEmail() {
    if (!email) return
    const txt = 'To: ' + email.to + '\nCc: ' + email.cc + '\nSubject: ' + email.subject + '\n\n' + email.body
    try {
      navigator.clipboard.writeText(txt)
      showToast('Email text copied')
    } catch (err) {
      showToast('Copy failed')
    }
  }

  // --- CSV export ---
  function exportCsv() {
    const csv = buildCsv(filtered)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'MSBP-projects.csv'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  // --- derived drawer view model ---
  const d = useMemo(() => {
    if (!draft) return null
    const sm = statusMeta[draft.status] || statusMeta.Open
    const prog = Math.max(0, Math.min(100, draft.progress || 0))
    const activities = (draft.activities || []).map((a) => ({
      ...a,
      onDate: (e) => updateActivity(a.id, 'date', e.target.value),
      onText: (e) => updateActivity(a.id, 'text', e.target.value),
      onRemove: () => removeActivity(a.id),
    }))
    return {
      ...draft,
      progress: prog,
      progressW: prog + '%',
      barColor: barColor(prog, draft.status),
      statusC: sm.c,
      statusBg: sm.bg,
      activities,
      activityCount: activities.length,
      startLabel: draft.startDate ? fmtDate(draft.startDate) : 'Not set',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  const onD = useMemo(() => {
    const fields = [
      'name', 'code', 'task', 'team', 'owner', 'ownerEmail', 'category', 'lead', 'year',
      'startDate', 'endDate', 'targetDate', 'plan', 'issue', 'folder',
    ]
    const map = {}
    for (const f of fields) map[f] = (e) => setDraftField(f, e.target.value)
    map.progress = (e) => setDraftField('progress', parseInt(e.target.value, 10))
    map.status = (e) => setDraftField('status', e.target.value)
    return map
  }, [])

  const drawerTag = isNew ? 'New project' : draft ? draft.code || draft.category || 'Project' : ''
  const emptyResults = !loading && rows.length === 0 && (isMobile || view === 'table' || view === 'summary')
  const kpiCols = isMobile ? 'repeat(2,1fr)' : 'repeat(5,1fr)'
  const emailMeta = emailProject
    ? (emailProject.code ? emailProject.code + ' · ' : '') + emailProject.name
    : ''

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(1100px 620px at 10% -10%, #E4F4F9 0%, rgba(228,244,249,0) 58%), radial-gradient(940px 560px at 100% -4%, #E7EFFC 0%, rgba(231,239,252,0) 52%), #F7F8FA',
      }}
    >
      <Header onExport={exportCsv} onAddNew={addNew} shared={isShared} />

      <main className="msbp-main" style={{ maxWidth: 1500, margin: '0 auto', padding: '26px 30px 90px' }}>
        <KpiCards kpi={kpi} cols={kpiCols} />

        <FilterBar
          search={search}
          onSearch={(e) => setSearch(e.target.value)}
          fYear={fYear}
          onYear={(e) => setFYear(e.target.value)}
          fCat={fCat}
          onCat={(e) => setFCat(e.target.value)}
          fLead={fLead}
          onLead={(e) => setFLead(e.target.value)}
          fStatus={fStatus}
          onStatusFilter={(e) => setFStatus(e.target.value)}
          years={years}
          cats={cats}
          leadCodes={leadCodes}
          statuses={STATUSES}
          showToggle
          isMobile={isMobile}
          view={view}
          onView={setView}
        />

        {loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '90px 0',
              color: '#a3abb6',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                border: '3px solid #E6E8EC',
                borderTopColor: '#02A0C1',
                borderRadius: '50%',
                animation: 'spin .8s linear infinite',
              }}
            />
            <div style={{ marginTop: 14, fontSize: 13, fontWeight: 600 }}>Loading projects…</div>
          </div>
        )}

        {!loading && view === 'summary' && (
          <SummaryView rows={rows} onSaveNote={saveNote} empty={emptyResults} />
        )}
        {!loading && view !== 'summary' && !isMobile && view === 'table' && (
          <ProjectTable rows={rows} statuses={STATUSES} tdPadV="13px" empty={emptyResults} />
        )}
        {!loading && view !== 'summary' && !isMobile && view === 'board' && (
          <BoardView cols={boardCols} onAllowDrop={(e) => e.preventDefault()} />
        )}
        {!loading && view !== 'summary' && isMobile && (
          <MobileCards rows={rows} statuses={STATUSES} empty={emptyResults} />
        )}
      </main>

      {drawerOpen && d && (
        <DetailDrawer
          d={d}
          onD={onD}
          drawerTag={drawerTag}
          statuses={STATUSES}
          cats={cats.length ? cats : [d.category].filter(Boolean)}
          leadCodes={leadCodes.length ? leadCodes : [d.lead].filter(Boolean)}
          naDate={naDate}
          naText={naText}
          onNaDate={(e) => setNaDate(e.target.value)}
          onNaText={(e) => setNaText(e.target.value)}
          addActivity={addActivity}
          onClose={closeDrawer}
          onSave={saveDraft}
          onDelete={handleDelete}
          onEmail={openEmailDraft}
        />
      )}

      {emailOpen && email && (
        <EmailComposer
          email={email}
          meta={emailMeta}
          onChange={setEmailField}
          onClose={closeEmail}
          onSend={sendEmail}
          onCopy={copyEmail}
        />
      )}

      <Toast message={toast} />
    </div>
  )
}
