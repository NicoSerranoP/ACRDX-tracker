import type { ReactNode } from "react";
import { DIVIDER, TEXT } from "../palette";

export default function SectionHeading({ n, title, trailing }: { n: string; title: string; trailing?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        borderBottom: `1px solid ${DIVIDER}`,
        paddingBottom: 6,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: 11,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "#5980a6",
        }}
      >
        {n}
      </div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 20, color: TEXT }}>
        {title}
      </div>
      {trailing && <div style={{ fontSize: 11, color: "#7a7a7d", marginLeft: "auto" }}>{trailing}</div>}
    </div>
  );
}
