import { LoginPage } from './pages/LoginPage'
import { Dashboard } from './pages/Dashboard'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, loading, accessDenied, signIn, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  // ✅ MANEJAR ACCESO DENEGADO
  if (accessDenied) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-500">
          No tienes acceso a esta app
        </p>
        <button
          onClick={signIn}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white"
        >
          Intentar con otra cuenta
        </button>
      </div>
    )
  }

  // ✅ SOLO SI NO HAY USER Y NO HAY ERROR
  if (!user) {
    return (
      <LoginPage
        onLogin={signIn}
        loading={false} // 👈 importante: ya no estás cargando aquí
        accessDenied={false}
      />
    )
  }

  return <Dashboard user={user} onLogout={signOut} />
}