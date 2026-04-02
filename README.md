# FhePulse

Decentralized polls & surveys DApp built on **Fhenix** — a privacy-preserving blockchain powered by Fully Homomorphic Encryption (FHE). Poll responses are encrypted on-chain, ensuring voter privacy while still allowing verifiable, aggregated results.

## How It Works

1. **Create a poll** — define options, voting mode (linear or quadratic), and a credit budget
2. **Vote privately** — responses are encrypted client-side before being submitted on-chain
3. **Tally without revealing** — the chain computes over encrypted data, so individual votes are never exposed
4. **Decrypt results** — only aggregated totals are decrypted after the poll ends

## Repository Structure

```
fhepulse/
├── frontend/                # npm workspaces monorepo
│   ├── artifacts/
│   │   ├── fhepulse/       # React 19 + Vite 7 SPA (main DApp)
│   │   ├── api-server/      # Express 5 API server
│   │   └── mockup-sandbox/  # Vite app for design mockups
│   ├── lib/
│   │   ├── api-spec/        # OpenAPI spec + Orval codegen
│   │   ├── api-client-react/ # Generated React Query hooks
│   │   ├── api-zod/         # Generated Zod schemas
│   │   └── db/              # Drizzle ORM + PostgreSQL schema
│   └── scripts/             # Utility scripts
└── cofhe-contracts/         # Solidity/FHE smart contracts (Hardhat)
    ├── contracts/
    │   ├── IFhePulse.sol    # Shared types, enums, events
    │   ├── PollFactory.sol  # Factory that deploys Poll instances
    │   └── Poll.sol         # Per-poll contract with FHE voting
    ├── test/                # Hardhat tests
    └── tasks/               # Hardhat tasks (deploy, create-poll, vote)
```

## Tech Stack

**Frontend**: React 19, Vite 7, TypeScript 5.9, Tailwind CSS v4, shadcn/ui, TanStack React Query, Wouter, Framer Motion

**Backend**: Express 5, Drizzle ORM, PostgreSQL

**Contracts**: Solidity 0.8.25, Hardhat, cofhejs, @fhenixprotocol/cofhe-contracts

## Getting Started

### Prerequisites

- Node.js 24+
- PostgreSQL (for API server)

### Frontend

```bash
cd frontend
npm install
npm run dev -w @workspace/fhepulse    # start the DApp
npm run dev -w @workspace/api-server   # start the API server
```

### Smart Contracts

```bash
cd cofhe-contracts
npm install
npm run compile
npm test
```

### Deploy to Testnet

```bash
cd cofhe-contracts
npm run eth-sepolia:deploy              # deploy PollFactory
npm run eth-sepolia:create-poll -- \
  --title "My Poll" --options 4 \
  --mode 0 --budget 100                 # create a poll
npm run eth-sepolia:vote -- \
  --poll <address> \
  --weights "30,50,10,10"               # submit a vote
```

## Architecture

- **Per-poll contracts** — each poll is its own `Poll.sol` instance deployed by `PollFactory.sol`, isolating FHE permissions and state
- **Encrypted weights** — voters submit encrypted weights per option (`InEuint32[]`). Linear mode sums weights; quadratic mode sums weights^2 against a credit budget
- **Multi-tx finalization** — poll creators call `requestFinalize()` to trigger decryption, then `finalize()` to retrieve plaintext tallies
- **API-first codegen** — OpenAPI spec drives typed React Query hooks and Zod validators via Orval

## License

MIT
