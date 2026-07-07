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
    beforeEach(() => {
      cy.mount(
        <Button
          onClick={() =>
            Dialog.show({
              title: "Default Modal",
              subtitle: "This is a subtitle",
              closable: true,
              actions: [
                { id: "confirm", caption: "Confirm", variant: "primary" },
                { id: "cancel", caption: "Cancel", variant: "default" },
              ],
              onClick: ({ buttonId, closeDialog }) => {
                console.log(`this is button ${buttonId}`);
                closeDialog();
              },
            })
          }
        >
          Open modal
        </Button>
      );

      cy.findByLabelText("dialog-wrapper").should("not.exist");
      cy.findByRole("button").click();
    });

    it("renders the modal dialog", () => {
      cy.findByLabelText("dialog-wrapper").should("exist");
      cy.findByText("Default Modal").should("exist");
      cy.findByText("This is a subtitle").should("exist");
    });
  });

  context("when clicking button", () => {
    it("should display console per id", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.findByLabelText("dialog-wrapper").should("exist");
      cy.findByText("Default Modal").should("exist");
      cy.findByText("This is a subtitle").should("exist");

      cy.findByText("Confirm").should("exist").click();
      cy.wait(300);
      cy.get("@consoleLog").should(
        "have.been.calledWith",
        "this is button confirm"
      );
    });
  });

  context("mobile", () => {
    it("renders wrapper without padding", () => {
      cy.mount(
        <ProductDialog
          icon={{
            image: RiAB,
          }}
          mobile
        />
      );

      cy.findByLabelText("dialog-wrapper").should("have.css", "padding", "0px");
    });

    it("renders with user select none", () => {
      cy.mount(
        <ProductDialog
          icon={{
            image: RiAB,
          }}
          mobile
        />
      );

      cy.findByLabelText("dialog-wrapper").should(
        "have.css",
        "user-select",
        "none"
      );
    });

    context("actions", () => {
      it("renders button full width", () => {
        cy.mount(
          <ProductDialog
            icon={{
              image: RiAB,
            }}
            actions={[{ id: "cancel", caption: "Cancel" }]}
            mobile
          />
        );

        cy.findByLabelText("dialog-wrapper").should(
          "have.css",
          "width",
          "380px"
        );
        cy.findAllByRole("button")
          .eq(1)
          .should("exist")
          .and("have.css", "width", "380px");
      });

      it("renders button with user-select none", () => {
        cy.mount(
          <ProductDialog
            icon={{
              image: RiAB,
            }}
            actions={[{ id: "cancel", caption: "Cancel" }]}
            mobile
          />
        );

        cy.findAllByRole("button")
          .eq(1)
          .should("exist")
          .and("have.css", "user-select", "none");
      });

      context("when hovering button", () => {
        it("should not changes the button", () => {
          cy.mount(
            <ProductDialog
              icon={{
                image: RiAB,
              }}
              actions={[{ id: "cancel", caption: "Cancel" }]}
              mobile
            />
          );

          cy.get("button")
            .eq(0)
            .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
            .realHover()
            .then(($el) => {
              cy.wait(200);
              cy.wrap($el).should(
                "have.css",
                "background-color",
                "rgba(0, 0, 0, 0)"
              );
            });
        });
      });

      context("when clicking", () => {
        it("should render on the console", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "cancel was clicked"
          );

          cy.mount(
            <ProductDialog
              icon={{
                image: RiAB,
              }}
              actions={[{ id: "cancel", caption: "Cancel" }]}
              onClick={({ buttonId }) => console.log(`${buttonId} was clicked`)}
              mobile
            />
          );

          cy.findAllByRole("button").eq(1).click();

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "cancel was clicked"
          );
        });

        it("should changes the background to the hover color", () => {
          cy.mount(
            <ProductDialog
              icon={{
                image: RiAB,
              }}
              actions={[{ id: "cancel", caption: "Cancel" }]}
              mobile
            />
          );

          cy.get("button")
            .eq(0)
            .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
            .realMouseDown();

          cy.wait(100);
          cy.get("button")
            .eq(0)
            .should(
              "have.css",
              "background-color",
              "rgba(255, 255, 255, 0.45)"
            );
        });
      });

      context("when given more than one button", () => {
        it("separate all with for each button", () => {
          cy.mount(
            <ProductDialog
              icon={{
                image: RiAB,
              }}
              actions={[
                { id: "cancel", caption: "Cancel" },
                { id: "archive", caption: "Archive", variant: "primary" },
              ]}
              mobile
            />
          );

          cy.findByLabelText("dialog-wrapper").should(
            "have.css",
            "width",
            "380px"
          );
          cy.findAllByRole("button")
            .eq(1)
            .should("exist")
            .and("have.css", "width", "190px");
          cy.findAllByRole("button")
            .eq(2)
            .should("exist")
            .and("have.css", "width", "190px");
        });
      });
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

      cy.findByLabelText("title-icon")
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

        cy.findByLabelText("title-icon")
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

        cy.findByLabelText("title-icon")
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
        cy.findByLabelText("overlay-blocker")
          .should("exist")
          .click("topLeft", { force: true });

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
        cy.findByLabelText("overlay-blocker")
          .should("exist")
          .click("topLeft", { force: true });

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
            .click("topLeft", { force: true });

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
            .click("topLeft", { force: true });
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
            .click("topLeft", { force: true });
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
            .click("topLeft", { force: true });
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });
    });
  });
});
