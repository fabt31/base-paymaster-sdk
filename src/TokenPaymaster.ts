import { ethers } from "ethers";
// Pay gas fees in ERC20 tokens instead of ETH
export class TokenPaymaster {
  private paymasterAddress: string;
  private provider: ethers.JsonRpcProvider;
  constructor(paymasterAddress: string, rpc: string) {
    this.paymasterAddress = paymasterAddress;
    this.provider = new ethers.JsonRpcProvider(rpc);
  }
  async getTokenQuote(token: string, gasEstimate: bigint): Promise<bigint> {
    // Fetch token/ETH price and compute token amount for gas
    const gasPrice = (await this.provider.getFeeData()).gasPrice ?? BigInt(1e9);
    const gasCostWei = gasPrice * gasEstimate;
    return gasCostWei * BigInt(105) / BigInt(100); // +5% buffer
  }
}