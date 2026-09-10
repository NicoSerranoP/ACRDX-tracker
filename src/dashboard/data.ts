import { useEffect, useState } from "react";
import { Network } from "../types";
import type { Shares, Snapshot } from "../types";
import type { RawShares, RawSnapshot } from "./types";
import { useFetchOnChainData } from "../utils/fetch-data";

const parseSnapshot = (raw: RawSnapshot): Snapshot => ({
  block: BigInt(raw.block),
  shares: BigInt(raw.shares),
  oraclePrice: BigInt(raw.oraclePrice),
  pricePerShare: BigInt(raw.pricePerShare),
  priceLastUpdated: BigInt(raw.priceLastUpdated),
  oracleAge: raw.oracleAge !== undefined ? BigInt(raw.oracleAge) : undefined,
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
  /** True while a manually-triggered live on-chain re-fetch (via verify()) is in flight. */
  verifying: boolean;
  /** Timestamp (ms) of the last successful manual verification, or null if never verified. */
  verifiedAt: number | null;
  /** Fetches the latest on-chain snapshot and, on success, merges it into the current day and stamps verifiedAt. */
  verify: () => void;
}

export function useShareHistory(): ShareHistoryState {
  const [data, setData] = useState<Shares[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifiedAt, setVerifiedAt] = useState<number | null>(null);
  const { data: liveData, loading: verifying, error: liveError, fetchData: fetchLiveData } = useFetchOnChainData();

  useEffect(() => {
    fetch("/shares.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status} reading /shares.json`);
        return response.json();
      })
      .then((raw: RawShares[]) => {
        setData(parseShares(raw));
        setError(null);
      })
      .catch((err: Error) => {
        setData(null);
        setError(err.message);
      });
  }, []);

  // A successful verify() merges the live on-chain snapshot into the most recent day, rather
  // than replacing the whole history, so the rest of the dashboard's day-by-day view is untouched.
  useEffect(() => {
    if (!liveData) return;
    const total = Object.values(Network).reduce((sum, network) => sum + liveData[network].shares, 0n);
    setData((current) => {
      if (!current || current.length === 0) return current;
      const lastIndex = current.length - 1;
      const updated = [...current];
      updated[lastIndex] = { ...updated[lastIndex], total, blockNumbers: liveData };
      return updated;
    });
    setError(null);
    setVerifiedAt(Date.now());
  }, [liveData]);

  useEffect(() => {
    if (!liveError) return;
    setError(liveError);
    setVerifiedAt(null);
  }, [liveError]);

  const verify = () => {
    if (verifying) return;
    fetchLiveData();
  };

  return { data, error, verifying, verifiedAt, verify };
}
