import Rpc from "./rpc.js";
import { Network, Shares } from "./types.js";
import { ACRDX_CONTRACT_ADDRESSES, CHRONICLE_ORACLE_ADDRESS, DAYS_TO_MONITOR } from "./constants.js";
import { formatUnits } from "viem/utils";
import saveAsJSONFile from "./file.js";

const main = async (): Promise<void> => {
  const start = Date.now();
  const rpc = new Rpc();

  const [ethereumVaultPrice, optimismVaultPrice, monadVaultPrice, baseVaultPrice, plumeVaultPrice] = await Promise.all([
    rpc.getPriceFromVault(Network.ETH, ACRDX_CONTRACT_ADDRESSES[Network.ETH]),
    rpc.getPriceFromVault(Network.OP, ACRDX_CONTRACT_ADDRESSES[Network.OP]),
    rpc.getPriceFromVault(Network.MONAD, ACRDX_CONTRACT_ADDRESSES[Network.MONAD]),
    rpc.getPriceFromVault(Network.BASE, ACRDX_CONTRACT_ADDRESSES[Network.BASE]),
    rpc.getPriceFromVault(Network.PLUME, ACRDX_CONTRACT_ADDRESSES[Network.PLUME]),
  ]);

  console.log("Oracle price in vault contract:");
  console.log(ethereumVaultPrice);
  console.log(optimismVaultPrice);
  console.log(monadVaultPrice);
  console.log(baseVaultPrice);
  console.log(plumeVaultPrice);

  const [ethereum, optimism, monad, base, plume] = await Promise.all([
    rpc.getTotalSupplyByBlocks(Network.ETH, ACRDX_CONTRACT_ADDRESSES[Network.ETH]),
    rpc.getTotalSupplyByBlocks(Network.OP, ACRDX_CONTRACT_ADDRESSES[Network.OP]),
    rpc.getTotalSupplyByBlocks(Network.MONAD, ACRDX_CONTRACT_ADDRESSES[Network.MONAD]),
    rpc.getTotalSupplyByBlocks(Network.BASE, ACRDX_CONTRACT_ADDRESSES[Network.BASE]),
    rpc.getTotalSupplyByBlocks(Network.PLUME, ACRDX_CONTRACT_ADDRESSES[Network.PLUME]),
  ]);

  const shares: Shares[] = [];

  for (let i = 0; i < DAYS_TO_MONITOR; i++) {
    const total = ethereum[i].shares + optimism[i].shares + monad[i].shares + base[i].shares + plume[i].shares;

    shares.push({
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
  const currentTotalShares = Number(formatUnits(shares[44].total, 18)).toFixed(2);

  console.log("current price: ", formattedOraclePrice);
  console.log("current AUM: ", (Number(currentTotalShares) * Number(formattedOraclePrice)).toFixed(2));

  console.log(`Execution time: ${(Date.now() - start) / (60 * 1000)} min`);
  return;
};

main();
