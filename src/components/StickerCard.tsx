import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus, Trash2, AlertTriangle } from "lucide-react";
import {
  toggleCollected,
  incDuplicate,
  decDuplicate,
} from "@/lib/album-store";

export const StickerCard = memo(function StickerCard({ 
  code, 
  isCollected, 
  duplicates, 
  isDuplicatesView 
}: { 
  code: string; 
  isCollected: boolean; 
  duplicates: number; 
  isDuplicatesView?: boolean; 
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (isDuplicatesView) {
    return (
      <div className="flex flex-col">
        <div className="relative aspect-[3/4] rounded-md shadow-sm flex items-center justify-center font-bold text-sm select-none border overflow-hidden bg-[#00C671] text-white border-[#00C671]">
          <span className="font-display tracking-tight text-[0.78rem] sm:text-sm break-all px-1 text-center">
            {code}
          </span>
          <div className="absolute top-1 right-1 bg-white text-[#e11d48] rounded-full min-w-[16px] h-[16px] flex items-center justify-center text-[10px] px-1 font-bold shadow">
            +{duplicates}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <motion.button
        type="button"
        onClick={() => {
          if (!isCollected) toggleCollected(code);
        }}
        whileTap={!isCollected ? { scale: 0.94 } : {}}
        animate={isCollected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative aspect-[3/4] rounded-md shadow-sm flex items-center justify-center font-bold text-sm select-none border overflow-hidden ${
          isCollected
            ? "bg-[#00C671] text-white border-[#00C671]"
            : "bg-[#f3f4f6] text-neutral-700 border-neutral-200"
        }`}
      >
        <span className="font-display tracking-tight text-[0.78rem] sm:text-sm break-all px-1 text-center">
          {code}
        </span>
        
        <AnimatePresence>
          {isCollected && (
            <motion.div
              key="trash-btn"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-1 left-1 z-10"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(true);
                }}
                className="bg-white rounded-sm p-1 shadow-sm active:scale-90 transition border border-neutral-200/50"
              >
                <Trash2 size={12} className="text-rose-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isCollected && (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
            >
              <Check size={10} className="text-[#00C671]" strokeWidth={4} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence initial={false}>
        {isCollected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-1.5 flex flex-col items-center bg-white border border-neutral-200 rounded-lg p-1 shadow-sm">
              <span className="text-[8px] font-bold tracking-[0.1em] text-neutral-400 uppercase mb-0.5">
                Repetidas
              </span>
              <div className="flex items-center justify-between w-full px-0.5">
                <button
                  onClick={() => decDuplicate(code)}
                  disabled={duplicates === 0}
                  className="w-5 h-5 flex items-center justify-center rounded bg-neutral-100 text-neutral-600 disabled:opacity-30 active:scale-90 transition"
                  aria-label="Diminuir"
                >
                  <Minus size={12} strokeWidth={3} />
                </button>
                <span
                  className={`font-display font-black text-xs tabular-nums ${
                    duplicates > 0 ? "text-[#e11d48]" : "text-neutral-400"
                  }`}
                >
                  {duplicates}
                </span>
                <button
                  onClick={() => incDuplicate(code)}
                  className="w-5 h-5 flex items-center justify-center rounded bg-neutral-100 text-neutral-600 active:scale-90 transition"
                  aria-label="Adicionar"
                >
                  <Plus size={12} strokeWidth={3} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl p-6 max-w-[280px] w-full text-center flex flex-col items-center border border-white/20"
            >
              <div className="w-14 h-14 bg-rose-100 rounded-full flex items-center justify-center mb-4 shadow-sm border border-rose-200">
                <Trash2 className="text-rose-500" size={26} />
              </div>
              <h3 className="font-display font-black text-neutral-900 text-xl mb-1 tracking-tight text-stroke-shadow-sm">Desmarcar?</h3>
              <p className="text-sm text-neutral-600 mb-6 font-medium">
                Deseja remover a figurinha <br/><b className="text-lg text-neutral-900">{code}</b> da sua coleção?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-bold bg-neutral-100 text-neutral-700 active:scale-95 transition shadow-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    toggleCollected(code);
                    setShowConfirm(false);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold bg-rose-500 text-white shadow-md shadow-rose-500/25 active:scale-95 transition"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
