import Rpc from "./rpc.js";
import { Network } from "./types.js";
import { ACRDX_CONTRACT_ADDRESS, CHRONICLE_ORACLE_ADDRESS } from "./constants.js";
import getBlocksToMonitor from "./blocks.js";

const main = async (): Promise<void> => {
  const rpc = new Rpc();

  const currentBlockNumber = await rpc.clients[Network.ETH].getBlockNumber();

  const blocksToMonitor = getBlocksToMonitor(currentBlockNumber, Network.ETH);

  const result = await Promise.all(
    blocksToMonitor.map(async (block) => {
      const [total, price] = await Promise.all([
        rpc.getTotalSupply(Network.ETH, ACRDX_CONTRACT_ADDRESS, block),
        rpc.getPrice(Network.ETH, CHRONICLE_ORACLE_ADDRESS, block),
      ]);

      return { block, total, price };
    }),
  );

  result.forEach(({ block, total, price }) => {
    console.log("block: ", block);
    console.log("total: ", total);
    console.log("price: ", price);
  });

  return;
};

main();
