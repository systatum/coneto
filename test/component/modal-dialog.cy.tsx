import { css } from "styled-components";
import { ModalDialog, ModalDialogProps } from "./../../components/modal-dialog";
import { useState } from "react";
import { RiAB } from "@remixicon/react";
import { Button } from "./../../components/button";

describe("Modal Dialog", () => {
  function ProductModalDialog(props: ModalDialogProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <ModalDialog
        title="Default Modal"
        subtitle="This is a subtitle"
        closable={true}
        buttons={[
          { id: "confirm", caption: "Confirm", variant: "primary" },
          { id: "cancel", caption: "Cancel", variant: "default" },
        ]}
        isOpen={isOpen}
        onVisibilityChange={setIsOpen}
        {...props}
      >
        <div style={{ fontSize: "0.875rem", color: "#374151" }}>
          Here is the content of the modal dialog.
        </div>
      </ModalDialog>
    );
  }

  context("with ModalDialog.show()", () => {
    it("renders the modal dialog", () => {
      cy.mount(
        <Button
          onClick={() =>
            ModalDialog.show({
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
        <ProductModalDialog
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
          <ProductModalDialog
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
          <ProductModalDialog
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
          <ProductModalDialog
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
          <ProductModalDialog
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
          <ProductModalDialog
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
            <ProductModalDialog
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
            <ProductModalDialog
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
          cy.mount(<ProductModalDialog closable={true} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductModalDialog closable={true} />);

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
          cy.mount(<ProductModalDialog closable={false} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("dialog-content").should("exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should not close the modal", () => {
          cy.mount(<ProductModalDialog closable={false} />);

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
          cy.mount(<ProductModalDialog />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductModalDialog />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });
    });
  });

  context("textWrapperStyle", () => {
    it("renders with gap 6px", () => {
      cy.mount(<ProductModalDialog />);

      cy.findByLabelText("dialog-text-wrapper").should(
        "have.css",
        "gap",
        "6px"
      );
    });

    context("when given gap 16px", () => {
      it("renders with gap 16px", () => {
        cy.mount(
          <ProductModalDialog
            styles={{
              textWrapperStyle: css`
                gap: 16px;
              `,
            }}
          />
        );

        cy.findByLabelText("dialog-text-wrapper").should(
          "have.css",
          "gap",
          "16px"
        );
      });
    });
  });

  context("titleStyle", () => {
    context("when given 30px", () => {
      it("renders title with 30px", () => {
        cy.mount(
          <ProductModalDialog
            styles={{
              titleStyle: css`
                font-size: 30px;
              `,
            }}
          />
        );

        cy.findByLabelText("dialog-title").should(
          "have.css",
          "font-size",
          "30px"
        );
      });
    });
  });

  context("subtitleStyle", () => {
    context("when given 20px", () => {
      it("renders title with 20px", () => {
        cy.mount(
          <ProductModalDialog
            styles={{
              subtitleStyle: css`
                font-size: 20px;
              `,
            }}
          />
        );

        cy.findByLabelText("dialog-subtitle").should(
          "have.css",
          "font-size",
          "20px"
        );
      });
    });
  });

  context("contentStyle", () => {
    it("renders content-level with style", () => {
      cy.mount(
        <ProductModalDialog
          styles={{
            contentStyle: css`
              min-height: 150px;
              background-color: wheat;
            `,
          }}
        />
      );

      cy.findByLabelText("dialog-content")
        .should("have.css", "min-height", "150px")
        .and("have.css", "background-color", "rgb(245, 222, 179)");
    });
  });

  context("button", () => {
    it("renders with properly padding", () => {
      cy.mount(
        <ProductModalDialog
          buttons={[
            {
              id: "add-draft",
              caption: "Add draft",
              variant: "primary",
            },
            {
              id: "cancel",
              caption: "Cancel",
              variant: "default",
            },
          ]}
          styles={{
            contentStyle: css`
              min-height: 150px;
              background-color: wheat;
            `,
          }}
        />
      );

      cy.findByRole("button", { name: /Add draft/i })
        .should("have.css", "height", "56px")
        .and("have.css", "padding-left", "16px")
        .and("have.css", "padding-right", "16px")
        .and("have.css", "padding-top", "16px")
        .and("have.css", "padding-bottom", "40px");
      cy.findByRole("button", { name: /Cancel/i })
        .should("have.css", "height", "56px")
        .and("have.css", "padding-left", "16px")
        .and("have.css", "padding-right", "16px")
        .and("have.css", "padding-top", "16px")
        .and("have.css", "padding-bottom", "40px");
    });
  });
});
