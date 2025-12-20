import { RiEdit2Line } from "@remixicon/react";
import { Card } from "./../../components/card";
import { Button } from "./../../components/button";
import { DormantText } from "./../../components/dormant-text";
import { Textbox } from "./../../components/textbox";
import { css } from "styled-components";

describe("Card", () => {
  context("with header", () => {
    const value = {
      title: "Department",
      subtitle: "Departments and their leaders",
    };

    const renderDormantTextField = (
      name: "title" | "subtitle",
      sizeText?: number
    ) => {
      return (
        <DormantText
          acceptChangeOn={"enter"}
          content={value?.[name]}
          cancelable
          dormantedStyle={css`
            padding: 0px;
          `}
          dormantedFontSize={sizeText ?? 16}
        >
          <Textbox value={value?.[name]} />
        </DormantText>
      );
    };

    context("with title", () => {
      it("can be given ReactNode to render", () => {
        cy.mount(
          <Card
            title={renderDormantTextField("title")}
            titleStyle={css`
              width: 100%;
            `}
            textContainerStyle={css`
              width: 100%;
            `}
            containerStyle={css`
              padding-left: 0px;
              padding-right: 0px;
              min-width: 1000px;
              padding-bottom: 0px;
            `}
            headerStyle={css`
              padding-left: 15px;
              padding-right: 15px;
              border-bottom: 1px solid #d1d5db;
            `}
          >
            test
          </Card>
        );

        cy.get("input[type='text']").should("not.exist");
        cy.findByText("Department").click();
        cy.get("input[type='text']")
          .should("exist")
          .and("have.value", "Department");
      });

      it("should render the text", () => {
        cy.mount(<Card title="Systatum Food Services">Test`</Card>);
        cy.findByText("Systatum Food Services").should("exist");
      });
    });

    context("with subtitle", () => {
      it("can be given ReactNode to render", () => {
        cy.mount(
          <Card
            subtitle={renderDormantTextField("subtitle", 14)}
            titleStyle={css`
              width: 100%;
            `}
            textContainerStyle={css`
              width: 100%;
            `}
            containerStyle={css`
              padding-left: 0px;
              padding-right: 0px;
              min-width: 1000px;
              padding-bottom: 0px;
            `}
            headerStyle={css`
              padding-left: 15px;
              padding-right: 15px;
              border-bottom: 1px solid #d1d5db;
            `}
          >
            test
          </Card>
        );

        cy.get("input[type='text']").should("not.exist");
        cy.findByText("Departments and their leaders").click();
        cy.get("input[type='text']")
          .should("exist")
          .and("have.value", "Departments and their leaders");
      });

      it("should render the text", () => {
        cy.mount(
          <Card
            title="Systatum Food Services"
            subtitle="Fueling innovation with every bite."
          >
            Test`
          </Card>
        );
        cy.findByText("Fueling innovation with every bite.").should("exist");
      });
    });

    context("when having action buttons", () => {
      it("should render the action button", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(
          <Card
            title="Systatum Food Services"
            subtitle="Fueling innovation with every bite."
            headerActions={[
              {
                caption: "Edit fields",
                icon: RiEdit2Line,
                onClick: () => {
                  console.log(`Edit button was clicked`);
                },
              },
            ]}
          >
            Test
          </Card>
        );

        cy.findByText("Edit fields").should("exist").click();

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "Edit button was clicked"
        );
      });
    });
  });

  context("with footer", () => {
    it("should render the footer content", () => {
      cy.mount(
        <Card
          title="Systatum Food Services"
          subtitle="Fueling innovation with every bite."
          headerActions={[
            {
              caption: "Edit fields",
              icon: RiEdit2Line,
              onClick: () => {
                console.log(`Edit button was clicked`);
              },
            },
          ]}
          footerContent={
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "4px",
              }}
            >
              <Button>Cancel</Button>
              <Button variant="primary">Import</Button>
            </div>
          }
        >
          Test
        </Card>
      );

      cy.findByText("Cancel").should("exist");
      cy.findByText("Import").should("exist");
    });
  });
});
