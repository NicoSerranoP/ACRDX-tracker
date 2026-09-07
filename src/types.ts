export enum Network {
  ETH = "ETH",
  OP = "OP",
  MONAD = "MONAD",
  BASE = "BASE",
  PLUME = "PLUME",
}

export interface OnChainData {
  total: bigint;
  block: bigint;
}
