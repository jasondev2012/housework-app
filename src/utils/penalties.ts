import type { Task, TaskStatus } from '../types'

export function getTaskStatus(task: Task, now = new Date()): TaskStatus {
  if (task.completed) return 'completed'

  const due = new Date(task.dueDate)
  due.setHours(23, 59, 59, 999)

  if (now > due) return 'overdue'
  return 'pending'
}

export function isTaskOverdue(task: Task, now = new Date()): boolean {
  return getTaskStatus(task, now) === 'overdue'
}

export function calculatePenaltiesByUser(
  tasks: Task[],
  userIds: string[],
  now = new Date(),
): Record<string, number> {
  const scores: Record<string, number> = {}
  userIds.forEach((id) => {
    scores[id] = 0
  })

  tasks.forEach((task) => {
    if (isTaskOverdue(task, now)) {
      scores[task.assignedTo] = (scores[task.assignedTo] ?? 0) + task.penaltyPoints
    }
  })

  return scores
}


export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number)

  const date = new Date(year, month - 1, day)

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}


export function toInputDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}
