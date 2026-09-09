import type { Network } from "../types";
import type { ContractKind } from "./types";

export interface ReconRow {
  network: Network;
  label: string;
  block: string;
  pps: string;
  ref: string;
  refSource: string;
  deviation: string;
  deviationBad: boolean;
  updated: string;
  age: string;
  ageBad: boolean;
  shares: string;
  status: string;
  bad: boolean;
}

export interface CheckResult {
  n: number;
  title: string;
  status: "PASS" | "BREACH";
  detail: string;
}

export interface Kpi {
  label: string;
  value: string;
  sub: string;
  color: "text" | "bad";
  linked: boolean;
  url: string;
}

export interface TopologyRow {
  kind: ContractKind;
  title: string;
  method: string;
  addrShort: string;
  url: string;
  hasLink: boolean;
  value: string;
  selected: boolean;
}

export interface TopologyNetwork {
  network: Network;
  label: string;
  fill: string;
  ink: string;
  block: string;
  rows: TopologyRow[];
}

export interface SupplyBar {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  tip: string;
  network: Network;
  day: number;
}

export interface AxisTick {
  y: number;
  topPct: number;
  label: string;
}

export interface DropMark {
  x: number;
  label: string;
}

export interface DropEvent {
  day: number;
  date: string;
  network: string;
  before: string;
  after: string;
  delta: string;
  pct: string;
  severity: "ALERT" | "NOTICE";
  networkKey: Network;
}

export type StaleLevel = "fresh" | "warn" | "stale";

export interface StaleCell {
  fill: StaleLevel;
  tip: string;
  day: number;
}

export interface StaleRow {
  network: Network;
  label: string;
  cells: StaleCell[];
}

export interface TxRow {
  block: string;
  date: string;
  event: string;
  amount: string;
  from: string;
  to: string;
  hash: string;
  url: string;
  flagged: boolean;
}
