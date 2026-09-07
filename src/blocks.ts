import { Network } from "./types.js";
import { DAYS_TO_MONITOR } from "./constants.js";

const getBlocksToMonitor = (currentBlock: bigint, network: Network): bigint[] => {
  let oneDayBlocks: bigint;

  switch (network) {
    case Network.ETH:
      oneDayBlocks = (24n * 60n * 60n) / 12n; // Assuming 12s per block
      break;
    case Network.OP:
      oneDayBlocks = (24n * 60n * 60n) / 2n; // Assuming 2s per block
      break;
    case Network.MONAD:
      oneDayBlocks = (24n * 60n * 60n * 5n) / 2n; // Assuming 0.4s = 4/10 s = 2/5 s per block
      break;
    case Network.BASE:
      oneDayBlocks = (24n * 60n * 60n) / 2n; // Assuming 2s per block
      break;
    case Network.PLUME:
      oneDayBlocks = (24n * 60n * 60n) / 1n; // Assuming 1s per block
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
