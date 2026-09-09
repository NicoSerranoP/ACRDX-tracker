import { RED_INK, RED_ROW_BG, TEXT, tagColors } from "../palette";
import type { ReconRow } from "../viewTypes";

export default function ReconciliationTable({ recon, snapshotDate }: { recon: ReconRow[]; snapshotDate: string }) {
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
        Vault price vs oracle · snapshot {snapshotDate}
      </div>
      <div style={{ overflowX: "auto", marginBottom: 26 }}>
        <table className="table" style={{ fontSize: 12, minWidth: 860 }}>
          <thead>
            <tr>
              <th>Network</th>
              <th>Block</th>
              <th style={{ textAlign: "right" }}>Vault pricePerShare</th>
              <th style={{ textAlign: "right" }}>Reference price</th>
              <th>Source</th>
              <th style={{ textAlign: "right" }}>Δ (5 dp)</th>
              <th>Price last updated</th>
              <th style={{ textAlign: "right" }}>Age</th>
              <th style={{ textAlign: "right" }}>Shares</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recon.map((r) => {
              const colors = tagColors(r.bad);
              return (
                <tr key={r.network} style={{ background: r.bad ? RED_ROW_BG : "transparent" }}>
                  <td style={{ fontWeight: 600 }}>{r.label}</td>
                  <td className="mono num" style={{ fontSize: 11, color: "#5d5d60" }}>
                    {r.block}
                  </td>
                  <td className="mono num" style={{ textAlign: "right" }}>
                    {r.pps}
                  </td>
                  <td className="mono num" style={{ textAlign: "right" }}>
                    {r.ref}
                  </td>
                  <td style={{ fontSize: 11, color: "#5d5d60" }}>{r.refSource}</td>
                  <td
                    className="mono num"
                    style={{ textAlign: "right", fontWeight: 600, color: r.deviationBad ? RED_INK : TEXT }}
                  >
                    {r.deviation}
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    {r.updated}
                  </td>
                  <td className="mono num" style={{ textAlign: "right", color: r.ageBad ? RED_INK : TEXT }}>
                    {r.age}
                  </td>
                  <td className="mono num" style={{ textAlign: "right" }}>
                    {r.shares}
                  </td>
                  <td>
                    <span className="tag" style={{ background: colors.bg, color: colors.fg }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
