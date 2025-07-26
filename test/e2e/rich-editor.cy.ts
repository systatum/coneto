import { getIdContent } from "test/support/commands";

context("RichEditor Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-richeditor--default"));
    });

    it("Should type text and apply bold and italic styles", () => {
      cy.findByRole("textbox").should("exist").click().type("Hello World");
      cy.findByRole("textbox").should("contain.text", "Hello World");

      cy.findByRole("textbox").type("{selectall}");

      cy.findAllByRole("button").eq(0).click();
      cy.findAllByRole("button").eq(1).click();
    });

    it("should insert an ordered list using the toolbar button", () => {
      cy.findByRole("textbox").click().type("Item 1");
      cy.findByRole("textbox").type("{selectall}");

      cy.findAllByRole("button").eq(2).click();
      cy.findByRole("textbox").find("ol").should("exist");
    });

    it("should insert an unordered list using the toolbar button", () => {
      cy.findByRole("textbox").click().type("Bullet Point");
      cy.findByRole("textbox").type("{selectall}");

      cy.findAllByRole("button").eq(3).click();
      cy.findByRole("textbox").find("ul").should("exist");
    });

    const headings = ["Heading 1", "Heading 2", "Heading 3"];

    headings.forEach((label) => {
      it(`should apply ${label} heading from dropdown`, () => {
        cy.findByRole("textbox").click().type("Heading Text");
        cy.findByRole("textbox").type("{selectall}");
        cy.findAllByRole("button").eq(4).click();
        cy.findByText(label).click();
      });
    });
  });
});
