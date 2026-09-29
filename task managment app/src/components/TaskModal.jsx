import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, LoaderCircle, X } from 'lucide-react'

const blankTask = { title: '', description: '', status: 'pending', priority: 'medium' }

export default function TaskModal({ task, onClose, onSave, loading, error }) {
  // Yahan useState isliye use kiya hai kyunki title, notes, priority aur status edits par turant React state se sync rehne chahiye.
  const [form, setForm] = useState(() => task ? { ...task } : { ...blankTask })
  const titleRef = useRef(null)
  const dueDateRef = useRef(null)

  // Yahan useEffect isliye use kiya hai kyunki modal mount ke baad hi title input DOM mein hota hai aur tab focus karna chahiye.
  // Yahan useRef isliye use kiya hai kyunki modal khulte hi title field par focus chahiye bina render state badle.
  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const handleSubmit = (event) => {
    event.preventDefault()
    onSave({ ...form, dueDate: dueDateRef.current.value })
  }

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="task-modal-title" aria-modal="true" className="task-modal" role="dialog">
        <div className="modal-heading"><div><p className="eyebrow">TASK DETAILS</p><h2 id="task-modal-title">{task ? 'Edit task' : 'A new task'}</h2></div><button aria-label="Close dialog" className="icon-button" onClick={onClose}><X size={19} /></button></div>
        {error && <div className="notice notice-error modal-error">{error}</div>}
        <form className="task-form" onSubmit={handleSubmit}>
          {/* Yahan controlled vs uncontrolled form ka contrast dikhaya hai: title React state se control hota hai, due date DOM ref se read hota hai. */}
          <label className="field-label">Title<input ref={titleRef} maxLength="100" name="title" onChange={handleChange} placeholder="What needs your attention?" required value={form.title} /></label>
          <label className="field-label">Notes<textarea maxLength="500" name="description" onChange={handleChange} placeholder="Add a little context..." rows="3" value={form.description || ''} /></label>
          <div className="form-grid">
            <label className="field-label">Priority<select name="priority" onChange={handleChange} value={form.priority}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label>
            <label className="field-label">Status<select name="status" onChange={handleChange} value={form.status}><option value="pending">Pending</option><option value="completed">Completed</option></select></label>
          </div>
          <label className="field-label">Due date <span className="uncontrolled-hint">native input</span><span className="date-field"><CalendarDays size={16} /><input defaultValue={task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ''} ref={dueDateRef} required type="date" /></span></label>
          <div className="modal-actions"><button className="button button-quiet" onClick={onClose} type="button">Cancel</button><button className="button button-dark" disabled={loading} type="submit">{loading && <LoaderCircle className="spin" size={16} />}{task ? 'Save changes' : 'Add task'}</button></div>
        </form>
      </section>
    </div>,
    document.body,
  )
}