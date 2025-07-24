import { getIdContent } from "test/support/commands";

describe("ChoiceGroup Component", () => {
  it("should render radio buttons and change selection", () => {
    cy.visit(getIdContent("content-choicegroup--with-radio"));

    cy.findAllByRole("radio", { timeout: 10000 }).should("have.length", 4);

    cy.findByText("Mentions")
      .click()
      .then(() => {
        cy.get('input[value="mentions"]').should("be.checked");
      });
  });

  it("should render checkboxes and allow multiple selection", () => {
    cy.visit(getIdContent("content-choicegroup--with-checkbox"));

    cy.findAllByRole("checkbox", { timeout: 10000 }).should("have.length", 3);

    cy.findByText("Email")
      .click()
      .then(() => {
        cy.get('input[value*="email"]').should("be.checked");
      });

    cy.findByText("Push Notifications")
      .click()
      .then(() => {
        cy.get('input[value*="push"]').should("be.checked");
      });
  });
});
