import { useEffect, useMemo, useState } from 'react'
import {
  addTask,
  deleteTask,
  subscribeTasks,
  toggleTaskComplete,
  updateTask,
} from '../firebase/firestore'
import { subscribeUsers, type StoredUser } from '../firebase/users'
import { calculatePenaltiesByUser } from '../utils/penalties'
import type { PenaltyScore, Task, TaskFilter, TaskFormData } from '../types'

export function useTasks(currentUserId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<StoredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TaskFilter>('all')

  // ✅ USERS (siempre cargan, no dependen del usuario)
  useEffect(() => {
    const unsubscribeUsers = subscribeUsers((data) => {
      setUsers(data)
    })

    return unsubscribeUsers
  }, [])

  // ✅ TASKS (solo si hay usuario)
  useEffect(() => {
    if (!currentUserId) {
      setTasks([])
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribeTasks = subscribeTasks((nextTasks) => {
      setTasks(nextTasks)
      setLoading(false)
    })

    return unsubscribeTasks
  }, [currentUserId])

  // ✅ FILTROS
  const filteredTasks = useMemo(() => {
    if (!currentUserId) return tasks

    switch (filter) {
      case 'mine':
        return tasks.filter((task) => task.assignedTo === currentUserId)
      case 'completed':
        return tasks.filter((task) => task.completed)
      default:
        return tasks
    }
  }, [tasks, filter, currentUserId])

  // ✅ PENALIDADES
  const penaltyScores = useMemo((): PenaltyScore[] => {
    const userIds = users.map((user) => user.id)
    const scores = calculatePenaltiesByUser(tasks, userIds)

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      photoURL: user.photoURL,
      points: scores[user.id] ?? 0,
    }))
  }, [tasks, users])

  // ✅ ACCIONES

  const createTask = async (data: TaskFormData) => {
    if (!currentUserId) {
      console.warn("createTask llamado sin user ❌")
      return
    }

    try {
      await addTask(data, currentUserId)
    } catch (error) {
      console.error("Error creando tarea:", error)
    }
  }

  const editTask = async (id: string, data: Partial<TaskFormData>) => {
    try {
      await updateTask(id, data)
    } catch (error) {
      console.error("Error editando tarea:", error)
    }
  }

  const removeTask = async (id: string) => {
    try {
      await deleteTask(id)
    } catch (error) {
      console.error("Error eliminando tarea:", error)
    }
  }

  const completeTask = async (id: string, completed: boolean) => {
    try {
      await toggleTaskComplete(id, completed)
    } catch (error) {
      console.error("Error completando tarea:", error)
    }
  }

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    users,
    loading,
    filter,
    setFilter,
    penaltyScores,
    createTask,
    editTask,
    removeTask,
    completeTask,
  }
}
