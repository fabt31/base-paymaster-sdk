import { ethers } from "ethers";
const BUNDLER_RPC = "https://api.pimlico.io/v2/base/rpc";
export async function sendUserOperation(userOp: object, apiKey: string) {
  const res = await fetch(`${BUNDLER_RPC}?apikey=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "eth_sendUserOperation", params: [userOp, "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"], id: 1 })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.result as string;
}
export async function getUserOperationReceipt(userOpHash: string, apiKey: string) {
  const res = await fetch(`${BUNDLER_RPC}?apikey=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method: "eth_getUserOperationReceipt", params: [userOpHash], id: 1 })
  });
  return (await res.json()).result;
}