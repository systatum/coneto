import type { StorybookConfig } from "@storybook/react-vite";

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
    return {
      ...config,
      optimizeDeps: {
        ...config.optimizeDeps,
        exclude: [...(config.optimizeDeps?.exclude ?? []), "@systatum/coneto"],
      },
      build: {
        ...config.build,
        chunkSizeWarningLimit: 10000,
        rollupOptions: {
          ...config.build?.rollupOptions,
          output: {
            ...((config.build?.rollupOptions?.output as object) ?? {}),
            manualChunks(id: string) {
              if (id.includes("monaco-editor")) return "monaco";
              if (id.includes("node_modules")) return "vendor";
            },
          },
        },
      },
    };
  },
};

export default config;
