import { collection, onSnapshot, setDoc, doc } from 'firebase/firestore'
import { db } from './firestore'
import type { AppUser } from '../types'

export interface StoredUser {
  id: string
  name: string
  email: string
  photoURL: string | null
}

export async function upsertUser(user: AppUser): Promise<void> {
  if (!user?.id || !user.email) {
    console.error("Invalid user:", user)
    return
  }

  await setDoc(
    doc(db, 'users', user.id), // ✅ FIX CLAVE
    {
      id: user.id, // ✅ mantienes uid en DB si quieres
      name: user.name ?? user.email.split('@')[0],
      email: user.email,
      photoURL: user.photoURL ?? null,
    },
    { merge: true },
  )
}


export function subscribeUsers(callback: (users: StoredUser[]) => void) {
  return onSnapshot(collection(db, 'users'), (snapshot) => {
    console.log("SNAPSHOT SIZE:", snapshot.size);

    const users = snapshot.docs.map((docSnap) => docSnap.data() as StoredUser);

    callback(users);
  });
}
