import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { ALL_CODES, SECTIONS } from "@/lib/stickers-data";
import { getEntry, useAlbum } from "@/lib/album-store";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Estatísticas — COPA 2026" }] }),
  component: StatsPage,
});

function Donut({ pct }: { pct: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative w-40 h-40">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="rgba(255,255,255,0.1)" strokeWidth="14" fill="none" />
        <circle
          cx="70"
          cy="70"
          r={r}
          stroke="#00C671"
          strokeWidth="14"
          fill="none"
          strokeDasharray={`${dash} ${c - dash}`}
          strokeLinecap="round"
          className="transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="modular-display text-4xl text-white">{pct.toFixed(0)}%</div>
        <div className="text-[10px] tracking-widest text-white/60 mt-1">DO ÁLBUM</div>
      </div>
    </div>
  );
}

function StatsPage() {
  const album = useAlbum();

  const data = useMemo(() => {
    let owned = 0, dupTotal = 0;
    for (const c of ALL_CODES) {
      const e = getEntry(album, c);
      if (e.isCollected) owned++;
      dupTotal += e.duplicates;
    }
    const sectionStats = SECTIONS.map((s) => {
      const o = s.codes.filter((c) => getEntry(album, c).isCollected).length;
      return { ...s, owned: o, total: s.codes.length, pct: (o / s.codes.length) * 100 };
    });
    const top = [...sectionStats]
      .filter((s) => s.owned < s.total)
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
    return {
      owned,
      total: ALL_CODES.length,
      pct: (owned / ALL_CODES.length) * 100,
      dupTotal,
      top,
      sectionStats,
    };
  }, [album]);

  return (
    <AppShell>
      <div className="bg-amplify text-white px-4 pt-6 pb-5 relative">
        <div className="absolute inset-0 bg-cup-bg/70" />
        <div className="relative">
          <div className="text-[10px] tracking-[0.2em] font-bold text-white/80">
            ESTATÍSTICAS
          </div>
          <div className="modular-display text-3xl text-stroke-shadow">SEU ÁLBUM</div>
        </div>
      </div>

      <div className="bg-unify flex-1 px-4 py-4 space-y-3">
        {/* Card 1: Visão Geral */}
        <div className="rounded-2xl p-5 bg-white/5 border border-white/10 backdrop-blur flex items-center gap-4">
          <Donut pct={data.pct} />
          <div className="flex-1 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-white/60">Visão Geral</div>
            <div className="text-2xl font-display font-black text-white leading-tight">
              {data.owned}<span className="text-white/50 text-base">/{data.total}</span>
            </div>
            <div className="text-xs text-white/70">figurinhas únicas coladas</div>
          </div>
        </div>

        {/* Card 2: Top Países */}
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-white/60 mb-3">
            Top — mais próximas de completar
          </div>
          {data.top.length === 0 ? (
            <div className="text-sm text-white/60">Tudo completo! 🏆</div>
          ) : (
            <div className="space-y-3">
              {data.top.map((s, i) => (
                <div key={s.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-display font-bold text-white">
                      {i + 1}. {s.name}
                    </span>
                    <span className="text-white/70">{s.owned}/{s.total}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cup-green transition-all" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 3: Inventário */}
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-white/60 mb-3">
            Inventário
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-cup-green/15 border border-cup-green/30 p-3">
              <div className="text-[10px] font-bold text-cup-green uppercase">Únicas coladas</div>
              <div className="modular-display text-3xl text-white mt-1">{data.owned}</div>
            </div>
            <div className="rounded-xl bg-cup-gold/15 border border-cup-gold/30 p-3">
              <div className="text-[10px] font-bold text-cup-gold uppercase">Repetidas (carteira)</div>
              <div className="modular-display text-3xl text-white mt-1">{data.dupTotal}</div>
            </div>
          </div>
        </div>

        {/* Per-section detail */}
        <div className="rounded-2xl p-4 bg-white/5 border border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-white/60 mb-3">
            Progresso por seção
          </div>
          <div className="space-y-2">
            {data.sectionStats.map((s) => (
              <div key={s.id}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-display font-bold text-white">{s.name}</span>
                  <span className="text-white/60">{s.owned}/{s.total}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-cup-green" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
