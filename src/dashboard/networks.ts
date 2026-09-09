import { ACRDX_CONTRACT_ADDRESSES, CHRONICLE_ORACLE_ADDRESS, DAYS_TO_MONITOR } from "../constants";
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

export const NETWORKS: NetworkMeta[] = [
  {
    key: Network.ETH,
    label: "Ethereum",
    fill: "#3C3C3D",
    ink: "#f2f2f3",
    explorer: "https://etherscan.io",
    isOracleSource: true,
  },
  {
    key: Network.OP,
    label: "Optimism",
    fill: "#FF0420",
    ink: "#f2f2f3",
    explorer: "https://optimistic.etherscan.io",
    isOracleSource: false,
  },
  {
    key: Network.BASE,
    label: "Base",
    fill: "#0052FF",
    ink: "#f2f2f3",
    explorer: "https://basescan.org",
    isOracleSource: false,
  },
  {
    key: Network.MONAD,
    label: "Monad",
    fill: "#836EF9",
    ink: "#f2f2f3",
    explorer: "https://monadexplorer.com",
    isOracleSource: false,
  },
  {
    key: Network.PLUME,
    label: "Plume",
    fill: "#3F51B5",
    ink: "#f2f2f3",
    explorer: "https://explorer.plume.org",
    isOracleSource: false,
  },
];

export const networkMeta = (network: Network): NetworkMeta => {
  const meta = NETWORKS.find((n) => n.key === network);
  if (!meta) throw new Error(`Unknown network: ${network}`);
  return meta;
};

export const tokenAddress = (network: Network): string => ACRDX_CONTRACT_ADDRESSES[network];

export const ORACLE_ADDRESS = CHRONICLE_ORACLE_ADDRESS;
export const DAYS = Number(DAYS_TO_MONITOR);

/** Collection time of the sampled `shares.json` snapshot grid: 2026-09-07T12:00:00Z. */
export const ANCHOR_TIMESTAMP = 1788782400;

/** Unix timestamp represented by a given snapshot day (1..DAYS) on the sampling grid. */
export const snapshotTimestamp = (day: number): number => ANCHOR_TIMESTAMP - (DAYS - day) * 86400;

/** Day of the Plume burn incident (~10 Aug 2026) — the "burn day" timeline jump target. */
export const INCIDENT_DAY = 17;

export const DEFAULT_THRESHOLDS = {
  devTolerance: 0.001,
  stalenessHours: 24,
  dropThresholdPct: 5,
};

/** Stand-in sender address for the repeat Plume/Ethereum burns, pending an indexer. */
export const BURNER_ADDRESS = "0x4a1e8Cf0b3d5d7A6F2c9E80B1d43aC7f6e5B2901";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/** Real Plume burn tx hash recorded in the design note (10 August 2026). */
export const PLUME_BURN_TX_HASH = "0x9436d124e15bea9def739ab01daf192f8c70b87d16787bbdddba2868ced5008e";
