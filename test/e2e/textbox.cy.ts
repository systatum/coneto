import { getIdContent } from "test/support/commands";

describe("Textbox", () => {
  context("default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--input"));
    });

    context("when typing", () => {
      it("should render text on the input", () => {
        cy.findByPlaceholderText("Type here...")
          .clear()
          .type("This is input text");
        cy.findByPlaceholderText("Type here...").should(
          "have.value",
          "This is input text"
        );
      });
    });
  });

  context("with dropdown", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--with-dropdown"));
    });

    context("when choosing", () => {
      it("should change the text on button", () => {
        cy.findByPlaceholderText("Type here...")
          .clear()
          .type("This is input text");
        cy.findByPlaceholderText("Type here...").should(
          "have.value",
          "This is input text"
        );
        cy.findAllByRole("button").eq(0).click();
        cy.findByText("Profile").click();
        cy.findAllByRole("button").eq(0).should("contain.text", "Profile");
      });
    });

    context("with filter", () => {
      context("when search content", () => {
        it("should render with filtered content", () => {
          cy.findAllByRole("button").eq(0).click();
          cy.findByLabelText("textbox-search").type("prof");
          ["Home", "Profile", "Settings", "Logout", "Dashboard"].map((data) => {
            if (data === "Profile" || data === "Home") {
              cy.findAllByText(data).should("exist");
            } else {
              cy.findAllByText(data).should("not.exist");
            }
          });
        });
      });
    });
  });

  context("with action", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--with-action"));
    });

    context("when pressing icon", () => {
      it("should render the action", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findByPlaceholderText("Type a message...")
          .clear()
          .type("This is a Input message");

        cy.findByLabelText("action-icon").click({ force: true });
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "Send message has been successful."
        );
      });
    });
  });

  context("with password", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--password"));
    });

    context("when pressing icon eyes", () => {
      it("should see password", () => {
        cy.findByPlaceholderText("Enter password...")
          .clear()
          .type("mypassword123")
          .should("have.attr", "type", "password");
        cy.findAllByLabelText("toggle-password").eq(0).click();
        cy.findByPlaceholderText("Enter password...").should(
          "have.attr",
          "type",
          "text"
        );
      });
    });
  });

  context("with error message", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-textbox--with-error-message"));
    });

    context("when typing", () => {
      it("should clear the error message", () => {
        cy.findByText("This field is required").should("exist");
        cy.findByPlaceholderText("Type with error...")
          .clear()
          .type("Error triggered");
        cy.findByRole("textbox").should("have.value", "Error triggered");
        cy.findByText("This field is required").should("not.exist");
      });
    });
  });
});
