import type { TaskFilter } from '../types'

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'mine', label: 'Mías' },
  { value: 'completed', label: 'Completadas' },
]

interface TaskFilterTabsProps {
  active: TaskFilter
  onChange: (filter: TaskFilter) => void
  counts: Record<TaskFilter, number>
}

export function TaskFilterTabs({ active, onChange, counts }: TaskFilterTabsProps) {
  return (
    <div className="flex gap-1 rounded-xl bg-neutral-100/80 p-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onChange(filter.value)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            active === filter.value
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          {filter.label}
          <span className="ml-1.5 text-xs text-neutral-400">({counts[filter.value]})</span>
        </button>
      ))}
    </div>
  )
}
