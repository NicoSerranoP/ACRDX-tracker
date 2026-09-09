import { useEffect, useState } from "react";
import { useFetchOnChainData } from "./utils/fetch-data";

type NetworkKey = "ETH" | "OP" | "MONAD" | "BASE" | "PLUME";

type ShareEntry = {
  day: number;
  total: string;
  blockNumbers: Record<
    NetworkKey,
    {
      block: string;
      shares: string;
      pricePerShare: string;
      priceLastUpdated: string;
      oraclePrice: string;
    }
  >;
};

export default function App() {
  const [data, setData] = useState<ShareEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchData } = useFetchOnChainData();

  useEffect(() => {
    fetch("/shares.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status}`);
        }
        return response.json();
      })
      .then((json: ShareEntry[]) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading shares...</div>;
  }

  if (error) {
    return <div style={{ padding: "2rem", color: "crimson" }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Shares data</h1>

      <button onClick={fetchData}>Fetch On-Chain Data</button>

      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 1200 }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem", textAlign: "left" }}>Day</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem", textAlign: "left" }}>Total</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem", textAlign: "left" }}>ETH</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem", textAlign: "left" }}>OP</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem", textAlign: "left" }}>MONAD</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem", textAlign: "left" }}>BASE</th>
            <th style={{ border: "1px solid #ddd", padding: "0.5rem", textAlign: "left" }}>PLUME</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.day}>
              <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{entry.day}</td>
              <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{entry.total}</td>
              <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{entry.blockNumbers.ETH?.shares ?? "0"}</td>
              <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{entry.blockNumbers.OP?.shares ?? "0"}</td>
              <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{entry.blockNumbers.MONAD?.shares ?? "0"}</td>
              <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{entry.blockNumbers.BASE?.shares ?? "0"}</td>
              <td style={{ border: "1px solid #ddd", padding: "0.5rem" }}>{entry.blockNumbers.PLUME?.shares ?? "0"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
