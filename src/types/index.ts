export interface AppUser {
  id: string
  name: string | null
  email: string | null
  photoURL: string | null
}

export interface Task {
  id: string
  title: string
  description: string
  assignedTo: string
  createdBy: string
  dueDate: string
  completed: boolean
  completedAt: string | null
  penaltyPoints: number
}

export type TaskFilter = 'all' | 'mine' | 'completed'

export type TaskStatus = 'completed' | 'overdue' | 'pending'

export interface TaskFormData {
  title: string
  description: string
  assignedTo: string
  dueDate: string
  penaltyPoints: number
}

export interface PenaltyScore {
  id: string
  name: string
  photoURL: string | null
  points: number
}
