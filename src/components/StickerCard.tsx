import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import {
  toggleCollected,
  incDuplicate,
  decDuplicate,
  getEntry,
  type AlbumState,
} from "@/lib/album-store";

export function StickerCard({ code, album }: { code: string; album: AlbumState }) {
  const { isCollected, duplicates } = getEntry(album, code);

  return (
    <div className="flex flex-col gap-1 select-none">
      <motion.button
        type="button"
        onClick={() => toggleCollected(code)}
        whileTap={{ scale: 0.93 }}
        animate={isCollected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`relative aspect-square rounded-md sticker-paper flex items-center justify-center font-display font-black text-[0.78rem] sm:text-sm overflow-hidden ${
          isCollected
            ? "bg-cup-green text-white"
            : "bg-cup-paper text-cup-bg"
        }`}
      >
        <span className="break-all px-1 text-center leading-tight">{code}</span>
        <AnimatePresence>
          {isCollected && (
            <motion.div
              key="ok"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
            >
              <Check size={10} className="text-cup-green" strokeWidth={4} />
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
            transition={{ duration: 0.18 }}
            className={`flex items-center justify-between rounded-md px-1 py-0.5 text-[10px] font-bold ${
              duplicates > 0
                ? "bg-cup-gold text-cup-bg"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            <button
              type="button"
              onClick={() => decDuplicate(code)}
              className="w-5 h-5 flex items-center justify-center rounded active:scale-90 disabled:opacity-40"
              disabled={duplicates === 0}
              aria-label="Remover repetida"
            >
              <Minus size={12} strokeWidth={3} />
            </button>
            <span className="modular-display text-sm tabular-nums">{duplicates}</span>
            <button
              type="button"
              onClick={() => incDuplicate(code)}
              className="w-5 h-5 flex items-center justify-center rounded active:scale-90"
              aria-label="Adicionar repetida"
            >
              <Plus size={12} strokeWidth={3} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
