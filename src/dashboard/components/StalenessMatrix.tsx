import type { Network } from "../../types";
import { RED, staleLevelColor } from "../palette";
import type { StaleRow } from "../viewTypes";

export default function StalenessMatrix({
  rows,
  onSelectCell,
}: {
  rows: StaleRow[];
  onSelectCell: (network: Network, day: number) => void;
}) {
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
        Price age per network · {rows[0]?.cells.length ?? 0} snapshots
      </div>
      <div className="blueprint" style={{ padding: "12px 14px" }}>
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        <div style={{ display: "grid", gap: 3 }}>
          {rows.map((row) => (
            <div
              key={row.network}
              style={{ display: "grid", gridTemplateColumns: "62px 1fr", gap: 8, alignItems: "center" }}
            >
              <div style={{ fontSize: 11, fontWeight: 600 }}>{row.label}</div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${row.cells.length}, 1fr)`, gap: 1 }}>
                {row.cells.map((cell) => (
                  <button
                    key={cell.day}
                    type="button"
                    onClick={() => onSelectCell(row.network, cell.day)}
                    title={cell.tip}
                    aria-label={cell.tip}
                    style={{
                      height: 15,
                      width: "100%",
                      background: staleLevelColor[cell.fill],
                      cursor: "pointer",
                      display: "block",
                      appearance: "none",
                      border: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#5d5d60", paddingTop: 9, flexWrap: "wrap" }}>
          <span>
            <i
              style={{
                display: "inline-block",
                width: 9,
                height: 9,
                background: staleLevelColor.fresh,
                marginRight: 4,
              }}
            />
            within threshold
          </span>
          <span>
            <i
              style={{ display: "inline-block", width: 9, height: 9, background: staleLevelColor.warn, marginRight: 4 }}
            />
            up to 2×
          </span>
          <span>
            <i style={{ display: "inline-block", width: 9, height: 9, background: RED, marginRight: 4 }} />
            stale
          </span>
        </div>
      </div>
    </div>
  );
}
