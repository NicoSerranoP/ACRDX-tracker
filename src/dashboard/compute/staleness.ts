import type { Shares } from "../../types";
import { isoDate } from "../format";
import { NETWORKS, snapshotTimestamp } from "../networks";
import type { StaleCell, StaleRow } from "../viewTypes";

export function computeStalenessMatrix(data: Shares[], stalenessHours: number): StaleRow[] {
  return NETWORKS.map((network) => {
    const cells: StaleCell[] = data.map((entry) => {
      const ageHours = (snapshotTimestamp(entry.day) - Number(entry.blockNumbers[network.key].priceLastUpdated)) / 3600;
      const level = ageHours > stalenessHours * 2 ? "stale" : ageHours > stalenessHours ? "warn" : "fresh";
      return {
        fill: level,
        tip: `${network.label} · ${isoDate(snapshotTimestamp(entry.day))} · price age ${ageHours.toFixed(0)}h`,
        day: entry.day,
      };
    });
    return { network: network.key, label: network.label, cells };
  });
}
