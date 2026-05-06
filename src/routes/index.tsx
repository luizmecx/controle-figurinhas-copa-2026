import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { SectionAccordion } from "@/components/SectionAccordion";
import { ALL_CODES, SECTIONS } from "@/lib/stickers-data";
import { getStatus, useAlbum } from "@/lib/album-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "COPA 2026 — Controle de Figurinhas" },
      { name: "description", content: "Tabela de controle de figurinhas da Copa do Mundo FIFA 2026." },
    ],
  }),
  component: Index,
});

type Filter = "all" | "missing" | "duplicates";

function Index() {
  const album = useAlbum();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const owned = useMemo(
    () => ALL_CODES.filter((c) => getStatus(album, c) >= 1).length,
    [album],
  );

  const filterCodes = useMemo(() => {
    const q = query.trim().toUpperCase();
    const set = new Set<string>();
    for (const code of ALL_CODES) {
      const s = getStatus(album, code);
      if (filter === "missing" && s !== 0) continue;
      if (filter === "duplicates" && s !== 2) continue;
      if (q && !code.includes(q)) continue;
      set.add(code);
    }
    return set;
  }, [album, filter, query]);

  const filterPills: { id: Filter; label: string; cls: string }[] = [
    { id: "all", label: "Todas", cls: "bg-cup-blue text-white" },
    { id: "missing", label: "Faltantes", cls: "bg-cup-gold text-foreground" },
    { id: "duplicates", label: "Repetidas", cls: "bg-cup-red text-white" },
  ];

  return (
    <AppShell>
      <AppHeader query={query} onQuery={setQuery} owned={owned} total={ALL_CODES.length} />

      <div className="px-4 py-3 flex gap-2 overflow-x-auto bg-background sticky top-0">
        {filterPills.map((p) => (
          <button
            key={p.id}
            onClick={() => setFilter(p.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-display font-bold whitespace-nowrap transition-all ${
              filter === p.id
                ? `${p.cls} shadow-md scale-105`
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="px-3 pb-6 space-y-3">
        {SECTIONS.map((s, i) => (
          <SectionAccordion
            key={s.id}
            section={s}
            album={album}
            defaultOpen={i === 0}
            filterCodes={query || filter !== "all" ? filterCodes : undefined}
          />
        ))}
      </div>
    </AppShell>
  );
}
