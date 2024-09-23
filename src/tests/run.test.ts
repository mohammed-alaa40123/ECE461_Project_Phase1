import { InstallCommand } from "../commands/InstallCommand.js";

describe("InstallCommand", () => {
  describe("Successful installation", () => {
    let result: number | undefined;

    beforeAll(async () => {
      result = await InstallCommand.run("userland.txt");
    }, 100000); // Increase the timeout to 10 seconds

    test("should install dependencies successfully", async () => {
      expect(result).toBe(0);
    }, 10000); // Increase the timeout to 10 seconds
  });


});