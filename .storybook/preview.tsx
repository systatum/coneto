import type { Preview } from "@storybook/react";
import { addons } from "@storybook/preview-api";
import { ThemeProvider } from "./../theme/provider";
import { GLOBALS_UPDATED } from "@storybook/core-events";
import "../shared.css";
import "../theme.css";
import "../documentation.css";

if (typeof window !== "undefined") {
  const channel = addons.getChannel();
  channel.on(
    GLOBALS_UPDATED,
    ({ globals }: { globals: { theme?: string } }) => {
      const mode = globals.theme ?? "dark";
      document.body.setAttribute("data-theme", mode);
      localStorage.setItem("sb-theme", mode);
    }
  );
}

const preview: Preview = {
  initialGlobals: {
    theme: "dark",
  },
  parameters: {
    options: {
      storySort: {
        order: [
          "Welcome",
          "Installation Guide",
          "Vite and Webpack",
          "Shared css",
          "Extending Theme",
          "Dark mode",
          "*",
        ],
      },
    },
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    test: {
      disable: true,
    },
  },
  decorators: [
    (Story, context) => {
      const isCypress =
        typeof window !== "undefined" &&
        (window as Window & { Cypress?: unknown }).Cypress;

      const mode = isCypress ? "light" : context.globals.theme || "dark";

      return (
        <ThemeProvider mode={mode}>
          <Story />
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme mode",
      defaultValue: "dark",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
};

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash.split("/")[1] ?? "";
    const storyId = hash.split("--")[0] ?? "Component";

    const formattedTitle = storyId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    document.title = `Coneto – ${formattedTitle}`;
  });
}

export default preview;
