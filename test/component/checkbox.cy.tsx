import { css } from "styled-components";
import { Checkbox } from "./../../components/checkbox";

describe("Checkbox", () => {
  context("selection behavior", () => {
    const checkboxComponent = () =>
      cy.mount(
        <Checkbox
          title="Checkbox title"
          label="Checkbox label"
          description="Checkbox description"
        />
      );

    context("when clicking the title", () => {
      it("renders checked the checkbox", () => {
        checkboxComponent();

        cy.findByRole("checkbox").should("not.be.checked");
        cy.findByText("Checkbox title").click();
        cy.findByRole("checkbox").should("be.checked");
      });
    });

    context("when clicking the label", () => {
      it("renders checked the checkbox", () => {
        checkboxComponent();

        cy.findByRole("checkbox").should("not.be.checked");
        cy.findByText("Checkbox label").click();
        cy.findByRole("checkbox").should("be.checked");
      });
    });

    context("when clicking the description", () => {
      it("renders checked the checkbox", () => {
        checkboxComponent();

        cy.findByRole("checkbox").should("not.be.checked");
        cy.findByText("Checkbox description").click();
        cy.findByRole("checkbox").should("be.checked");
      });
    });
  });

  context("when adding a large label", () => {
    it("render the checkbox and label with center alignment", () => {
      cy.mount(
        <Checkbox
          label="This is checkbox with title"
          styles={{
            labelStyle: css`
              font-size: 30px;
            `,
          }}
        />
      );
      cy.findByRole("checkbox").click();
      cy.findByText("This is checkbox with title").should(
        "have.css",
        "font-size",
        "30px"
      );
      cy.findByRole("checkbox").should("be.checked");
      cy.findByLabelText("input-container-checkbox").should(
        "have.css",
        "align-items",
        "center"
      );
    });
  });

  context("when disabled", () => {
    it("render the checkbox with not-allowed", () => {
      cy.mount(<Checkbox disabled label="This is checkbox with title" />);
      cy.findByRole("checkbox")
        .should("have.css", "cursor", "not-allowed")
        .and("have.css", "user-select", "none");
      cy.findByText("This is checkbox with title")
        .should("have.css", "cursor", "not-allowed")
        .and("have.css", "user-select", "none");
    });
    context("when clicking", () => {
      it("should not render the console", () => {
        cy.mount(
          <Checkbox
            disabled
            label="This is checkbox with title"
            onChange={() => {
              console.log("Test the console");
            }}
          />
        );
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findByText("This is checkbox with title").click();

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "Test the console"
        );
      });
    });
  });
});
