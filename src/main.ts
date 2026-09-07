import Rpc from "./rpc.js";
import { Network } from "./types.js";
import { ACRDX_CONTRACT_ADDRESS, CHRONICLE_ORACLE_ADDRESS } from "./constants.js";

const main = async (): Promise<void> => {
  const rpc = new Rpc();

  const total = await rpc.getTotalSupply(Network.ETH, ACRDX_CONTRACT_ADDRESS);
  const price = await rpc.getPrice(Network.ETH, CHRONICLE_ORACLE_ADDRESS);

  console.log("total: ", total);
  console.log("price: ", price);

  return;
};

main();
