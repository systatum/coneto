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

    it("Should insert an ordered list using the toolbar button", () => {
      cy.findByRole("textbox").click().type("Item 1");
      cy.findByRole("textbox").type("{selectall}");

      cy.findAllByRole("button").eq(2).click();
      cy.findByRole("textbox").find("ol").should("exist");
    });

    it("Should insert an unordered list using the toolbar button", () => {
      cy.findByRole("textbox").click().type("Bullet Point");
      cy.findByRole("textbox").type("{selectall}");

      cy.findAllByRole("button").eq(3).click();
      cy.findByRole("textbox").find("ul").should("exist");
    });

    it("Should show content on screen", () => {
      cy.findByRole("textbox").click().type("Print content Test");

      cy.findByRole("textbox").type("{selectall}");
      cy.findAllByRole("button").eq(0).click();
      cy.findByRole("textbox").type("{moveToEnd}{enter}{enter}");
      cy.findAllByRole("button").eq(0).click();

      cy.findByRole("textbox").type(
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.{enter}"
      );

      cy.findByRole("textbox")
        .click()
        .type("{enter}- The quick brown fox jumps over the lazy dog.{enter}")
        .type("Pack my box with five dozen liquor jugs.{enter}")
        .type("Typing skills improve with daily practice.{enter}")
        .type("Accuracy is more important than speed.{enter}")
        .type("Stay consistent and avoid looking at the keyboard.");

      cy.findAllByRole("button").eq(5).click();

      cy.get("pre")
        .invoke("text")
        .then((text) => {
          expect(text).to.contain("**Print content Test**");
          expect(text).to.contain(
            "The quick brown fox jumps over the lazy dog."
          );
          expect(text).to.contain(
            "*   Pack my box with five dozen liquor jugs."
          );
          expect(text).to.contain(
            "*   Typing skills improve with daily practice."
          );
          expect(text).to.contain("*   Accuracy is more important than speed.");
          expect(text).to.contain(
            "*   Stay consistent and avoid looking at the keyboard."
          );
        });
    });

    const headings = ["Heading 1", "Heading 2", "Heading 3"];

    headings.forEach((label) => {
      it(`Should apply ${label} heading from dropdown`, () => {
        cy.findByRole("textbox").click().type("Heading Text");
        cy.findByRole("textbox").type("{selectall}");
        cy.findAllByRole("button").eq(4).click();
        cy.findByText(label).click();
      });
    });
  });
});
