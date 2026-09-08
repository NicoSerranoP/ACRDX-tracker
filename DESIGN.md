# Monitoring ACRDX

## What is ACRDX

ACRDX is a ShareToken smart contract representing the Tokenized Apollo Diversified Credit Fund issued by Anemoy Capital SPC Limited and deployed using the Centrifuge tokenization platform. The contract inherits a ERC-20 token structure where each one represents a unit of the fund's shares, therefore the `totalSupply` function reflects the total number of issued shares.

ACRDX is deployed in 5 different networks: Ethereum, Optimism, Monad, Base and Plume. The total amount of ACRDX on-chain shares is represented by the sum of the total supply across these networks.

## How to Monitor ACRDX

To monitor ACRDX, we track the on-chain total supply of the token and multiply it by the oracle price provided by Chronicle Labs and their Proof Of Assets mechanism (it is a trusted mechanism). We follow up token supply and oracle price accross a time frame in order to check for anomalies.

_TODO:_ Explore the ACRDX vaults to look for asset holdings (only USDC as of now) and cross-check them with the anomalies movement. It looks like it might be related to a staled oracle price. The vault exposes the Chronicle Labs price in `pricePerShare()` and `priceLastUpdated()`, We could monitor it for anomalies.

_TODO:_ Additionally, we compare this calculated value with the reported AUM (Assets Under Management) to ensure accuracy. The reported AUM is provided by <TO_BE_CONFIRMED_BUT_I_BELIEVE_BY_CENTRIFUGE_API>.

## Data sources

All this information was fetched on September 7th 2026

1. [Chronicle Labs Proof of Assets:](https://chroniclelabs.org/dashboard/proof-of-asset/anemoy-tokenized-apollo-acrdx): shows:
   - Share token price: $1.024337
   - Outstanding shares: 30,472,585
   - Net Asset Value (NAV): $31,2140,200 (share token price * outstanding shares = $31,214,196)
   - NAV calculation frequency: daily
   - This repo monitoring results: shares * oracle price = $31,214,197.40. There is a $1.40 discrepancy compared to the reported NAV.
   - **IMPORTANT:** shows 42,634,425 token supply on August 3rd
   - **IMPORTANT:** The ACRDX Transfers Analytics only show [one tx](https://explorer.plume.org/tx/0x9436d124e15bea9def739ab01daf192f8c70b87d16787bbdddba2868ced5008e?tab=state) with 12,020,502 being burned to 0x0 in the Plume network on August 10th 2026. Total supply before: 32,222,245. Total supply after: 20,201,743
   - **IMPORTANT:** The sender of the burn tx executed a similar tx burning 17M tokens in May 12th. He performs a 1 token test tx before executing the large burns (17M and 12M).

2. [Centrifuge Pool interface](https://app.centrifuge.io/pool/281474976710664): shows:
   - Accepts stablecoins: USDC, USDS, AUSD, USDT
   - If you interact with the ACRDX contract.vault(asset) function, you will see that the only active vault is for USDC.
   - **IMPORTANT:** shows $42,362,030 as Apollo Diversified Credit Market Value as of July 20, 2026. Maybe it is connected to the token supply event in August 3rd.

3. [Typescript monitoring tool](../README.md): shows
   - for exact daily monitoring, the script takes around ~5 minutes to finish.
   - `shares.json` (ETH block number: 25722135) shows the Plume burn incident. $42M before, $30M after.
   - `shares.json` (ETH block number: 25722135) shows another burn in Ethereum. 378,869 tokens before, 261,058 after. 117,810 burned tokens.
   - The Alchemy Monad API cannot get historical eth_call data. An open RPC endpoint is used instead.
