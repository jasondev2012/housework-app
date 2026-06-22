import { motion } from 'framer-motion'
import type { PenaltyScore } from '../types'

interface ScoreboardProps {
  scores: PenaltyScore[]
  currentUserId: string
}

export function Scoreboard({ scores, currentUserId }: ScoreboardProps) {
  if (scores.length === 0) return null

  const sorted = [...scores].sort((a, b) => b.points - a.points)
  const leader = sorted[0]?.points > 0 ? sorted[0] : null

  return (
    <div className="border-t border-neutral-100 bg-neutral-50/80 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
          Scoreboard de penalidades
        </p>
        <div className="flex flex-wrap gap-3">
          {sorted.map((score, index) => (
            <motion.div
              key={score.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
                score.id === currentUserId
                  ? 'border-indigo-200 bg-indigo-50'
                  : 'border-neutral-200 bg-white'
              }`}
            >
              {score.photoURL ? (
                <img src={score.photoURL} alt={score.name} className="h-6 w-6 rounded-full" />
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium">
                  {score.name[0]}
                </div>
              )}
              <span className="text-sm font-medium text-neutral-700">{score.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  score.points > 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {score.points} pts
              </span>
            </motion.div>
          ))}
        </div>
        {leader && leader.points > 0 && (
          <p className="text-xs text-neutral-500">
            {leader.id === currentUserId ? 'Tú' : leader.name} lleva más penalidades esta semana
          </p>
        )}
      </div>
    </div>
  )
}
