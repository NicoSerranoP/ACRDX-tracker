import { VERIFIED_INK } from "../palette";

/** Green checkmark shown next to a KPI or topology row once its value has been re-verified
 *  against a fresh fetch of shares.json. */
export default function VerifiedIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={VERIFIED_INK}
      strokeWidth={size >= 13 ? 2.2 : 2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none" }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
