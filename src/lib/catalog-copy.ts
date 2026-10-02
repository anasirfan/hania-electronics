import type { Category } from "@/domain/types";

export function joinNames(names: string[]): string {
  const clean = names.map((n) => n.trim()).filter(Boolean);
  if (!clean.length) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} and ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")}, and ${clean[clean.length - 1]}`;
}

export function catalogSubtitle(categories: Pick<Category, "name">[]): string {
  const names = joinNames(categories.map((c) => c.name));
  if (!names) return "Shop HANIA Electronics with cash on delivery across Pakistan.";
  return `${names} — cash on delivery across Pakistan.`;
}
