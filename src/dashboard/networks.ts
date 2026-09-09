import { Network } from "../types";

export interface NetworkMeta {
  key: Network;
  label: string;
  fill: string;
  ink: string;
  explorer: string;
  /** Only the Ethereum deployment carries the Chronicle Labs oracle contract directly. */
  isOracleSource: boolean;
}

export const NETWORKS: Record<Network, NetworkMeta> = {
  [Network.ETH]: {
    key: Network.ETH,
    label: "Ethereum",
    fill: "#3C3C3D",
    ink: "#f2f2f3",
    explorer: "https://etherscan.io",
    isOracleSource: true,
  },
  [Network.OP]: {
    key: Network.OP,
    label: "Optimism",
    fill: "#FF0420",
    ink: "#f2f2f3",
    explorer: "https://optimistic.etherscan.io",
    isOracleSource: false,
  },
  [Network.BASE]: {
    key: Network.BASE,
    label: "Base",
    fill: "#0052FF",
    ink: "#f2f2f3",
    explorer: "https://basescan.org",
    isOracleSource: false,
  },
  [Network.MONAD]: {
    key: Network.MONAD,
    label: "Monad",
    fill: "#836EF9",
    ink: "#f2f2f3",
    explorer: "https://monadexplorer.com",
    isOracleSource: false,
  },
  [Network.PLUME]: {
    key: Network.PLUME,
    label: "Plume",
    fill: "#3F51B5",
    ink: "#f2f2f3",
    explorer: "https://explorer.plume.org",
    isOracleSource: false,
  },
};

/** NETWORKS in display order, for sections that render/iterate over all five chains. */
export const NETWORK_LIST: NetworkMeta[] = Object.values(NETWORKS);

/** Collection time of the sampled `shares.json` snapshot grid: 2026-09-07T12:00:00Z. */
export const ANCHOR_TIMESTAMP = 1788782400;

/** Unix timestamp represented by a given snapshot day (1..totalDays) on the sampling grid.
 *  totalDays must be the actual number of snapshots (data.length) so dates stay correct
 *  even if the configured collection window (VITE_DAYS_TO_MONITOR) drifts from what's on disk. */
export const snapshotTimestamp = (day: number, totalDays: number): number =>
  ANCHOR_TIMESTAMP - (totalDays - day) * 86400;

/** Day of the Plume burn incident (~10 Aug 2026) — the "burn day" timeline jump target. */
export const INCIDENT_DAY = 17;

export const DEFAULT_THRESHOLDS = {
  devTolerance: 0.001,
  stalenessHours: 24,
  dropThresholdPct: 5,
};
