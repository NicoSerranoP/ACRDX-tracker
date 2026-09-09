import { Network } from "../types.js";
import { DAYS_TO_MONITOR, ONE_DAY_IN_BLOCKS } from "./constants.js";

const getBlocksToMonitor = (currentBlock: bigint, network: Network): bigint[] => {
  const blocksToMonitor: bigint[] = [];

  for (let i = DAYS_TO_MONITOR - 1n; i >= 0n; i--) {
    blocksToMonitor.push(currentBlock - i * ONE_DAY_IN_BLOCKS[network]);
  }

  return blocksToMonitor;
};

export default getBlocksToMonitor;
