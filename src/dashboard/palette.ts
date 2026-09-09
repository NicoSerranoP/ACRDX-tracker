export const TEXT = "#1d1f20";
export const MUTED = "#5d5d60";
export const FAINT = "#7a7a7d";
export const DIVIDER = "rgba(29,31,32,.16)";
export const ACCENT = "#5980a6";
export const ACCENT_500 = "#749dc4";
export const ACCENT_INK = "#1d2d3d";
export const ACCENT_TAG_BG = "#eef6ff";
export const ACCENT_TAG_FG = "#2c455d";
export const STALE_FRESH = "#d6ebff";
export const VERIFIED_INK = "#2f6b46";

export const RED = "oklch(.52 .14 27)";
export const RED_INK = "oklch(.42 .14 27)";
export const RED_BG = "oklch(.93 .04 27)";
export const RED_ROW_BG = "oklch(.97 .015 27)";

export const staleLevelColor: Record<"fresh" | "warn" | "stale", string> = {
  fresh: STALE_FRESH,
  warn: ACCENT_500,
  stale: RED,
};

export const tagColors = (bad: boolean): { bg: string; fg: string } =>
  bad ? { bg: RED_BG, fg: RED_INK } : { bg: ACCENT_TAG_BG, fg: ACCENT_TAG_FG };
