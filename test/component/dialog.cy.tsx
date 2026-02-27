import { useState } from "react";
import { Dialog, DialogProps } from "./../../components/dialog";
import { RiAB } from "@remixicon/react";
import { Button } from "./../../components/button";

describe("Dialog", () => {
  function ProductDialog(props: DialogProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Dialog isOpen={isOpen} onVisibilityChange={setIsOpen} {...props}>
        Here is the content of the modal dialog.
      </Dialog>
    );
  }

  context("with Dialog.show()", () => {
    it("renders the modal dialog", () => {
      cy.mount(
        <Button
          onClick={() =>
            Dialog.show({
              title: "Default Modal",
              subtitle: "This is a subtitle",
              closable: true,
              buttons: [
                { id: "confirm", caption: "Confirm", variant: "primary" },
                { id: "cancel", caption: "Cancel", variant: "default" },
              ],
            })
          }
        >
          Open modal
        </Button>
      );

      cy.findByLabelText("dialog-wrapper").should("not.exist");
      cy.findByRole("button").click();

      cy.findByLabelText("dialog-wrapper").should("exist");
      cy.findByText("Default Modal").should("exist");
      cy.findByText("This is a subtitle").should("exist");
    });
  });

  context("when given icon", () => {
    it("renders icon 28px (by default)", () => {
      cy.mount(
        <ProductDialog
          icon={{
            image: RiAB,
          }}
        />
      );

      cy.findByLabelText("dialog-icon")
        .should("exist")
        .and("have.css", "width", "28px");
    });

    context("when given size 35px", () => {
      it("renders icon 28px (by default)", () => {
        cy.mount(
          <ProductDialog
            icon={{
              image: RiAB,
              size: 35,
            }}
          />
        );

        cy.findByLabelText("dialog-icon")
          .should("exist")
          .and("have.css", "width", "35px");
      });
    });

    context("when given red color", () => {
      it("renders icon with red color and lightened background color", () => {
        cy.mount(
          <ProductDialog
            icon={{
              image: RiAB,
              color: "red",
            }}
          />
        );

        cy.findByLabelText("dialog-icon")
          .should("exist")
          .and("have.css", "color", "rgb(255, 0, 0)")
          .parent()
          .and("have.css", "background-color", "rgb(255, 230, 230)");
      });
    });
  });

  context("onClosed", () => {
    context("when pressing escape", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("dialog-content").should("exist");
        cy.get("body").type("{esc}");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("dialog-content").should("not.exist");
      });
    });

    context("when clicking overlay-blocker", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("dialog-content").should("exist");
        cy.findByLabelText("overlay-blocker").should("exist").click("topLeft");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("dialog-content").should("not.exist");
      });
    });

    context("when clicking close button", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("dialog-content").should("exist");
        cy.findByLabelText("overlay-blocker").should("exist").click("topLeft");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("dialog-content").should("not.exist");
      });
    });

    context("when given closable false", () => {
      context("when pressing escape", () => {
        it("should not give the callback", () => {
          cy.mount(
            <ProductDialog
              closable={false}
              onClosed={() => {
                console.log("the modal is closed");
              }}
            />
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "the modal is closed"
          );

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "the modal is closed"
          );
          cy.findByLabelText("dialog-content").should("exist");
        });
      });

      context("when clicking overlay-blocker", () => {
        it("should not give the callback", () => {
          cy.mount(
            <ProductDialog
              closable={false}
              onClosed={() => {
                console.log("the modal is closed");
              }}
            />
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "the modal is closed"
          );

          cy.findByLabelText("dialog-content").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "the modal is closed"
          );
          cy.findByLabelText("dialog-content").should("exist");
        });
      });
    });
  });

  context("closable", () => {
    context("when given true", () => {
      context("when pressing escape", () => {
        it("should close the modal", () => {
          cy.mount(<ProductDialog closable={true} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductDialog closable={true} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });
    });

    context("when given false", () => {
      context("when pressing escape", () => {
        it("should not close the modal", () => {
          cy.mount(<ProductDialog closable={false} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("dialog-content").should("exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should not close the modal", () => {
          cy.mount(<ProductDialog closable={true} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("dialog-content").should("exist");
        });
      });
    });

    context("when not given (default)", () => {
      context("when pressing escape", () => {
        it("should close the modal", () => {
          cy.mount(<ProductDialog />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductDialog />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });
    });
  });
});
