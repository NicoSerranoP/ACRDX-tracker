import { DIVIDER, VERIFIED_INK } from "../palette";

function Logo() {
  return (
    <svg width={28} height={28} viewBox="0 0 32 32" role="img" aria-label="ACRDX" style={{ flex: "none" }}>
      <rect width="32" height="32" rx="8" fill="#1a7d52" />
      <text
        x="16"
        y="23"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontWeight={700}
        fontSize={19}
        fill="#ffffff"
      >
        A
      </text>
    </svg>
  );
}

export default function Header({
  snapshotDate,
  dayLabel,
  onVerify,
  verifying,
  verifiedAt,
}: {
  snapshotDate: string;
  dayLabel: string;
  onVerify: () => void;
  verifying: boolean;
  verifiedAt: number | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 20,
        flexWrap: "wrap",
        padding: "14px 20px 12px",
        borderBottom: `1px solid ${DIVIDER}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <Logo />
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: ".01em",
          }}
        >
          ACRDX
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#5d5d60", maxWidth: 460, lineHeight: 1.35 }}>
        Anemoy Tokenized Apollo Diversified Credit Fund — share token across 5 networks
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#7a7a7d" }}>
          Snapshot
        </div>
        <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>
          {snapshotDate}
        </div>
        <div style={{ fontSize: 11, color: "#7a7a7d" }}>day {dayLabel}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <button
            className="btn btn-primary"
            onClick={onVerify}
            disabled={verifying}
            style={{ fontSize: 11, letterSpacing: ".09em", textTransform: "uppercase", padding: "6px 12px" }}
          >
            {verifying ? "verifying…" : "verify now"}
          </button>
          {verifiedAt !== null && (
            <div className="mono" style={{ fontSize: 10, color: VERIFIED_INK, whiteSpace: "nowrap" }}>
              verified {new Date(verifiedAt).toISOString().slice(0, 19).replace("T", " ")} UTC
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
