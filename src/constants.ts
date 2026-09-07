import { loadEnvFile } from "node:process";
import { Hex } from "viem";
import { Network } from "./types.js";

loadEnvFile("./.env");

export const DAYS_TO_MONITOR = BigInt(process.env.DAYS_TO_MONITOR ?? "45");
export const CHRONICLE_ORACLE_ADDRESS = process.env.CHRONICLE_ORACLE_ADDRESS as Hex;
export const ACRDX_ETH_CONTRACT_ADDRESS = process.env.ACRDX_ETH_CONTRACT_ADDRESS as Hex;
export const ACRDX_OP_CONTRACT_ADDRESS = process.env.ACRDX_OP_CONTRACT_ADDRESS as Hex;
export const ACRDX_MONAD_CONTRACT_ADDRESS = process.env.ACRDX_MONAD_CONTRACT_ADDRESS as Hex;
export const ACRDX_BASE_CONTRACT_ADDRESS = process.env.ACRDX_BASE_CONTRACT_ADDRESS as Hex;
export const ACRDX_PLUME_CONTRACT_ADDRESS = process.env.ACRDX_PLUME_CONTRACT_ADDRESS as Hex;

export const ACRDX_CONTRACT_ADDRESSES = {
  [Network.ETH]: ACRDX_ETH_CONTRACT_ADDRESS,
  [Network.OP]: ACRDX_OP_CONTRACT_ADDRESS,
  [Network.MONAD]: ACRDX_MONAD_CONTRACT_ADDRESS,
  [Network.BASE]: ACRDX_BASE_CONTRACT_ADDRESS,
  [Network.PLUME]: ACRDX_PLUME_CONTRACT_ADDRESS,
};

if (!CHRONICLE_ORACLE_ADDRESS) {
  throw new Error("CHRONICLE_ORACLE_ADDRESS is not defined in the env variables.");
}

if (!ACRDX_ETH_CONTRACT_ADDRESS) {
  throw new Error("ACRDX_ETH_CONTRACT_ADDRESS is not defined in the env variables.");
}

if (!ACRDX_OP_CONTRACT_ADDRESS) {
  throw new Error("ACRDX_OP_CONTRACT_ADDRESS is not defined in the env variables.");
}

if (!ACRDX_MONAD_CONTRACT_ADDRESS) {
  throw new Error("ACRDX_MONAD_CONTRACT_ADDRESS is not defined in the env variables.");
}

if (!ACRDX_BASE_CONTRACT_ADDRESS) {
  throw new Error("ACRDX_BASE_CONTRACT_ADDRESS is not defined in the env variables.");
}

if (!ACRDX_PLUME_CONTRACT_ADDRESS) {
  throw new Error("ACRDX_PLUME_CONTRACT_ADDRESS is not defined in the env variables.");
}
