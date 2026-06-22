import { useMemo, useState } from 'react'
import { CreateTaskModal } from '../components/CreateTaskModal'
import { DashboardHeader } from '../components/DashboardHeader'
import { FloatingActionButton } from '../components/FloatingActionButton'
import { TaskFilterTabs } from '../components/TaskFilter'
import { TaskList } from '../components/TaskList'
import { AdminPanel } from '../components/AdminPanel'
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal'
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
    penaltyHistory,
    achievements,
    createTask,
    editTask,
    removeTask,
    completeTask,
    restoreDeletedTask,
    compensatePenalty,
  } = useTasks(user.id)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [showAdmin, setShowAdmin] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  const counts = useMemo(
    (): Record<TaskFilter, number> => ({
      all: allTasks.filter(t => !t.deleted).length,
      mine: allTasks.filter((t) => t.assignedTo === user.id && !t.deleted).length,
      completed: allTasks.filter((t) => t.completed && !t.deleted).length,
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

  const handleDeleteClick = (taskId: string) => {
    setTaskToDelete(taskId)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await removeTask(taskToDelete)
      setDeleteConfirmOpen(false)
      setTaskToDelete(null)
    }
  }

  return (
    <div className="min-h-screen pb-24">
      <DashboardHeader user={user} penaltyScores={penaltyScores} onLogout={onLogout} />

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              {showAdmin ? '⚙️ Panel de Control' : '📋 Tareas'}
            </h1>
            <p className="text-sm text-neutral-500">
              {showAdmin
                ? 'Gestiona penalidades, historial y logros'
                : 'Organiza el hogar entre los dos'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!showAdmin && <ViewToggle view={view} onChange={setView} />}
            <button
              type="button"
              onClick={() => setShowAdmin(!showAdmin)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
            >
              {showAdmin ? '← Tareas' : 'Estadísticas ⚙️'}
            </button>
          </div>
        </div>

        {showAdmin ? (
          <AdminPanel
            allTasks={allTasks}
            users={users}
            currentUserId={user.id}
            penaltyHistory={penaltyHistory}
            penaltyScores={penaltyScores}
            achievements={achievements}
            onRestoreTask={restoreDeletedTask}
            onCompensatePenalty={compensatePenalty}
            isLoading={loading}
          />
        ) : (
          <>
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
                onDelete={handleDeleteClick}
              />
            ) : (
              <CalendarView tasks={allTasks.filter(t => !t.deleted)} users={users} currentUserId={user.id} />
            )}
          </>
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

      <ConfirmDeleteModal
        open={deleteConfirmOpen}
        title="Eliminar tarea"
        description="¿Estás seguro de que deseas eliminar esta tarea? Puedes restaurarla desde la papelera."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false)
          setTaskToDelete(null)
        }}
        isLoading={loading}
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
