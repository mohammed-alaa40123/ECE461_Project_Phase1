import { parentPort, workerData } from "worker_threads";
import calculateCorrectness from "./Metrics/Correctness.js";
import checkLicenseCompatibility from "./Metrics/Licensing.js";

type WorkerData = {
  functionName: "calculateCorrectness" | "checkLicenseCompatibility";
  args: any[];
};

async function runFunction(
  fn: (...args: any[]) => Promise<any>,
  args: any[]
): Promise<void> {
  try {
    const result = await fn(...args);
    parentPort?.postMessage({ success: true, result });
  } catch (error) {
    parentPort?.postMessage({
      success: false,
      error: (error as Error).message,
    });
  }
}

const { functionName, args } = workerData as WorkerData;

if (functionName === "calculateCorrectness") {
  runFunction(calculateCorrectness, args);
} else if (functionName === "checkLicenseCompatibility") {
  runFunction(checkLicenseCompatibility, args);
}
