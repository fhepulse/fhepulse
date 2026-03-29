# FhePulse

Decentralized polls & surveys DApp built on **Fhenix** — a privacy-preserving blockchain powered by Fully Homomorphic Encryption (FHE). Poll responses are encrypted on-chain, ensuring voter privacy while still allowing verifiable, aggregated results.

## Project Status

This is an early-stage monorepo. The frontend exists with mocked Web3 data. Smart contracts (PollFactory + per-poll Poll contracts) are implemented with encrypted voting via FHE. Frontend integration with contracts is the next step.

## Repository Structure

```
fhepulse/
├── frontend/              # npm workspaces monorepo (see below)
│   ├── artifacts/
│   │   ├── fhepulse/     # React 19 + Vite 7 SPA (main DApp frontend)
│   │   ├── api-server/    # Express 5 API server
│   │   └── mockup-sandbox/# Vite app for design mockups
│   ├── lib/
│   │   ├── api-spec/      # OpenAPI spec + Orval codegen config
│   │   ├── api-client-react/ # Generated React Query hooks
│   │   ├── api-zod/       # Generated Zod schemas
│   │   └── db/            # Drizzle ORM + PostgreSQL schema
│   └── scripts/           # Utility scripts
└── cofhe-contracts/       # Solidity/FHE smart contracts (Hardhat)
    ├── contracts/
    │   ├── IFhePulse.sol  # Shared types, enums, events
    │   ├── PollFactory.sol# Factory that deploys Poll instances
    │   └── Poll.sol       # Per-poll contract with FHE voting
    ├── test/              # Hardhat tests (Mocha/Chai + cofhejs mocks)
    └── tasks/             # Hardhat tasks (deploy, create-poll, vote)
```

## Tech Stack

### Frontend (`frontend/`)

- **Monorepo**: npm workspaces (`.npmrc` sets `legacy-peer-deps=true`)
- **Runtime**: Node.js 24
- **Language**: TypeScript 5.9 (composite project references, `tsc --build`)
- **Frontend**: React 19, Vite 7, Wouter (routing), TanStack React Query
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix primitives), Framer Motion
- **Backend**: Express 5, Drizzle ORM, PostgreSQL
- **Codegen**: Orval (OpenAPI -> React Query hooks + Zod schemas)
- **Build**: esbuild (API server), Vite (frontend apps)

### Contracts (`cofhe-contracts/`)

- **Chain**: Fhenix (EVM-compatible, FHE-enabled)
- **Framework**: Hardhat + cofhe-hardhat-plugin
- **Language**: Solidity 0.8.25 (EVM: cancun)
- **FHE SDK**: `@fhenixprotocol/cofhe-contracts`, `cofhejs`
- **Architecture**: PollFactory deploys per-poll Poll contracts
- **Voting modes**: Linear (distribute points) and Quadratic (cost = weight^2)
- **Testing**: Mocha/Chai with cofhejs mock environment
- **Networks**: Hardhat (local mock), eth-sepolia, arb-sepolia

## Development Commands

All frontend commands run from `frontend/`:

```bash
# Install dependencies
npm install

# Typecheck entire workspace (always run from root, never per-package)
npm run typecheck

# Build all packages
npm run build

# Run the main frontend app (fhepulse)
npm run dev -w @workspace/fhepulse

# Run the API server
npm run dev -w @workspace/api-server

# Generate API client code from OpenAPI spec
npm run codegen -w @workspace/api-spec

# Database migrations (requires DATABASE_URL)
npm run push -w @workspace/db
npm run push-force -w @workspace/db   # fallback if push fails

# Run a utility script
npm run <script-name> -w @workspace/scripts
```

### Contract Commands

All contract commands run from `cofhe-contracts/`:

