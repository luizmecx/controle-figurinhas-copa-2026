export type CountryMeta = {
  code: string;       // FIFA code (BRA, MEX...)
  name: string;       // full name (PT)
  iso: string;        // flagcdn slug
  from: string;       // gradient start (hex)
  to: string;         // gradient end (hex)
};

export const COUNTRIES: CountryMeta[] = [
  { code: "MEX", name: "México",       iso: "mx",     from: "#006847", to: "#ce1126" },
  { code: "RSA", name: "África do Sul",iso: "za",     from: "#007a4d", to: "#ffb612" },
  { code: "KOR", name: "Coreia do Sul",iso: "kr",     from: "#003478", to: "#c60c30" },
  { code: "CZE", name: "República Tcheca", iso: "cz", from: "#11457e", to: "#d7141a" },
  { code: "CAN", name: "Canadá",       iso: "ca",     from: "#ff0000", to: "#b30000" },
  { code: "BIH", name: "Bósnia",       iso: "ba",     from: "#002395", to: "#fecb00" },
  { code: "QAT", name: "Catar",        iso: "qa",     from: "#8a1538", to: "#5a0d24" },
  { code: "SUI", name: "Suíça",        iso: "ch",     from: "#d52b1e", to: "#a01b14" },
  { code: "BRA", name: "Brasil",       iso: "br",     from: "#009c3b", to: "#ffdf00" },
  { code: "MAR", name: "Marrocos",     iso: "ma",     from: "#c1272d", to: "#006233" },
  { code: "HAI", name: "Haiti",        iso: "ht",     from: "#00209f", to: "#d21034" },
  { code: "SCO", name: "Escócia",      iso: "gb-sct", from: "#005eb8", to: "#0a3a72" },
  { code: "USA", name: "Estados Unidos", iso: "us",   from: "#3c3b6e", to: "#b22234" },
  { code: "PAR", name: "Paraguai",     iso: "py",     from: "#d52b1e", to: "#0038a8" },
  { code: "AUS", name: "Austrália",    iso: "au",     from: "#00008b", to: "#ff0000" },
  { code: "TUR", name: "Turquia",      iso: "tr",     from: "#e30a17", to: "#a00710" },
  { code: "GER", name: "Alemanha",     iso: "de",     from: "#000000", to: "#ffce00" },
  { code: "CUW", name: "Curaçao",      iso: "cw",     from: "#002b7f", to: "#f9e814" },
  { code: "CIV", name: "Costa do Marfim", iso: "ci",  from: "#ff8200", to: "#009e60" },
  { code: "ECU", name: "Equador",      iso: "ec",     from: "#ffd700", to: "#034ea2" },
  { code: "NED", name: "Holanda",      iso: "nl",     from: "#ae1c28", to: "#21468b" },
  { code: "JPN", name: "Japão",        iso: "jp",     from: "#bc002d", to: "#7a001d" },
  { code: "SWE", name: "Suécia",       iso: "se",     from: "#006aa7", to: "#fecc00" },
  { code: "TUN", name: "Tunísia",      iso: "tn",     from: "#e70013", to: "#a0000e" },
  { code: "BEL", name: "Bélgica",      iso: "be",     from: "#000000", to: "#ef3340" },
  { code: "EGY", name: "Egito",        iso: "eg",     from: "#ce1126", to: "#000000" },
  { code: "IRN", name: "Irã",          iso: "ir",     from: "#239f40", to: "#da0000" },
  { code: "NZL", name: "Nova Zelândia",iso: "nz",     from: "#00247d", to: "#cc142b" },
  { code: "ESP", name: "Espanha",      iso: "es",     from: "#aa151b", to: "#f1bf00" },
  { code: "CPV", name: "Cabo Verde",   iso: "cv",     from: "#003893", to: "#cf2027" },
  { code: "KSA", name: "Arábia Saudita",iso: "sa",    from: "#006c35", to: "#004d24" },
  { code: "URU", name: "Uruguai",      iso: "uy",     from: "#0038a8", to: "#fcd116" },
  { code: "FRA", name: "França",       iso: "fr",     from: "#0055a4", to: "#ef4135" },
  { code: "SEN", name: "Senegal",      iso: "sn",     from: "#00853f", to: "#fdef42" },
  { code: "IRQ", name: "Iraque",       iso: "iq",     from: "#ce1126", to: "#000000" },
  { code: "NOR", name: "Noruega",      iso: "no",     from: "#ba0c2f", to: "#00205b" },
  { code: "ARG", name: "Argentina",    iso: "ar",     from: "#74acdf", to: "#f6b40e" },
  { code: "ALG", name: "Argélia",      iso: "dz",     from: "#006233", to: "#d21034" },
  { code: "AUT", name: "Áustria",      iso: "at",     from: "#ed2939", to: "#a01b25" },
  { code: "JOR", name: "Jordânia",     iso: "jo",     from: "#000000", to: "#ce1126" },
  { code: "POR", name: "Portugal",     iso: "pt",     from: "#006600", to: "#ff0000" },
  { code: "COD", name: "Rep. Dem. Congo", iso: "cd",  from: "#007fff", to: "#f7d618" },
  { code: "UZB", name: "Uzbequistão",  iso: "uz",     from: "#1eb53a", to: "#0099b5" },
  { code: "COL", name: "Colômbia",     iso: "co",     from: "#fcd116", to: "#003893" },
  { code: "ENG", name: "Inglaterra",   iso: "gb-eng", from: "#ffffff", to: "#ce1124" },
  { code: "CRO", name: "Croácia",      iso: "hr",     from: "#171796", to: "#ff0000" },
  { code: "GHA", name: "Gana",         iso: "gh",     from: "#006b3f", to: "#fcd116" },
  { code: "PAN", name: "Panamá",       iso: "pa",     from: "#005293", to: "#d21034" },
];

export type Section = {
  id: string;
  name: string;
  kind: "special" | "team" | "coca";
  codes: string[];
  meta?: CountryMeta;
};

export const SECTIONS: Section[] = [
  {
    id: "FWC",
    name: "Especiais FWC",
    kind: "special",
    codes: Array.from({ length: 20 }, (_, i) => `FWC${i}`),
  },
  ...COUNTRIES.map<Section>((c) => ({
    id: c.code,
    name: `${c.code} • ${c.name}`,
    kind: "team",
    codes: Array.from({ length: 20 }, (_, i) => `${c.code}${i + 1}`),
    meta: c,
  })),
  {
    id: "CC",
    name: "Especiais Coca-Cola",
    kind: "coca",
    codes: Array.from({ length: 14 }, (_, i) => `CC${i + 1}`),
  },
];

export const ALL_CODES: string[] = SECTIONS.flatMap((s) => s.codes);
