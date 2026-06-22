import { motion } from 'framer-motion'
import type { StoredUser } from '../firebase/users'
import type { Task } from '../types'
import { getTaskStatus } from '../utils/penalties'
import { TaskCard } from './TaskCard'

interface TaskListProps {
  tasks: Task[]
  users: StoredUser[]
  currentUserId: string
  loading: boolean
  onComplete: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskList({
  tasks,
  users,
  currentUserId,
  loading,
  onComplete,
  onEdit,
  onDelete,
}: TaskListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 py-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-neutral-200/60" />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="mb-4 text-4xl">✨</div>
        <p className="text-sm font-medium text-neutral-600">No hay tareas aquí</p>
        <p className="mt-1 text-xs text-neutral-400">Crea una nueva con el botón +</p>
      </motion.div>
    )
  }

  const grouped = {
    overdue: tasks.filter((t) => getTaskStatus(t) === 'overdue'),
    pending: tasks.filter((t) => getTaskStatus(t) === 'pending'),
    completed: tasks.filter((t) => getTaskStatus(t) === 'completed'),
  }

  const sectionProps = { users, currentUserId, onComplete, onEdit, onDelete }

  return (
    <div className="flex flex-col gap-6 py-4">
      {grouped.overdue.length > 0 && (
        <TaskSection title="Atrasadas" emoji="⚠️" tasks={grouped.overdue} {...sectionProps} />
      )}
      {grouped.pending.length > 0 && (
        <TaskSection title="Pendientes" emoji="⏳" tasks={grouped.pending} {...sectionProps} />
      )}
      {grouped.completed.length > 0 && (
        <TaskSection title="Completadas" emoji="✅" tasks={grouped.completed} {...sectionProps} />
      )}
    </div>
  )
}

interface TaskSectionProps {
  title: string
  emoji: string
  tasks: Task[]
  users: StoredUser[]
  currentUserId: string
  onComplete: (id: string, completed: boolean) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

function TaskSection({
  title,
  emoji,
  tasks,
  users,
  currentUserId,
  onComplete,
  onEdit,
  onDelete,
}: TaskSectionProps) {
  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        <span>{emoji}</span> {title}
        <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 text-neutral-500">
          {tasks.length}
        </span>
      </h2>
      <div className="flex flex-col gap-3">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            assignee={users.find((u) => u.id === task.assignedTo)}
            isMine={task.assignedTo === currentUserId}
            index={index}
            onComplete={onComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  )
}
