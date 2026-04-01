import type { Preview } from "@storybook/react";
import "../shared.css";
import { ThemeProvider } from "./../theme/provider";

const preview: Preview = {
  parameters: {
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
      const mode = context.globals.theme || "light";

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
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
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
