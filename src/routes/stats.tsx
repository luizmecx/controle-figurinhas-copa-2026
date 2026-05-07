import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { ALL_CODES, SECTIONS } from "@/lib/stickers-data";
import { getEntry, useAlbum } from "@/lib/album-store";

export const Route = createFileRoute("/stats")({
  head: () => ({ meta: [{ title: "Estatísticas — COPA 2026" }] }),
  component: StatsPage,
});

function StatsPage() {
  const album = useAlbum();

  const stats = useMemo(() => {
    let owned = 0, missing = 0, dupKinds = 0, dupTotal = 0;
    for (const c of ALL_CODES) {
      const e = getEntry(album, c);
      if (e.isCollected) owned++;
      else missing++;
      if (e.duplicates > 0) { dupKinds++; dupTotal += e.duplicates; }
    }
    
    let completedTeams = 0;
    for (const s of SECTIONS) {
      if (s.kind === "team") {
        if (s.codes.every(c => getEntry(album, c).isCollected)) {
          completedTeams++;
        }
      }
    }

    return { owned, missing, dupKinds, dupTotal, completedTeams, total: ALL_CODES.length };
  }, [album]);

  const top = useMemo(() => {
    return SECTIONS
      .filter((s) => s.kind === "team")
      .map((s) => {
        const o = s.codes.filter((c) => getEntry(album, c).isCollected).length;
        return { name: s.name, code: s.id, owned: o, total: s.codes.length, pct: o / s.codes.length };
      })
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 3);
  }, [album]);

  const pct = stats.total ? stats.owned / stats.total : 0;

  return (
    <AppShell>
      <div
        className="flex-1 flex flex-col"
        style={{
          background:
            "linear-gradient(160deg, #064e2a 0%, #0a6d3a 35%, #b88a06 75%, #7a5d00 100%)",
        }}
      >
        <div className="px-4 pt-6 pb-4 text-white">
          <div className="text-[10px] tracking-[0.22em] font-bold text-white/80">
            ESTATÍSTICAS
          </div>
          <div className="modular-display text-3xl text-stroke-shadow">SEU ÁLBUM</div>
        </div>

        <div className="px-4 pb-6 space-y-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4">
            <RingChart pct={pct} />
            <div className="flex-1 text-white">
              <div className="text-xs uppercase tracking-wider opacity-85 font-bold">
                Progresso geral
              </div>
              <div className="modular-display text-3xl">{(pct * 100).toFixed(1)}%</div>
              <div className="text-xs opacity-90 mt-1">
                {stats.owned} de {stats.total} figurinhas
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Coladas" value={stats.owned} cls="bg-[#00C671] text-white" />
            <StatCard label="Faltantes" value={stats.missing} cls="bg-yellow-400 text-neutral-900" />
            <StatCard label="Seleções completas" value={stats.completedTeams} cls="bg-blue-700 text-white" />
            <StatCard label="Repetidas (total)" value={stats.dupTotal} cls="bg-rose-600 text-white" />
          </div>

          <div className="bg-white/95 rounded-2xl p-4 border border-white/30 shadow">
            <div className="font-display font-black text-sm mb-3">🏆 Top 3 Seleções</div>
            <div className="space-y-3">
              {top.map((t, i) => (
                <div key={t.code} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 grid place-items-center font-display font-black text-neutral-900 text-xs shadow">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="font-display font-bold truncate">{t.name}</span>
                      <span className="text-muted-foreground">{t.owned}/{t.total}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-[#00C671]" style={{ width: `${t.pct * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/95 rounded-2xl p-4 border border-white/30 shadow">
            <div className="font-display font-black text-sm mb-3">Progresso por seção</div>
            <div className="space-y-2 max-h-80 overflow-auto pr-1">
              {SECTIONS.map((s) => {
                const o = s.codes.filter((c) => getEntry(album, c).isCollected).length;
                const p = (o / s.codes.length) * 100;
                return (
                  <div key={s.id}>
                    <div className="flex justify-between text-[11px] font-medium mb-1">
                      <span className="font-display font-bold truncate">{s.name}</span>
                      <span className="text-muted-foreground">{o}/{s.codes.length}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-[#00C671]" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <div className={`rounded-xl p-4 shadow ${cls}`}>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-90">{label}</div>
      <div className="modular-display text-3xl mt-1">{value}</div>
    </div>
  );
}

function RingChart({ pct }: { pct: number }) {
  const size = 96, stroke = 10, r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.25)" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke="#00C671" strokeWidth={stroke} fill="none" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center modular-display text-white text-lg">
        {Math.round(pct * 100)}%
      </div>
    </div>
  );
}
