import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { app } from './config'
import type { Task, TaskFormData, PenaltyHistoryEntry } from '../types'

export const db = getFirestore(app)
const tasksCollection = collection(db, 'tasks')

function mapTask(id: string, data: Record<string, unknown>): Task {
  return {
    id,
    title: String(data.title ?? ''),
    description: String(data.description ?? ''),
    assignedTo: String(data.assignedTo ?? ''),
    createdBy: String(data.createdBy ?? ''),
    dueDate: String(data.dueDate ?? ''),
    completed: Boolean(data.completed),
    completedAt: data.completedAt ? String(data.completedAt) : null,
    penaltyPoints: Number(data.penaltyPoints ?? 1),
    deleted: Boolean(data.deleted),
    deletedAt: data.deletedAt ? String(data.deletedAt) : null,
  }
}

export async function addTask(data: TaskFormData, createdBy: string): Promise<void> {
  console.log("ADDING TASK:", data, createdBy);
  await addDoc(tasksCollection, {
    ...data,
    createdBy,
    completed: false,
    completedAt: null,
    deleted: false,
    deletedAt: null,
    createdAt: serverTimestamp(),
  })
}

export async function updateTask(id: string, data: Partial<TaskFormData>): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), data)
}

export async function toggleTaskComplete(id: string, completed: boolean): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), {
    completed,
    completedAt: completed ? new Date().toISOString() : null,
  })
}

export async function deleteTask(id: string): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), {
    deleted: true,
    deletedAt: new Date().toISOString(),
  })
}

export async function restoreTask(id: string): Promise<void> {
  await updateDoc(doc(db, 'tasks', id), {
    deleted: false,
    deletedAt: null,
  })
}

export function subscribeTasks(callback: (tasks: Task[]) => void): Unsubscribe {
  const q = query(tasksCollection, orderBy('dueDate', 'asc'))

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map((docSnap) => mapTask(docSnap.id, docSnap.data()))
    callback(tasks)
  })
}

// ===== PENALTY HISTORY =====
const penaltyHistoryCollection = collection(db, 'penaltyHistory')

export async function addPenaltyHistory(
  entry: Omit<PenaltyHistoryEntry, 'id'>,
): Promise<void> {
  await addDoc(penaltyHistoryCollection, {
    ...entry,
    createdAt: serverTimestamp(),
  })
}

export function subscribePenaltyHistory(
  userId: string,
  callback: (history: PenaltyHistoryEntry[]) => void,
): Unsubscribe {
  const q = query(
    penaltyHistoryCollection,
    orderBy('date', 'desc'),
  )

  return onSnapshot(q, (snapshot) => {
    const history = snapshot.docs
      .map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          userId: String(data.userId),
          reason: data.reason,
          points: Number(data.points),
          date: String(data.date),
          description: String(data.description),
          taskId: data.taskId ? String(data.taskId) : undefined,
          amountPaid: data.amountPaid ? Number(data.amountPaid) : undefined,
        } as PenaltyHistoryEntry
      })
      .filter((entry) => entry.userId === userId)
    
    callback(history)
  })
}
