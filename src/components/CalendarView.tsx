import { useMemo } from 'react'
import type { StoredUser } from '../firebase/users'
import type { Task } from '../types'
import { getTaskStatus } from '../utils/penalties'

interface CalendarViewProps {
  tasks: Task[]
  users: StoredUser[]
  currentUserId: string
}

export function CalendarView({ tasks, users, currentUserId }: CalendarViewProps) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const monthName = today.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  const tasksByDay = useMemo(() => {
    const map: Record<number, Task[]> = {}
    tasks.forEach((task) => {
      const date = new Date(task.dueDate)
      if (date.getMonth() === month && date.getFullYear() === year) {
        const day = date.getDate()
        map[day] = [...(map[day] ?? []), task]
      }
    })
    return map
  }, [tasks, month, year])

  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 })
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-center text-sm font-semibold capitalize text-neutral-700">
        {monthName}
      </h2>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-neutral-400">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => {
          const dayTasks = tasksByDay[day] ?? []
          const isToday = day === today.getDate()

          return (
            <div
              key={day}
              className={`min-h-[72px] rounded-xl border p-1.5 ${
                isToday ? 'border-indigo-300 bg-indigo-50/50' : 'border-neutral-100'
              }`}
            >
              <span
                className={`text-xs font-medium ${
                  isToday ? 'text-indigo-600' : 'text-neutral-500'
                }`}
              >
                {day}
              </span>
              <div className="mt-1 flex flex-col gap-0.5">
                {dayTasks.slice(0, 2).map((task) => {
                  const status = getTaskStatus(task)
                  const assignee = users.find((u) => u.id === task.assignedTo)
                  return (
                    <div
                      key={task.id}
                      title={task.title}
                      className={`truncate rounded px-1 py-0.5 text-[10px] font-medium ${
                        status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : status === 'overdue'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {task.assignedTo === currentUserId ? '●' : '○'} {task.title}
                      {assignee && task.assignedTo !== currentUserId && (
                        <span className="opacity-60"> ({assignee.name[0]})</span>
                      )}
                    </div>
                  )
                })}
                {dayTasks.length > 2 && (
                  <span className="text-[10px] text-neutral-400">+{dayTasks.length - 2}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
