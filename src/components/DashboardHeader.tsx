import type { AppUser, PenaltyScore } from '../types'
import { Scoreboard } from './Scoreboard'

interface DashboardHeaderProps {
  user: AppUser
  penaltyScores: PenaltyScore[]
  onLogout: () => void
}

export function DashboardHeader({ user, penaltyScores, onLogout }: DashboardHeaderProps) {
  const myPenalties = penaltyScores.find((score) => score.id === user.id)?.points ?? 0

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200/60 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name ?? 'Usuario'}
              className="h-10 w-10 rounded-full ring-2 ring-white shadow-md"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-600">
              {(user.name ?? user.email ?? '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-neutral-900">{user.name ?? 'Usuario'}</p>
            <p className="text-xs text-neutral-500">
              {myPenalties > 0 ? (
                <span className="text-red-600">{myPenalties} pts de penalidad</span>
              ) : (
                <span className="text-green-600">Sin penalidades 🎉</span>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
        >
          Salir
        </button>
      </div>

      <Scoreboard scores={penaltyScores} currentUserId={user.id} />
    </header>
  )
}
