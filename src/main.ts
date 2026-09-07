import { loadEnvFile } from "node:process";
import Rpc from "./rpc.js";
import { Network } from "./types.js";

loadEnvFile("./.env");

const main = (): void => {
  const rpcProvider = new Rpc();

  console.log("ETH RPC URL:", rpcProvider.clients[Network.ETH]);
  console.log("OP RPC URL:", rpcProvider.clients[Network.OP]);
  console.log("MONAD RPC URL:", rpcProvider.clients[Network.MONAD]);
  console.log("BASE RPC URL:", rpcProvider.clients[Network.BASE]);
  console.log("PLUME RPC URL:", rpcProvider.clients[Network.PLUME]);
  return;
};

main();
