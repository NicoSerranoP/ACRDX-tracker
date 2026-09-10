import { useCallback, useState } from "react";
import rpc from "./clients";
import { Network, Snapshot } from "../types";

export function useFetchOnChainData() {
  const [data, setData] = useState<Record<Network, Snapshot> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setData(null);
    setLoading(true);
    setError(null);

    try {
      await rpc.setupContracts();

      const oraclePrice = await rpc.oracleContract.read.read();

      const networks = Object.values(Network);

      const results = await Promise.all(
        networks.map(async (network) => {
          const [block, totalSupply, pricePerShare, priceLastUpdated] = await Promise.all([
            rpc.clients[network].getBlock({ blockTag: "latest" }),
            rpc.acrdxContracts[network].read.totalSupply(),
            rpc.usdcVaultContracts[network].read.pricePerShare(),
            rpc.usdcVaultContracts[network].read.priceLastUpdated(),
          ]);

          return {
            block: block.number,
            shares: totalSupply as bigint,
            oraclePrice: oraclePrice as bigint,
            pricePerShare: pricePerShare as bigint,
            priceLastUpdated: priceLastUpdated as bigint,
          };
        }),
      );

      setData(
        networks.reduce(
          (acc, network, index) => {
            acc[network] = results[index];
            return acc;
          },
          {} as Record<Network, Snapshot>,
        ),
      );

      setError(null);

      console.log("oraclePrice: ", oraclePrice);
      console.log("results: ", results);
    } catch (err) {
      setError((err as Error).message);
    }

    setLoading(false);
  }, []);

  return { data, loading, error, fetchData };
}
