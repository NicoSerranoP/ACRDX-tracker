import { DIVIDER } from "../palette";

export default function Header({ snapshotDate, dayLabel }: { snapshotDate: string; dayLabel: string }) {
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
      <div
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 24, letterSpacing: ".01em" }}
      >
        ACRDX
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
      </div>
    </div>
  );
}
