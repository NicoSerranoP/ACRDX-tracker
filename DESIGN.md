# Monitoring ACRDX

## What is ACRDX

ACRDX is a ShareToken smart contract representing the Tokenized Apollo Diversified Credit Fund issued by Anemoy Capital SPC Limited and deployed using the Centrifuge tokenization platform. The contract inherits a ERC-20 token structure where each one represents a unit of the fund's shares, therefore the `totalSupply` function reflects the total number of issued shares.

ACRDX is deployed in 5 different networks: Ethereum, Optimism, Monad, Base and Plume. The total amount of ACRDX on-chain shares is represented by the sum of the total supply across these networks.

## How to Monitor ACRDX

To monitor ACRDX, we track the on-chain total supply of the token and multiply it by the oracle price provided by Chronicle Labs and their Proof Of Assets mechanism (it is a trusted mechanism). Additionally, we compare this calculated value with the reported AUM (Assets Under Management) to ensure accuracy. The reported AUM is provided by <TO_BE_CONFIRMED_BUT_I_BELIEVE_BY_CENTRIFUGE_API>.

## Data sources

1. [Chronicle Labs Proof of Assets:](https://chroniclelabs.org/dashboard/proof-of-asset/anemoy-tokenized-apollo-acrdx): shows:
   - Share token price: $1.024337
   - Outstanding shares: 30,472,585
   - Net Asset Value (NAV): $31,2140,200 (share token price * outstanding shares = $31,214,196)
   - NAV calculation frequency: daily
   - **IMPORTANT:** shows 42,634,425 token supply on August 3rd
   - **IMPORTANT:** The ACRDX Transfers Analytics only show [one tx](https://explorer.plume.org/tx/0x9436d124e15bea9def739ab01daf192f8c70b87d16787bbdddba2868ced5008e?tab=state) with 12,020,502 being burned to 0x0 in the Plume network. Total supply before: 32,222,245. Total supply after: 20,201,743

2. [Centrifuge Pool interface](https://app.centrifuge.io/pool/281474976710664): shows:
   - Accepts stablecoins: USDC, USDS, AUSD, USDT
   - **IMPORTANT:** shows $42,362,030 as Apollo Diversified Credit Market Value as of July 20, 2026. Maybe it is connected to the token supply event in August 3rd.
