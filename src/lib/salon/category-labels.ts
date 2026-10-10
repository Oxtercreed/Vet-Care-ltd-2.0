import type { Category } from "./types";

export const CATEGORY_ORDER: Category[] = [
  "wellness",
  "vaccines",
  "dental",
  "diagnostics",
  "grooming",
];

export function categoryLabel(c: Category | "all", locale: "en" | "sw" = "en"): string {
  if (c === "all") return locale === "sw" ? "Zote" : "All";
  const labels: Record<Category, { en: string; sw: string }> = {
    wellness: { en: "Wellness", sw: "Afya" },
    vaccines: { en: "Vaccines", sw: "Chanjo" },
    dental: { en: "Dental", sw: "Meno" },
    diagnostics: { en: "Diagnostics", sw: "Uchunguzi" },
    grooming: { en: "Grooming", sw: "Usafi" },
  };
  return labels[c][locale];
}
