import Rpc from "./rpc.js";
import { Network, OnChainData } from "./types.js";
import { ACRDX_CONTRACT_ADDRESSES, CHRONICLE_ORACLE_ADDRESS } from "./constants.js";
import getBlocksToMonitor from "./blocks.js";
import { formatUnits } from "viem/utils";

const main = async (): Promise<void> => {
  const rpc = new Rpc();

  const [currentBlockNumber, oraclePrice] = await Promise.all([
    rpc.clients[Network.ETH].getBlockNumber(),
    rpc.getPrice(Network.ETH, CHRONICLE_ORACLE_ADDRESS),
  ]);

  const blocksToMonitor = getBlocksToMonitor(currentBlockNumber, Network.ETH);

  const result: OnChainData[] = await Promise.all(
    blocksToMonitor.map(async (block) => {
      const total = await rpc.getTotalSupply(Network.ETH, ACRDX_CONTRACT_ADDRESSES[Network.ETH], block);
      const data: OnChainData = { block, total };

      return data;
    }),
  );

  result.forEach(({ block, total }) => {
    console.log("block: ", block);
    console.log("total: ", Number(formatUnits(total, 18)).toFixed(2));
    console.log("price: ", Number(formatUnits(oraclePrice, 18)).toFixed(2));
  });

  return;
};

main();
