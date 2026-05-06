import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { ALL_CODES, SECTIONS } from "@/lib/stickers-data";
import { getStatus, getDuplicates, useAlbum } from "@/lib/album-store";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Estatísticas — COPA 2026" }] }),
  component: StatsPage,
});

function StatsPage() {
  const album = useAlbum();

  const stats = useMemo(() => {
    let owned = 0,
      missing = 0,
      dupKinds = 0,
      dupTotal = 0;
    for (const c of ALL_CODES) {
      const s = getStatus(album, c);
      if (s === 0) missing++;
      else owned++;
      if (s === 2) {
        dupKinds++;
        dupTotal += getDuplicates(album, c);
      }
    }
    return { owned, missing, dupKinds, dupTotal };
  }, [album]);

  return (
    <AppShell>
      <div className="bg-amplify text-white px-4 pt-6 pb-5">
        <div className="text-[10px] tracking-[0.2em] font-bold text-white/80">
          ESTATÍSTICAS
        </div>
        <div className="modular-display text-3xl text-stroke-shadow">SEU ÁLBUM</div>
      </div>

      <div className="bg-unify flex-1 px-4 py-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Coladas" value={stats.owned} cls="bg-cup-green text-white" />
          <StatCard label="Faltantes" value={stats.missing} cls="bg-cup-gold text-foreground" />
          <StatCard label="Tipos repetidos" value={stats.dupKinds} cls="bg-cup-red text-white" />
          <StatCard label="Repetidas (total)" value={stats.dupTotal} cls="bg-cup-blue text-white" />
        </div>

        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="font-display font-bold text-sm mb-3">Progresso por seção</div>
          <div className="space-y-2">
            {SECTIONS.map((s) => {
              const o = s.codes.filter((c) => getStatus(album, c) >= 1).length;
              const pct = (o / s.codes.length) * 100;
              return (
                <div key={s.id}>
                  <div className="flex justify-between text-[11px] font-medium mb-1">
                    <span className="font-display font-bold">{s.name}</span>
                    <span className="text-muted-foreground">
                      {o}/{s.codes.length}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cup-green transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className={`rounded-xl p-4 shadow ${cls}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">
        {label}
      </div>
      <div className="modular-display text-3xl mt-1">{value}</div>
    </div>
  );
}
