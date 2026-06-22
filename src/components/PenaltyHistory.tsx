import { formatDate } from '../utils/penalties'
import type { PenaltyHistoryEntry } from '../types'

interface PenaltyHistoryProps {
  history: PenaltyHistoryEntry[]
  userName: string
}

export function PenaltyHistory({ history, userName }: PenaltyHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="text-sm text-neutral-500">
          Sin historial de penalidades para {userName}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {history.map((entry) => (
        <div
          key={entry.id}
          className={`rounded-lg p-3 text-sm ${
            entry.reason === 'overdue'
              ? 'border-l-4 border-red-400 bg-red-50'
              : 'border-l-4 border-green-400 bg-green-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-neutral-900">{entry.description}</p>
              <p className="text-xs text-neutral-600 mt-1">
                {formatDate(entry.date)}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  entry.reason === 'overdue'
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {entry.reason === 'overdue' ? '+' : '-'}{entry.points} pts
              </p>
              {entry.amountPaid && (
                <p className="text-xs text-neutral-600">
                  Pagado: ${entry.amountPaid.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
