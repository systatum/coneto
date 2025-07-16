import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  title: "Systatum Coneto",
  theme: create({
    base: "dark",
    brandImage: "/systatum.png",
    brandTitle: "Systatum Coneto",
  }),
});

document.title = "Systatum Coneto";
