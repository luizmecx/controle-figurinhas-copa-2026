export type Section = {
  id: string;
  name: string;
  kind: "special" | "team" | "coca";
  codes: string[];
};

const TEAMS = [
  "MEX","RSA","KOR","CZE","CAN","BIH","QAT","SUI","BRA","MAR",
  "HAI","SCO","USA","PAR","AUS","TUR","GER","CUW","CIV","ECU",
  "NED","JPN","SWE","TUN","BEL","EGY","IRN","NZL","ESP","CPV",
  "KSA","URU","FRA","SEN","IRQ","NOR","ARG","ALG","AUT","JOR",
  "POR","COD","UZB","COL","ENG","CRO","GHA","PAN",
];

export const SECTIONS: Section[] = [
  {
    id: "FWC",
    name: "Especiais FWC",
    kind: "special",
    codes: Array.from({ length: 20 }, (_, i) => `FWC${i}`),
  },
  ...TEAMS.map<Section>((t) => ({
    id: t,
    name: t,
    kind: "team",
    codes: Array.from({ length: 20 }, (_, i) => `${t}${i + 1}`),
  })),
  {
    id: "CC",
    name: "Especiais Coca-Cola",
    kind: "coca",
    codes: Array.from({ length: 14 }, (_, i) => `CC${i + 1}`),
  },
];

export const ALL_CODES: string[] = SECTIONS.flatMap((s) => s.codes);
