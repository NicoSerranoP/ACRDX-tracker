import { useEffect, useMemo, useRef, useState } from "react";
import { DAYS_TO_MONITOR } from "../constants";
import { Network } from "../types";
import { defaultBlockRange, type BlockRange } from "./compute/transactions";
import { selectedContract } from "./compute/topology";
import { useShareHistory } from "./data";
import { buildLedger } from "./ledger";
import { DEFAULT_THRESHOLDS } from "./networks";
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

const NETWORK_KEYS = Object.values(Network);
const INITIAL_SELECTION: Selection = { network: Network.PLUME, kind: "token" };
/** Only used before the real snapshot count is known (i.e. before shares.json has loaded). */
const FALLBACK_DAYS = Number(DAYS_TO_MONITOR);

export default function Dashboard() {
  const { data, error, verifying, verifiedAt, verify } = useShareHistory();
  const [day, setDay] = useState(FALLBACK_DAYS);
  const [selection, setSelection] = useState<Selection>(INITIAL_SELECTION);
  const [useManualRange, setUseManualRange] = useState(true);
  const [manualRange, setManualRange] = useState<BlockRange>({ from: "", to: "" });
  const verified = !!verifiedAt && !error;

  // Once the real snapshot history loads, jump to its actual latest day — the fallback above
  // is just a placeholder and shouldn't be trusted as "the last day" once real data arrives.
  // On every later data change (e.g. a verify() refetch) just clamp day back in range instead,
  // so a shrinking snapshot count can't leave day pointing past the end of the array.
  const dayInitialized = useRef(false);
  useEffect(() => {
    if (!data) return;
    if (!dayInitialized.current) {
      dayInitialized.current = true;
      setDay(data.length);
      return;
    }
    setDay((current) => Math.min(current, data.length));
  }, [data]);

  const totalDays = data ? data.length : FALLBACK_DAYS;

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
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
        fontSize: 13,
        padding: "0 0 60px",
      }}
    >
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "var(--color-bg)" }}>
        <Header
          snapshotDate={data ? isoDate(snapshotTimestamp(day, totalDays)) : "—"}
          dayLabel={`${day} / ${totalDays}`}
          onVerify={verify}
          verifying={verifying}
          verifiedAt={verifiedAt}
        />
        <Timeline day={day} totalDays={totalDays} onDay={setDay} />
      </div>

      {error && <ErrorBanner message={error} />}

      {data && (
        <DashboardBody
          data={data}
          day={day}
          verified={verified}
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
  verified: boolean;
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
    verified,
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
  const vm = buildViewModel(data, ledger, { day, selection, range, verified }, DEFAULT_THRESHOLDS);
  const contract = selectedContract(selection);

  return (
    <>
      <KpiStrip kpis={vm.kpis} />
      <TopologySection topology={vm.topology} onSelect={onSelectContract} />
      <MonitoringSection
        cursorX={vm.cursorX}
        snapshotDate={isoDate(snapshotTimestamp(day, data.length))}
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
        selectedHasLink={contract.hasLink}
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
