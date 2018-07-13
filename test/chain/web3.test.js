import { getNetworkName } from "../../src/chain/web3";

test("getNetworkName", async () => {
  const name = await getNetworkName();
  expect(name).toBe("mainnet");
});
