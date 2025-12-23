import { Searchbox } from "./../../components/searchbox";

describe("Searchbox", () => {
  context("deletion", () => {
    context("when clicking", () => {
      it("calls onChange with an empty value", () => {
        cy.mount(
          <Searchbox
            value="Alimnfl"
            onChange={(e) => console.log(`the value is ${e.target.value}`)}
          />
        );
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findByLabelText("delete-input").click();
        cy.get("@consoleLog").should("have.been.calledWith", "the value is ");
      });

      it("should keep focus on the searchbox", () => {
        cy.mount(
          <Searchbox
            value="Alimnfl"
            onChange={(e) => console.log(`the value is ${e.target.value}`)}
          />
        );

        cy.findByLabelText("textbox-search").click().should("be.focused");
        cy.findByLabelText("delete-input").click();
        cy.findByLabelText("textbox-search").should("be.focused");
      });
    });
  });
});
