import type { GetContractReturnType, PublicClient } from "viem";

import ACRDX_ABI from "./abis/ACRDX.json" with { type: "json" };
import USDC_VAULT_ABI from "./abis/USDCVault.json" with { type: "json" };
import CHRONICLE_ORACLE_ABI from "./abis/ChronicleOracle.json" with { type: "json" };

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
  oracleAge?: bigint;
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

export type ACRDXContract = GetContractReturnType<typeof ACRDX_ABI, PublicClient>;
export type ChronicleOracleContract = GetContractReturnType<typeof CHRONICLE_ORACLE_ABI, PublicClient>;
export type USDCVaultContract = GetContractReturnType<typeof USDC_VAULT_ABI, PublicClient>;
