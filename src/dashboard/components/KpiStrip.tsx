import { RED_INK, TEXT } from "../palette";
import type { Kpi } from "../viewTypes";
import VerifiedIcon from "./VerifiedIcon";

function KpiValue({ kpi }: { kpi: Kpi }) {
  const color = kpi.color === "bad" ? RED_INK : TEXT;
  if (kpi.linked) {
    return (
      <a
        href={kpi.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color,
          textDecoration: "underline",
          textDecorationColor: "rgba(89,128,166,.55)",
          textUnderlineOffset: 3,
        }}
      >
        {kpi.value}
      </a>
    );
  }
  return <span style={{ color }}>{kpi.value}</span>;
}

export default function KpiStrip({ kpis }: { kpis: Kpi[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 1,
        background: "rgba(29,31,32,.16)",
        borderBottom: "1px solid rgba(29,31,32,.16)",
      }}
    >
      {kpis.map((kpi) => (
        <div key={kpi.label} style={{ background: "#f2f2f3", padding: "11px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ fontSize: 10, letterSpacing: ".09em", textTransform: "uppercase", color: "#7a7a7d" }}>
              {kpi.label}
            </div>
            {kpi.verified && <VerifiedIcon size={13} />}
          </div>
          <div className="mono" style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25, marginTop: 3 }}>
            <KpiValue kpi={kpi} />
          </div>
          <div style={{ fontSize: 11, color: "#5d5d60" }}>{kpi.sub}</div>
        </div>
      ))}
    </div>
  );
}
