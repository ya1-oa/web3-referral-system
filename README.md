# Web3 Referral System

A modular, production-ready referral and subscription system built on EVM-compatible blockchains. Combines on-chain reward distribution, NFT-gated subscriptions, a 3-level referral tree, and a React + TypeScript frontend dashboard — all composable and reusable across projects.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
  - [ReferralToken (ERC-20)](#referraltoken-erc-20)
  - [ReferralStorage](#referralstorage)
  - [SubscriptionNFT (ERC-721)](#subscriptionnft-erc-721)
  - [Referral (Core Logic)](#referral-core-logic)
  - [TradingUpdates](#tradingupdates)
- [Frontend](#frontend)
  - [Components](#components)
  - [Hooks](#hooks)
- [Referral Reward Structure](#referral-reward-structure)
- [Installation](#installation)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Security Considerations](#security-considerations)
- [Known Limitations & TODOs](#known-limitations--todos)
- [Tech Stack](#tech-stack)

---

## Overview

This system enables any dApp to:

- **Register users** on-chain with an ERC-20 token payment
- **Mint a Subscription NFT** automatically on registration
- **Track a 3-level referral tree** entirely on-chain, with permissioned storage
- **Distribute rewards** automatically to up to 3 levels of referrers on every registration and subscription renewal
- **Gate content access** based on live NFT subscription status
- **Display a referral dashboard** showing network depth, rewards earned per node, and subscription status

The contract architecture deliberately separates storage from logic, making the `Referral` contract upgradeable without migrating user data.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        Frontend                         │
│   React + TypeScript + Viem + TailwindCSS               │
│   ReferralStats | SubscriptionNFT | ModulesViewer       │
└──────────────────────────┬──────────────────────────────┘
                           │ reads / writes via hooks
┌──────────────────────────▼──────────────────────────────┐
│                   Referral.sol (Core)                   │
│   register() | subscribe() | processReferralRewards()   │
│   getReferralTree() | batchGetUserStats()               │
└────────┬─────────────────┬──────────────────────────────┘
         │                 │
┌────────▼──────┐  ┌───────▼────────┐  ┌─────────────────┐
│ ReferralToken │  │ ReferralStorage│  │ SubscriptionNFT │
│   ERC-20      │  │  (ownable,     │  │   ERC-721       │
│  reward token │  │   upgradeable) │  │ time-gated subs │
└───────────────┘  └────────────────┘  └─────────────────┘
```

The separation of `ReferralStorage` from `Referral` is intentional: you can deploy a new version of `Referral` and point it at the same `ReferralStorage` without losing any user or referral data.

---

## Smart Contracts

### ReferralToken (ERC-20)

`contracts/ReferralToken.sol`

Standard ERC-20 used as the payment and reward token throughout the system.

| Parameter | Value |
|---|---|
| Name | `ReferralToken` |
| Symbol | `REF` |
| Initial Supply | 1,000,000 REF (18 decimals) |
| Max Supply | 10,000,000 REF |
| Minting | Owner-only, capped at max supply |

```solidity
// Approve the referral contract to spend on behalf of user before registering
token.approveReferralContract(referralContractAddress, amount);
```

**Swap in your own token:** This contract is a stand-in. In production, replace with your existing ERC-20 and update the `rewardToken` address in the `Referral` constructor.

---

### ReferralStorage

`contracts/ReferralStorage.sol`

Permissioned key-value store for user state and referral relationships. Only the `Referral` contract (set as `owner`) can write.

**User struct:**

```solidity
struct User {
    address referrer;       // Who referred this user
    uint256 referralCount;  // Direct referral count
    uint256 totalRewards;   // Cumulative rewards earned
    bool isRegistered;
    bool isSubscribed;
    uint256 tokenID;        // Subscription NFT token ID
}
```

**Key mappings:**

| Mapping | Purpose |
|---|---|
| `users[address]` | User struct by address |
| `referrals[address]` | Array of direct referee addresses |

**Why separate storage?** Upgrading business logic in `Referral.sol` only requires calling `referralStorage.transferOwnership(newReferral)` — no data migration needed.

---

### SubscriptionNFT (ERC-721)

`contracts/SubscriptionNFT.sol`

Soulbound-style NFT that tracks subscription expiry on-chain via timestamp.

| Feature | Detail |
|---|---|
| Minting | Only callable by the `Referral` contract |
| Renewal | Only callable by the `Referral` contract |
| Duration | Configurable (`SUB_DURATION`, default: 3 minutes for dev/test) |
| URI | Dynamic — returns `activeBaseURI` or `inactiveBaseURI` based on expiry |
| `timeUntilExpired(tokenId)` | Returns seconds remaining, or `0` if expired |
| `isActive(tokenId)` | Returns bool subscription status |

**Deployment note:** Set `SUB_DURATION` to a real duration (e.g. `30 days`) before mainnet deployment. The 3-minute value is for local testing only.

**Setting NFT metadata URIs:**
```solidity
nft.setActiveBaseURI("ipfs://Qm.../active.json");
nft.setExpiredBaseURI("ipfs://Qm.../expired.json");
```

---

### Referral (Core Logic)

`contracts/Referral.sol`

The central contract. Handles registration, subscription renewal, reward distribution, and read queries.

**Key parameters:**

| Parameter | Default | Setter |
|---|---|---|
| `referralRewards[3]` | `[500, 300, 100]` (5%, 3%, 1%) | `updateReferralRewards()` |
| `registrationAmount` | 100 REF | `updateRegistrationAmount()` |
| `subscriptionAmount` | 50 REF | — |
| `subscriptionDuration` | 3 minutes | `updateSubscriptionDuration()` |

**Core flows:**

#### Registration

```
User calls register(referrerAddress)
  → transferFrom(user, contract, registrationAmount)
  → SubscriptionNFT.mint(user)
  → ReferralStorage.setUser(user, newUser)
  → ReferralStorage.addReferral(referrer, user)
  → processReferralRewards(user, registrationAmount)
    → Level 1 referrer gets 5% if subscribed
    → Level 2 referrer gets 3% if subscribed
    → Level 3 referrer gets 1% if subscribed
```

#### Subscription Renewal

```
User calls subscribe(userAddress)
  → checks NFT ownership
  → transferFrom(user, contract, subscriptionAmount)
  → SubscriptionNFT.renewSubscription(tokenId)
  → processReferralRewards(user, subscriptionAmount)
```

**Important:** The caller of `subscribe()` does not have to be the user themselves — this allows renewal to be triggered by a backend cron or keeper bot on behalf of a user who has pre-approved the token spend.

**Batch query (used by dashboard):**

```solidity
function batchGetUserStats(address[] calldata userAddresses)
    external view
    returns (IReferralStorage.User[] memory userStats)
```

Returns live subscription status (via `timeUntilExpired`) for an array of addresses in a single RPC call — critical for rendering the referral tree without N+1 calls.

---

### TradingUpdates

`contracts/TradingUpdates.sol`

Optional admin-only on-chain bulletin board for trading signals. Not required for the referral system — useful if you want immutable, auditable trade posts.

| Feature | Detail |
|---|---|
| Access | Admin mapping (multi-admin support) |
| Storage | `mapping(uint256 => TradingPost)` |
| Indexing | Time-indexed (daily buckets) and asset-indexed |
| Pagination | `getLatestPosts(limit, offset)` and `getPostsByAsset(asset, limit, offset)` |

> **Known issue:** `getAssetIndex()` uses `nextPostId - 1` as the index, which overwrites prior entries for the same asset. This is a bug — asset indexing needs a per-asset counter mapping in production. See [Known Limitations](#known-limitations--todos).

---

## Frontend

Built with React 18, TypeScript, React Router v7, Viem, and TailwindCSS.

### Components

#### `ReferralStats`

Main referral dashboard. Accepts `stats: UserStats | null` and `address: string | null` as props (fetched by the parent and passed down to avoid redundant RPC calls).

**What it renders:**
- Summary stat cards: total referrals, total rewards, active traders
- Referral network tree grouped by level (1, 2, 3), with parent-address attribution
- Direct referral list with per-address reward display

**Internals worth noting:**
- Uses `useMemo` to derive `referralAddresses` from the tree, avoiding re-renders on unrelated state changes
- `buildReferralTree` is debounced (500ms) via `useCallback` + lodash `debounce` to prevent thrashing on rapid re-fetches
- A 30-second polling interval (`UPDATE_INTERVAL`) re-runs the tree build on a `setTimeout` — replace with a Viem `watchContractEvent` for event-driven updates in production
- `shouldUpdate()` guards against redundant rebuilds using `initialLoadRef` and `lastUpdateRef`

#### `SubscriptionNFT`

Compact subscription status card. Embeds in the dashboard stat grid.

- Reads live NFT data via `useSubscriptionNFT(userAddress)`
- Shows active/expired state, seconds remaining, and a Renew button
- Calls `renewSubscription()` from the web3 utils layer and reloads on success

#### `SubscriptionPage`

Full-page subscription management view. Redirects to `/` if no address, redirects to `/register` if not registered. Shows NFT image (from `tokenURI`), expiry in days, and the renewal CTA.

#### `ModulesViewer`

Gated content viewer — shows video lessons from a `ModuleContext`. Intended to be placed behind a subscription check. Tracks lesson completion via `updateLessonStatus`. Uses `ModuleProgress` for sidebar navigation between modules and lessons within a module.

#### `ReferralDashboard`

Landing/hero component. Displays the product value proposition. Accepts `stats` and `address` props for any personalization you want to wire in.

#### `GetWallet`

Placeholder component for wallet connection guidance. Implement your preferred wallet connect flow here (RainbowKit, ConnectKit, or raw Viem).

---

### Hooks

The following hooks are imported from `../lib/web3/hooks` — implement these against your chain using Viem `useReadContract` / `useReadContracts`:

| Hook | Purpose |
|---|---|
| `useReferralTree(address)` | Returns `{ tree: ReferralInfo[], loading }` — calls `getReferralTree()` |
| `useBatchUserStats(addresses[])` | Returns `{ stats: UserStats[], loading }` — calls `batchGetUserStats()` |
| `useGetAddress()` | Returns `{ addr: string }` — connected wallet address |
| `useSubscriptionNFT(address)` | Returns `{ nftData, loading }` — tokenURI, timeUntilExpiry, isSubscribed |

`renewSubscription()` in `../lib/web3/referral` should call `subscribe(userAddress)` on the `Referral` contract via `writeContract`.

---

## Referral Reward Structure

| Level | Relationship | Reward Rate | Trigger |
|---|---|---|---|
| 1 | Direct referrer | 5% | Registration + every renewal |
| 2 | Referrer's referrer | 3% | Registration + every renewal |
| 3 | Level 2's referrer | 1% | Registration + every renewal |

Rewards are only paid to a referrer if their own subscription NFT is currently active (`isSubscribed == true`). Inactive referrers are skipped — their slot in the chain is not filled by the next level up.

Rewards are paid immediately in the same transaction as registration or renewal. There is no claim step.

---

## Installation

**Prerequisites:** Node.js 18+, pnpm or npm, a funded EVM wallet for deployment.

```bash
# Clone the repo
git clone https://github.com/your-org/web3-referral-system.git
cd web3-referral-system

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

**.env.example:**
```env
# Deployment
PRIVATE_KEY=0x...
RPC_URL=https://...
ETHERSCAN_API_KEY=...

# Frontend (Vite)
VITE_CHAIN_ID=1
VITE_REFERRAL_CONTRACT=0x...
VITE_STORAGE_CONTRACT=0x...
VITE_NFT_CONTRACT=0x...
VITE_TOKEN_CONTRACT=0x...
```

---

## Deployment

Contracts must be deployed in this order due to constructor dependencies:

```bash
# 1. Deploy the ERC-20 reward token
npx hardhat run scripts/deploy-token.ts --network <network>

# 2. Deploy ReferralStorage (no constructor args)
npx hardhat run scripts/deploy-storage.ts --network <network>

# 3. Deploy SubscriptionNFT (pass initial owner address)
npx hardhat run scripts/deploy-nft.ts --network <network>

# 4. Deploy Referral (pass token + NFT addresses)
npx hardhat run scripts/deploy-referral.ts --network <network>
```

**Post-deployment wiring (required before any user can register):**

```solidity
// 1. Connect storage to referral contract (transfers ownership of storage to Referral)
referral.setReferralStorage(referralStorageAddress);

// 2. Tell the NFT contract which address is allowed to mint/renew
nft.setReferralContract(referralContractAddress);

// 3. Set NFT metadata URIs
nft.setActiveBaseURI("ipfs://Qm.../active.json");
nft.setExpiredBaseURI("ipfs://Qm.../expired.json");

// 4. Set payout address for profit withdrawal
referral.updatePayout(yourTreasuryAddress);

// 5. Fund the contract with reward tokens for distribution
// (or ensure the token treasury has sufficient approved balance)
token.transfer(referralContractAddress, rewardPoolAmount);
```

---

## Configuration

All tunable parameters are owner-callable on `Referral.sol`:

| Function | What it changes |
|---|---|
| `updateReferralRewards([l1, l2, l3])` | Reward percentages (basis points: 500 = 5%) |
| `updateRegistrationAmount(amount)` | Cost to register (in wei, 18 decimals) |
| `updateSubscriptionDuration(seconds)` | NFT subscription length |
| `updatePayout(address)` | Treasury address for `payoutProfit()` |
| `updateSubscription(user, bool)` | Admin override for subscription status |

---

## Usage Guide

### For end users

1. **Approve** the `Referral` contract to spend your REF tokens:
   ```
   token.approve(referralContract, registrationAmount)
   ```

2. **Register** with an optional referrer address:
   ```
   referral.register(referrerAddress) // address(0) if no referrer
   ```
   This mints your Subscription NFT and pays rewards up the referral chain.

3. **Share your address** as a referral link parameter so others can register with you as their referrer.

4. **Renew** before your NFT expires to keep receiving referral rewards:
   ```
   token.approve(referralContract, subscriptionAmount)
   referral.subscribe(yourAddress)
   ```

### For integrators

Swap out `ReferralToken` for your own ERC-20. The only change needed is passing your token address to the `Referral` constructor. Everything else is token-agnostic.

To add a new frontend page gated by subscription status:

```tsx
const { nftData } = useSubscriptionNFT(address);
if (!nftData?.isSubscribed) return <Navigate to="/subscribe" />;
```

---

## Security Considerations

- **Reentrancy:** `Referral.sol` inherits `ReentrancyGuard`. `register()` and `subscribe()` are both `nonReentrant`.
- **Token transfers before state changes:** `register()` transfers tokens before writing state — consistent with checks-effects-interactions, though the `ReentrancyGuard` provides the primary protection.
- **Storage ownership:** `ReferralStorage` uses `Ownable` with `onlyOwner` on all write functions. The owner should be set to the `Referral` contract address after deployment, not an EOA.
- **Admin key management:** `TradingUpdates` uses a simple `admins` mapping. In production, replace with `AccessControl` from OpenZeppelin for role granularity and revocation safety.
- **NFT transfer:** `SubscriptionNFT` does not override ERC-721 transfer functions — NFTs can be transferred between wallets. If you want soulbound behavior, override `_update()` to revert on transfers to non-zero addresses.
- **Reward pool solvency:** The `Referral` contract pays rewards from its own ERC-20 balance. If the balance is insufficient, `transfer()` will revert and the entire `register()`/`subscribe()` call reverts. Monitor contract balance before high-volume campaigns.
- **Authorization on `subscribe()`:** Anyone can call `subscribe(userAddress)` as long as the token allowance and balance conditions are met by `user`. This is intentional for keeper/bot automation but may not match all use cases — add an `msg.sender == user || isKeeper[msg.sender]` guard if needed.

---

## Known Limitations & TODOs

- **`getAssetIndex()` bug in `TradingUpdates`:** Returns `nextPostId - 1` for every asset, overwriting prior asset index entries. Needs a `mapping(string => uint256) private assetPostCount` counter.
- **`averageROI` calculation in `ReferralStats`:** Uses `% 18` (modulo) instead of `/ 10**18` (decimal normalization). This is a frontend bug that produces meaningless values — replace with proper BigInt division.
- **Direct referral reward display:** The "Direct Referrals" panel uses `.find()` with `ref.addr.toLowerCase() === ref.addr.toLowerCase()` — this always matches the first element. Needs the outer loop variable to distinguish the two `ref` references.
- **No event-driven tree refresh:** The 30-second polling timeout in `ReferralStats` should be replaced with Viem contract event watchers (`watchContractEvent` on `UserRegistered` and `SubscriptionRenewed`).
- **`subscriptionDuration` mismatch:** `SubscriptionNFT` hardcodes `SUB_DURATION = 3 minutes` as a constant. The `Referral` contract has `updateSubscriptionDuration()` but cannot push that to the NFT contract. These need to be kept in sync, or the NFT contract should read its duration from `Referral`.
- **No referral link generation UI:** The `GetWallet` component is a stub. Wire in wallet connect (RainbowKit recommended) and generate shareable referral URLs using the connected address as the `ref` query param.
- **No on-chain pagination for large trees:** `getReferralTree()` loads all 3 levels eagerly. For trees with thousands of level-1 referrals, this will hit block gas limits on reads. Add pagination to `getReferrals()` in `ReferralStorage`.
- **`processReferralRewards` subscription check uses stale storage value:** `updateSubscriptionStatus(user)` is called before iterating referrers, but referrer subscription status is read from storage (which may also be stale). Call `updateSubscriptionStatus(currentReferrer)` inside the loop for each referrer, or check `timeUntilExpired` directly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart contracts | Solidity ^0.8.19, OpenZeppelin 5.x |
| Contract tooling | Hardhat, hardhat-ignition, hardhat-verify |
| Frontend framework | React 18, TypeScript 5.6 |
| Web3 client | Viem 2.x, Web3.js 4.x |
| Routing | React Router v7 |
| Styling | TailwindCSS 3.4 |
| Icons | Lucide React |
| Build | Vite 6 |
| Utilities | Lodash (debounce), dotenv |
| NFT metadata | Pinata SDK (IPFS pinning) |

---

## License

MIT
