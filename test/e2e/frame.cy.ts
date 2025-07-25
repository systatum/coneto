import { getIdContent } from "test/support/commands";

describe("Frame Component", () => {
  it("renders DefaultFrame with inner content", () => {
    cy.visit(getIdContent("stage-frame--default-frame"));

    cy.contains("This is inside the frame.").should("exist");
  });

  it("renders WithTitle story with title and content", () => {
    cy.visit(getIdContent("stage-frame--with-title"));

    cy.contains("Frame Title").should("exist");
    cy.contains("This frame has a title.").should("exist");
  });

  it("renders Custom story with custom title and content", () => {
    cy.visit(getIdContent("stage-frame--custom"));

    cy.contains("Frame w/ Class").should("exist");
    cy.contains("This frame has a custom background color.").should("exist");
  });
});
