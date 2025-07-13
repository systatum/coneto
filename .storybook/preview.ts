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

export default preview;
