import { formatUnits } from "viem";
import type { Shares } from "../../types";
import { dayMonth, groupNumber, isoDate } from "../format";
import { NETWORK_LIST, snapshotTimestamp } from "../networks";
import type { DropEvent, SupplyBar, AxisTick } from "../viewTypes";
import { CHART_HEIGHT, CHART_VIEWBOX_HEIGHT, chartStep } from "./chartLayout";

export const maxAggregateSupply = (data: Shares[]): number =>
  Math.max(...data.map((e) => Number(formatUnits(e.total, 18)))) * 1.08;

/** Segments below this height get bumped up to it so all 5 networks stay legible even when
 *  one chain's supply is a tiny fraction of the aggregate (e.g. Ethereum/Optimism vs Plume). */
const MIN_VISIBLE_SEGMENT_HEIGHT = 2.5;

export function computeSupplyBars(data: Shares[], maxTotal: number): SupplyBar[] {
  const step = chartStep(data.length);
  const barWidth = step - 2.2;
  const bars: SupplyBar[] = [];

  data.forEach((entry, i) => {
    let y = CHART_HEIGHT;
    NETWORK_LIST.forEach((network) => {
      const value = Number(formatUnits(entry.blockNumbers[network.key].shares, 18));
      if (value <= 0) return;
      const height = Math.max((value / maxTotal) * CHART_HEIGHT, MIN_VISIBLE_SEGMENT_HEIGHT);
      y -= height;
      bars.push({
        x: i * step + 1.1,
        y,
        w: barWidth,
        h: height,
        fill: network.fill,
        tip: `${network.label} · ${isoDate(snapshotTimestamp(entry.day, data.length))} · ${groupNumber(value)} ACRDX`,
        network: network.key,
        day: entry.day,
      });
    });
  });

  return bars;
}

export function computeSupplyGridY(maxTotal: number): AxisTick[] {
  return [0, 0.25, 0.5, 0.75, 1].map((fraction) => {
    const y = CHART_HEIGHT - fraction * CHART_HEIGHT;
    return { y, topPct: (y / CHART_VIEWBOX_HEIGHT) * 100, label: `${((maxTotal * fraction) / 1e6).toFixed(1)}M` };
  });
}

export const computeXTicks = (data: Shares[]): { label: string }[] =>
  data.map((entry, i) => ({
    label: i % 3 === 0 || i === data.length - 1 ? dayMonth(snapshotTimestamp(entry.day, data.length)) : "",
  }));

export function computeDropMarks(dropEvents: DropEvent[], totalDays: number): { x: number; label: string }[] {
  const step = chartStep(totalDays);
  return dropEvents
    .filter((e) => e.severity === "ALERT")
    .map((e) => ({ x: (e.day - 1) * step + step / 2, label: e.pct }));
}
