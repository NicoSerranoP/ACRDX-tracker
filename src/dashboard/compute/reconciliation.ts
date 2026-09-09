import type { Shares } from "../../types";
import { groupNumber, isoDate, formatUnits18, toFloat18 } from "../format";
import { NETWORKS, snapshotTimestamp } from "../networks";
import type { Thresholds } from "../types";
import type { ReconRow } from "../viewTypes";

export function computeReconciliation(snapshot: Shares, thresholds: Thresholds): ReconRow[] {
  const ethOracle = toFloat18(snapshot.blockNumbers.ETH.oraclePrice);
  const timestamp = snapshotTimestamp(snapshot.day);

  return NETWORKS.map((network) => {
    const s = snapshot.blockNumbers[network.key];
    const pps = Number(s.pricePerShare) / 1e6;
    const ownOracle = toFloat18(s.oraclePrice);
    const ref = ownOracle > 0 ? ownOracle : ethOracle > 0 ? ethOracle : pps;
    const refSource =
      ownOracle > 0 ? "own oracle read()" : ethOracle > 0 ? "Chronicle · Ethereum" : "vault pricePerShare()";
    const deviation = pps - ref;
    const ageHours = (timestamp - Number(s.priceLastUpdated)) / 3600;
    const deviationBad = Math.abs(deviation) > thresholds.devTolerance;
    const ageBad = ageHours > thresholds.stalenessHours;
    const bad = deviationBad || ageBad;
    const status = bad ? (deviationBad && ageBad ? "DEV + STALE" : deviationBad ? "DEVIATION" : "STALE") : "OK";

    return {
      network: network.key,
      label: network.label,
      block: groupNumber(Number(s.block)),
      pps: pps.toFixed(6),
      ref: ref.toFixed(6),
      refSource,
      deviation:
        Math.abs(deviation) < 5e-6 ? "0.00000" : `${deviation > 0 ? "+" : "−"}${Math.abs(deviation).toFixed(5)}`,
      deviationBad,
      updated: isoDate(Number(s.priceLastUpdated)),
      age: `${ageHours.toFixed(0)}h`,
      ageBad,
      shares: formatUnits18(s.shares, 0),
      status,
      bad,
    };
  });
}
