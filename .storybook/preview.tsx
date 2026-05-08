import type { Preview } from "@storybook/react";
import { addons } from "@storybook/preview-api";
import "../shared.css";
import { ThemeProvider } from "./../theme/provider";
import { GLOBALS_UPDATED } from "@storybook/core-events";

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
        order: ["Welcome", "*"],
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
      const mode = context.globals.theme || "dark";

      document.body.setAttribute("data-theme", mode);

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
