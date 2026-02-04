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
          styles={{
            contentStyle: css`
              min-height: 150px;
              background-color: wheat;
            `,
          }}
        />
      );

      cy.findByLabelText("modal-dialog-content")
        .should("have.css", "min-height", "150px")
        .and("have.css", "background-color", "rgb(245, 222, 179)");
    });
  });

  context("button", () => {
    it("renders with properly padding", () => {
      const args: ModalDialogProps = {
        title: "Default Modal",
        subTitle: "This is a subtitle",
        hasCloseButton: true,
        buttons: [
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
