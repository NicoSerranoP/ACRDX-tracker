import type { Shares } from "../types";
import { cursorX } from "./compute/chartLayout";
import { computeChecks } from "./compute/checks";
import { computeDropEvents } from "./compute/dropEvents";
import { computeKpis } from "./compute/kpis";
import { computePriceChart, type PriceChartData } from "./compute/priceChart";
import { computeReconciliation } from "./compute/reconciliation";
import { computeStalenessMatrix } from "./compute/staleness";
import {
  computeDropMarks,
  computeSupplyBars,
  computeSupplyGridY,
  computeXTicks,
  maxAggregateSupply,
} from "./compute/supplyChart";
import { computeTopology } from "./compute/topology";
import { computeTransactions, type BlockRange } from "./compute/transactions";
import type { Ledger, Selection, Thresholds } from "./types";
import type {
  AxisTick,
  CheckResult,
  DropEvent,
  Kpi,
  ReconRow,
  StaleRow,
  SupplyBar,
  TopologyNetwork,
  TxRow,
} from "./viewTypes";

export interface UIState {
  day: number;
  selection: Selection;
  range: BlockRange;
  verified: boolean;
}

export interface DashboardViewModel {
  day: number;
  snapshot: Shares;
  selection: Selection;
  kpis: Kpi[];
  checks: CheckResult[];
  recon: ReconRow[];
  topology: TopologyNetwork[];
  supplyBars: SupplyBar[];
  supplyGridY: AxisTick[];
  xTicks: { label: string }[];
  dropMarks: { x: number; label: string }[];
  dropEvents: DropEvent[];
  priceChart: PriceChartData;
  staleRows: StaleRow[];
  cursorX: number;
  txRows: TxRow[];
  txTotalCount: number;
  range: BlockRange;
  thresholds: Thresholds;
}

export function buildViewModel(
  data: Shares[],
  ledger: Ledger,
  ui: UIState,
  thresholds: Thresholds,
): DashboardViewModel {
  const day = Math.min(Math.max(ui.day, 1), data.length);
  const snapshot = data[day - 1];
  const recon = computeReconciliation(snapshot, thresholds, data.length);
  const dropEvents = computeDropEvents(data, thresholds.dropThresholdPct);
  const checks = computeChecks({ snapshot, day, recon, dropEvents, thresholds });
  const kpis = computeKpis({ snapshot, recon, checks, thresholds, verified: ui.verified });
  const maxTotal = maxAggregateSupply(data);
  const { rows: txRows, totalCount: txTotalCount } = computeTransactions({
    ledger,
    selection: ui.selection,
    range: ui.range,
    totalDays: data.length,
  });

  return {
    day,
    snapshot,
    selection: ui.selection,
    kpis,
    checks,
    recon,
    topology: computeTopology(snapshot.blockNumbers, ui.selection, ui.verified),
    supplyBars: computeSupplyBars(data, maxTotal),
    supplyGridY: computeSupplyGridY(maxTotal),
    xTicks: computeXTicks(data),
    dropMarks: computeDropMarks(dropEvents, data.length),
    dropEvents,
    priceChart: computePriceChart(data),
    staleRows: computeStalenessMatrix(data, thresholds.stalenessHours),
    cursorX: cursorX(day, data.length),
    txRows,
    txTotalCount,
    range: ui.range,
    thresholds,
  };
}
