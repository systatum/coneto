import { getIdContent } from "test/support/commands";

context("Timeline Component", () => {
  const defaultData = [
    "Traveled to Japan",
    "Started Daily Meditation Habit",
    "Ran First Half Marathon",
    "Adopted a Dog",
  ];

  const customData = [
    "Alim Naufal | 5 weeks ago",
    "HR Team | 5 weeks ago",
    "Adam Hakarsa | 3 weeks ago",
    "HR Team | 2 weeks ago",
    "Alim Naufal | 2 weeks ago",
    "HR Team | 1 week ago",
  ];

  context("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-timeline--default"));
    });

    it("Should display all timeline items", () => {
      defaultData.forEach((content) => {
        cy.contains(content, { timeout: 10000 }).should("be.visible");
      });
    });
  });

  context("Clickable", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-timeline--clickable"));
    });

    it("Should display all timeline items", () => {
      defaultData.forEach((content) => {
        cy.contains(content, { timeout: 10000 }).should("be.visible");
      });
    });

    it("Should have clickable items", () => {
      Array.from({ length: 4 }).forEach((_, index) => {
        cy.findByLabelText(`timeline-item-${index}`).should("be.visible");
      });
    });
  });

  context("Custom", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-timeline--custom"));
    });

    it("Should display all custom timeline items", () => {
      customData.forEach((content) => {
        cy.contains(content, { timeout: 10000 }).should("be.visible");
      });
    });
  });
});
