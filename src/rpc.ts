import { loadEnvFile } from "node:process";
import { createPublicClient, getContract, Hex, http, PublicClient } from "viem";

import ACRDX_ABI from "./abis/ACRDX.json" with { type: "json" };
import CHRONICLE_ORACLE_ABI from "./abis/ChronicleOracle.json" with { type: "json" };
import { Network } from "./types.js";

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
      });

      this.clients[network as Network] = client;
    });
  }

  async getTotalSupply(network: Network, address: Hex, blockNumber?: bigint) {
    const client = this.clients[network];

    const contract = getContract({
      client,
      address,
      abi: ACRDX_ABI,
    });

    return contract.read.totalSupply({ blockNumber }) as Promise<bigint>;
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
}
