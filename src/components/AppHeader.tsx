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
    <header className="sticky top-0 z-40 bg-amplify text-white pb-3 shadow-lg">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center border-2 border-white shrink-0">
          <Trophy size={18} className="text-cup-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold tracking-[0.2em] text-white/80">
            FIFA WORLD CUP 26
          </div>
          <div className="modular-display text-2xl text-white text-stroke-shadow">
            COPA 2026
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="text-[11px] font-medium text-white/85 mb-2">
          Tabela de Controle de Figurinhas
        </div>

        <div className="relative mb-2">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Buscar (ex: BRA, MEX, FWC1)"
            className="w-full bg-white/95 text-foreground placeholder:text-muted-foreground rounded-full pl-9 pr-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-cup-gold"
          />
        </div>

        <div className="bg-black/35 rounded-full h-3 overflow-hidden border border-white/20">
          <div
            className="h-full bg-cup-green transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] mt-1 font-medium text-white/90">
          <span>{owned} coladas</span>
          <span className="font-bold">{pct.toFixed(1)}%</span>
          <span>{total - owned} faltantes</span>
        </div>
      </div>
    </header>
  );
}
