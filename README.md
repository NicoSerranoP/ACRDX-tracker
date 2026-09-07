# Take-home assesment for Soter Labs Engineering role

# Task

Study 0x9477724bb54ad5417de8baff29e59df3fb4da74f.

We track this position and publish what it is worth; counterparties settle on that number

Look at August 2026. Shares, the price we take from a third-party feed, and cash do not reconcile.

Build the monitoring that catches that class of problem. Deciding what "that class" is, and what "monitoring" means here, is the exercise.

8 hours, hard cap. Deliver:
1. A design note (2 pages max): what you monitor, what you deliberately don't, and what your system does when it cannot read.
2. An app that runs against live state. One check taken fully end-to-end — real reads, real failure handling, actionable output — beats six partial ones.

We offer short Q&A sessions. Questions should be submitted at least 6h before each session; we'll work through them live and you can follow up freely.


# Role

## About the Company

Soter Labs runs end-to-end governance and risk operations for the Sky ecosystem, one of the largest decentralized capital allocation systems in DeFi. Sky scales through its Prime model: independent allocation protocols deploying capital under the Atlas, Sky’s codified governance rulebook. Our work spans the full operational cycle: decision-making support (Core Council management, governance poll management, risk management), process definition and execution (risk processes, spell cycle management, governance processes, signing processes), and security and monitoring. We are a small senior team with high autonomy and direct exposure to Sky Core and ecosystem partners.

## About the Team / Role
You’ll work directly with senior Engineering staff across projects spanning governance and risk operations. Initial focus is twofold: designing and implementing a smart contract monitoring framework covering the entire Sky ecosystem, and supporting development of the settlement feature, the system that executes the Atlas rules Primes operate under. Both sit at the core of what Soter Labs does: monitoring live capital and enforcing governance onchain.

We operate on a high-autonomy, high-support model: we support you through your learning phase, and we expect high autonomy and high agency in return. Our goal is to make people grow in the ecosystem. We invest in them for the long term.

## What You’ll Do (at the beginning)
- Research and propose an approach for monitoring all smart contract types across the ecosystem, including L2 deployments; iterate on it with feedback from Sky Core devs and external partners

- Implement the monitoring framework; collaborate with risk teams to define response processes and to operate and evolve the monitoring over time

- Manage the deployment and monitoring of vaults holding hundreds of millions of dollars

- Execute parameter changes driven by governance requests

- Take on further projects, scoped based on ecosystem needs and your competencies

## What We’re Looking For (Required)
- Eagerness to contribute to Sky: understanding of the Sky ecosystem, genuine curiosity and interest in the vision, and willingness to grow within the ecosystem

- A first-principles problem solver: someone who identifies gaps others miss and proactively proposes improvements, rather than waiting for a spec

- 5+ years of software engineering experience, with production EVM/smart contract work

- Solidity fluency and deep understanding of EVM security patterns (access control, oracle mechanics, upgradeability, cross-chain/L2 messaging)

- Comfort owning high-value production systems where mistakes are expensive and irreversible; you treat every deployment, transaction, and parameter change with the rigor that hundreds of millions of dollars demand

## Very Nice to Have
- Prior experience with smart contract risk analysis in high-stakes environments (a huge plus)

- Experience with L2 infrastructure (OP Stack, Arbitrum) and bridge/messaging security

## Tech Stack
Solidity, Foundry/Hardhat, TypeScript, Tenderly, multisig-based ops (Safe).
