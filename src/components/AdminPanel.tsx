import { useState } from 'react'
import { motion } from 'framer-motion'
import { DeletedTasksList } from './DeletedTasksList'
import { PenaltyHistory } from './PenaltyHistory'
import { AchievementsGrid } from './AchievementBadge'
import { PenaltyCompensationModal } from './PenaltyCompensationModal'
import type { Task, PenaltyHistoryEntry, Achievement } from '../types'

interface AdminPanelProps {
  allTasks: Task[]
  users: any[]
  currentUserId: string
  penaltyHistory: PenaltyHistoryEntry[]
  penaltyScores: any[]
  achievements: Achievement[]
  onRestoreTask: (id: string) => void
  onCompensatePenalty: (userId: string, points: number, amount: number) => void
  isLoading?: boolean
}

type Tab = 'deleted' | 'history' | 'achievements' | 'leaderboard'

export function AdminPanel({
  allTasks,
  users,
  currentUserId,
  penaltyHistory,
  penaltyScores,
  onRestoreTask,
  onCompensatePenalty,
  isLoading = false,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('leaderboard')
  const [compensationOpen, setCompensationOpen] = useState(false)
  const [selectedUserForCompensation, setSelectedUserForCompensation] = useState<string | null>(null)

  const currentUser = users.find((u) => u.id === currentUserId)
  const currentUserPenalty = penaltyScores.find((s) => s.id === currentUserId)?.points ?? 0

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'leaderboard', label: 'Tabla de posiciones', icon: '🏆' },
    { id: 'history', label: 'Historial', icon: '📊' },
    { id: 'achievements', label: 'Logros', icon: '⭐' },
    { id: 'deleted', label: 'Papelera', icon: '🗑️' },
  ]

  const handleCompensate = async (points: number, amount: number) => {
    if (selectedUserForCompensation) {
      onCompensatePenalty(selectedUserForCompensation, points, amount)
      setCompensationOpen(false)
      setSelectedUserForCompensation(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-neutral-900">
              Tabla de Posiciones
            </h3>
            <div className="space-y-3">
              {[...penaltyScores]
                .sort((a, b) => a.points - b.points)
                .map((score, index) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600">
                        {index + 1}
                      </div>
                      {score.photoURL ? (
                        <img
                          src={score.photoURL}
                          alt={score.name}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold">
                          {score.name[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">{score.name}</p>
                        <p className="text-xs text-neutral-500">
                          {score.id === currentUserId ? 'Tú' : 'Otro usuario'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          score.points === 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {score.points}
                      </p>
                      <p className="text-xs text-neutral-500">puntos</p>
                    </div>
                  </div>
                ))}
            </div>

            {penaltyScores.some((s) => s.id === currentUserId) && (
              <button
                onClick={() => {
                  setSelectedUserForCompensation(currentUserId)
                  setCompensationOpen(true)
                }}
                disabled={isLoading || currentUserPenalty === 0}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                💰 Compensar mis penalidades
              </button>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-neutral-900">
              Historial de Penalidades
            </h3>
            <PenaltyHistory
              history={penaltyHistory}
              userName={currentUser?.name ?? 'Desconocido'}
            />
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-neutral-900">
              Logros Desbloqueados
            </h3>achievements
            <AchievementsGrid achievements={[]} />
          </div>
        )}

        {activeTab === 'deleted' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-neutral-900">
              Papelera ({allTasks.filter((t) => t.deleted).length})
            </h3>
            <DeletedTasksList
              tasks={allTasks}
              users={users}
              onRestore={onRestoreTask}
              isLoading={isLoading}
            />
          </div>
        )}
      </motion.div>

      <PenaltyCompensationModal
        open={compensationOpen}
        currentPenalty={currentUserPenalty}
        userName={currentUser?.name ?? 'Tú'}
        onCompensate={handleCompensate}
        onCancel={() => setCompensationOpen(false)}
        isLoading={isLoading}
      />
    </div>
  )
}
