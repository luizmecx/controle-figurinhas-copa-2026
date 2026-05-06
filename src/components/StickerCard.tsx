import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { cycleSticker, getStatus, getDuplicates, type AlbumState } from "@/lib/album-store";

export function StickerCard({ code, album }: { code: string; album: AlbumState }) {
  const status = getStatus(album, code);
  const dup = getDuplicates(album, code);

  const base =
    "relative aspect-[3/4] rounded-lg overflow-hidden flex items-center justify-center font-bold text-sm select-none active:scale-95 transition-transform shadow-sm border";

  let cls = "";
  if (status === 0) cls = "bg-together-soft text-white text-stroke-shadow border-border";
  else if (status === 1) cls = "bg-cup-green text-white border-cup-green";
  else cls = "bg-cup-gold text-foreground border-cup-gold";

  return (
    <motion.button
      type="button"
      onClick={() => cycleSticker(code)}
      className={`${base} ${cls}`}
      whileTap={{ scale: 0.92 }}
      animate={
        status === 1
          ? { scale: [1, 1.08, 1] }
          : status === 2
          ? { rotate: [0, -4, 4, 0] }
          : { scale: 1 }
      }
      transition={{ duration: 0.35 }}
    >
      <span className="font-display tracking-tight text-[0.78rem] sm:text-sm break-all px-1 text-center">
        {code}
      </span>

      <AnimatePresence>
        {status === 1 && (
          <motion.div
            key="check"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="absolute top-1 right-1 bg-cup-gold rounded-full p-0.5 shadow"
          >
            <Trophy size={10} className="text-foreground" strokeWidth={3} />
          </motion.div>
        )}
        {status === 2 && (
          <motion.div
            key="dup"
            initial={{ scale: 0, y: -6 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-cup-red text-white text-[10px] font-black rounded-full px-1.5 py-0.5 shadow border-2 border-background"
          >
            +{dup}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
