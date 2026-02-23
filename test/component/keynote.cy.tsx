import { css } from "styled-components";
import {
  Keynote,
  KeynoteProps,
  KeynoteStyles,
} from "./../../components/keynote";

describe("Keynote", () => {
  context("styles", () => {
    function KeynoteDefault({ styles }: { styles?: KeynoteStyles }) {
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
          <KeynoteDefault
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
            <KeynoteDefault
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
  });
});
