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

  const meta = section.meta;
  let gradient = "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)";
  if (meta) {
    gradient = `linear-gradient(135deg, ${meta.from} 0%, ${meta.to} 100%)`;
  } else if (section.kind === "coca") {
    gradient = "linear-gradient(135deg, #e31837 0%, #8b0000 100%)";
  } else if (section.kind === "special") {
    gradient = "linear-gradient(135deg, #ffcc00 0%, #d4a000 100%)";
  }

  const flagUrl = meta ? `https://flagcdn.com/w40/${meta.iso}.png` : null;

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm flex flex-col">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative w-full text-left"
        style={{ backgroundImage: gradient }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative px-3 py-3 flex items-center gap-3">
          {flagUrl ? (
            <img
              src={flagUrl}
              alt={`Bandeira ${meta?.name}`}
              className="w-8 h-6 object-cover rounded-sm border border-white/40 shadow shrink-0"
              loading="lazy"
            />
          ) : section.kind === "coca" ? (
            <img 
              src="https://logodownload.org/wp-content/uploads/2014/04/coca-cola-logo-2.png" 
              alt="Coca-Cola Logo" 
              className="w-8 h-6 object-contain rounded-sm border border-white/40 bg-white shadow shrink-0 p-0.5" 
            />
          ) : section.kind === "special" ? (
            <img 
              src="https://scontent.fsjk2-1.fna.fbcdn.net/v/t39.30808-6/621653819_10164317998444328_3181777124742335534_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=106&ccb=1-7&_nc_sid=25d718&_nc_ohc=0tNcpVhWEB8Q7kNvwGdI0sC&_nc_oc=AdrvB-xlZHPV-gx0-IX3CFWzafjDycHkCoOso1crBUcGbhdmFyh2ZnwNrKAakQ5JU3jzoY3688drh0cZewVOcsNh&_nc_zt=23&_nc_ht=scontent.fsjk2-1.fna&_nc_gid=lcsTzAbn8StKouKXGS3Ebw&_nc_ss=7b289&oh=00_Af6FjhPgzTrssNvqfzxm3pJKOT2lAFjxpeg1szm9_wwXLw&oe=6A01CF8B" 
              alt="Panini Logo" 
              className="w-8 h-6 object-cover rounded-sm border border-white/40 shadow shrink-0" 
            />
          ) : (
            <div className="w-8 h-6 rounded-sm bg-white/20 border border-white/40 grid place-items-center text-white text-[10px] font-bold">
              ★
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-display font-black text-white text-stroke-shadow text-base leading-tight tracking-tight truncate">
              {section.name}
            </div>
            <div className="text-[11px] text-white/95 mt-0.5 font-medium">
              {owned}/{total} coladas
            </div>
          </div>
          <div className="text-white font-display font-black text-xl text-stroke-shadow">
            {Math.round(pct)}%
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }}>
            <ChevronDown className="text-white" />
          </motion.div>
        </div>
        <div className="relative h-1.5 bg-black/25">
          <div
            className="h-full bg-[#00C671] transition-all"
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
            className="relative z-0 overflow-hidden"
          >
            <div className="p-3 grid grid-cols-4 sm:grid-cols-5 gap-2 bg-background">
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
