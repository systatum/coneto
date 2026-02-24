import { useState } from "react";
import { Dialog, DialogProps } from "./../../components/dialog";

describe("Dialog", () => {
  function ProductDialog(props: DialogProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Dialog isOpen={isOpen} onVisibilityChange={setIsOpen} {...props}>
        <Dialog.Content>
          Here is the content of the modal dialog.
        </Dialog.Content>
      </Dialog>
    );
  }

  context("escapable", () => {
    context("when given true", () => {
      context("when pressing escape", () => {
        it("should close the modal", () => {
          cy.mount(<ProductDialog escapable={true} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });
    });

    context("when given false", () => {
      context("when pressing escape", () => {
        it("should not close the modal", () => {
          cy.mount(<ProductDialog escapable={false} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
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
    });
  });
});
