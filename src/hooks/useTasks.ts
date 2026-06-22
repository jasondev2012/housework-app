import { useEffect, useMemo, useState } from 'react'
import {
  addTask,
  deleteTask,
  subscribeTasks,
  toggleTaskComplete,
  updateTask,
  restoreTask,
  addPenaltyHistory,
  subscribePenaltyHistory,
} from '../firebase/firestore'
import { subscribeUsers, type StoredUser } from '../firebase/users'
import { calculatePenaltiesByUser, isTaskOverdue, calculateAchievements } from '../utils/penalties'
import type { PenaltyScore, Task, TaskFilter, TaskFormData, PenaltyHistoryEntry, Achievement } from '../types'

export function useTasks(currentUserId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<StoredUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [penaltyHistory, setPenaltyHistory] = useState<PenaltyHistoryEntry[]>([])

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

  // ✅ PENALTY HISTORY
  useEffect(() => {
    if (!currentUserId) {
      setPenaltyHistory([])
      return
    }

    const unsubscribeHistory = subscribePenaltyHistory(currentUserId, (history) => {
      setPenaltyHistory(history)
    })

    return unsubscribeHistory
  }, [currentUserId])

  // ✅ FILTROS
  const filteredTasks = useMemo(() => {
    if (!currentUserId) return tasks.filter(t => !t.deleted)

    switch (filter) {
      case 'mine':
        return tasks.filter((task) => task.assignedTo === currentUserId && !task.deleted)
      case 'completed':
        return tasks.filter((task) => task.completed && !task.deleted)
      default:
        return tasks.filter(t => !t.deleted)
    }
  }, [tasks, filter, currentUserId])

  // ✅ PENALIDADES
  const penaltyScores = useMemo((): PenaltyScore[] => {
    const userIds = users.map((user) => user.id)
    const scores = calculatePenaltiesByUser(tasks, userIds, penaltyHistory)

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      photoURL: user.photoURL,
      points: scores[user.id] ?? 0,
    }))
  }, [tasks, users, penaltyHistory])

  // ✅ ACHIEVEMENTS
  const achievements = useMemo((): Achievement[] => {
    if (!currentUserId) return []
    return calculateAchievements(tasks, penaltyHistory, currentUserId)
  }, [tasks, penaltyHistory, currentUserId])

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
      
      // Agregar al historial si se marca como no completada una tarea atrasada con penalidad
      const task = tasks.find(t => t.id === id)
      if (task && !completed && isTaskOverdue(task) && task.penaltyPoints > 0) {
        await addPenaltyHistory({
          userId: task.assignedTo,
          reason: 'overdue',
          points: task.penaltyPoints,
          date: new Date().toISOString().split('T')[0],
          description: `Penalidad por tarea atrasada: "${task.title}"`,
          taskId: id,
        })
      }
    } catch (error) {
      console.error("Error completando tarea:", error)
    }
  }

  const restoreDeletedTask = async (id: string) => {
    try {
      await restoreTask(id)
    } catch (error) {
      console.error("Error restaurando tarea:", error)
    }
  }

  const compensatePenalty = async (
    userId: string,
    pointsToReduce: number,
    amountPaid: number,
  ) => {
    try {
      await addPenaltyHistory({
        userId,
        reason: 'compensation',
        points: pointsToReduce,
        date: new Date().toISOString().split('T')[0],
        description: `Compensación de penalidades pagadas`,
        amountPaid,
      })
    } catch (error) {
      console.error("Error compensando penalidades:", error)
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
    penaltyHistory,
    achievements,
    createTask,
    editTask,
    removeTask,
    completeTask,
    restoreDeletedTask,
    compensatePenalty,
  }
}
