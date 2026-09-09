import { createPublicClient, getContract, Hex, http, PublicClient } from "viem";

import ACRDX_ABI from "../abis/ACRDX.json" with { type: "json" };
import USDC_VAULT_ABI from "../abis/USDCVault.json" with { type: "json" };
import CHRONICLE_ORACLE_ABI from "../abis/ChronicleOracle.json" with { type: "json" };
import { BlockResult, Network, Snapshot } from "../types.js";
import {
  ACRDX_CONTRACT_ADDRESSES,
  CHRONICLE_ORACLE_ADDRESS,
  DAYS_TO_MONITOR,
  ONE_DAY_IN_BLOCKS,
  ONE_DAY_IN_SECONDS,
  RPC_URLS,
  USDC_CONTRACT_ADDRESSES,
} from "../constants.js";

export default class Rpc {
  clients: Record<Network, PublicClient>;

  constructor() {
    this.clients = {} as Record<Network, PublicClient>;

    Object.values(Network).forEach((network) => {
      const client = createPublicClient({
        transport: http(RPC_URLS[network], { batch: { wait: 10 } }),
        batch: {
          multicall: {
            wait: 10,
          },
        },
      });

      this.clients[network] = client;
    });
  }

  async getDataByBlocks(network: Network): Promise<Snapshot[]> {
    const client = this.clients[network];

    const acrdxAddress = ACRDX_CONTRACT_ADDRESSES[network];
    const acrdxContract = getContract({
      client,
      address: acrdxAddress,
      abi: ACRDX_ABI,
    });

    const vaultAddress = (await acrdxContract.read.vault([USDC_CONTRACT_ADDRESSES[network]])) as Hex;
    const vaultContract = getContract({
      client,
      address: vaultAddress,
      abi: USDC_VAULT_ABI,
    });

    const oracleContract = getContract({
      client: this.clients[Network.ETH],
      address: CHRONICLE_ORACLE_ADDRESS,
      abi: CHRONICLE_ORACLE_ABI,
    });

    const blocks = await this.getBlockWindow(network);

    const promises = blocks.map(async (block) => {
      const [totalSupply, pricePerShare, priceLastUpdated] = await Promise.all([
        acrdxContract.read.totalSupply({ blockNumber: block }) as Promise<bigint>,
        vaultContract.read.pricePerShare({ blockNumber: block }) as Promise<bigint>,
        vaultContract.read.priceLastUpdated({ blockNumber: block }) as Promise<bigint>,
      ]);

      let oraclePrice = 0n;

      if (network === Network.ETH) {
        oraclePrice = (await oracleContract.read.read({ blockNumber: block })) as bigint;
      }

      return { block, shares: totalSupply, pricePerShare, priceLastUpdated, oraclePrice };
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
    const latest = await client.getBlock({ blockTag: "latest" });
    const latestBlock: BlockResult = { number: latest.number, timestamp: latest.timestamp };

    const sharedCache = new Map<bigint, bigint>([[latestBlock.number, latestBlock.timestamp]]);
    const window: bigint[] = [];
    let previousResolved: BlockResult | undefined;

    for (let i = DAYS_TO_MONITOR - 1n; i >= 0n; i--) {
      const targetDaySeconds = i * ONE_DAY_IN_SECONDS;
      const targetTimestamp = targetDaySeconds > latestBlock.timestamp ? 0n : latestBlock.timestamp - targetDaySeconds;

      const guessedDayBlocks = i * ONE_DAY_IN_BLOCKS[network];
      const guessedBlockNumber = guessedDayBlocks > latestBlock.number ? 0n : latestBlock.number - guessedDayBlocks;

      const lowBound = previousResolved && previousResolved.timestamp <= targetTimestamp ? previousResolved.number : 0n;

      const resolved = await this.getBlockByTimestamp(client, targetTimestamp, guessedBlockNumber, {
        latestBlock,
        cache: sharedCache,
        lowBound,
      });

      window.push(resolved.number);
      previousResolved = resolved;
    }

    return window;
  }

  async getBlockByTimestamp(
    client: PublicClient,
    targetTimestamp: bigint,
    guessedBlockNumber: bigint,
    searchOptions?: {
      latestBlock?: BlockResult;
      cache?: Map<bigint, bigint>;
      lowBound?: bigint;
      highBound?: bigint;
    },
  ): Promise<BlockResult> {
    const cache = searchOptions?.cache ?? new Map<bigint, bigint>();

    const getTimestampAt = async (blockNumber: bigint): Promise<bigint> => {
      const cached = cache.get(blockNumber);
      if (cached !== undefined) {
        return cached;
      }

      const block = await client.getBlock({ blockNumber });
      cache.set(blockNumber, block.timestamp);
      return block.timestamp;
    };

    let latestBlock = searchOptions?.latestBlock;
    if (!latestBlock) {
      const latest = await client.getBlock({ blockTag: "latest" });
      latestBlock = { number: latest.number, timestamp: latest.timestamp };
    }
    cache.set(latestBlock.number, latestBlock.timestamp);

    if (targetTimestamp > latestBlock.timestamp) {
      throw new Error("Target timestamp is after the last available block");
    }

    let low = searchOptions?.lowBound ?? 0n;

    if (low < 0n) {
      low = 0n;
    }

    if (low > latestBlock.number) {
      low = latestBlock.number;
    }

    let high = searchOptions?.highBound ?? latestBlock.number;

    if (high > latestBlock.number) {
      high = latestBlock.number;
    }

    if (high < low) {
      high = low;
    }

    if (guessedBlockNumber >= low && guessedBlockNumber <= high) {
      const guessedTimestamp = await getTimestampAt(guessedBlockNumber);

      if (guessedTimestamp <= targetTimestamp) {
        low = guessedBlockNumber;
      }

      if (guessedTimestamp >= targetTimestamp) {
        high = guessedBlockNumber;
      }
    }

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
