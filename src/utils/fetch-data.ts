import { useCallback, useState } from "react";
import { CHRONICLE_ORACLE_ADDRESS } from "../constants";

export function useFetchOnChainData() {
  const [data, setData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    console.log("Nico is here");
    console.log(CHRONICLE_ORACLE_ADDRESS);
  }, []);

  return { data, loading, error, fetchData };
}
