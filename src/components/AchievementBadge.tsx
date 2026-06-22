import { motion } from 'framer-motion'
import type { Achievement } from '../types'

interface AchievementBadgeProps {
  achievement: Achievement
  index: number
}

const achievementIcons: Record<string, string> = {
  'on-time': '⏰',
  'streak-7': '🔥',
  'perfect-week': '⭐',
  'super-star': '✨',
  'teamwork': '🤝',
  'early-bird': '🌅',
  'night-owl': '🌙',
  'speedster': '🚀',
}

export function AchievementBadge({ achievement, index }: AchievementBadgeProps) {
  const isUnlocked = achievement.unlockedAt !== null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={`text-center p-4 rounded-lg border transition-all ${
        isUnlocked
          ? 'border-amber-200 bg-amber-50'
          : 'border-neutral-200 bg-neutral-50 opacity-50'
      }`}
    >
      <div className="text-3xl mb-2">
        {achievementIcons[achievement.id] || '🏆'}
      </div>
      <h4 className="font-semibold text-sm text-neutral-900">{achievement.name}</h4>
      <p className="text-xs text-neutral-600 mt-1">{achievement.description}</p>
    </motion.div>
  )
}

interface AchievementsGridProps {
  achievements: Achievement[]
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  if (achievements.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-center">
        <p className="text-sm text-neutral-500">
          Sin logros desbloqueados aún
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {achievements.map((achievement, idx) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          index={idx}
        />
      ))}
    </div>
  )
}
