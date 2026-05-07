import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { SectionAccordion } from "@/components/SectionAccordion";
import { ALL_CODES, SECTIONS, COUNTRIES } from "@/lib/stickers-data";
import { getEntry, useAlbum } from "@/lib/album-store";

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
    () => ALL_CODES.filter((c) => getEntry(album, c).isCollected).length,
    [album],
  );

  const totalDuplicates = useMemo(
    () => ALL_CODES.reduce((acc, c) => acc + getEntry(album, c).duplicates, 0),
    [album]
  );

  const filterCodes = useMemo(() => {
    const q = query.trim().toUpperCase();
    const set = new Set<string>();

    // Build a set of country prefixes whose code OR name matches the query.
    // e.g. "brasil" → matches BRA, "fra" → matches FRA.
    const matchedCountryCodes = new Set<string>(
      COUNTRIES
        .filter((c) =>
          c.code.includes(q) ||
          c.name.toUpperCase().includes(q)
        )
        .map((c) => c.code)
    );

    for (const code of ALL_CODES) {
      const e = getEntry(album, code);
      if (filter === "missing" && e.isCollected) continue;
      if (filter === "duplicates" && e.duplicates === 0) continue;

      if (q) {
        // 1. Direct sticker-code match (e.g. "BRA1", "FWC3")
        const directMatch = code.includes(q);
        // 2. Country-name / country-code section match
        const countryMatch = matchedCountryCodes.has(
          SECTIONS.find((s) => s.codes.includes(code))?.id ?? ""
        );
        if (!directMatch && !countryMatch) continue;
      }

      set.add(code);
    }
    return set;
  }, [album, filter, query]);

  return (
    <AppShell>
      <AppHeader
        query={query}
        onQuery={setQuery}
        owned={owned}
        total={ALL_CODES.length}
        totalDuplicates={totalDuplicates}
        filter={filter}
        onFilter={setFilter}
      />
      <div className="px-3 py-3 pb-6 space-y-3 flex flex-col">
        {SECTIONS.map((s, i) => (
          <SectionAccordion
            key={s.id}
            section={s}
            album={album}
            filterCodes={query || filter !== "all" ? filterCodes : undefined}
            isDuplicatesView={filter === "duplicates"}
          />
        ))}
      </div>
    </AppShell>
  );
}
