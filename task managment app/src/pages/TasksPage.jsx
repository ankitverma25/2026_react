import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowDownWideNarrow, ArrowUpDown, ChevronLeft, ChevronRight, CirclePlus, ListFilter, LoaderCircle, Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import TaskCard from '../components/TaskCard.jsx'
import TaskModal from '../components/TaskModal.jsx'
import { demoTasks } from '../data/demoTasks.js'
import useApi from '../hooks/useApi.js'
import api from '../lib/api.js'

const pageSize = 6
const priorityRank = { high: 0, medium: 1, low: 2 }

export default function TasksPage() {
  // Yahan useState isliye use kiya hai kyunki task data aur toolbar state isi parent page mein own honi chahiye, taaki list, counts, filters aur modal ek hi source share karein.
  const [tasks, setTasks] = useState(demoTasks)
  const [isDemo, setIsDemo] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, totalTasks: demoTasks.length, totalPages: 2 })
  const [modalTask, setModalTask] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { run, loading, error } = useApi()
  const { run: runMutation, loading: mutationLoading, error: mutationError } = useApi()

  // Yahan useEffect isliye use kiya hai kyunki initial mount aur filter/sort/page badalne par backend se usi slice ke tasks mangane hain.
  useEffect(() => {
    let active = true
    const loadTasks = async () => {
      try {
        const response = await run(() => api.get('/tasks', {
          params: { page, limit: pageSize, ...(filter !== 'all' && { status: filter }), ...(search.trim() && { search: search.trim() }), sortBy, sortOrder },
        }))
        if (!active) return
        // API contract: { tasks: Task[], pagination: { page, limit, totalTasks, totalPages } }.
        setTasks(response.data.tasks)
        setPagination(response.data.pagination)
        setIsDemo(false)
      } catch {
        if (active) setIsDemo(true)
      }
    }
    loadTasks()
    return () => { active = false }
  }, [run, filter, search, sortBy, sortOrder, page])

  // Yahan useMemo isliye use kiya hai kyunki demo mode mein search, status filter, sorting aur page slice ko task data badle tabhi recompute karna hai.
  const demoFilteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return tasks
      .filter((task) => filter === 'all' || task.status === filter)
      .filter((task) => task.title.toLowerCase().includes(normalizedSearch))
      .toSorted((first, second) => {
        const difference = sortBy === 'priority'
          ? priorityRank[first.priority] - priorityRank[second.priority]
          : new Date(first.dueDate) - new Date(second.dueDate)
        return difference * (sortOrder === 'asc' ? 1 : -1)
      })
  }, [tasks, filter, search, sortBy, sortOrder])

  const visibleTasks = isDemo
    ? demoFilteredTasks.slice((page - 1) * pageSize, page * pageSize)
    : tasks
  const totalPages = isDemo ? Math.max(1, Math.ceil(demoFilteredTasks.length / pageSize)) : Math.max(1, pagination.totalPages)
  const totalCount = isDemo ? demoFilteredTasks.length : pagination.totalTasks
  const pendingCount = tasks.filter((task) => task.status === 'pending').length
  const completedCount = tasks.filter((task) => task.status === 'completed').length

  const changeFilter = (nextFilter) => {
    setFilter(nextFilter)
    setPage(1)
  }
  const changeSearch = (event) => {
    setSearch(event.target.value)
    setPage(1)
  }
  const toggleSortOrder = () => setSortOrder((current) => current === 'asc' ? 'desc' : 'asc')
  const openCreate = () => {
    setModalTask(null)
    setModalOpen(true)
  }
  const openEdit = useCallback((task) => {
    setModalTask(task)
    setModalOpen(true)
  }, [])

  // Yahan useCallback isliye use kiya hai kyunki ye callbacks har row ko props ke roop mein jaate hain aur memoized TaskCard ko stable props chahiye.
  const handleSave = useCallback(async (formData) => {
    const now = new Date().toISOString()
    const payload = { ...formData, dueDate: new Date(`${formData.dueDate}T12:00:00`).toISOString() }
    try {
      if (modalTask) {
        const response = await runMutation(() => api.put(`/tasks/${modalTask._id}`, payload))
        setTasks((current) => current.map((task) => task._id === modalTask._id ? response.data.task : task))
      } else {
        const response = await runMutation(() => api.post('/tasks', payload))
        setTasks((current) => [response.data.task, ...current])
      }
      setIsDemo(false)
      } catch (requestError) {
        if (requestError.response) return
      const fallbackTask = { ...payload, _id: modalTask?._id || `local-${Date.now()}`, createdAt: modalTask?.createdAt || now, updatedAt: now }
      setTasks((current) => modalTask
        ? current.map((task) => task._id === modalTask._id ? fallbackTask : task)
        : [fallbackTask, ...current])
      setIsDemo(true)
    }
    setModalOpen(false)
  }, [modalTask, runMutation])

  const handleToggle = useCallback(async (task) => {
    const status = task.status === 'completed' ? 'pending' : 'completed'
    try {
      const response = await runMutation(() => api.patch(`/tasks/${task._id}/status`, { status }))
      setTasks((current) => current.map((item) => item._id === task._id ? response.data.task : item))
      setIsDemo(false)
      } catch (requestError) {
        if (requestError.response) return
      setTasks((current) => current.map((item) => item._id === task._id ? { ...item, status, updatedAt: new Date().toISOString() } : item))
      setIsDemo(true)
    }
  }, [runMutation])

  const handleDelete = useCallback(async (task) => {
    if (!window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return
    try {
      await runMutation(() => api.delete(`/tasks/${task._id}`))
      setTasks((current) => current.filter((item) => item._id !== task._id))
      setIsDemo(false)
    } catch (requestError) {
      if (requestError.response) return
      setTasks((current) => current.filter((item) => item._id !== task._id))
      setIsDemo(true)
    }
  }, [runMutation])

  const filterOptions = [
    { id: 'all', label: 'All tasks' },
    { id: 'pending', label: 'To do' },
    { id: 'completed', label: 'Completed' },
  ]

  return (
    <div className="tasks-view">
      <section className="welcome-band">
        <div className="welcome-copy"><p className="eyebrow eyebrow-light"><Sparkles size={13} /> TUESDAY, SEPTEMBER 29, 2026</p><h1>A clear day,<br /><em>a clear mind.</em></h1><p>You have {pendingCount} things to move forward. Start anywhere.</p></div>
        <div className="welcome-mark"><span>WEEK 40</span><strong>29</strong><small>SEP / TUE</small><i /></div>
        <div className="welcome-decoration deco-one" /><div className="welcome-decoration deco-two" />
      </section>

      <section aria-label="Task overview" className="stats-strip">
        <div className="stat-item"><span className="stat-kicker">IN YOUR LIST</span><strong>{isDemo ? tasks.length : pagination.totalTasks}</strong><span>tasks in total</span></div>
        <div className="stat-item"><span className="stat-kicker">OPEN HERE</span><strong>{pendingCount.toString().padStart(2, '0')}</strong><span>still to do</span></div>
        <div className="stat-item"><span className="stat-kicker">DONE HERE</span><strong>{completedCount.toString().padStart(2, '0')}</strong><span>on this page</span></div>
        <div className="stat-progress"><div><span>WEEKLY MOMENTUM</span><b>{tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%</b></div><div className="progress-track"><i style={{ width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` }} /></div><small>Keep the rhythm going.</small></div>
      </section>

      <section className="task-section">
        <div className="section-heading"><div><p className="eyebrow">THE WORK</p><h2>Your task list <span>{String(totalCount).padStart(2, '0')}</span></h2></div><button className="button button-coral" onClick={openCreate}><CirclePlus size={17} /> New task</button></div>
        <div className="task-toolbar">
          <div aria-label="Filter tasks" className="filter-tabs" role="tablist">
            {filterOptions.map((option) => <button aria-selected={filter === option.id} className={filter === option.id ? 'active' : ''} key={option.id} onClick={() => changeFilter(option.id)} role="tab">{option.label}{option.id === 'pending' && <span>{pendingCount}</span>}</button>)}
          </div>
          <div className="toolbar-controls">
            <label className="search-field"><Search size={16} /><input aria-label="Search task titles" onChange={changeSearch} placeholder="Find a task..." value={search} /></label>
            <label className="sort-select"><SlidersHorizontal size={15} /><select aria-label="Sort tasks by" onChange={(event) => { setSortBy(event.target.value); setPage(1) }} value={sortBy}><option value="dueDate">Due date</option><option value="priority">Priority</option></select></label>
            <button aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`} className="icon-button sort-direction" onClick={toggleSortOrder}><ArrowUpDown size={16} /></button>
          </div>
        </div>

        {isDemo && <div className="demo-banner"><span className="demo-dot" /> Demo data · changes stay in this browser session until you connect the API</div>}
        {error && error !== 'Could not reach the API. Demo mode is active.' && <div className="notice notice-error inline-error">{error}</div>}
        {mutationError && mutationError !== 'Could not reach the API. Demo mode is active.' && <div className="notice notice-error inline-error">{mutationError}</div>}
        {loading && <div className="list-loading"><LoaderCircle className="spin" size={18} /> Updating your list...</div>}
        {!loading && visibleTasks.length === 0 && <div className="empty-state"><div className="empty-icon"><ListFilter size={22} /></div><h3>Nothing on this page</h3><p>{search ? 'Try another title, or clear the search.' : 'A fresh slate. Add a task when something comes to mind.'}</p><button className="button button-quiet" onClick={openCreate}>Create a task <CirclePlus size={16} /></button></div>}
        {/* Yahan list keys isliye use ki hain kyunki MongoDB _id se React har task ko stable identity dekar sahi row update kar sakta hai. */}
        {visibleTasks.length > 0 && <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task._id} onDelete={handleDelete} onEdit={openEdit} onToggle={handleToggle} task={task} />)}</div>}

        <footer className="list-footer"><span>Showing <strong>{totalCount === 0 ? 0 : (page - 1) * pageSize + (visibleTasks.length ? 1 : 0)}–{Math.min(page * pageSize, totalCount)}</strong> of {totalCount} tasks</span><div className="pagination"><button aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}><ChevronLeft size={16} /></button><span>Page <strong>{page}</strong> of {totalPages}</span><button aria-label="Next page" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}><ChevronRight size={16} /></button></div></footer>
      </section>
      <div className="page-footnote"><ArrowDownWideNarrow size={14} /> A good plan leaves room for the unexpected.</div>
      {modalOpen && <TaskModal error={mutationError} loading={mutationLoading} onClose={() => setModalOpen(false)} onSave={handleSave} task={modalTask} />}
    </div>
  )
}