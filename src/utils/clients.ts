import { createPublicClient, getContract, Hex, http, PublicClient } from "viem";
import { ACRDXContract, ChronicleOracleContract, Network, USDCVaultContract } from "../types";
import { ACRDX_CONTRACT_ADDRESSES, CHRONICLE_ORACLE_ADDRESS, RPC_URLS, USDC_CONTRACT_ADDRESSES } from "../constants";

import CHRONICLE_ORACLE_ABI from "../abis/ChronicleOracle.json" with { type: "json" };
import USDC_VAULT_ABI from "../abis/USDCVault.json" with { type: "json" };
import ACRDX_ABI from "../abis/ACRDX.json" with { type: "json" };

class Rpc {
  clients: Record<Network, PublicClient>;
  oracleContract: ChronicleOracleContract;
  acrdxContracts: Record<Network, ACRDXContract>;
  usdcVaultContracts: Record<Network, USDCVaultContract>;

  constructor() {
    this.clients = {} as Record<Network, PublicClient>;
    this.oracleContract = {} as ChronicleOracleContract;
    this.acrdxContracts = {} as Record<Network, ACRDXContract>;
    this.usdcVaultContracts = {} as Record<Network, USDCVaultContract>;

    const networks = Object.values(Network);

    networks.forEach(async (network) => {
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

  async setupContracts() {
    const networks = Object.values(Network);

    const promises = networks.map(async (network) => {
      const client = this.clients[network];

      const acrdxContract = getContract({
        client,
        address: ACRDX_CONTRACT_ADDRESSES[network],
        abi: ACRDX_ABI,
      });

      const vaultAddress = (await acrdxContract.read.vault([USDC_CONTRACT_ADDRESSES[network]])) as Hex;

      const vaultContract = getContract({
        client,
        address: vaultAddress,
        abi: USDC_VAULT_ABI,
      });

      this.acrdxContracts[network] = acrdxContract;
      this.usdcVaultContracts[network] = vaultContract;
    });

    await Promise.all(promises);

    const oracleContract = getContract({
      client: this.clients[Network.ETH],
      address: CHRONICLE_ORACLE_ADDRESS,
      abi: CHRONICLE_ORACLE_ABI,
    });

    this.oracleContract = oracleContract;
  }
}

const rpc = new Rpc();

export default rpc;
