import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ALL_CODES } from "@/lib/stickers-data";
import { getEntry, resetAlbum, useAlbum } from "@/lib/album-store";
import { signOut } from "@/lib/auth";
import { LogOut, RotateCcw, Share2, Check } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Configurações — COPA 2026" }] }),
  component: SettingsPage,
});

function SettingsPage() {
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
    <AppShell>
      <div className="bg-white px-4 pt-6 pb-4 border-b border-neutral-200">
        <div className="text-[10px] tracking-[0.22em] font-bold text-neutral-500">
          CONFIGURAÇÕES
        </div>
        <div className="modular-display text-3xl text-neutral-900">AJUSTES</div>
      </div>

      <div className="bg-neutral-50 p-4 space-y-3 flex-1">
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
          <p>Use <b>−</b> / <b>+</b> abaixo para controlar suas <b className="text-rose-600">repetidas</b>.</p>
          <p>Toque novamente na figurinha para voltar a <b>faltante</b>.</p>
        </div>
      </div>
    </AppShell>
  );
}
