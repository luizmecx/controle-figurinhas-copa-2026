import { Search, Settings, X, Share2, RotateCcw, LogOut, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { ALL_CODES } from "@/lib/stickers-data";
import { getEntry, resetAlbum, useAlbum } from "@/lib/album-store";
import { signOut } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

type Filter = "all" | "missing" | "duplicates";

export function AppHeader({
  query,
  onQuery,
  owned,
  total,
  filter,
  onFilter,
}: {
  query: string;
  onQuery: (q: string) => void;
  owned: number;
  total: number;
  filter: Filter;
  onFilter: (f: Filter) => void;
}) {
  const pct = total ? (owned / total) * 100 : 0;

  const pills: { id: Filter; label: string }[] = [
    { id: "all", label: "Todas" },
    { id: "missing", label: "Faltantes" },
    { id: "duplicates", label: "Repetidas" },
  ];

  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
    <header className="sticky top-0 z-30 shadow-lg">
      <div 
        className="relative bg-cover bg-center"
        style={{ backgroundImage: 'url(https://www.seropedicaonline.com/wp-content/uploads/2022/06/2002-brazil-1200x800-1.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
        <div className="relative">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center border-2 border-white shrink-0 shadow-sm overflow-hidden">
              <img 
                src="https://s2-ge.glbimg.com/RGU5LEYpvpcPRro8r9wxAEvmltU=/0x0:2048x2048/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2023/q/Q/e3U1thRemgE9lEG0J4gQ/logo-fifa.jpg" 
                alt="2026 Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold tracking-[0.22em] text-white/85">
                FIFA WORLD CUP 26
              </div>
              <div className="modular-display text-2xl text-white text-stroke-shadow">
                COPA 2026
              </div>
            </div>
            <button onClick={() => setSettingsOpen(true)} className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white transition bg-black/20 rounded-full border border-white/20 active:scale-95">
              <Settings size={20} />
            </button>
          </div>

          <div className="px-4 pb-3">
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder="Buscar (ex: BRA, MEX, FWC1)"
                className="w-full bg-white/95 text-foreground placeholder:text-neutral-500 rounded-full pl-9 pr-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-yellow-300"
              />
            </div>

            <div className="bg-black/35 rounded-full h-3 overflow-hidden border border-white/25">
              <div
                className="h-full bg-[#00C671] transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] mt-1 font-medium text-white/95">
              <span>{owned} coladas</span>
              <span className="font-bold">{pct.toFixed(1)}%</span>
              <span>{total - owned} faltantes</span>
            </div>

            <div className="flex gap-2 mt-3">
              {pills.map((p) => {
                const active = filter === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => onFilter(p.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-display font-bold transition ${
                      active
                        ? "bg-white text-neutral-900 shadow"
                        : "bg-white/15 text-white border border-white/30"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
    <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}

function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const album = useAlbum();
  const [confirm, setConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const duplicatesList = useMemo(() => {
    return ALL_CODES
      .map((c) => ({ c, e: getEntry(album, c) }))
      .filter((x) => x.e.duplicates > 0)
      .map((x) => `${x.c} (x${x.e.duplicates})`);
  }, [album]);

  const share = async () => {
    const text =
      duplicatesList.length === 0
        ? "Ainda não tenho figurinhas repetidas 🙃"
        : `Minhas repetidas Copa 2026:\n${duplicatesList.join(", ")}`;
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {}
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 z-50 bg-background flex flex-col"
        >
          <div className="bg-white px-4 pt-6 pb-4 border-b border-neutral-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] tracking-[0.22em] font-bold text-neutral-500">
                CONFIGURAÇÕES
              </div>
              <div className="modular-display text-3xl text-neutral-900">AJUSTES</div>
            </div>
            <button onClick={onClose} className="p-2 text-neutral-500 active:scale-95 transition">
              <X size={28} />
            </button>
          </div>

          <div className="bg-neutral-50 p-4 space-y-3 flex-1 overflow-y-auto">
            <button
              onClick={share}
              className="w-full bg-[#00C671] text-white rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition"
            >
              {copied ? <Check /> : <Share2 />}
              <div className="text-left flex-1">
                <div>Compartilhar repetidas</div>
                <div className="text-xs font-normal opacity-90">
                  {duplicatesList.length} tipos disponíveis
                </div>
              </div>
            </button>

            {!confirm ? (
              <button
                onClick={() => setConfirm(true)}
                className="w-full bg-white border border-neutral-200 text-neutral-800 rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow-sm active:scale-[0.98] transition"
              >
                <RotateCcw />
                <span>Zerar álbum</span>
              </button>
            ) : (
              <div className="bg-white border-2 border-rose-500 rounded-xl p-4 space-y-3">
                <div className="text-sm font-bold">Tem certeza? Esta ação não pode ser desfeita.</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { resetAlbum(); setConfirm(false); }}
                    className="flex-1 bg-rose-600 text-white rounded-lg py-2 font-display font-bold"
                  >
                    Sim, zerar
                  </button>
                  <button
                    onClick={() => setConfirm(false)}
                    className="flex-1 bg-neutral-100 text-neutral-800 rounded-lg py-2 font-display font-bold"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="w-full bg-neutral-900 text-white rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition"
            >
              <LogOut />
              <span>Sair</span>
            </button>

            <div className="bg-white border border-neutral-200 rounded-xl p-4 text-xs text-neutral-600">
              <p className="font-bold text-neutral-900 mb-1">Como usar</p>
              <p>Toque na figurinha para marcar como <b className="text-[#00C671]">colada</b>.</p>
              <p>Use <b>−</b> / <b>+</b> abaixo para controlar suas <b className="text-rose-600">repetidas</b> na aba Todas.</p>
              <p>Toque novamente na figurinha para voltar a <b>faltante</b>.</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
