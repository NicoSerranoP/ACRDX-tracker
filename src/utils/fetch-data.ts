import { useCallback, useState } from "react";
import rpc from "./clients";

export function useFetchOnChainData() {
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    await rpc.setupContracts();

    const price = await rpc.oracleContract.read.read();
    console.log("price: ", price);
  }, []);

  return { data, loading, error, fetchData };
}
