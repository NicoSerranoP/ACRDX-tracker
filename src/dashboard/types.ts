import type { Network, Snapshot } from "../types";

export type RawSnapshot = { [K in keyof Snapshot]: string };

export interface RawShares {
  day: number;
  total: string;
  blockNumbers: Record<Network, RawSnapshot>;
}

export type ContractKind = "oracle" | "token" | "vault";

export interface Selection {
  network: Network;
  kind: ContractKind;
}

export interface Thresholds {
  devTolerance: number;
  stalenessHours: number;
  dropThresholdPct: number;
}

export interface LedgerEvent {
  block: number;
  day: number;
  event: string;
  amount: string;
  from: string;
  to: string;
  hash: string;
  flagged?: boolean;
}

export type Ledger = Record<string, LedgerEvent[]>;

export const selectionKey = (selection: Selection): string => `${selection.network}:${selection.kind}`;

export const ledgerKey = (network: Network, kind: ContractKind): string => `${network}:${kind}`;
