import { getIdContent } from "test/support/commands";

describe("Badge", () => {
  context("Default", () => {
    it("should show the Default badge", () => {
      cy.visit(getIdContent("content-badge--default"));

      cy.contains("Default badge", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Default badge").should("be.visible");
    });
  });

  context("With Action", () => {
    context("when given and clicking", () => {
      it("should show console log", () => {
        cy.visit(getIdContent("content-badge--with-actions"));

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.contains("With action badge", { timeout: 10000 })
          .should("be.visible")
          .click();

        cy.contains("With action badge").should("be.visible");
        cy.findByLabelText("badge-action").should("be.visible").click();
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "Data was deleted"
        );
      });
    });
  });

  context("Neutral", () => {
    it("should show the Neutral badge with circle", () => {
      cy.visit(getIdContent("content-badge--neutral"));

      cy.contains("Neutral badge with circle", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Neutral badge with circle").should("be.visible");
    });
  });

  context("Green", () => {
    it("should show the green badge with circle", () => {
      cy.visit(getIdContent("content-badge--green"));

      cy.contains("Green badge with circle", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Green badge with circle").should("be.visible");
    });
  });

  context("Yellow", () => {
    it("should show the yellow badge with circle", () => {
      cy.visit(getIdContent("content-badge--yellow"));

      cy.contains("Yellow badge with circle", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Yellow badge with circle").should("be.visible");
    });
  });

  context("Red", () => {
    it("should show the red badge (proceed with caution)", () => {
      cy.visit(getIdContent("content-badge--red"));

      cy.contains("Proceed with caution", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.contains("Proceed with caution").should("be.visible");
    });
  });

  context("Custom", () => {
    it("should show all Custom badges", () => {
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
