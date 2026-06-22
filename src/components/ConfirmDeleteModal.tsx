import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmDeleteModalProps {
  open: boolean
  title: string
  description: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function ConfirmDeleteModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-40 bg-black/20"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4v2m0 4v2m0-10a9 9 0 110-18 9 9 0 010 18z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{description}</p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
