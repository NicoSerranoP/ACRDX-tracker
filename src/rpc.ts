import { createPublicClient, http, PublicClient } from "viem";
import { Network } from "./types.js";

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
        transport: http(envRPCUrl, { batch: true }),
      });

      this.clients[network as Network] = client;
    });
  }
}
