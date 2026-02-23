import { css } from "styled-components";
import {
  Keynote,
  KeynoteProps,
  KeynoteStyles,
} from "./../../components/keynote";

describe("Keynote", () => {
  context("styles", () => {
    function ProductKeyNote({ styles }: { styles?: KeynoteStyles }) {
      const data = {
        modelType: "MXQ83700F3",
        requestCreatedBy: "adam@systatum.com",
        lastSynced: "2025-06-20",
        createdOn: "2025-06-19",
        desc: "Backup unit installed on site",
      };

      return (
        <Keynote
          data={data}
          styles={styles}
          keys={[
            "modelType",
            "requestCreatedBy",
            "lastSynced",
            "createdOn",
            "desc",
          ]}
          keyLabels={[
            "Model Type",
            "Request Created By",
            "Last Synced",
            "Created On",
            "Description",
          ]}
        />
      );
    }

    context("when given gap by 8px between content", () => {
      it("renders with 8px gap", () => {
        cy.mount(
          <ProductKeyNote
            styles={{
              self: css`
                gap: 8px;
              `,
            }}
          />
        );

        cy.findByLabelText("keynote-wrapper").should("have.css", "gap", "8px");
      });
    });

    context("keynotePointStyles", () => {
      context("when given with font size 20px and padding-y 12px", () => {
        it("renders custom font-size styles to label and value", () => {
          cy.mount(
            <ProductKeyNote
              styles={{
                rowStyle: css`
                  padding: 12px 0;
                `,
                rowKeyStyle: css`
                  font-size: 20px;
                `,
                rowValueStyle: css`
                  font-size: 20px;
                `,
              }}
            />
          );

          cy.contains("Model Type").should("have.css", "font-size", "20px");

          cy.contains("MXQ83700F3").should("have.css", "font-size", "20px");

          cy.contains("Model Type")
            .parent()
            .should("have.css", "padding-top", "12px")
            .and("have.css", "padding-bottom", "12px");
        });
      });
    });

    context("key label", () => {
      it("renders with 14px and width 30%", () => {
        cy.mount(<ProductKeyNote />);

        Array.from({ length: 5 }).map((_, index) => {
          cy.findAllByLabelText("keynote-point-key")
            .eq(index)
            .should("have.css", "font-size", "14px")
            .and("have.css", "width", "138px");
        });
      });
    });

    context("value label", () => {
      it("renders with 14px and width 70%", () => {
        cy.mount(<ProductKeyNote />);

        Array.from({ length: 5 }).map((_, index) => {
          cy.findAllByLabelText("keynote-point-value")
            .eq(index)
            .should("have.css", "font-size", "14px")
            .and("have.css", "width", "322px");
        });
      });
    });
  });
});
