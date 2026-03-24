import { getIdContent } from "test/support/commands";

describe("StatefulForm", () => {
  context("when default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-statefulform--default"));
    });

    context("when typing ", () => {
      it("should render value", () => {
        cy.findAllByRole("button").eq(2).should("be.disabled");

        cy.findByText("First Name").click().type("Alim");
        cy.findByText("Last Name").click().type("Naufal");
        cy.findByText("Email").click().type("alim@systatum.com");
        cy.findByPlaceholderText("Enter phone number").type("08123456789");

        cy.findAllByRole("button").eq(1).click();
        cy.findByPlaceholderText("Search your country...").type("Indonesia");
        cy.findByText("Indonesia").click();
        cy.findByText("Note").click().type("This is additional");
        cy.findByRole("checkbox").click();

        cy.findAllByRole("button").eq(2).should("not.be.disabled");

        cy.findByDisplayValue("Alim").should("exist");
        cy.findByDisplayValue("Naufal").should("exist");
        cy.findByDisplayValue("alim@systatum.com").should("exist");
        cy.findByPlaceholderText("Enter phone number").should(
          "have.value",
          "812-345-6789"
        );
        cy.findByText("+62").should("exist");
        cy.findByLabelText("Note").should("have.value", "This is additional");
        cy.findByRole("checkbox").should("be.checked");
      });
    });

    context("when hidden", () => {
      context("with required field", () => {
        it("should validate successfully", () => {
          cy.findAllByRole("button").eq(2).should("be.disabled");

          cy.findByText("First Name").click().type("Alim");
          cy.findByText("Middle Name").should("not.exist");
          cy.findByText("Last Name").click().type("Naufal");
          cy.findByText("Email").click().type("alim@systatum.com");
          cy.findByPlaceholderText("Enter phone number").type("08123456789");

          cy.findAllByRole("button").eq(1).click();
          cy.findByPlaceholderText("Search your country...").type("Indonesia");
          cy.findByText("Indonesia").click();
          cy.findByText("Note").click().type("This is additional");
          cy.findByRole("checkbox").click();

          cy.findAllByRole("button").eq(1).should("not.be.disabled");
        });
      });
    });
  });
});
