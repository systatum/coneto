import { RiEdit2Line } from "@remixicon/react";
import { Card } from "./../../components/card";
import { Button } from "./../../components/button";

describe("Card", () => {
  context("Header", () => {
    context("title", () => {
      context("when given", () => {
        it("should render the text", () => {
          cy.mount(<Card title="Systatum Food Services">Test`</Card>);
          cy.findByText("Systatum Food Services").should("exist");
        });
      });
    });

    context("subtitle", () => {
      context("when given", () => {
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
    });

    context("headerActions", () => {
      context("when given", () => {
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
                  title: "Edit fields",
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
  });

  context("Footer", () => {
    context("when given", () => {
      it("should render the footer content", () => {
        cy.mount(
          <Card
            title="Systatum Food Services"
            subtitle="Fueling innovation with every bite."
            headerActions={[
              {
                title: "Edit fields",
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
});
