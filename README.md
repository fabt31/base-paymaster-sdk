# base-paymaster-sdk

> ERC-4337 Paymaster SDK for Base L2

Sponsor gas fees for your users on Base. Integrate in minutes with the Paymaster SDK — support ETH gas sponsorship, ERC-20 gas payments, and conditional sponsorship policies.

## Features

- ⛽ **Verifying Paymaster**: Sponsor gas for whitelisted users
- 💳 **Token Paymaster**: Users pay gas in USDC/USDT instead of ETH
- 🎯 **Policy Engine**: Conditional sponsorship (first 10 txs, NFT holders, etc.)
- 📊 **Dashboard**: Track sponsorship spend per dApp
- 🔗 **Coinbase Smart Wallet** compatible
- 🛡️ **Rate limiting**: Prevent abuse

## Quick Start

```typescript
import { createPaymaster } from "base-paymaster-sdk";

const paymaster = createPaymaster({
  rpcUrl: "https://mainnet.base.org",
  paymasterUrl: "https://api.developer.coinbase.com/rpc/v1/base/...",
  apiKey: process.env.COINBASE_API_KEY
});

// Sponsor a user operation
const sponsoredOp = await paymaster.sponsorUserOperation(userOp);
```

## Paymaster Addresses (Base)

| Type | Address |
|------|---------|
| Verifying Paymaster | Deploy your own |
| Coinbase Paymaster | `0x2d7e08622c5e6B43B9B3B4B30B8b3BE7b61547b` |
| Entry Point v0.6 | `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` |
| Entry Point v0.7 | `0x0000000071727De22E5E9d8BAf0edAc6f37da032` |

## License

MIT
