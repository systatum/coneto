import { Button } from "./../../components/button";
import {
  PaperDialog,
  PaperDialogProps,
  PaperDialogRef,
} from "./../../components/paper-dialog";
import { useRef } from "react";

describe("PaperDialog", () => {
  function ProductPaperDialog(props: PaperDialogProps) {
    const dialogRef = useRef<PaperDialogRef>(null);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Button onClick={() => dialogRef.current?.openDialog()}>Open</Button>
        <Button onClick={() => dialogRef.current?.closeDialog()}>Close</Button>

        <PaperDialog closable width="35vw" ref={dialogRef} {...props}>
          <PaperDialog.Content
            style={{
              padding: "36px",
              gap: "16px",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                Escapable Feature
              </h2>
              <p style={{ fontSize: "14px", color: "#4B5563" }}>
                When closable with value false, the dialog cannot be closed by
                pressing the Escape key or clicking the background. Use the
                close button or action buttons to dismiss it.
              </p>
              <p style={{ fontSize: "14px", color: "#4B5563" }}>
                You can still interact with the content and action buttons
                inside the dialog.
              </p>
            </div>
          </PaperDialog.Content>
        </PaperDialog>
      </div>
    );
  }

  context("onClose", () => {
    context("when pressing escape", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductPaperDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByRole("button").eq(0).should("exist").click();

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("paper-dialog-content").should("exist");
        cy.get("body").type("{esc}");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("paper-dialog-content").should("not.exist");
      });
    });

    context("when clicking overlay-blocker", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductPaperDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByRole("button").eq(0).should("exist").click();

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("paper-dialog-content").should("exist");
        cy.findByLabelText("overlay-blocker").should("exist").click("topLeft");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("paper-dialog-content").should("not.exist");
      });
    });

    context("when clicking close button", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductPaperDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByRole("button").eq(0).should("exist").click();

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("paper-dialog-content").should("exist");
        cy.findByLabelText("overlay-blocker").should("exist").click("topLeft");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("paper-dialog-content").should("not.exist");
      });
    });
  });

  context("closable", () => {
    context("when given true", () => {
      context("when pressing escape", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog closable={true} />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("paper-dialog-content").should("not.exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog closable={true} />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-content").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("paper-dialog-content").should("not.exist");
        });
      });
    });

    context("when given false", () => {
      context("when pressing escape", () => {
        it("should not close the modal", () => {
          cy.mount(<ProductPaperDialog closable={false} />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("paper-dialog-content").should("exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog closable={false} />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-content").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("paper-dialog-content").should("exist");
        });
      });
    });

    context("when not given (default)", () => {
      context("when pressing escape", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("paper-dialog-content").should("not.exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-content").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("paper-dialog-content").should("not.exist");
        });
      });
    });
  });
});
