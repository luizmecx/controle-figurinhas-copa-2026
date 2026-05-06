import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { ALL_CODES } from "@/lib/stickers-data";
import { getEntry, resetAlbum, useAlbum } from "@/lib/album-store";
import { logout } from "@/lib/auth";
import { RotateCcw, ArrowLeftRight, LogOut, X, Check, Copy } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Configurações — COPA 2026" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const album = useAlbum();
  const [confirm, setConfirm] = useState(false);
  const [showTrades, setShowTrades] = useState(false);
  const [copied, setCopied] = useState(false);

  const tradesText = useMemo(() => {
    const missing: string[] = [];
    const dups: string[] = [];
    for (const c of ALL_CODES) {
      const e = getEntry(album, c);
      if (!e.isCollected) missing.push(c);
      if (e.duplicates > 0) dups.push(`${c} (${e.duplicates}x)`);
    }
    const m = missing.length ? `Faltam: ${missing.join(", ")}` : "Faltam: —";
    const d = dups.length ? `Repetidas: ${dups.join(", ")}` : "Repetidas: —";
    return `${m}\n\n${d}`;
  }, [album]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(tradesText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <AppShell>
      <div className="bg-amplify text-white px-4 pt-6 pb-5 relative">
        <div className="absolute inset-0 bg-cup-bg/70" />
        <div className="relative">
          <div className="text-[10px] tracking-[0.2em] font-bold text-white/80">
            CONFIGURAÇÕES
          </div>
          <div className="modular-display text-3xl text-stroke-shadow">AJUSTES</div>
        </div>
      </div>

      <div className="p-4 space-y-3 flex-1">
        <button
          onClick={() => setShowTrades(true)}
          className="w-full bg-cup-green text-white rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition"
        >
          <ArrowLeftRight />
          <div className="text-left flex-1">
            <div>Gerar Lista de Trocas</div>
            <div className="text-xs font-normal opacity-90">
              Faltantes e repetidas em texto pronto
            </div>
          </div>
        </button>

        {!confirm ? (
          <button
            onClick={() => setConfirm(true)}
            className="w-full bg-white/10 text-white rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition border border-white/10"
          >
            <RotateCcw />
            <span>Zerar álbum</span>
          </button>
        ) : (
          <div className="bg-white/5 border-2 border-cup-red rounded-xl p-4 space-y-3">
            <div className="text-sm font-bold text-white">Tem certeza? Esta ação não pode ser desfeita.</div>
            <div className="flex gap-2">
              <button
                onClick={() => { resetAlbum(); setConfirm(false); }}
                className="flex-1 bg-cup-red text-white rounded-lg py-2 font-display font-bold"
              >
                Sim, zerar
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 bg-white/10 text-white rounded-lg py-2 font-display font-bold border border-white/10"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => logout()}
          className="w-full bg-cup-red/90 text-white rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition"
        >
          <LogOut />
          <span>Sair</span>
        </button>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/70">
          <p className="font-bold text-white mb-1">Como usar</p>
          <p>Toque na figurinha para marcar como <b className="text-cup-green">colada</b>.</p>
          <p>Use os botões <b>−</b> e <b>+</b> abaixo para somar repetidas.</p>
        </div>
      </div>

      <AnimatePresence>
        {showTrades && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowTrades(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-cup-bg border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="font-display font-black text-white">Lista de Trocas</div>
                <button
                  onClick={() => setShowTrades(false)}
                  className="text-white/70 hover:text-white"
                  aria-label="Fechar"
                >
                  <X size={20} />
                </button>
              </div>

              <pre className="px-4 py-3 max-h-[55vh] overflow-auto text-xs text-white/90 whitespace-pre-wrap font-mono">
{tradesText}
              </pre>

              <div className="p-3 border-t border-white/10">
                <button
                  onClick={copy}
                  className="w-full bg-cup-green text-white rounded-xl py-3 flex items-center justify-center gap-2 font-display font-bold active:scale-[0.98] transition"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? "Copiado!" : "Copiar para Área de Transferência"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
