import { formatUnits } from "viem";
import { CHRONICLE_ORACLE_ADDRESS } from "../../constants";
import { Network } from "../../types";
import type { Shares } from "../../types";
import { formatUnits18, groupNumber } from "../format";
import { NETWORKS } from "../networks";
import type { Thresholds } from "../types";
import type { CheckResult, Kpi, ReconRow } from "../viewTypes";

export function computeKpis(params: {
  snapshot: Shares;
  recon: ReconRow[];
  checks: CheckResult[];
  thresholds: Thresholds;
}): Kpi[] {
  const { snapshot, recon, checks, thresholds } = params;
  const ethSnapshot = snapshot.blockNumbers[Network.ETH];
  const ethOracle = Number(formatUnits(ethSnapshot.oraclePrice, 18));
  const sharePrice = ethOracle || Number(ethSnapshot.pricePerShare) / 1e6;
  const nav = Number(formatUnits(snapshot.total, 18)) * sharePrice;
  const failCount = checks.filter((c) => c.status === "BREACH").length;
  const maxAge = Math.max(...recon.map((r) => parseFloat(r.age)));
  const explorer = NETWORKS[Network.ETH].explorer;

  return [
    {
      label: "Aggregate supply",
      value: formatUnits18(snapshot.total, 0),
      sub: "ACRDX shares across 5 chains",
      color: "text",
      linked: false,
      url: "",
    },
    {
      label: "Share price",
      value: sharePrice.toFixed(6),
      sub: "Chronicle Labs proof of assets",
      color: "text",
      linked: true,
      url: `${explorer}/address/${CHRONICLE_ORACLE_ADDRESS}#readContract#F9`,
    },
    {
      label: "Net asset value",
      value: `$${groupNumber(Math.round(nav))}`,
      sub: "supply × oracle price",
      color: "text",
      linked: false,
      url: "",
    },
    {
      label: "Oldest price",
      value: `${maxAge.toFixed(0)}h`,
      sub: `threshold ${thresholds.stalenessHours}h`,
      color: maxAge > thresholds.stalenessHours ? "bad" : "text",
      linked: false,
      url: "",
    },
    {
      label: "Checks breaching",
      value: `${failCount} / 4`,
      sub: failCount ? "action required" : "all clear",
      color: failCount ? "bad" : "text",
      linked: false,
      url: "",
    },
  ];
}
