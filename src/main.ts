import Rpc from "./rpc.js";
import { Network, Shares } from "./types.js";
import { ACRDX_CONTRACT_ADDRESSES, CHRONICLE_ORACLE_ADDRESS, DAYS_TO_MONITOR } from "./constants.js";
import { formatUnits } from "viem/utils";
import saveAsJSONFile from "./file.js";

const main = async (): Promise<void> => {
  const rpc = new Rpc();

  const [ethereum, optimism, monad, base, plume] = await Promise.all([
    rpc.getTotalSupplyByBlocks(Network.ETH, ACRDX_CONTRACT_ADDRESSES[Network.ETH]),
    rpc.getTotalSupplyByBlocks(Network.OP, ACRDX_CONTRACT_ADDRESSES[Network.OP]),
    rpc.getTotalSupplyByBlocks(Network.MONAD, ACRDX_CONTRACT_ADDRESSES[Network.MONAD]),
    rpc.getTotalSupplyByBlocks(Network.BASE, ACRDX_CONTRACT_ADDRESSES[Network.BASE]),
    rpc.getTotalSupplyByBlocks(Network.PLUME, ACRDX_CONTRACT_ADDRESSES[Network.PLUME]),
  ]);

  const shares: Shares[] = [];

  for (let i = 0; i < DAYS_TO_MONITOR; i++) {
    const total = ethereum[0].shares + optimism[0].shares + monad[0].shares + base[0].shares + plume[0].shares;

    shares.push({
      total,
      blockNumbers: {
        [Network.ETH]: ethereum[0],
        [Network.OP]: optimism[0],
        [Network.MONAD]: monad[0],
        [Network.BASE]: base[0],
        [Network.PLUME]: plume[0],
      },
    });
  }

  await saveAsJSONFile("shares.json", shares);

  const oraclePrice = await rpc.getPrice(Network.ETH, CHRONICLE_ORACLE_ADDRESS);
  const formattedOraclePrice = Number(formatUnits(oraclePrice, 18)).toFixed(6);
  const currentTotalShares = Number(formatUnits(shares[44].total, 18)).toFixed(2);

  console.log("oraclePrice: ", formattedOraclePrice);
  console.log("current AUM:", (Number(currentTotalShares) * Number(formattedOraclePrice)).toFixed(2));

  return;
};

main();
