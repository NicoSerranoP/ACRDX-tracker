import { formatUnits } from "viem";
import type { Shares } from "../../types";
import { formatUnits18, isoDate } from "../format";
import { NETWORK_LIST, snapshotTimestamp } from "../networks";
import type { DropEvent } from "../viewTypes";

/** Flags a per-network supply decrease between consecutive snapshots, severity ALERT when the
 *  same-day aggregate also fell by more than dropThresholdPct (an aggregate increase, even a
 *  large one, is never a "drop" and stays NOTICE). */
export function computeDropEvents(data: Shares[], dropThresholdPct: number): DropEvent[] {
  const events: DropEvent[] = [];

  for (let i = 1; i < data.length; i++) {
    const prevTotal = Number(formatUnits(data[i - 1].total, 18));
    const curTotal = Number(formatUnits(data[i].total, 18));
    const aggregatePct = ((curTotal - prevTotal) / prevTotal) * 100;

    NETWORK_LIST.forEach((network) => {
      const before = data[i - 1].blockNumbers[network.key].shares;
      const after = data[i].blockNumbers[network.key].shares;
      if (after >= before) return;

      events.push({
        day: data[i].day,
        date: isoDate(snapshotTimestamp(data[i].day, data.length)),
        network: network.label,
        networkKey: network.key,
        before: formatUnits18(before, 0),
        after: formatUnits18(after, 0),
        delta: `−${formatUnits18(before - after, 0)}`,
        pct: `${aggregatePct.toFixed(3)}%`,
        severity: aggregatePct < -dropThresholdPct ? "ALERT" : "NOTICE",
      });
    });
  }

  return events;
}
