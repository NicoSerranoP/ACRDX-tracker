import { loadEnvFile } from "node:process";
import { createPublicClient, getContract, Hex, http, PublicClient } from "viem";

import ACRDX_ABI from "./abis/ACRDX.json" with { type: "json" };
import CHRONICLE_ORACLE_ABI from "./abis/ChronicleOracle.json" with { type: "json" };
import { BlockResult, Network, Snapshot } from "./types.js";
import { DAYS_TO_MONITOR, ONE_DAY_IN_BLOCKS, ONE_DAY_IN_SECONDS } from "./constants.js";

loadEnvFile("./.env");

export default class Rpc {
  clients: Record<Network, PublicClient>;

  constructor() {
    this.clients = {} as Record<Network, PublicClient>;

    Object.values(Network).forEach((network) => {
      const envRPCUrl = process.env[`${network}_RPC_URL`];

      if (!envRPCUrl) {
        throw new Error(`RPC URL for ${network} is not defined in the env variables.`);
      }

      const client = createPublicClient({
        transport: http(envRPCUrl, { batch: { wait: 10 } }),
        batch: {
          multicall: {
            wait: 10,
          },
        },
      });

      this.clients[network as Network] = client;
    });
  }

  async getTotalSupplyByBlocks(network: Network, address: Hex): Promise<Snapshot[]> {
    const client = this.clients[network];
    const blocks = await this.getBlockWindow(network);

    const contract = getContract({
      client,
      address,
      abi: ACRDX_ABI,
    });

    const promises = blocks.map(async (block) => {
      const total = (await contract.read.totalSupply({ blockNumber: block })) as bigint;

      return { block, shares: total };
    });

    return Promise.all(promises);
  }

  async getPrice(network: Network, address: Hex, blockNumber?: bigint) {
    const client = this.clients[network];

    const contract = getContract({
      client,
      address,
      abi: CHRONICLE_ORACLE_ABI,
    });

    return contract.read.read({ blockNumber }) as Promise<bigint>;
  }

  async getBlockWindow(network: Network): Promise<bigint[]> {
    const client = this.clients[network];
    const latestBlock = await client.getBlock();

    const window: bigint[] = [];

    for (let i = DAYS_TO_MONITOR - 1n; i >= 0n; i--) {
      const targetDaySeconds = i * ONE_DAY_IN_SECONDS;
      const targetTimestamp = targetDaySeconds > latestBlock.timestamp ? 0n : latestBlock.timestamp - targetDaySeconds;

      const guessedDayBlocks = i * ONE_DAY_IN_BLOCKS[network];
      const guessedBlockNumber = guessedDayBlocks > latestBlock.number ? 0n : latestBlock.number - guessedDayBlocks;

      const resolved = await this.getBlockByTimestamp(client, targetTimestamp, guessedBlockNumber);
      window.push(resolved.number);
    }

    return window;
  }

  async getBlockByTimestamp(
    client: PublicClient,
    targetTimestamp: bigint,
    guessedBlockNumber: bigint,
  ): Promise<BlockResult> {
    const cache = new Map<bigint, bigint>();

    const getTimestampAt = async (blockNumber: bigint): Promise<bigint> => {
      const cached = cache.get(blockNumber);
      if (cached !== undefined) {
        return cached;
      }

      const block = await client.getBlock({ blockNumber });
      cache.set(blockNumber, block.timestamp);
      return block.timestamp;
    };

    const latestBlock = await client.getBlock({ blockTag: "latest" });
    cache.set(latestBlock.number, latestBlock.timestamp);

    if (targetTimestamp > latestBlock.timestamp) {
      throw new Error("Target timestamp is after the last available block");
    }

    let low = 0n;
    if (guessedBlockNumber > 0n && guessedBlockNumber <= latestBlock.number) {
      const guessedLowTimestamp = await getTimestampAt(guessedBlockNumber);
      if (guessedLowTimestamp <= targetTimestamp) {
        low = guessedBlockNumber;
      }
    }

    let high = latestBlock.number;
    let result: BlockResult = {
      number: latestBlock.number,
      timestamp: latestBlock.timestamp,
    };

    while (low <= high) {
      const mid = low + (high - low) / 2n;
      const midTimestamp = await getTimestampAt(mid);

      if (midTimestamp >= targetTimestamp) {
        result = { number: mid, timestamp: midTimestamp };
        if (mid === 0n) break;
        high = mid - 1n;
      } else {
        low = mid + 1n;
      }
    }

    return result;
  }
}
