import { motion } from 'framer-motion'
import type { Task } from '../types'
import { formatDate, formatTimestamp } from '../utils/penalties'

interface DeletedTasksListProps {
  tasks: Task[]
  users: any[]
  onRestore: (id: string) => void
  isLoading?: boolean
}

export function DeletedTasksList({
  tasks,
  users,
  onRestore,
  isLoading = false,
}: DeletedTasksListProps) {
  const deletedTasks = tasks.filter((t) => t.deleted)

  if (deletedTasks.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="text-sm text-neutral-500">
          No hay tareas eliminadas
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {deletedTasks.map((task, index) => {
        const assignee = users.find((u) => u.id === task.assignedTo)

        return (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-lg border border-neutral-300 bg-neutral-50 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-neutral-600 line-through">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="mt-1 text-sm text-neutral-500">
                    {task.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-600">
                  <span>📅 {formatDate(task.dueDate)}</span>
                  {assignee && (
                    <span>👤 {assignee.name}</span>
                  )}
                  {task.deletedAt && (
                    <span>🗑️ {formatTimestamp(task.deletedAt)}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRestore(task.id)}
                disabled={isLoading}
                className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Restaurar
              </button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
