import type { PriceChartData } from "../compute/priceChart";
import { CHART_VIEWBOX_HEIGHT } from "../compute/chartLayout";

export default function PriceChart({ chart, cursorX }: { chart: PriceChartData; cursorX: number }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: ".04em",
          textTransform: "uppercase",
          color: "#5d5d60",
          marginBottom: 7,
        }}
      >
        Chronicle oracle vs vault price
      </div>
      <div
        className="blueprint"
        style={{ padding: "12px 14px 8px", display: "grid", gridTemplateColumns: "54px 1fr", gap: "0 7px" }}
      >
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <div style={{ position: "relative", height: 170, alignSelf: "start" }}>
          {chart.axis.map((g) => (
            <div
              key={g.label}
              className="mono num"
              style={{
                position: "absolute",
                right: 0,
                top: `${g.topPct}%`,
                transform: "translateY(-50%)",
                fontSize: 9,
                color: "#7a7a7d",
              }}
            >
              {g.label}
            </div>
          ))}
        </div>
        <div>
          <svg
            viewBox={`0 0 1000 ${CHART_VIEWBOX_HEIGHT}`}
            preserveAspectRatio="none"
            style={{ width: "100%", height: 170, display: "block", overflow: "visible" }}
          >
            <polygon points={chart.deviationBandPoints} fill="rgba(89,128,166,.18)" />
            <polyline
              points={chart.oraclePoints}
              fill="none"
              stroke="#1d2d3d"
              strokeWidth={1.6}
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={chart.vaultPoints}
              fill="none"
              stroke="#749dc4"
              strokeWidth={1.6}
              strokeDasharray="4 3"
              vectorEffect="non-scaling-stroke"
            />
            <line x1={cursorX} y1={0} x2={cursorX} y2={206} stroke="#1d1f20" strokeWidth={1} />
          </svg>
          <div style={{ display: "flex", gap: 14, fontSize: 11, color: "#5d5d60", paddingTop: 6 }}>
            <span>
              <i
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 2,
                  background: "#1d2d3d",
                  verticalAlign: "middle",
                  marginRight: 4,
                }}
              />
              oracle read()
            </span>
            <span>
              <i
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 2,
                  background: "#749dc4",
                  verticalAlign: "middle",
                  marginRight: 4,
                }}
              />
              vault pricePerShare()
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
