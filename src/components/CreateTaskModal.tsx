import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { StoredUser } from '../firebase/users'
import type { Task, TaskFormData } from '../types'
import { toInputDate } from '../utils/penalties'

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => Promise<void>
  users: StoredUser[]
  currentUserId: string
  editingTask?: Task | null
}

const emptyForm: TaskFormData = {
  title: '',
  description: '',
  assignedTo: '',
  dueDate: toInputDate(),
  penaltyPoints: 1,
}

export function CreateTaskModal({
  open,
  onClose,
  onSubmit,
  users,
  currentUserId,
  editingTask,
}: CreateTaskModalProps) {
  const [form, setForm] = useState<TaskFormData>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description,
        assignedTo: editingTask.assignedTo,
        dueDate: editingTask.dueDate.split('T')[0],
        penaltyPoints: editingTask.penaltyPoints,
      })
    } else {
      setForm({
        ...emptyForm,
        assignedTo: currentUserId,
        dueDate: toInputDate(),
      })
    }
  }, [editingTask, currentUserId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    console.log("FORM DATA:", form)
  
    if (!form.title.trim() || !form.assignedTo) {
      console.log("FORM INVALID ❌")
      return
    }
  
    setSubmitting(true)
  
    try {
      console.log("CALLING onSubmit 🚀")
  
      await onSubmit(form)
  
      console.log("SUBMIT DONE ✅")
  
      onClose()
    } catch (error) {
      console.error("ERROR SUBMIT:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2"
          >
            <h2 className="text-lg font-semibold text-neutral-900">
              {editingTask ? 'Editar tarea' : 'Nueva tarea'}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              {editingTask ? 'Modifica los detalles de la tarea' : 'Asigna una tarea del hogar'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <Field label="Título">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ej: Sacar la basura"
                  required
                  className="input-field"
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detalles opcionales..."
                  rows={2}
                  className="input-field resize-none"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Asignar a">
                  <select
                    value={form.assignedTo}
                    onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                    required
                    className="input-field"
                  >
                    {users.map((user) => (
                      <option key={user.uid || user.email} value={user.uid}>
                        {user.uid === currentUserId ? 'Yo' : user.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Fecha límite">
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    required
                    className="input-field"
                  />
                </Field>
              </div>

              <Field label="Puntos de penalidad">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={form.penaltyPoints}
                  onChange={(e) =>
                    setForm({ ...form, penaltyPoints: Number(e.target.value) || 1 })
                  }
                  className="input-field w-24"
                />
              </Field>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-60"
                >
                  {submitting ? 'Guardando...' : editingTask ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-neutral-600">{label}</span>
      {children}
    </label>
  )
}
