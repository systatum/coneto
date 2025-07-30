import { getIdContent } from "test/support/commands";

context("Rating Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--default"));
    });

    it("Should display 5 stars and allow clicking", () => {
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
      cy.findAllByRole("img", { hidden: true }).eq(3).click();
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
    });
  });

  describe("Not Editable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--not-editable"));
    });

    it("Should show 5 stars and not be editable", () => {
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
    });
  });

  describe("With Label", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--with-label"));
    });

    it("Should show label text and 5 stars", () => {
      cy.findByText("4.5 / 5").should("exist");
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
    });
  });

  describe("Small", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--small"));
    });

    it("Should display small stars and allow clicking", () => {
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
      cy.findAllByRole("img", { hidden: true }).eq(2).click();
    });
  });

  describe("Medium", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--medium"));
    });

    it("Should display medium stars and allow clicking", () => {
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
      cy.findAllByRole("img", { hidden: true }).eq(1).click();
    });
  });

  describe("Large", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-rating--large"));
    });

    it("Should display large stars and allow clicking", () => {
      cy.findAllByRole("img", { hidden: true }).should("have.length", 5);
      cy.findAllByRole("img", { hidden: true }).eq(4).click();
    });
  });
});
