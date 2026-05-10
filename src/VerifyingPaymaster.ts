import { ethers } from "ethers";

const ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

interface UserOperation {
  sender: string;
  nonce: bigint;
  initCode: string;
  callData: string;
  callGasLimit: bigint;
  verificationGasLimit: bigint;
  preVerificationGas: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  paymasterAndData: string;
  signature: string;
}

export class VerifyingPaymaster {
  private provider: ethers.JsonRpcProvider;
  private signer: ethers.Wallet;
  private paymasterAddress: string;
  private validUntil: number;

  constructor(config: { rpc: string; paymasterAddress: string; signerKey: string; validUntil?: number }) {
    this.provider = new ethers.JsonRpcProvider(config.rpc);
    this.signer = new ethers.Wallet(config.signerKey, this.provider);
    this.paymasterAddress = config.paymasterAddress;
    this.validUntil = config.validUntil ?? Math.floor(Date.now() / 1000) + 300;
  }

  async sponsorUserOperation(userOp: UserOperation): Promise<UserOperation> {
    const hash = this.getUserOpHash(userOp);
    const sig = await this.signer.signMessage(ethers.getBytes(hash));
    const paymasterData = ethers.solidityPacked(
      ["address", "uint48", "uint48", "bytes"],
      [this.paymasterAddress, this.validUntil, 0, sig]
    );
    return { ...userOp, paymasterAndData: paymasterData };
  }

  private getUserOpHash(op: UserOperation): string {
    const packed = ethers.AbiCoder.defaultAbiCoder().encode(
      ["address","uint256","bytes32","bytes32","uint256","uint256","uint256","uint256","uint256"],
      [op.sender, op.nonce, ethers.keccak256(op.initCode), ethers.keccak256(op.callData),
       op.callGasLimit, op.verificationGasLimit, op.preVerificationGas, op.maxFeePerGas, op.maxPriorityFeePerGas]
    );
    return ethers.keccak256(ethers.solidityPacked(["bytes32","address","uint256"], [ethers.keccak256(packed), ENTRY_POINT, 8453]));
  }
}