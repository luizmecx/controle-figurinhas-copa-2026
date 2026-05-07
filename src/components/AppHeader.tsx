import { Search } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-30 shadow-lg">
      <div className="relative bg-gradient-to-r from-green-700 via-yellow-500 to-blue-700">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
        <div className="relative">
          <div className="px-4 pt-4 pb-2 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-black flex items-center justify-center border-2 border-white shrink-0">
              <span className="modular-display text-white text-lg leading-none">26</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold tracking-[0.22em] text-white/85">
                FIFA WORLD CUP 26
              </div>
              <div className="modular-display text-2xl text-white text-stroke-shadow">
                COPA 2026
              </div>
            </div>
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
  );
}
