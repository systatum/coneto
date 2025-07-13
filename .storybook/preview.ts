import type { Preview } from "@storybook/react";
import "../shared.css";

const preview: Preview = {
  parameters: {
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
};

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash.split("/")[1] ?? "";
    const storyId = hash.split("--")[0] ?? "Component";

    const formattedTitle = storyId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    document.title = `Coneto Systatum – ${formattedTitle}`;
  });
}

export default preview;
