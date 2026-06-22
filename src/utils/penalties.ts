import type { Task, TaskStatus, Achievement, PenaltyHistoryEntry } from '../types'


export function getTaskStatus(task: Task, now = new Date()): TaskStatus {
  if (task.completed) return 'completed'

  const due = parseLocalDate(task.dueDate)
  due.setHours(23, 59, 59, 999)

  if (now > due) return 'overdue'
  return 'pending'
}

function parseLocalDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function isTaskOverdue(task: Task, now = new Date()): boolean {
  return getTaskStatus(task, now) === 'overdue'
}

export function calculatePenaltiesByUser(
  tasks: Task[],
  userIds: string[],
  history: PenaltyHistoryEntry[] = [],
  now = new Date(),
): Record<string, number> {
  const scores: Record<string, number> = {}
  userIds.forEach((id) => {
    scores[id] = 0
  })

  // Penalidades por tareas atrasadas
  tasks.forEach((task) => {
    if (!task.deleted && isTaskOverdue(task, now)) {
      scores[task.assignedTo] = (scores[task.assignedTo] ?? 0) + task.penaltyPoints
    }
  })

  // Ajustar por compensaciones
  history.forEach((entry) => {
    if (entry.reason === 'compensation') {
      scores[entry.userId] = Math.max(0, (scores[entry.userId] ?? 0) - entry.points)
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

export function formatTimestamp(isoString: string | null): string {
  if (!isoString) return ''
  
  try {
    const date = new Date(isoString)
    if (isNaN(date.getTime())) return 'INVALID DATE'
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'INVALID DATE'
  }
}


export function toInputDate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0]
}

export function calculateAchievements(
  tasks: Task[],
  history: PenaltyHistoryEntry[] = [],
  userId: string,
): Achievement[] {
  const achievements: Achievement[] = [
    {
      id: 'on-time',
      name: 'Puntual',
      description: 'Completa 5 tareas sin penalidades',
      icon: '⏰',
      condition: 'onTime',
      unlockedAt: null,
    },
    {
      id: 'streak-7',
      name: 'Racha de 7',
      description: '7 días sin tareas atrasadas',
      icon: '🔥',
      condition: 'streak7',
      unlockedAt: null,
    },
    {
      id: 'perfect-week',
      name: 'Semana Perfecta',
      description: 'Completa todas las tareas en una semana',
      icon: '⭐',
      condition: 'perfectWeek',
      unlockedAt: null,
    },
    {
      id: 'super-star',
      name: 'Superestrella',
      description: '0 puntos de penalidad',
      icon: '✨',
      condition: 'superStar',
      unlockedAt: null,
    },
  ]

  // Contar tareas completadas a tiempo
  const completedOnTime = tasks.filter(
    (t) =>
      t.assignedTo === userId &&
      t.completed &&
      !t.deleted &&
      !isTaskOverdue(t, new Date(t.completedAt ?? new Date())),
  ).length

  // Logro: Puntual
  if (completedOnTime >= 5) {
    const onTimeAchievement = achievements.find((a) => a.id === 'on-time')
    if (onTimeAchievement) {
      onTimeAchievement.unlockedAt = new Date().toISOString()
    }
  }

  // Logro: Superestrella
  const totalPenaltyPoints = history
    .filter((h) => h.userId === userId && h.reason === 'overdue')
    .reduce((sum, h) => sum + h.points, 0)

  const totalCompensation = history
    .filter((h) => h.userId === userId && h.reason === 'compensation')
    .reduce((sum, h) => sum + h.points, 0)

  if (totalPenaltyPoints <= totalCompensation) {
    const superStarAchievement = achievements.find((a) => a.id === 'super-star')
    if (superStarAchievement) {
      superStarAchievement.unlockedAt = new Date().toISOString()
    }
  }

  return achievements
}
