import { motion } from 'framer-motion'
import type { StoredUser } from '../firebase/users'
import type { Task } from '../types'
import { formatDate, getTaskStatus } from '../utils/penalties'

interface TaskCardProps {
  task: Task
  assignee?: StoredUser
  isMine: boolean
  index: number
  onComplete: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const statusStyles = {
  completed: 'border-green-200 bg-green-50/50',
  overdue: 'border-red-200 bg-red-50/50',
  pending: 'border-neutral-200 bg-white',
}

export function TaskCard({
  task,
  assignee,
  isMine,
  index,
  onComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const status = getTaskStatus(task)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md ${statusStyles[status]}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => onComplete(task.id, !task.completed)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            task.completed
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-neutral-300 hover:border-indigo-400'
          }`}
          aria-label={task.completed ? 'Marcar pendiente' : 'Marcar completada'}
        >
          {task.completed && (
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-medium text-neutral-900 ${
                task.completed ? 'line-through text-neutral-400' : ''
              }`}
            >
              {task.title}
            </h3>
            <StatusBadge status={status} penaltyPoints={task.penaltyPoints} />
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-neutral-500 line-clamp-2">{task.description}</p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="flex items-center gap-1 rounded-lg bg-white/80 px-2 py-1">
              📅 {formatDate(task.dueDate)}
            </span>
            {assignee && (
              <span className="flex items-center gap-1.5 rounded-lg bg-white/80 px-2 py-1">
                {assignee.photoURL ? (
                  <img src={assignee.photoURL} alt="" className="h-4 w-4 rounded-full" />
                ) : (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-neutral-200 text-[10px]">
                    {assignee.name[0]}
                  </span>
                )}
                {isMine ? 'Tú' : assignee.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-neutral-500 hover:bg-white hover:text-neutral-800"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>
    </motion.article>
  )
}

function StatusBadge({
  status,
  penaltyPoints,
}: {
  status: ReturnType<typeof getTaskStatus>
  penaltyPoints: number
}) {
  if (status === 'completed') {
    return (
      <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        Completada
      </span>
    )
  }
  if (status === 'overdue') {
    return (
      <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        -{penaltyPoints} pts
      </span>
    )
  }
  return (
    <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
      Pendiente
    </span>
  )
}
