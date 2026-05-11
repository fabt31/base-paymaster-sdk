import { VerifyingPaymaster } from "../src/VerifyingPaymaster";
describe("VerifyingPaymaster", () => {
  it("should instantiate with valid config", () => {
    const pm = new VerifyingPaymaster({ rpc: "https://mainnet.base.org", paymasterAddress: "0x" + "0".repeat(40), signerKey: "0x" + "1".repeat(64) });
    expect(pm).toBeDefined();
  });
});