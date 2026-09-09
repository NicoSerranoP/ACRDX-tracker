import { useEffect, useState } from "react";
import { Network } from "../types";
import type { Shares, Snapshot } from "../types";
import type { RawShares, RawSnapshot } from "./types";

const parseSnapshot = (raw: RawSnapshot): Snapshot => ({
  block: BigInt(raw.block),
  shares: BigInt(raw.shares),
  oraclePrice: BigInt(raw.oraclePrice),
  pricePerShare: BigInt(raw.pricePerShare),
  priceLastUpdated: BigInt(raw.priceLastUpdated),
});

export const parseShares = (raw: RawShares[]): Shares[] =>
  raw.map((entry) => ({
    day: entry.day,
    total: BigInt(entry.total),
    blockNumbers: Object.fromEntries(
      Object.values(Network).map((network) => [network, parseSnapshot(entry.blockNumbers[network])]),
    ) as Record<Network, Snapshot>,
  }));

export interface ShareHistoryState {
  data: Shares[] | null;
  error: string | null;
}

export function useShareHistory(): ShareHistoryState {
  const [state, setState] = useState<ShareHistoryState>({ data: null, error: null });

  useEffect(() => {
    fetch("/shares.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status} reading /shares.json`);
        return response.json();
      })
      .then((raw: RawShares[]) => setState({ data: parseShares(raw), error: null }))
      .catch((err: Error) => setState({ data: null, error: err.message }));
  }, []);

  return state;
}
