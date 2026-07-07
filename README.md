# Polygon Property Verifier

A full-stack property listing app with on-chain address verification. Selecting
**Verify Property** on a listing:

1. Computes a SHA-256 hash of the property address on the backend.
2. Records that hash on the **Polygon Amoy testnet** by emitting a `PropertyVerified` event
   from a small Solidity contract, signed by the user in MetaMask.
3. Shows the transaction hash, block number and a Polygonscan link in the UI.

The hash is stored as an indexed `bytes32` event topic, so every verification is searchable on
Polygonscan.

> **Network:** the app targets **Polygon Amoy** (chain ID 80002). The older Mumbai testnet
> was deprecated in April 2024 and no longer accepts transactions.

## Stack

| Package | Tech |
|---|---|
| `contracts/` | Solidity 0.8.24, Hardhat, ethers v6, Chai |
| `backend/` | Express, Prisma, SQLite, TypeScript |
| `frontend/` | Next.js 14 (App Router), React 18, Tailwind CSS, ethers v6 |

## Architecture

```
 Next.js frontend                       Express backend               Polygon Amoy
 ----------------                       ---------------               ------------
 property list / detail  -- GET  ---->  /api/properties
 Verify Property         -- POST ---->  /api/properties/verify/:id
                         <-- sha256 ---  (node:crypto)
 MetaMask signer         ------------- verifyProperty(hash) -------->  PropertyVerifier
                         <------------ receipt + tx hash ------------  emits PropertyVerified
```

Key files:

| File | Responsibility |
|---|---|
| `contracts/contracts/PropertyVerifier.sol` | Single guarded function that rejects a zero hash and emits `PropertyVerified(hash, verifier, timestamp)`. |
| `backend/src/routes/properties.ts` | List and detail endpoints, plus the SHA-256 hash endpoint with 400/404/500 handling. |
| `frontend/src/lib/verifyProperty.ts` | Wallet connection, Amoy network switch (adds the chain on error 4902), contract call and receipt handling. |
| `frontend/src/components/VerifyPropertyButton.tsx` | UI state machine: `hashing → signing → mining → success / error`. |

## Prerequisites

- Node.js 20+ and npm 10+
- Chrome or Brave with the MetaMask extension

## 1. Set up a testnet wallet

Use a **fresh** wallet that never holds real funds.

1. Create a new wallet in MetaMask and keep the seed phrase in a password manager.
2. Add the Polygon Amoy network (Settings > Networks > Add a network manually):
   - Network name: `Polygon Amoy`
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency symbol: `POL`
   - Block explorer: `https://amoy.polygonscan.com`
3. Fund it with test POL from <https://faucet.polygon.technology> (select Amoy) or
   <https://www.alchemy.com/faucets/polygon-amoy>.
4. Export the private key (account menu > Account details > Show private key). It must be
   64 hex characters prefixed with `0x`.

## 2. Deploy the contract

```bash
cd contracts
cp .env.example .env         # set PRIVATE_KEY; AMOY_RPC_URL can stay as is
npm install
npx hardhat compile          # also regenerates the ABI in frontend/src/lib
npx hardhat test
npx hardhat run scripts/deploy.ts --network amoy
```

The deploy script prints the contract address and writes it to `contracts/deployed.json`.

## 3. Run the backend

```bash
cd backend
cp .env.example .env
npm install
npm run setup                # prisma migrate + seed 3 sample properties
npm run dev                  # http://localhost:4000
```

```bash
curl http://localhost:4000/api/properties
curl http://localhost:4000/api/properties/1
curl -X POST http://localhost:4000/api/properties/verify/1
# { "success": true, "propertyHash": "0x...", "propertyId": 1, "address": "..." }
```

## 4. Run the frontend

```bash
cd frontend
cp .env.example .env.local   # set NEXT_PUBLIC_CONTRACT_ADDRESS from step 2
npm install
npm run dev                  # http://localhost:3000
```

Open a property, click **Verify Property**, approve the transaction in MetaMask and follow the
Polygonscan link once it confirms. The `propertyHash` in the event matches the backend response.

## API

| Method and path | Description |
|---|---|
| `GET /health` | Liveness check. |
| `GET /api/properties` | All properties. |
| `GET /api/properties/:id` | One property. `400` on an invalid id, `404` if not found. |
| `POST /api/properties/verify/:id` | SHA-256 hash of the property address as `0x`-prefixed hex. |

## Error handling

- The backend validates ids, returns structured `{ success: false, error }` bodies and has a
  catch-all 500 handler.
- The frontend surfaces backend outages, a missing MetaMask, an unconfigured contract address,
  rejected signatures and failed transactions as readable banners.
- The wallet is switched to Amoy automatically, and the network is added to MetaMask if it is
  missing.

## Security notes

- No secrets are committed. Each package ignores its `.env` files.
- The Hardhat config only accepts a well-formed private key and otherwise deploys nothing.
- The ABI is regenerated from Hardhat artifacts on `postcompile`, so the frontend can't drift
  from the deployed contract interface.

## Roadmap

- Index `PropertyVerified` events on the backend and show verification history per property.
- Persist verification status alongside each listing.
- Add contract ownership and access control for who can verify.
- Backend and frontend test suites.

## License

MIT
