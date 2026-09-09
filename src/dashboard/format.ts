const E18 = 10n ** 18n;

export const shortAddress = (address: string): string =>
  address && address.length > 14 ? `${address.slice(0, 8)}…${address.slice(-6)}` : address || "—";

export const isoDate = (timestamp: number): string => new Date(timestamp * 1000).toISOString().slice(0, 10);

export const dayMonth = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
};

export const groupNumber = (n: number): string => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

/** Formats an 18-decimal fixed-point bigint, truncating (not rounding) to `dp` decimal places. */
export const formatUnits18 = (value: bigint, dp: number): string => {
  const negative = value < 0n;
  const magnitude = negative ? -value : value;
  const integerPart = Number(magnitude / E18).toLocaleString("en-US");
  const fractionPart = dp ? `.${(magnitude % E18).toString().padStart(18, "0").slice(0, dp)}` : "";
  return `${negative ? "−" : ""}${integerPart}${fractionPart}`;
};

export const toFloat18 = (value: bigint): number => Number(value) / 1e18;
