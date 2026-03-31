import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  title: "Systatum Coneto React UI Library",
  theme: create({
    base: "dark",
    brandImage: "/systatum-with-title.png",
    brandTitle: "Systatum Coneto React UI Library",
  }),
});

document.title = "Systatum Coneto React UI Library";
