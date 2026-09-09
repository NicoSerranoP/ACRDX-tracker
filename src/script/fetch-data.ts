import Rpc from "./rpc.js";
import { Network, Shares } from "../types.js";
import { formatUnits } from "viem/utils";
import saveAsJSONFile from "./file.js";
import { CHRONICLE_ORACLE_ADDRESS, DAYS_TO_MONITOR } from "../constants.js";

const main = async (): Promise<void> => {
  const start = Date.now();
  const rpc = new Rpc();

  const [ethereum, optimism, monad, base, plume] = await Promise.all([
    rpc.getDataByBlocks(Network.ETH),
    rpc.getDataByBlocks(Network.OP),
    rpc.getDataByBlocks(Network.MONAD),
    rpc.getDataByBlocks(Network.BASE),
    rpc.getDataByBlocks(Network.PLUME),
  ]);

  const shares: Shares[] = [];

  for (let i = 0; i < DAYS_TO_MONITOR; i++) {
    const total = ethereum[i].shares + optimism[i].shares + monad[i].shares + base[i].shares + plume[i].shares;

    shares.push({
      day: i + 1,
      total,
      blockNumbers: {
        [Network.ETH]: ethereum[i],
        [Network.OP]: optimism[i],
        [Network.MONAD]: monad[i],
        [Network.BASE]: base[i],
        [Network.PLUME]: plume[i],
      },
    });
  }

  await saveAsJSONFile("shares.json", shares);

  const oraclePrice = await rpc.getPrice(Network.ETH, CHRONICLE_ORACLE_ADDRESS);
  const formattedOraclePrice = Number(formatUnits(oraclePrice, 18)).toFixed(6);
  const currentTotalShares = Number(formatUnits(shares[shares.length - 1].total, 18)).toFixed(2);

  console.log("current price: ", formattedOraclePrice);
  console.log("current AUM: ", (Number(currentTotalShares) * Number(formattedOraclePrice)).toFixed(2));

  console.log(`Execution time: ${(Date.now() - start) / (60 * 1000)} min`);
  return;
};

main();
