import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PenaltyCompensationModalProps {
  open: boolean
  currentPenalty: number
  userName: string
  onCompensate: (pointsToReduce: number, amountPaid: number) => void | Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function PenaltyCompensationModal({
  open,
  currentPenalty,
  userName,
  onCompensate,
  onCancel,
  isLoading = false,
}: PenaltyCompensationModalProps) {
  const [pointsToReduce, setPointsToReduce] = useState(currentPenalty)
  const [amountPaid, setAmountPaid] = useState(0)

  const handleCompensate = () => {
    onCompensate(pointsToReduce, amountPaid)
    setPointsToReduce(currentPenalty)
    setAmountPaid(0)
  }

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
              <h3 className="text-lg font-semibold text-neutral-900">
                Compensar penalidades de {userName}
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Penalidades actuales: <span className="font-semibold">{currentPenalty} puntos</span>
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Puntos a descontar
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={currentPenalty}
                    value={pointsToReduce}
                    onChange={(e) => setPointsToReduce(Math.min(currentPenalty, Number(e.target.value)))}
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700">
                    Monto pagado ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.50"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>

                <div className="rounded-lg bg-indigo-50 p-3">
                  <p className="text-sm text-indigo-900">
                    Nuevos puntos: <span className="font-semibold">{currentPenalty - pointsToReduce}</span>
                  </p>
                </div>
              </div>

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
                  onClick={handleCompensate}
                  disabled={isLoading || pointsToReduce === 0}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? 'Guardando...' : 'Compensar'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
