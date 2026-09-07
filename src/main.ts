import Rpc from "./rpc.js";
import { Network, OnChainData } from "./types.js";
import { ACRDX_CONTRACT_ADDRESS, CHRONICLE_ORACLE_ADDRESS } from "./constants.js";
import getBlocksToMonitor from "./blocks.js";
import { formatUnits } from "viem/utils";

const main = async (): Promise<void> => {
  const rpc = new Rpc();

  const currentBlockNumber = await rpc.clients[Network.ETH].getBlockNumber();

  const blocksToMonitor = getBlocksToMonitor(currentBlockNumber, Network.ETH);

  const result: OnChainData[] = await Promise.all(
    blocksToMonitor.map(async (block) => {
      const [total, price] = await Promise.all([
        rpc.getTotalSupply(Network.ETH, ACRDX_CONTRACT_ADDRESS, block),
        rpc.getPrice(Network.ETH, CHRONICLE_ORACLE_ADDRESS, block),
      ]);

      const data: OnChainData = { block, total, price };

      return data;
    }),
  );

  result.forEach(({ block, total, price }) => {
    console.log("block: ", block);
    console.log("total: ", Number(formatUnits(total, 18)).toFixed(2));
    console.log("price: ", Number(formatUnits(price, 18)).toFixed(2));
  });

  return;
};

main();
