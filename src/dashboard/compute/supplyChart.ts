import type { Shares } from "../../types";
import { dayMonth, groupNumber, isoDate, toFloat18 } from "../format";
import { NETWORKS, snapshotTimestamp } from "../networks";
import type { DropEvent, SupplyBar, AxisTick } from "../viewTypes";
import { CHART_HEIGHT, CHART_VIEWBOX_HEIGHT, chartStep } from "./chartLayout";

export const maxAggregateSupply = (data: Shares[]): number => Math.max(...data.map((e) => toFloat18(e.total))) * 1.08;

export function computeSupplyBars(data: Shares[], maxTotal: number): SupplyBar[] {
  const step = chartStep();
  const barWidth = step - 2.2;
  const bars: SupplyBar[] = [];

  data.forEach((entry, i) => {
    let acc = 0;
    NETWORKS.forEach((network) => {
      const value = toFloat18(entry.blockNumbers[network.key].shares);
      if (value <= 0) return;
      const height = (value / maxTotal) * CHART_HEIGHT;
      const y = CHART_HEIGHT - (acc / maxTotal) * CHART_HEIGHT - height;
      acc += value;
      bars.push({
        x: i * step + 1.1,
        y,
        w: barWidth,
        h: Math.max(height, 0.4),
        fill: network.fill,
        tip: `${network.label} · ${isoDate(snapshotTimestamp(entry.day))} · ${groupNumber(value)} ACRDX`,
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
    label: i % 3 === 0 || i === data.length - 1 ? dayMonth(snapshotTimestamp(entry.day)) : "",
  }));

export function computeDropMarks(dropEvents: DropEvent[]): { x: number; label: string }[] {
  const step = chartStep();
  return dropEvents
    .filter((e) => e.severity === "ALERT")
    .map((e) => ({ x: (e.day - 1) * step + step / 2, label: e.pct }));
}
