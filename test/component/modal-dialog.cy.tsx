import { css } from "styled-components";
import { ModalDialog, ModalDialogProps } from "./../../components/modal-dialog";

describe("Modal Dialog", () => {
  context("contentStyle", () => {
    it("renders content-level with style", () => {
      const args: ModalDialogProps = {
        title: "Default Modal",
        subTitle: "This is a subtitle",
        hasCloseButton: true,
        buttons: [
          {
            id: "confirm",
            caption: "Confirm",
            variant: "primary",
          },
          {
            id: "cancel",
            caption: "Cancel",
            variant: "default",
          },
        ],
        isOpen: true,
        children: (
          <div
            style={{
              fontSize: "0.875rem",
              color: "#374151",
            }}
          >
            Here is the content of the modal dialog.
          </div>
        ),
        onVisibilityChange: (isOpen) => console.log(isOpen),
      };

      cy.mount(
        <ModalDialog
          {...args}
          contentStyle={css`
            min-height: 150px;
            background-color: wheat;
          `}
        />
      );

      cy.findByLabelText("modal-dialog-content")
        .should("have.css", "min-height", "150px")
        .and("have.css", "background-color", "rgb(245, 222, 179)");
    });
  });
});
