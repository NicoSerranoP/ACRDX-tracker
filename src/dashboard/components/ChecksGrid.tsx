import { tagColors } from "../palette";
import type { CheckResult } from "../viewTypes";
import BlueprintCorners from "./BlueprintCorners";

export default function ChecksGrid({ checks }: { checks: CheckResult[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 10,
        marginBottom: 22,
      }}
    >
      {checks.map((check) => {
        const colors = tagColors(check.status === "BREACH");
        return (
          <div key={check.n} className="blueprint" style={{ padding: "11px 12px" }}>
            <BlueprintCorners />
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <div style={{ fontSize: 10, letterSpacing: ".09em", textTransform: "uppercase", color: "#7a7a7d" }}>
                check {check.n}
              </div>
              <span className="tag" style={{ marginLeft: "auto", background: colors.bg, color: colors.fg }}>
                {check.status}
              </span>
            </div>
            <div
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: 15,
                marginTop: 4,
                lineHeight: 1.2,
              }}
            >
              {check.title}
            </div>
            <div style={{ fontSize: 11, color: "#5d5d60", marginTop: 3, lineHeight: 1.45 }}>{check.detail}</div>
          </div>
        );
      })}
    </div>
  );
}
