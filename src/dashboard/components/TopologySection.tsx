import type { Selection } from "../types";
import type { TopologyNetwork, TopologyRow } from "../viewTypes";
import BlueprintCorners from "./BlueprintCorners";
import SectionHeading from "./SectionHeading";
import VerifiedIcon from "./VerifiedIcon";

function TopologyRowItem({
  row,
  network,
  onSelect,
}: {
  row: TopologyRow;
  network: TopologyNetwork;
  onSelect: (s: Selection) => void;
}) {
  const select = () => onSelect({ network: network.network, kind: row.kind });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={select}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
        }
      }}
      style={{
        position: "relative",
        border: "1px solid rgba(29,31,32,.16)",
        padding: "5px 7px 5px 9px",
        cursor: "pointer",
        background: "rgba(255,255,255,.5)",
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {row.selected && (
        <i style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#5980a6" }} />
      )}
      <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 13, lineHeight: 1.15 }}>
          {row.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: "auto" }}>
          <div className="mono num" style={{ fontSize: 12, fontWeight: 600 }}>
            {row.value}
          </div>
          {row.verified && <VerifiedIcon size={11} />}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <div className="mono" style={{ fontSize: 9, color: "#7a7a7d" }}>
          {row.method}
        </div>
        {row.hasLink ? (
          <a
            href={row.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mono"
            onClick={(e) => e.stopPropagation()}
            style={{ fontSize: 9, marginLeft: "auto", textAlign: "right" }}
          >
            {row.addrShort}
          </a>
        ) : (
          <div className="mono" style={{ fontSize: 9, marginLeft: "auto", textAlign: "right", color: "#7a7a7d" }}>
            {row.addrShort}
          </div>
        )}
      </div>
    </div>
  );
}

function NetworkCard({ network, onSelect }: { network: TopologyNetwork; onSelect: (s: Selection) => void }) {
  return (
    <div style={{ border: "1px solid rgba(29,31,32,.3)", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "6px 9px 7px",
          background: network.fill,
          color: network.ink,
          display: "flex",
          alignItems: "baseline",
          gap: 6,
        }}
      >
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 15, lineHeight: 1.1 }}>
          {network.label}
        </div>
        <div style={{ fontSize: 9, letterSpacing: ".09em", textTransform: "uppercase", opacity: 0.7 }}>network</div>
        <div className="mono" style={{ fontSize: 9, opacity: 0.75, marginLeft: "auto" }}>
          {network.block}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, padding: 5 }}>
        {network.rows.map((row) => (
          <TopologyRowItem key={row.kind} row={row} network={network} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

export default function TopologySection({
  topology,
  onSelect,
}: {
  topology: TopologyNetwork[];
  onSelect: (s: Selection) => void;
}) {
  return (
    <div style={{ padding: "26px 20px 0" }}>
      <SectionHeading n="01" title="Deployment topology" trailing="click any entity to load its transactions" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(184px, 1fr))",
          gap: 8,
          alignItems: "stretch",
        }}
      >
        <div
          className="blueprint"
          style={{
            padding: "11px 11px 12px",
            display: "flex",
            flexDirection: "column",
            background: "#1d2d3d",
            color: "#f2f2f3",
          }}
        >
          <BlueprintCorners />
          <div
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, lineHeight: 1.05 }}
          >
            ACRDX
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.4, opacity: 0.8, marginTop: 6 }}>
            Each token is a share. ERC-20 deployed on 5 chains; on-chain supply is the sum across them.
          </div>
          <div className="mono" style={{ fontSize: 10, opacity: 0.55, marginTop: "auto", paddingTop: 10 }}>
            18 decimals · 5 networks
          </div>
        </div>

        {topology.map((network) => (
          <NetworkCard key={network.network} network={network} onSelect={onSelect} />
        ))}
      </div>

      <div style={{ fontSize: 11, color: "#7a7a7d", marginTop: 10, lineHeight: 1.5, maxWidth: 900 }}>
        Vault addresses resolve at runtime through <span className="mono">ACRDX.vault(USDC)</span> and are left unlinked
        here. The Plume share-token address in the supplied environment file is truncated; it is shown assuming it
        matches the Ethereum/Base deployment. Cross-chain rows on non-Ethereum networks have no oracle contract — the
        vault price is written by an Axelar message originating from the single Chronicle Labs oracle on Ethereum
        mainnet.
      </div>
    </div>
  );
}