```bash
# Install dependencies
npm install

# Compile contracts
npm compile

# Run tests (mock FHE environment)
npm test

# Clean build artifacts
npm clean

# Deploy PollFactory (testnet)
npm eth-sepolia:deploy    # or arb-sepolia:deploy

# Create a poll (testnet)
npm eth-sepolia:create-poll -- --title "My Poll" --options 4 --mode 0 --budget 100

# Submit a vote (testnet)
npm eth-sepolia:vote -- --poll <address> --weights "30,50,10,10"
```

## Key Architecture Decisions

- **npm workspaces** — workspaces defined in root `package.json`; `legacy-peer-deps=true` in `.npmrc`
- **Composite TypeScript** — every package sets `composite: true` and extends `tsconfig.base.json`. Cross-package imports require project references. Always typecheck from workspace root, never per-package
- **`emitDeclarationOnly`** — `tsc` only emits `.d.ts`; actual JS is bundled by Vite/esbuild
- **API-first codegen** — edit `lib/api-spec/openapi.yaml`, then run Orval codegen to produce typed React Query hooks and Zod validators. Do not hand-write API client code
- **Mock data** — `frontend/artifacts/fhepulse/src/hooks/use-mock-data.ts` provides fake Web3 state. This will be replaced with real contract interactions
- **Per-poll contracts** — each poll is its own `Poll.sol` instance deployed by `PollFactory.sol`. This isolates FHE permissions and state between polls
- **Encrypted weights** — voters submit `InEuint32[]` (one encrypted weight per option). Linear mode sums weights; quadratic mode sums weights^2 against a credit budget
- **Multi-tx finalization** — poll creator calls `requestFinalize()` (triggers `FHE.decrypt()`), waits, then calls `finalize()` (retrieves plaintext tallies via `FHE.getDecryptResultSafe()`)
- **Mock decryption timing** — in Hardhat mock environment, advance time by 11+ seconds between `requestFinalize()` and `finalize()` calls

## Conventions

- Use `@workspace/<package-name>` for internal imports between packages
- UI components live in `artifacts/fhepulse/src/components/ui/` (shadcn/ui pattern)
- Page components live in `artifacts/fhepulse/src/pages/`
- Layout components live in `artifacts/fhepulse/src/components/layout/`
- Dark mode is the default theme
- Format with Prettier (`prettier 3.8`)

## Fhenix / FHE Smart Contracts

Fhenix is an EVM-compatible L2 that integrates Fully Homomorphic Encryption at the protocol level. Key concepts for this project:

- **Encrypted inputs**: Users encrypt poll responses client-side before submitting on-chain
- **On-chain FHE computation**: The chain can compute over encrypted data (e.g., tallying votes) without decrypting individual responses
- **Decryption**: Only authorized parties (e.g., poll creators after a deadline) can decrypt aggregated results
- **Privacy guarantee**: Individual votes are never revealed on-chain

### FHE Reference

**Before writing any FHE smart contract code, read the FHE assistant reference:**

```
Read the /Users/east/workspace/fhenix/fhe-assistant/core.md file and help me build FHE smart contracts using these patterns
```

This file contains the complete FHE library reference including types, operations, access control patterns, and decryption workflows.

### FHE Quick Rules

- **Import**: `import "@fhenixprotocol/cofhe-contracts/FHE.sol";`
- **Types**: `ebool`, `euint8`, `euint16`, `euint32`, `euint64`, `euint128`, `euint256`, `eaddress` — all are `uint256` handles, not actual encrypted data
- **Access control is mandatory**:
  - `FHE.allowThis(value)` — when storing encrypted data in contract state
  - `FHE.allowSender(value)` — when returning encrypted data to the caller
  - `FHE.allow(value, address)` — when sharing with a specific address
- **No `if` with `ebool`** — use `FHE.select(condition, ifTrue, ifFalse)` for all conditional logic on encrypted values
- **Decryption is multi-transaction**: call `FHE.decrypt()` in one tx, retrieve with `FHE.getDecryptResult()` or `FHE.getDecryptResultSafe()` in a subsequent tx
- **Encrypted inputs**: Use `InEuint32 calldata` (etc.) for user-submitted encrypted values, convert with `FHE.asEuint32(input)`
