import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  staticDirs: ["../public"],
  stories: [
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: ["@storybook/addon-storysource", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.optimizeDeps = {
      ...(config.optimizeDeps || {}),
      exclude: ["libphonenumber-js"],
    };
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "libphonenumber-js": path.resolve(
        __dirname,
        "./../lib/libphonenumber-js/max"
      ),
    };
    return config;
  },
};
export default config;
