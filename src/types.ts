export enum Network {
  ETH = "ETH",
  OP = "OP",
  MONAD = "MONAD",
  BASE = "BASE",
  PLUME = "PLUME",
}

export interface Snapshot {
  block: bigint;
  shares: bigint;
  oraclePrice: bigint;
  pricePerShare: bigint;
  priceLastUpdated: bigint;
}

export interface Shares {
  day: number;
  total: bigint;
  blockNumbers: Record<Network, Snapshot>;
}

export interface BlockResult {
  number: bigint;
  timestamp: bigint;
}
