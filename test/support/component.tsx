import "./../../shared.css";
import { mount, MountOptions } from "cypress/react";
import "./commands";
import "@testing-library/cypress/add-commands";
import "cypress-real-events";
import { ThemeProvider } from "./../../theme/provider";
import { themes } from "./../../theme/mode";
import { ReactNode } from "react";

type CustomMountOptions = MountOptions & {
  mode?: "light" | "dark";
};

const mountWithTheme = (
  component: React.ReactNode,
  options: CustomMountOptions = {}
) => {
  const { mode = "light" } = options;

  return mount(
    <ThemeProvider themes={themes} mode={mode}>
      <div data-theme={mode}>{component}</div>
    </ThemeProvider>,
    options
  );
};

Cypress.Commands.add("mount", mountWithTheme);

declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: ReactNode,
        options?: CustomMountOptions
      ): Cypress.Chainable;
    }
  }
}
