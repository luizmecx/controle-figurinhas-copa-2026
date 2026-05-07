import { motion, AnimatePresence } from "framer-motion";
import { Check, Minus, Plus } from "lucide-react";
import {
  toggleCollected,
  incDuplicate,
  decDuplicate,
  getEntry,
  type AlbumState,
} from "@/lib/album-store";

export function StickerCard({ code, album, isDuplicatesView }: { code: string; album: AlbumState; isDuplicatesView?: boolean }) {
  const { isCollected, duplicates } = getEntry(album, code);

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
        onClick={() => toggleCollected(code)}
        whileTap={{ scale: 0.94 }}
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
            <div className="mt-1 flex items-center justify-between gap-1 bg-white border border-neutral-200 rounded-md px-1 py-0.5">
              <button
                onClick={() => decDuplicate(code)}
                disabled={duplicates === 0}
                className="w-5 h-5 flex items-center justify-center rounded text-neutral-700 disabled:opacity-30 active:scale-90"
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
                className="w-5 h-5 flex items-center justify-center rounded text-neutral-700 active:scale-90"
                aria-label="Adicionar"
              >
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
