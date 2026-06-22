import { useMemo, useState } from 'react'
import { CreateTaskModal } from '../components/CreateTaskModal'
import { DashboardHeader } from '../components/DashboardHeader'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { TaskFilterTabs } from '../components/TaskFilter'
import { TaskList } from '../components/TaskList'
import { useTasks } from '../hooks/useTasks'
import type { AppUser, Task, TaskFilter, TaskFormData } from '../types'
import { CalendarView } from '../components/CalendarView'

interface DashboardProps {
  user: AppUser
  onLogout: () => void
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const {
    tasks,
    allTasks,
    users,
    loading,
    filter,
    setFilter,
    penaltyScores,
    createTask,
    editTask,
    removeTask,
    completeTask,
  } = useTasks(user.id)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const counts = useMemo(
    (): Record<TaskFilter, number> => ({
      all: allTasks.length,
      mine: allTasks.filter((t) => t.assignedTo === user.id).length,
      completed: allTasks.filter((t) => t.completed).length,
    }),
    [allTasks, user.id],
  )

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await editTask(editingTask.id, data)
    } else {
      await createTask(data)
    }
    setEditingTask(null)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen pb-24">
      <DashboardHeader user={user} penaltyScores={penaltyScores} onLogout={onLogout} />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">Tareas</h1>
            <p className="text-sm text-neutral-500">Organiza el hogar entre los dos</p>
          </div>
          <ViewToggle view={view} onChange={setView} />
        </div>

        <div className="mb-6">
          <TaskFilterTabs active={filter} onChange={setFilter} counts={counts} />
        </div>

        {view === 'list' ? (
          <TaskList
            tasks={tasks}
            users={users}
            currentUserId={user.id}
            loading={loading}
            onComplete={completeTask}
            onEdit={handleEdit}
            onDelete={removeTask}
          />
        ) : (
          <CalendarView tasks={allTasks} users={users} currentUserId={user.id} />
        )}
      </main>

      <FloatingActionButton onClick={() => setModalOpen(true)} />

      <CreateTaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        users={users.length > 0 ? users : [{ id: user.id, name: user.name ?? 'Yo', email: user.email ?? '', photoURL: user.photoURL }]}
        currentUserId={user.id}
        editingTask={editingTask}
      />
    </div>
  )
}

function ViewToggle({
  view,
  onChange,
}: {
  view: 'list' | 'calendar'
  onChange: (view: 'list' | 'calendar') => void
}) {
  return (
    <div className="flex rounded-lg border border-neutral-200 bg-white p-0.5 text-xs">
      <button
        type="button"
        onClick={() => onChange('list')}
        className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
          view === 'list' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        Lista
      </button>
      <button
        type="button"
        onClick={() => onChange('calendar')}
        className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
          view === 'calendar' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:text-neutral-700'
        }`}
      >
        Calendario
      </button>
    </div>
  )
}
