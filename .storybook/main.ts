import type { StorybookConfig } from "@storybook/react-vite";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

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
    config.plugins?.push(
      monacoEditorPlugin({
        languageWorkers: [
          "editorWorkerService",
          "typescript",
          "json",
          "css",
          "html",
        ],
      })
    );

    return config;
  },
};
export default config;
