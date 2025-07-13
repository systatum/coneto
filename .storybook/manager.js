import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  title: "Coneto Systatum",
  theme: create({
    base: "dark",
    brandImage: "/systatum.png",
    brandTitle: "Coneto Systatum",
  }),
});

document.title = "Coneto Systatum";
