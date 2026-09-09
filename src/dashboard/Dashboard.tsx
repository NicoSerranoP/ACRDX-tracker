import { useMemo, useState } from "react";
import { Network } from "../types";
import { defaultBlockRange, type BlockRange } from "./compute/transactions";
import { selectedContract } from "./compute/topology";
import { useShareHistory } from "./data";
import { buildLedger } from "./ledger";
import { DAYS, DEFAULT_THRESHOLDS, NETWORKS } from "./networks";
import type { Selection } from "./types";
import { buildViewModel } from "./viewModel";
import ErrorBanner from "./components/ErrorBanner";
import Header from "./components/Header";
import KpiStrip from "./components/KpiStrip";
import MonitoringSection from "./components/MonitoringSection";
import Timeline from "./components/Timeline";
import TopologySection from "./components/TopologySection";
import TransactionsSection from "./components/TransactionsSection";
import { isoDate } from "./format";
import { snapshotTimestamp } from "./networks";

const NETWORK_KEYS = NETWORKS.map((n) => n.key);
const INITIAL_SELECTION: Selection = { network: Network.PLUME, kind: "token" };

export default function Dashboard() {
  const { data, error } = useShareHistory();
  const [day, setDay] = useState(DAYS);
  const [selection, setSelection] = useState<Selection>(INITIAL_SELECTION);
  const [useManualRange, setUseManualRange] = useState(true);
  const [manualRange, setManualRange] = useState<BlockRange>({ from: "", to: "" });

  const ledger = useMemo(() => (data ? buildLedger(data, NETWORK_KEYS) : {}), [data]);

  const selectContract = (next: Selection) => {
    setSelection(next);
    setUseManualRange(true);
    setManualRange({ from: "", to: "" });
  };

  const inspect = (next: Selection, targetDay: number) => {
    setSelection(next);
    setDay(targetDay);
    setUseManualRange(false);
  };

  const setManualFrom = (from: string) => {
    setManualRange((r) => ({ ...r, from }));
    setUseManualRange(true);
  };

  const setManualTo = (to: string) => {
    setManualRange((r) => ({ ...r, to }));
    setUseManualRange(true);
  };

  const clearRange = () => {
    setUseManualRange(true);
    setManualRange({ from: "", to: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f2f2f3",
        color: "#1d1f20",
        fontFamily: "Barlow, system-ui, sans-serif",
        fontSize: 13,
        padding: "0 0 60px",
      }}
    >
      <Header snapshotDate={data ? isoDate(snapshotTimestamp(day)) : "—"} dayLabel={`${day} / ${DAYS}`} />
      <Timeline day={day} onDay={setDay} />

      {error && <ErrorBanner message={error} />}

      {data && (
        <DashboardBody
          data={data}
          day={day}
          selection={selection}
          range={useManualRange ? manualRange : defaultBlockRange(data, day, selection)}
          ledger={ledger}
          onSelectContract={selectContract}
          onInspect={inspect}
          onManualFrom={setManualFrom}
          onManualTo={setManualTo}
          onSyncRange={() => setUseManualRange(false)}
          onClearRange={clearRange}
        />
      )}
    </div>
  );
}

interface DashboardBodyProps {
  data: NonNullable<ReturnType<typeof useShareHistory>["data"]>;
  day: number;
  selection: Selection;
  range: BlockRange;
  ledger: ReturnType<typeof buildLedger>;
  onSelectContract: (s: Selection) => void;
  onInspect: (s: Selection, day: number) => void;
  onManualFrom: (value: string) => void;
  onManualTo: (value: string) => void;
  onSyncRange: () => void;
  onClearRange: () => void;
}

function DashboardBody(props: DashboardBodyProps) {
  const {
    data,
    day,
    selection,
    range,
    ledger,
    onSelectContract,
    onInspect,
    onManualFrom,
    onManualTo,
    onSyncRange,
    onClearRange,
  } = props;
  const vm = buildViewModel(data, ledger, { day, selection, range }, DEFAULT_THRESHOLDS);
  const contract = selectedContract(selection);

  return (
    <>
      <KpiStrip kpis={vm.kpis} />
      <TopologySection topology={vm.topology} onSelect={onSelectContract} />
      <MonitoringSection
        day={day}
        snapshotDate={isoDate(snapshotTimestamp(day))}
        thresholds={vm.thresholds}
        checks={vm.checks}
        recon={vm.recon}
        supplyBars={vm.supplyBars}
        supplyGridY={vm.supplyGridY}
        xTicks={vm.xTicks}
        dropMarks={vm.dropMarks}
        dropEvents={vm.dropEvents}
        priceChart={vm.priceChart}
        staleRows={vm.staleRows}
        onInspect={onInspect}
      />
      <TransactionsSection
        selectedTitle={contract.title}
        selectedAddr={contract.addr}
        selectedUrl={contract.url}
        range={vm.range}
        rows={vm.txRows}
        totalCount={vm.txTotalCount}
        onFromChange={onManualFrom}
        onToChange={onManualTo}
        onSyncRange={onSyncRange}
        onClearRange={onClearRange}
      />
    </>
  );
}
