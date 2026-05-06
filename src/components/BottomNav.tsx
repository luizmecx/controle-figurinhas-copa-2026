import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, BarChart3, Settings } from "lucide-react";

const items = [
  { to: "/", label: "Álbum", icon: LayoutGrid },
  { to: "/stats", label: "Estatísticas", icon: BarChart3 },
  { to: "/settings", label: "Configurações", icon: Settings },
] as const;

export function BottomNav() {
  const loc = useLocation();
  return (
    <nav className="sticky bottom-0 z-40 bg-cup-bg/95 backdrop-blur border-t border-white/10">
      <div className="grid grid-cols-3">
        {items.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 py-2.5 font-display text-[11px] font-semibold transition-colors ${
                active ? "text-cup-green" : "text-white/60"
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
