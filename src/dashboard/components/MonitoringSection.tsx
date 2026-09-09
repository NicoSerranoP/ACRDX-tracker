import type { Network } from "../../types";
import { cursorX } from "../compute/chartLayout";
import type { PriceChartData } from "../compute/priceChart";
import type { Selection, Thresholds } from "../types";
import type { AxisTick, CheckResult, DropEvent, ReconRow, StaleRow, SupplyBar } from "../viewTypes";
import ChecksGrid from "./ChecksGrid";
import DropEventsTable from "./DropEventsTable";
import PriceChart from "./PriceChart";
import ReconciliationTable from "./ReconciliationTable";
import SectionHeading from "./SectionHeading";
import StalenessMatrix from "./StalenessMatrix";
import SupplyChart from "./SupplyChart";

export interface MonitoringSectionProps {
  day: number;
  snapshotDate: string;
  thresholds: Thresholds;
  checks: CheckResult[];
  recon: ReconRow[];
  supplyBars: SupplyBar[];
  supplyGridY: AxisTick[];
  xTicks: { label: string }[];
  dropMarks: { x: number; label: string }[];
  dropEvents: DropEvent[];
  priceChart: PriceChartData;
  staleRows: StaleRow[];
  onInspect: (selection: Selection, day: number) => void;
}

export default function MonitoringSection(props: MonitoringSectionProps) {
  const {
    day,
    snapshotDate,
    thresholds,
    checks,
    recon,
    supplyBars,
    supplyGridY,
    xTicks,
    dropMarks,
    dropEvents,
    priceChart,
    staleRows,
    onInspect,
  } = props;
  const cursor = cursorX(day);
  const selectDay = (network: Network, targetDay: number) => onInspect({ network, kind: "token" }, targetDay);
  const selectVaultDay = (network: Network, targetDay: number) => onInspect({ network, kind: "vault" }, targetDay);

  return (
    <div style={{ padding: "30px 20px 0" }}>
      <SectionHeading
        n="02"
        title="Monitoring"
        trailing={
          <span className="mono">
            tol {thresholds.devTolerance.toFixed(5)} · stale &gt; {thresholds.stalenessHours}h · drop &gt;{" "}
            {thresholds.dropThresholdPct}%
          </span>
        }
      />

      <ChecksGrid checks={checks} />
      <ReconciliationTable recon={recon} snapshotDate={snapshotDate} />
      <SupplyChart
        bars={supplyBars}
        gridY={supplyGridY}
        xTicks={xTicks}
        dropMarks={dropMarks}
        cursorX={cursor}
        onSelectBar={selectDay}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <PriceChart chart={priceChart} cursorX={cursor} />
        <StalenessMatrix rows={staleRows} onSelectCell={selectVaultDay} />
      </div>

      <DropEventsTable events={dropEvents} onInspect={onInspect} />
    </div>
  );
}
