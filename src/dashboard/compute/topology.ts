import { formatUnits } from "viem";
import { ACRDX_CONTRACT_ADDRESSES, CHRONICLE_ORACLE_ADDRESS } from "../../constants";
import type { Network, Snapshot } from "../../types";
import { formatUnits18, groupNumber, shortAddress } from "../format";
import { NETWORK_LIST, NETWORKS, type NetworkMeta } from "../networks";
import type { ContractKind, Selection } from "../types";
import type { TopologyNetwork, TopologyRow } from "../viewTypes";

interface ContractInfo {
  title: string;
  method: string;
  addr: string;
  url: string;
}

function contractInfo(network: NetworkMeta, kind: ContractKind): ContractInfo {
  if (kind === "oracle") {
    return network.isOracleSource
      ? {
          title: "Chronicle Labs Oracle",
          method: "read()",
          addr: CHRONICLE_ORACLE_ADDRESS,
          url: `${network.explorer}/address/${CHRONICLE_ORACLE_ADDRESS}`,
        }
      : { title: "Cross-chain oracle", method: "updates vault", addr: "", url: "" };
  }
  if (kind === "token") {
    const addr = ACRDX_CONTRACT_ADDRESSES[network.key];
    return { title: "ERC20 Share Token", method: "totalSupply()", addr, url: `${network.explorer}/address/${addr}` };
  }
  return { title: "USDC Vault", method: "pricePerShare()", addr: "", url: "" };
}

function contractValue(kind: ContractKind, s: Snapshot): string {
  if (kind === "token") return formatUnits18(s.shares, 0);
  if (kind === "vault") return (Number(s.pricePerShare) / 1e6).toFixed(6);
  const ownOracle = Number(formatUnits(s.oraclePrice, 18));
  return (ownOracle > 0 ? ownOracle : Number(s.pricePerShare) / 1e6).toFixed(6);
}

function topologyRows(network: NetworkMeta, s: Snapshot, selection: Selection): TopologyRow[] {
  return (["oracle", "token", "vault"] as ContractKind[]).map((kind) => {
    const info = contractInfo(network, kind);
    return {
      kind,
      title: info.title,
      method: info.method,
      url: info.url,
      hasLink: Boolean(info.url),
      addrShort: info.addr ? shortAddress(info.addr) : "via vault(USDC)",
      value: contractValue(kind, s),
      selected: selection.network === network.key && selection.kind === kind,
    };
  });
}

export interface SelectedContract {
  title: string;
  addr: string;
  url: string;
  hasLink: boolean;
}

/** The title/address/link of the currently selected contract, for the Transactions section header. */
export function selectedContract(selection: Selection): SelectedContract {
  const network = NETWORKS[selection.network];
  const info = contractInfo(network, selection.kind);
  return {
    title: `${network.label} · ${info.title}`,
    addr: info.addr || "address resolved via ACRDX.vault(USDC) — link pending",
    url: info.url,
    hasLink: Boolean(info.url),
  };
}

export function computeTopology(blockNumbers: Record<Network, Snapshot>, selection: Selection): TopologyNetwork[] {
  return NETWORK_LIST.map((network) => {
    const s = blockNumbers[network.key];
    return {
      network: network.key,
      label: network.label,
      fill: network.fill,
      ink: network.ink,
      block: groupNumber(Number(s.block)),
      rows: topologyRows(network, s, selection),
    };
  });
}
