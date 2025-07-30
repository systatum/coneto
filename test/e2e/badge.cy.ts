import { getIdContent } from "test/support/commands";

context("Badge Component", () => {
  describe("Default", () => {
    it("Should show and allow clicking the Default badge", () => {
      cy.visit(getIdContent("content-badge--default"));

      cy.contains("Default badge", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Default badge").should("be.visible");
    });
  });

  describe("Neutral", () => {
    it("Should show and allow clicking the Neutral badge with circle", () => {
      cy.visit(getIdContent("content-badge--neutral"));

      cy.contains("Neutral badge with circle", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Neutral badge with circle").should("be.visible");
    });
  });

  describe("Green", () => {
    it("Should show and allow clicking the Green badge with circle", () => {
      cy.visit(getIdContent("content-badge--green"));

      cy.contains("Green badge with circle", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Green badge with circle").should("be.visible");
    });
  });

  describe("Yellow", () => {
    it("Should show and allow clicking the Yellow badge with circle", () => {
      cy.visit(getIdContent("content-badge--yellow"));

      cy.contains("Yellow badge with circle", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Yellow badge with circle").should("be.visible");
    });
  });

  describe("Red", () => {
    it("Should show and allow clicking the Red badge (Proceed with caution)", () => {
      cy.visit(getIdContent("content-badge--red"));

      cy.contains("Proceed with caution", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Proceed with caution").should("be.visible");
    });
  });

  describe("Custom", () => {
    it("Should show and allow clicking all Custom badges", () => {
      cy.visit(getIdContent("content-badge--custom"));

      const captions = [
        "Anime",
        "Manga",
        "Comics",
        "Movies",
        "Podcasts",
        "TV Shows",
        "Novels",
        "Music",
        "Games",
        "Webtoons",
      ];

      captions.forEach((caption) => {
        cy.contains(caption, { timeout: 10000 }).should("be.visible").click();
        cy.contains(caption).should("be.visible");
      });
    });
  });
});
