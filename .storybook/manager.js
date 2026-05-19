import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";
import logo from "./../public/systatum-with-title.png";

addons.setConfig({
  title: "Systatum Coneto React UI Library",
  theme: create({
    base: "dark",
    brandImage: logo,
    brandTitle: "Systatum Coneto React UI Library",
  }),
});

document.title = "Systatum Coneto React UI Library";
