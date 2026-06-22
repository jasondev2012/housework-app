import { useEffect, useState } from 'react'
import { loginWithGoogle, logout, subscribeAuth, auth } from '../firebase/auth'
import { getRedirectResult } from 'firebase/auth'
import { upsertUser } from '../firebase/users'
import { isAllowedEmail } from '../utils/allowedUsers'
import type { AppUser } from '../types'

interface AuthState {
  user: AppUser | null
  loading: boolean
  accessDenied: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    accessDenied: false,
  })

  useEffect(() => {
    const initAuth = async () => {
      try {
        // ✅ CLAVE PARA signInWithRedirect
        const result = await getRedirectResult(auth)

        if (result?.user) {
          console.log("REDIRECT USER:", result.user)
        }
      } catch (error) {
        console.error("Redirect error:", error)
      }
    }

    initAuth()

    const unsubscribe = subscribeAuth(async (user: AppUser | null) => {
      console.log("AUTH STATE CHANGED:", user)
    
      if (!user) {
        setState({ user: null, loading: false, accessDenied: false })
        return
      }
    
      if (!user.email || !isAllowedEmail(user.email)) {
        await logout()
        setState({ user: null, loading: false, accessDenied: true })
        return
      }
    
      
      try {
        await upsertUser(user)
      } catch (error) {
        console.error("Firestore error:", error)
      } finally {
        setState({ user, loading: false, accessDenied: false })
      }

    
      // ✅ SIEMPRE liberar loading
      setState({ user, loading: false, accessDenied: false })
    })

    return unsubscribe
  }, [])

  const signIn = async () => {
    setState((prev) => ({ ...prev, loading: true, accessDenied: false }))

    try {
      await loginWithGoogle()
      // ⚠️ NO hacer nada más (redirect)
    } catch (error) {
      console.error('Login error:', error)

      setState((prev) => ({
        ...prev,
        loading: false,
      }))
    }
  }

  const signOut = async () => {
    await logout()
    setState({ user: null, loading: false, accessDenied: false })
  }

  return {
    user: state.user,
    loading: state.loading,
    accessDenied: state.accessDenied,
    signIn,
    signOut,
  }
}