export const STATUSES = [
  "Submitted",
  "Under Review",
  "Approved",
  "Implemented",
] as const;

export type Status = (typeof STATUSES)[number];
