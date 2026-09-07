import { loadEnvFile } from "node:process";
import { Hex } from "viem";

loadEnvFile("./.env");

export const ACRDX_CONTRACT_ADDRESS = process.env.ACRDX_CONTRACT_ADDRESS as Hex;
export const CHRONICLE_ORACLE_ADDRESS = process.env.CHRONICLE_ORACLE_ADDRESS as Hex;

if (!ACRDX_CONTRACT_ADDRESS) {
  throw new Error("nico ACRDX_CONTRACT_ADDRESS is not defined in the env variables.");
}

if (!CHRONICLE_ORACLE_ADDRESS) {
  throw new Error("CHRONICLE_ORACLE_ADDRESS is not defined in the env variables.");
}
