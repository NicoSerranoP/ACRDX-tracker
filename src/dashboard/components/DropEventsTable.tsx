import { RED_INK, tagColors } from "../palette";
import type { Selection } from "../types";
import type { DropEvent } from "../viewTypes";

export default function DropEventsTable({
  events,
  onInspect,
}: {
  events: DropEvent[];
  onInspect: (selection: Selection, day: number) => void;
}) {
  return (
    <>
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
        Supply decreases
      </div>
      <div style={{ overflowX: "auto", marginBottom: 4 }}>
        <table className="table" style={{ fontSize: 12, minWidth: 780 }}>
          <thead>
            <tr>
              <th>Snapshot</th>
              <th>Network</th>
              <th style={{ textAlign: "right" }}>Supply before</th>
              <th style={{ textAlign: "right" }}>Supply after</th>
              <th style={{ textAlign: "right" }}>Δ shares</th>
              <th style={{ textAlign: "right" }}>Δ aggregate</th>
              <th>Severity</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {events.map((e, i) => {
              const colors = tagColors(e.severity === "ALERT");
              return (
                <tr key={i}>
                  <td className="mono">{e.date}</td>
                  <td style={{ fontWeight: 600 }}>{e.network}</td>
                  <td className="mono num" style={{ textAlign: "right" }}>
                    {e.before}
                  </td>
                  <td className="mono num" style={{ textAlign: "right" }}>
                    {e.after}
                  </td>
                  <td className="mono num" style={{ textAlign: "right", color: RED_INK, fontWeight: 600 }}>
                    {e.delta}
                  </td>
                  <td className="mono num" style={{ textAlign: "right" }}>
                    {e.pct}
                  </td>
                  <td>
                    <span className="tag" style={{ background: colors.bg, color: colors.fg }}>
                      {e.severity}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost"
                      onClick={() => onInspect({ network: e.networkKey, kind: "token" }, e.day)}
                      style={{ fontSize: 11, padding: "2px 6px" }}
                    >
                      inspect →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: "#7a7a7d", lineHeight: 1.5, maxWidth: 900 }}>
        Reference price for every network is the single Chronicle Labs oracle read on Ethereum mainnet; where a snapshot
        carries <span className="mono">oraclePrice = 0</span> (all non-Ethereum networks, which hold no oracle contract)
        the vault's own <span className="mono">pricePerShare()</span> is used instead and the row is labelled
        accordingly. Snapshot timestamps are derived from the daily sampling grid anchored at the collection time,
        2026-09-07 12:00 UTC; <span className="mono">shares.json</span> records block numbers, not block timestamps.
      </div>
    </>
  );
}
