import type { BlockRange } from "../compute/transactions";
import { tagColors } from "../palette";
import type { TxRow } from "../viewTypes";
import BlueprintCorners from "./BlueprintCorners";
import SectionHeading from "./SectionHeading";

export interface TransactionsSectionProps {
  selectedTitle: string;
  selectedAddr: string;
  selectedUrl: string;
  range: BlockRange;
  rows: TxRow[];
  totalCount: number;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSyncRange: () => void;
  onClearRange: () => void;
}

const rowTagColors = (event: string) =>
  event === "Burn" ? tagColors(true) : { bg: event === "Mint" ? "#d6ebff" : "#f5f5f8", fg: "#2c455d" };

export default function TransactionsSection(props: TransactionsSectionProps) {
  const {
    selectedTitle,
    selectedAddr,
    selectedUrl,
    range,
    rows,
    totalCount,
    onFromChange,
    onToChange,
    onSyncRange,
    onClearRange,
  } = props;

  return (
    <div style={{ padding: "30px 20px 0" }}>
      <SectionHeading n="03" title="Transactions" trailing={`${rows.length} of ${totalCount} events in range`} />

      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <div className="blueprint" style={{ padding: "8px 11px", flex: "1 1 260px", minWidth: 240 }}>
          <BlueprintCorners />
          <div style={{ fontSize: 10, letterSpacing: ".09em", textTransform: "uppercase", color: "#7a7a7d" }}>
            Selected contract
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 16 }}>
            {selectedTitle}
          </div>
          <a href={selectedUrl} target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: 11 }}>
            {selectedAddr}
          </a>
        </div>
        <div className="field" style={{ flex: "0 1 150px" }}>
          <label>Block from</label>
          <input className="input mono" type="text" value={range.from} onChange={(e) => onFromChange(e.target.value)} />
        </div>
        <div className="field" style={{ flex: "0 1 150px" }}>
          <label>Block to</label>
          <input className="input mono" type="text" value={range.to} onChange={(e) => onToChange(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn btn-primary" onClick={onSyncRange} style={{ fontSize: 12 }}>
            7-snapshot window
          </button>
          <button className="btn btn-secondary" onClick={onClearRange} style={{ fontSize: 12 }}>
            all blocks
          </button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="table" style={{ fontSize: 12, minWidth: 940 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "right" }}>Block</th>
              <th>Snapshot</th>
              <th>Event</th>
              <th style={{ textAlign: "right" }}>Amount / value</th>
              <th>From</th>
              <th>To</th>
              <th>Tx hash</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => {
              const colors = rowTagColors(t.event);
              return (
                <tr key={i} style={{ background: t.flagged ? "oklch(.97 .015 27)" : "transparent" }}>
                  <td className="mono num" style={{ textAlign: "right" }}>
                    {t.block}
                  </td>
                  <td className="mono" style={{ fontSize: 11, color: "#5d5d60" }}>
                    {t.date}
                  </td>
                  <td>
                    <span className="tag" style={{ background: colors.bg, color: colors.fg }}>
                      {t.event}
                    </span>
                  </td>
                  <td className="mono num" style={{ textAlign: "right", fontWeight: 600 }}>
                    {t.amount}
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    {t.from}
                  </td>
                  <td className="mono" style={{ fontSize: 11 }}>
                    {t.to}
                  </td>
                  <td>
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="mono" style={{ fontSize: 11 }}>
                      {t.hash} ↗
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <div
          style={{
            padding: 18,
            textAlign: "center",
            fontSize: 12,
            color: "#7a7a7d",
            border: "1px dashed rgba(29,31,32,.24)",
            marginTop: 8,
          }}
        >
          No transactions for this contract inside blocks {range.from}–{range.to}.
        </div>
      )}
      <div style={{ fontSize: 11, color: "#7a7a7d", lineHeight: 1.5, maxWidth: 900, marginTop: 10 }}>
        Block numbers, amounts and price values are derived from <span className="mono">shares.json</span>. Counterparty
        addresses and transaction hashes are placeholders pending an indexer, except the Plume burn of 10 August 2026,
        whose hash is the real one recorded in the design note. Rows marked <span className="mono">*</span> use a
        stand-in address for the repeat burn sender.
      </div>
    </div>
  );
}
