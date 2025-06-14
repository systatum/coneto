import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

addons.setConfig({
  title: "Storybook",
  theme: create({
    base: "dark",
    brandImage: "/systatum.png",
  }),
});
