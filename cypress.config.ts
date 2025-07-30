import { defineConfig } from "cypress";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:6006",
    specPattern: "test/e2e/**/*.cy.{js,ts,jsx,tsx}",
    supportFile: "test/support/e2e.ts",
    fixturesFolder: "test/fixtures",
  },
});
