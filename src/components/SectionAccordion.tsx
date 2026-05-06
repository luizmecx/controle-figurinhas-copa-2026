import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { StickerCard } from "./StickerCard";
import type { Section } from "@/lib/stickers-data";
import { getEntry, type AlbumState } from "@/lib/album-store";

export function SectionAccordion({
  section,
  album,
  defaultOpen = false,
  filterCodes,
}: {
  section: Section;
  album: AlbumState;
  defaultOpen?: boolean;
  filterCodes?: Set<string>;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const codes = filterCodes
    ? section.codes.filter((c) => filterCodes.has(c))
    : section.codes;
  if (codes.length === 0) return null;

  const owned = section.codes.filter((c) => getEntry(album, c).isCollected).length;
  const total = section.codes.length;
  const pct = (owned / total) * 100;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white shadow-lg">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left sticky top-[56px] z-20"
      >
        <div className="bg-26 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-display font-black text-white text-stroke-shadow text-lg leading-none tracking-tight">
              {section.name}
            </div>
            <div className="text-[11px] text-white/95 mt-1 font-medium">
              {owned}/{total} coladas
            </div>
          </div>
          <div className="text-white font-display font-black text-2xl text-stroke-shadow">
            {Math.round(pct)}%
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown className="text-white" />
          </motion.div>
        </div>
        <div className="h-1.5 bg-black/30">
          <div
            className="h-full bg-cup-green transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-cup-paper"
          >
            <div className="p-3 grid grid-cols-4 sm:grid-cols-5 gap-2">
              {codes.map((code) => (
                <StickerCard key={code} code={code} album={album} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
