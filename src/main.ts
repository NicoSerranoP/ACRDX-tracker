import Rpc from "./rpc.js";
import { Network } from "./types.js";
import { ACRDX_CONTRACT_ADDRESSES, CHRONICLE_ORACLE_ADDRESS } from "./constants.js";
import { formatUnits } from "viem/utils";

const main = async (): Promise<void> => {
  const rpc = new Rpc();

  const oraclePrice = await rpc.getPrice(Network.ETH, CHRONICLE_ORACLE_ADDRESS);

  const result = await rpc.getTotalSupplyByBlocks(Network.ETH, ACRDX_CONTRACT_ADDRESSES[Network.ETH]);

  result.forEach(({ block, total }) => {
    console.log("block: ", block);
    console.log("total: ", Number(formatUnits(total, 18)).toFixed(2));
    console.log("price: ", Number(formatUnits(oraclePrice, 18)).toFixed(6));
  });

  return;
};

main();
