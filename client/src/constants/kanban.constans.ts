export const COLUMN_STATUS = {
  TODO: "To do",
  INWORK: "In Work",
  REVIEW: "Review",
  DONE: "Done",
} as const;

export const COLUMN_COLORS = {
  "To do": "cyan",
  "In Work": "yellow",
  Review: "indigo",
  Done: "green",
} as const;

export type TColumnStatus = keyof typeof COLUMN_STATUS;
export type TColumnStatusValue = (typeof COLUMN_STATUS)[TColumnStatus];

export type TColumnColors = keyof typeof COLUMN_COLORS;
export type TColumnColorsValue = (typeof COLUMN_COLORS)[TColumnColors];
