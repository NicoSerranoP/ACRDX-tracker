import { formatUnits } from "viem";
import { Network, type Shares } from "../../types";
import type { AxisTick } from "../viewTypes";
import { CHART_HEIGHT, CHART_VIEWBOX_HEIGHT, chartStep } from "./chartLayout";

export interface PriceChartData {
  oraclePoints: string;
  vaultPoints: string;
  deviationBandPoints: string;
  axis: AxisTick[];
}

interface PricePair {
  oracle: number;
  vault: number;
}

const ethPrices = (data: Shares[]): PricePair[] =>
  data.map((entry) => {
    const eth = entry.blockNumbers[Network.ETH];
    const vault = Number(eth.pricePerShare) / 1e6;
    const oracle = Number(formatUnits(eth.oraclePrice, 18));
    return { oracle: oracle > 0 ? oracle : vault, vault };
  });

export function computePriceChart(data: Shares[]): PriceChartData {
  const step = chartStep();
  const prices = ethPrices(data);
  const values = prices.flatMap((p) => [p.oracle, p.vault]);
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo) * 0.25 || 0.001;
  const domainLo = lo - pad;
  const domainSpan = hi - lo + pad * 2;

  const px = (i: number): number => i * step + step / 2;
  const py = (v: number): number => CHART_HEIGHT - ((v - domainLo) / domainSpan) * CHART_HEIGHT;

  const oraclePoints = prices.map((p, i) => `${px(i)},${py(p.oracle)}`).join(" ");
  const vaultPoints = prices.map((p, i) => `${px(i)},${py(p.vault)}`).join(" ");
  const reversedVaultPoints = prices
    .map((p, i) => `${px(i)},${py(p.vault)}`)
    .reverse()
    .join(" ");

  const axis = [lo, (lo + hi) / 2, hi].map((v) => ({
    y: py(v),
    topPct: (py(v) / CHART_VIEWBOX_HEIGHT) * 100,
    label: v.toFixed(6),
  }));

  return {
    oraclePoints,
    vaultPoints,
    deviationBandPoints: `${oraclePoints} ${reversedVaultPoints}`,
    axis,
  };
}
