import { Search, Trophy } from "lucide-react";

export function AppHeader({
  query,
  onQuery,
  owned,
  total,
}: {
  query: string;
  onQuery: (q: string) => void;
  owned: number;
  total: number;
}) {
  const pct = total ? (owned / total) * 100 : 0;
  return (
    <header className="sticky top-0 z-40 text-white shadow-lg">
      {/* Layered background: pattern + dark overlay + blur */}
      <div className="relative bg-amplify">
        <div className="absolute inset-0 bg-cup-bg/70 backdrop-blur-md" />
        <div className="relative pb-3">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cup-bg flex items-center justify-center border-2 border-white/30 shrink-0">
              <Trophy size={18} className="text-cup-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold tracking-[0.2em] text-white/85">
                FIFA WORLD CUP 26
              </div>
              <div className="modular-display text-2xl text-white text-stroke-shadow">
                COPA 2026
              </div>
            </div>
          </div>

          <div className="px-4">
            <div className="relative mb-2">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-cup-bg/60"
              />
              <input
                value={query}
                onChange={(e) => onQuery(e.target.value)}
                placeholder="Buscar (ex: BRA, MEX, FWC1)"
                className="w-full bg-white text-cup-bg placeholder:text-cup-bg/50 rounded-full pl-9 pr-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-cup-gold"
              />
            </div>

            <div className="bg-black/50 rounded-full h-3 overflow-hidden border border-white/25">
              <div
                className="h-full bg-cup-green transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] mt-1 font-medium text-white">
              <span>{owned} coladas</span>
              <span className="font-bold">{pct.toFixed(1)}%</span>
              <span>{total - owned} faltantes</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
