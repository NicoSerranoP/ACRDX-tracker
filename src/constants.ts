import type { Hex } from "viem";
import { Network } from "./types.js";

type EnvMap = Record<string, string | undefined>;

const viteEnv = (import.meta as ImportMeta & { env?: EnvMap }).env;
const nodeEnv = (globalThis as { process?: { env?: EnvMap } }).process?.env;
const nodeProcess = globalThis as { process?: { loadEnvFile?: (path?: string) => unknown } };

nodeProcess.process?.loadEnvFile?.("./.env");

const readEnv = (key: string): string | undefined => viteEnv?.[key] ?? nodeEnv?.[key];

const getRequiredEnv = (key: string): string => {
  const value = readEnv(key);

  if (!value || value === "undefined") {
    throw new Error(`${key} is not defined in the environment variables.`);
  }

  return value;
};

export const DAYS_TO_MONITOR = BigInt(readEnv("VITE_DAYS_TO_MONITOR") ?? "45");
export const CHRONICLE_ORACLE_ADDRESS = getRequiredEnv("VITE_CHRONICLE_ORACLE_ADDRESS") as Hex;

export const RPC_URLS = {
  [Network.ETH]: getRequiredEnv("VITE_ETH_RPC_URL"),
  [Network.OP]: getRequiredEnv("VITE_OP_RPC_URL"),
  [Network.MONAD]: getRequiredEnv("VITE_MONAD_RPC_URL"),
  [Network.BASE]: getRequiredEnv("VITE_BASE_RPC_URL"),
  [Network.PLUME]: getRequiredEnv("VITE_PLUME_RPC_URL"),
};

export const ACRDX_CONTRACT_ADDRESSES = {
  [Network.ETH]: getRequiredEnv("VITE_ACRDX_ETH_CONTRACT_ADDRESS") as Hex,
  [Network.OP]: getRequiredEnv("VITE_ACRDX_OP_CONTRACT_ADDRESS") as Hex,
  [Network.MONAD]: getRequiredEnv("VITE_ACRDX_MONAD_CONTRACT_ADDRESS") as Hex,
  [Network.BASE]: getRequiredEnv("VITE_ACRDX_BASE_CONTRACT_ADDRESS") as Hex,
  [Network.PLUME]: getRequiredEnv("VITE_ACRDX_PLUME_CONTRACT_ADDRESS") as Hex,
};

export const USDC_CONTRACT_ADDRESSES = {
  [Network.ETH]: getRequiredEnv("VITE_USDC_ETH_CONTRACT_ADDRESS") as Hex,
  [Network.OP]: getRequiredEnv("VITE_USDC_OP_CONTRACT_ADDRESS") as Hex,
  [Network.MONAD]: getRequiredEnv("VITE_USDC_MONAD_CONTRACT_ADDRESS") as Hex,
  [Network.BASE]: getRequiredEnv("VITE_USDC_BASE_CONTRACT_ADDRESS") as Hex,
  [Network.PLUME]: getRequiredEnv("VITE_USDC_PLUME_CONTRACT_ADDRESS") as Hex,
};

export const ONE_DAY_IN_BLOCKS = {
  [Network.ETH]: (24n * 60n * 60n) / 12n, // assuming 12s per block
  [Network.OP]: (24n * 60n * 60n) / 2n, // assuming 2s per block
  [Network.MONAD]: (24n * 60n * 60n * 10n) / 3n, // assuming 0.3s = 3/10 s per block
  [Network.BASE]: (24n * 60n * 60n) / 2n, // assuming 2s per block
  [Network.PLUME]: (24n * 60n * 60n * 5n) / 2n, // assuming 0.4s per block
};

export const ONE_DAY_IN_SECONDS = 24n * 60n * 60n;

export const CHART_WIDTH = 1000;
export const CHART_HEIGHT = 200;
export const CHART_VIEWBOX_HEIGHT = 214;

/** Stand-in sender address for the repeat Plume/Ethereum burns, pending an indexer. */
export const BURNER_ADDRESS = "0x4a1e8Cf0b3d5d7A6F2c9E80B1d43aC7f6e5B2901";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/** Real Plume burn tx hash recorded in the design note (10 August 2026). */
export const PLUME_BURN_TX_HASH = "0x9436d124e15bea9def739ab01daf192f8c70b87d16787bbdddba2868ced5008e";
