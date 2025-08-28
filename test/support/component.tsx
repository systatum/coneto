import "./../../shared.css";
import { mount } from "cypress/react";
import "./commands";
import "@testing-library/cypress/add-commands";

Cypress.Commands.add("mount", mount);

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}
