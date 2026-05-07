import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, BarChart3, Settings } from "lucide-react";

const items = [
  { to: "/", label: "Álbum", icon: LayoutGrid },
  { to: "/stats", label: "Estatísticas", icon: BarChart3 },
] as const;

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="sticky bottom-6 z-40 mx-4 mb-6 bg-white/90 backdrop-blur-lg border border-neutral-200 rounded-2xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-2">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 py-2.5 font-display text-[11px] font-semibold transition-colors ${
                active ? "text-cup-green" : "text-muted-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
