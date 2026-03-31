import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  title: "Systatum - Coneto React UI",
  theme: create({
    base: "dark",
    brandImage: "/systatum.png",
    brandTitle: "Systatum - Coneto React UI",
  }),
});

document.title = "Systatum - Coneto React UI";
