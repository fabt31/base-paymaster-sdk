# Paymaster Integration Guide

## 1. Deploy VerifyingPaymaster
```bash
forge script script/Deploy.s.sol --rpc-url $BASE_RPC_URL --broadcast
```

## 2. Fund the Paymaster
```typescript
await paymaster.deposit({ value: ethers.parseEther("0.1") });
```

## 3. Sponsor User Operations
```typescript
const sponsored = await paymaster.sponsorUserOperation(userOp);
const hash = await bundler.sendUserOperation(sponsored);
```

## Gas Limits
- Verification gas: ~50,000
- Paymaster overhead: ~30,000
- Total overhead vs EOA: ~80,000 gas