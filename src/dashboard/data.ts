import { useCallback, useEffect, useState } from "react";
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
  /** True while a manually-triggered re-fetch (via verify()) is in flight. */
  verifying: boolean;
  /** Timestamp (ms) of the last successful manual verification, or null if never verified. */
  verifiedAt: number | null;
  /** Re-fetches /shares.json on demand and, on success, stamps verifiedAt. */
  verify: () => void;
}

export function useShareHistory(): ShareHistoryState {
  const [data, setData] = useState<Shares[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifiedAt, setVerifiedAt] = useState<number | null>(null);

  const fetchShares = useCallback((markVerified: boolean) => {
    fetch("/shares.json", { cache: markVerified ? "no-store" : "default" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status} reading /shares.json`);
        return response.json();
      })
      .then((raw: RawShares[]) => {
        setData(parseShares(raw));
        setError(null);
        if (markVerified) setVerifiedAt(Date.now());
      })
      .catch((err: Error) => {
        setData(null);
        setError(err.message);
        if (markVerified) setVerifiedAt(null);
      })
      .finally(() => {
        if (markVerified) setVerifying(false);
      });
  }, []);

  useEffect(() => {
    fetchShares(false);
  }, [fetchShares]);

  const verify = () => {
    if (verifying) return;
    setVerifying(true);
    setVerifiedAt(null);
    fetchShares(true);
  };

  return { data, error, verifying, verifiedAt, verify };
}
