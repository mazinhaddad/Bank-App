export const CATEGORIES = [
  "Customer Experience",
  "Operations",
  "Digital Banking",
  "AI & Automation",
  "Employee Experience",
] as const;

export type Category = (typeof CATEGORIES)[number];
