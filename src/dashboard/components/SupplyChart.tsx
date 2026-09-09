import type { Network } from "../../types";
import { RED, RED_INK } from "../palette";
import { NETWORK_LIST } from "../networks";
import { CHART_HEIGHT, CHART_VIEWBOX_HEIGHT, CHART_WIDTH, CURSOR_LINE_HEIGHT } from "../compute/chartLayout";
import type { AxisTick, SupplyBar } from "../viewTypes";

interface SupplyChartProps {
  bars: SupplyBar[];
  gridY: AxisTick[];
  xTicks: { label: string }[];
  dropMarks: { x: number; label: string }[];
  cursorX: number;
  onSelectBar: (network: Network, day: number) => void;
}

function Legend() {
  return (
    <div style={{ display: "flex", gap: 10, marginLeft: "auto", flexWrap: "wrap" }}>
      {NETWORK_LIST.map((n) => (
        <div key={n.key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}>
          <i
            style={{
              width: 9,
              height: 9,
              background: n.fill,
              border: "1px solid rgba(29,31,32,.3)",
              display: "inline-block",
            }}
          />
          {n.label}
        </div>
      ))}
    </div>
  );
}

export default function SupplyChart({ bars, gridY, xTicks, dropMarks, cursorX, onSelectBar }: SupplyChartProps) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 7 }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: ".04em",
            textTransform: "uppercase",
            color: "#5d5d60",
          }}
        >
          Aggregate supply · sum(totalSupply) per snapshot
        </div>
        <Legend />
      </div>
      <div
        className="blueprint"
        style={{
          padding: "12px 14px 8px",
          marginBottom: 8,
          display: "grid",
          gridTemplateColumns: "14px 46px 1fr",
          gap: "0 7px",
        }}
      >
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <div
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: 10,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "#7a7a7d",
            textAlign: "center",
            alignSelf: "center",
          }}
        >
          Σ totalSupply · ACRDX
        </div>
        <div style={{ position: "relative", height: 190, alignSelf: "start" }}>
          {gridY.map((g) => (
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
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_VIEWBOX_HEIGHT}`}
            preserveAspectRatio="none"
            style={{ width: "100%", height: 190, display: "block", overflow: "visible" }}
          >
            {gridY.map((g) => (
              <line
                key={g.label}
                x1={0}
                y1={g.y}
                x2={CHART_WIDTH}
                y2={g.y}
                stroke="rgba(29,31,32,.12)"
                strokeWidth={1}
              />
            ))}
            {bars.map((b, i) => (
              <rect
                key={i}
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                fill={b.fill}
                onClick={() => onSelectBar(b.network, b.day)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectBar(b.network, b.day);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={b.tip}
                style={{ cursor: "pointer" }}
              >
                <title>{b.tip}</title>
              </rect>
            ))}
            {dropMarks.map((m, i) => (
              <g key={i}>
                <line x1={m.x} y1={0} x2={m.x} y2={CHART_HEIGHT} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
                <text
                  x={m.x - 6}
                  y={14}
                  fontSize={10}
                  fill={RED_INK}
                  fontFamily="ui-monospace, monospace"
                  textAnchor="end"
                >
                  {m.label}
                </text>
              </g>
            ))}
            <line x1={cursorX} y1={0} x2={cursorX} y2={CURSOR_LINE_HEIGHT} stroke="#1d1f20" strokeWidth={1} />
          </svg>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${xTicks.length}, 1fr)`, marginTop: 4 }}>
            {xTicks.map((t, i) => (
              <div
                key={i}
                className="mono"
                style={{
                  fontSize: 9,
                  color: "#7a7a7d",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                  overflow: "visible",
                  lineHeight: 1.1,
                }}
              >
                {t.label}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "#7a7a7d",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Snapshot date · day / month
          </div>
        </div>
      </div>
    </>
  );
}
