import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ALL_CODES } from "@/lib/stickers-data";
import { getStatus, getDuplicates, resetAlbum, useAlbum } from "@/lib/album-store";
import { RotateCcw, Share2, Check } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Configurações — COPA 2026" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const album = useAlbum();
  const [confirm, setConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const duplicatesList = useMemo(() => {
    return ALL_CODES.filter((c) => getStatus(album, c) === 2).map(
      (c) => `${c} (x${getDuplicates(album, c)})`,
    );
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
      <div className="bg-amplify text-white px-4 pt-6 pb-5">
        <div className="text-[10px] tracking-[0.2em] font-bold text-white/80">
          CONFIGURAÇÕES
        </div>
        <div className="modular-display text-3xl text-stroke-shadow">AJUSTES</div>
      </div>

      <div className="p-4 space-y-3 flex-1">
        <button
          onClick={share}
          className="w-full bg-cup-green text-white rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition"
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
            className="w-full bg-secondary text-secondary-foreground rounded-xl p-4 flex items-center gap-3 font-display font-bold shadow active:scale-[0.98] transition"
          >
            <RotateCcw />
            <span>Zerar álbum</span>
          </button>
        ) : (
          <div className="bg-card border-2 border-cup-red rounded-xl p-4 space-y-3">
            <div className="text-sm font-bold">Tem certeza? Esta ação não pode ser desfeita.</div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  resetAlbum();
                  setConfirm(false);
                }}
                className="flex-1 bg-cup-red text-white rounded-lg py-2 font-display font-bold"
              >
                Sim, zerar
              </button>
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 bg-secondary text-secondary-foreground rounded-lg py-2 font-display font-bold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-4 text-xs text-muted-foreground">
          <p className="font-bold text-foreground mb-1">Como usar</p>
          <p>1 toque: marca como <b className="text-cup-green">tenho</b>.</p>
          <p>2 toques: marca como <b className="text-cup-red">repetida</b>.</p>
          <p>3 toques: volta para <b>faltante</b>.</p>
        </div>
      </div>
    </AppShell>
  );
}
