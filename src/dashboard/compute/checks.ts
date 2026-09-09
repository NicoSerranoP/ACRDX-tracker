import type { Shares } from "../../types";
import { formatUnits18 } from "../format";
import { NETWORK_LIST } from "../networks";
import type { Thresholds } from "../types";
import type { CheckResult, DropEvent, ReconRow } from "../viewTypes";

const check = (n: number, title: string, ok: boolean, detail: string): CheckResult => ({
  n,
  title,
  status: ok ? "PASS" : "BREACH",
  detail,
});

function supplyReconciles(snapshot: Shares): boolean {
  const sum = NETWORK_LIST.reduce((acc, network) => acc + snapshot.blockNumbers[network.key].shares, 0n);
  return sum === snapshot.total;
}

export function computeChecks(params: {
  snapshot: Shares;
  day: number;
  recon: ReconRow[];
  dropEvents: DropEvent[];
  thresholds: Thresholds;
}): CheckResult[] {
  const { snapshot, day, recon, dropEvents, thresholds } = params;
  const deviationFails = recon.filter((r) => r.deviationBad);
  const staleFails = recon.filter((r) => r.ageBad);
  const sumOk = supplyReconciles(snapshot);
  const alertsBefore = dropEvents.filter((e) => e.severity === "ALERT" && e.day <= day);
  const lastAlert = alertsBefore[alertsBefore.length - 1];

  return [
    check(
      1,
      "Vault price ≈ oracle price",
      deviationFails.length === 0,
      deviationFails.length
        ? `${deviationFails.map((r) => `${r.label} ${r.deviation}`).join(", ")} beyond ±${thresholds.devTolerance.toFixed(5)}`
        : `All 5 vaults within ±${thresholds.devTolerance.toFixed(5)} of the reference price.`,
    ),
    check(
      2,
      "Price freshness vs snapshot",
      staleFails.length === 0,
      staleFails.length
        ? `${staleFails.map((r) => `${r.label} ${r.age}`).join(", ")} older than ${thresholds.stalenessHours}h`
        : `Every vault price written within ${thresholds.stalenessHours}h of the snapshot.`,
    ),
    check(
      3,
      "Σ totalSupply reconciles",
      sumOk,
      `${sumOk ? "Sum of the 5 chains equals the recorded aggregate: " : "Chain supplies do not sum to the recorded aggregate: "}${formatUnits18(snapshot.total, 0)} ACRDX.`,
    ),
    check(
      4,
      "Supply drop watch",
      alertsBefore.length === 0,
      alertsBefore.length
        ? `${alertsBefore.length} drop past ${thresholds.dropThresholdPct}% up to this snapshot — latest ${lastAlert.network} ${lastAlert.pct}`
        : `No aggregate decrease past ${thresholds.dropThresholdPct}% up to this snapshot.`,
    ),
  ];
}
