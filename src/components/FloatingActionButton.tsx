import { motion } from 'framer-motion'

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl text-white shadow-xl shadow-indigo-300/40 transition-shadow hover:shadow-2xl hover:shadow-indigo-300/50 sm:bottom-8 sm:right-8"
      aria-label="Nueva tarea"
    >
      +
    </motion.button>
  )
}
