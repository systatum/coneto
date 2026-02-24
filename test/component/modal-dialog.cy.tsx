import { css } from "styled-components";
import { ModalDialog, ModalDialogProps } from "./../../components/modal-dialog";
import { useState } from "react";

describe("Modal Dialog", () => {
  function ProductModalDialog(props: ModalDialogProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <ModalDialog
        escapable={true}
        title="Default Modal"
        subTitle="This is a subtitle"
        hasCloseButton={true}
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

  context("escapable", () => {
    context("when given true", () => {
      context("when pressing escape", () => {
        it("should close the modal", () => {
          cy.mount(<ProductModalDialog />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("dialog-content").should("not.exist");
        });
      });
    });

    context("when given false", () => {
      context("when pressing escape", () => {
        it("should not close the modal", () => {
          cy.mount(<ProductModalDialog escapable={false} />);

          cy.findByLabelText("dialog-content").should("exist");
          cy.get("body").type("{esc}");
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
    });
  });

  context("textWrapperStyle", () => {
    it("renders with gap 6px", () => {
      cy.mount(<ProductModalDialog />);

      cy.findByLabelText("modal-dialog-text-wrapper").should(
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

        cy.findByLabelText("modal-dialog-text-wrapper").should(
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

        cy.findByLabelText("modal-dialog-title").should(
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

        cy.findByLabelText("modal-dialog-subtitle").should(
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

      cy.findByLabelText("modal-dialog-content")
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
