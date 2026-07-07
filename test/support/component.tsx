import "./../../shared.css";
import "./../../documentation.css";
import { mount, MountOptions } from "cypress/react";
import "./commands";
import "@testing-library/cypress/add-commands";
import "cypress-real-events";
import { ThemeProvider } from "./../../theme/provider";
import React, { ReactNode } from "react";

type CustomMountOptions = MountOptions & {
  mode?: "light" | "dark" | string;
};

const mountWithTheme = (
  component: React.ReactNode,
  options: CustomMountOptions = {}
) => {
  const { mode = "light" } = options;

  document.body.setAttribute("data-theme", mode);

  return mount(
    <ThemeProvider mode={mode}>
      <div data-theme={mode}>{component}</div>
    </ThemeProvider>,
    options
  );
};

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("Canceled")) return false;
});

Cypress.Commands.add("shouldHaveEditorFromValue", (label, expectedValue) => {
  const normalize = (text: string) =>
    text
      .replace(/\u200B/g, "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const actualLines: string[] = [];

  cy.findByLabelText(label)
    .find(".view-line")
    .each(($el) => {
      actualLines.push(normalize($el.text() || ""));
    })
    .then(() => {
      const expectedLines = expectedValue.split("\n").map(normalize);

      expect(actualLines.join("\n")).to.eq(expectedLines.join("\n"));
    });
});

Cypress.Commands.add("mount", mountWithTheme);
Cypress.Commands.add("mountWithoutTheme", mount);

declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: ReactNode,
        options?: CustomMountOptions
      ): Cypress.Chainable;
      mountWithoutTheme(component: ReactNode): Cypress.Chainable;
      shouldHaveEditorFromValue(
        label: string,
        expectedValue: string
      ): Chainable<void>;
    }
  }
}
