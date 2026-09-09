import { formatUnits } from "viem";
import { BURNER_ADDRESS, CHRONICLE_ORACLE_ADDRESS, PLUME_BURN_TX_HASH, ZERO_ADDRESS } from "../constants";
import { Network } from "../types";
import type { Shares, Snapshot } from "../types";
import { formatUnits18 } from "./format";
import { INCIDENT_DAY, NETWORKS } from "./networks";
import { ledgerKey } from "./types";
import type { Ledger, LedgerEvent } from "./types";

const E18 = 10n ** 18n;
const LARGE_BURN_THRESHOLD = 1_000_000n * E18;

/** Deterministic PRNG (mulberry32) so the synthetic ledger is stable across renders. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomHex(rng: () => number, length: number): string {
  let out = "0x";
  for (let i = 0; i < length; i++) out += "0123456789abcdef"[Math.floor(rng() * 16)];
  return out;
}

function transferEvents(
  network: Network,
  cur: Snapshot,
  prev: Snapshot,
  day: number,
  rng: () => number,
): LedgerEvent[] {
  const delta = cur.shares - prev.shares;
  if (delta === 0n) {
    if (rng() >= 0.22) return [];
    const amount = BigInt(Math.floor(rng() * 90000 + 500)) * E18;
    const block = Number(cur.block) - Math.floor(rng() * 900);
    return [
      {
        block,
        day,
        event: "Transfer",
        amount: `${formatUnits18(amount, 2)} ACRDX`,
        from: randomHex(rng, 40),
        to: randomHex(rng, 40),
        hash: randomHex(rng, 64),
      },
    ];
  }

  const burn = delta < 0n;
  const magnitude = burn ? -delta : delta;
  const isLargeBurn = burn && magnitude > LARGE_BURN_THRESHOLD;
  const isRealPlumeBurn = network === Network.PLUME && isLargeBurn && day === INCIDENT_DAY;
  const block = Number(cur.block);
  const events: LedgerEvent[] = [];

  if (isLargeBurn) {
    events.push({
      block: block - 47,
      day,
      event: "Transfer",
      amount: `${formatUnits18(E18, 2)} ACRDX`,
      from: `${BURNER_ADDRESS}*`,
      to: ZERO_ADDRESS,
      hash: randomHex(rng, 64),
    });
  }

  events.push({
    block,
    day,
    event: burn ? "Burn" : "Mint",
    amount: `${formatUnits18(magnitude, 2)} ACRDX`,
    from: burn ? `${BURNER_ADDRESS}*` : ZERO_ADDRESS,
    to: burn ? ZERO_ADDRESS : `${BURNER_ADDRESS}*`,
    hash: isRealPlumeBurn ? PLUME_BURN_TX_HASH : randomHex(rng, 64),
    flagged: true,
  });

  return events;
}

function priceEvents(
  network: Network,
  cur: Snapshot,
  prev: Snapshot,
  day: number,
  rng: () => number,
): { vault: LedgerEvent[]; oracle: LedgerEvent[] } {
  if (cur.priceLastUpdated === prev.priceLastUpdated) return { vault: [], oracle: [] };

  const isSource = NETWORKS[network].isOracleSource;
  const block = Number(cur.block);
  const ownOraclePrice = Number(formatUnits(cur.oraclePrice, 18));
  const vaultPrice = Number(cur.pricePerShare) / 1e6;

  const vault: LedgerEvent[] = [
    {
      block,
      day,
      event: "PriceUpdated",
      amount: `${vaultPrice.toFixed(6)} USDC/share`,
      from: isSource ? CHRONICLE_ORACLE_ADDRESS : "Axelar gateway",
      to: "USDC Vault",
      hash: randomHex(rng, 64),
    },
  ];
  const oracle: LedgerEvent[] = [
    {
      block,
      day,
      event: isSource ? "Poke" : "MessageExecuted",
      amount: `${(isSource ? ownOraclePrice || vaultPrice : vaultPrice).toFixed(6)} USD`,
      from: isSource ? "Chronicle validators" : "Ethereum mainnet",
      to: isSource ? CHRONICLE_ORACLE_ADDRESS : "Cross-chain oracle",
      hash: randomHex(rng, 64),
    },
  ];

  return { vault, oracle };
}

function buildNetworkLedger(network: Network, data: Shares[], seed: number): Pick<Ledger, string> {
  const rng = mulberry32(seed);
  const token: LedgerEvent[] = [];
  const vault: LedgerEvent[] = [];
  const oracle: LedgerEvent[] = [];

  for (let i = 1; i < data.length; i++) {
    const cur = data[i].blockNumbers[network];
    const prev = data[i - 1].blockNumbers[network];
    const day = data[i].day;

    token.push(...transferEvents(network, cur, prev, day, rng));
    const prices = priceEvents(network, cur, prev, day, rng);
    vault.push(...prices.vault);
    oracle.push(...prices.oracle);
  }

  return {
    [ledgerKey(network, "token")]: token,
    [ledgerKey(network, "vault")]: vault,
    [ledgerKey(network, "oracle")]: oracle,
  };
}

/** Synthetic-but-data-grounded transaction ledger, derived from supply/price deltas in `data`. */
export function buildLedger(data: Shares[], networks: Network[]): Ledger {
  return networks.reduce<Ledger>(
    (acc, network, index) => Object.assign(acc, buildNetworkLedger(network, data, 9137 + index * 31)),
    {},
  );
}
