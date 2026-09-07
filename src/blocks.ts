import { Network } from "./types.js";
import { DAYS_TO_MONITOR } from "./constants.js";

const getBlocksToMonitor = (currentBlock: bigint, network: Network): bigint[] => {
  let oneDayBlocks: bigint;

  switch (network) {
    case Network.ETH:
      oneDayBlocks = (24n * 60n * 60n) / 12n; // Assuming 12s per block
      break;
    default:
      throw new Error("Unsupported network");
  }

  const blocksToMonitor: bigint[] = [];

  for (let i = DAYS_TO_MONITOR - 1n; i >= 0n; i--) {
    blocksToMonitor.push(currentBlock - i * oneDayBlocks);
  }

  return blocksToMonitor;
};

export default getBlocksToMonitor;
