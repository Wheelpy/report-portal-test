import type { Config } from "jest";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const jestConfig: Config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testTimeout: 30000,
  verbose: true,
  setupFiles: ["<rootDir>/jest.setup.ts"],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
};

export default jestConfig;
