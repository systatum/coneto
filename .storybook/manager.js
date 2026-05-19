import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming";

const basePath = window.location.pathname.replace(/\/[^/]*$/, "/");
console.log("My base path is:", basePath);

addons.setConfig({
  title: "Systatum Coneto React UI Library",
  theme: create({
    base: "dark",
    brandImage: `${basePath}systatum-with-title.png`,
    brandTitle: "Systatum Coneto React UI Library",
  }),
});

document.title = "Systatum Coneto React UI Library";
