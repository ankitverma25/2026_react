import { memo } from 'react'
import { CalendarDays, Check, MoreHorizontal } from 'lucide-react'

function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const due = new Date(task.dueDate)

  return (
    <article className={`task-row ${task.status === 'completed' ? 'task-complete' : ''}`}>
      <button aria-label={task.status === 'completed' ? 'Mark pending' : 'Mark completed'} className={`task-check ${task.status === 'completed' ? 'checked' : ''}`} onClick={() => onToggle(task)}>
        {task.status === 'completed' && <Check size={13} strokeWidth={3} />}
      </button>
      <div className="task-main">
        <button className="task-title" onClick={() => onEdit(task)}>{task.title}</button>
        <p>{task.description || 'No notes added'}</p>
      </div>
      <span className={`priority-label priority-${task.priority}`}><i />{task.priority}</span>
      <span className="task-due"><CalendarDays size={14} />{due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      <div className="task-menu-wrap">
        <details className="task-menu"><summary aria-label="Task actions"><MoreHorizontal size={19} /></summary><div className="task-menu-pop"><button onClick={() => onEdit(task)}>Edit task</button><button className="delete-action" onClick={() => onDelete(task)}>Delete task</button></div></details>
      </div>
    </article>
  )
}

// Yahan React.memo isliye use kiya hai kyunki ek filter ya modal update par unchanged task rows ko dobara render karne ki zaroorat nahi.
export default memo(TaskCard)