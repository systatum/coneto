import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  staticDirs: ["../public"],
  stories: [
    "../components/**/*.mdx",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-storysource",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/experimental-addon-test",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    return config;
  },
};
export default config;
