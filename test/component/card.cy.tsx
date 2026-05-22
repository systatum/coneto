import { RiDeleteBack2Fill, RiEdit2Line } from "@remixicon/react";
import { Card, CardProps } from "./../../components/card";
import { Button } from "./../../components/button";
import { DormantText } from "./../../components/dormant-text";
import { Textbox } from "./../../components/textbox";
import { css } from "styled-components";
import { useState } from "react";

describe("Card", () => {
  function ProductCard(props: Omit<CardProps, "children">) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <Card
        title="Systatum Food Services"
        subtitle="Fueling innovation with every bite."
        headerActions={[
          {
            caption: "Edit fields",
            onClick: () => {
              console.log(`Edit button was clicked`);
            },
          },
        ]}
        onMouseEnter={() => console.log("now is hovering card")}
        onMouseLeave={() => console.log("now is leaving card")}
        onClick={() => console.log("now is clicking card")}
        {...props}
        toggleable={props?.toggleable ?? false}
        onToggleChange={(isOpen) => setIsOpen(isOpen)}
        open={isOpen}
      >
        Test
      </Card>
    );
  }

  context("styles", () => {
    context("containerStyle", () => {
      context("when given width 700px", () => {
        it("renders card container with width 700px", () => {
          cy.mount(
            <ProductCard
              styles={{
                containerStyle: css`
                  width: 700px;
                `,
              }}
            />
          );

          cy.findByLabelText("card-container").should(
            "have.css",
            "width",
            "700px"
          );
        });
      });
    });

    context("headerStyle", () => {
      context("when given gap 20px", () => {
        it("renders the header container with gap 20px", () => {
          cy.mount(
            <ProductCard
              title="Product Title"
              toggleable
              styles={{
                headerStyle: css`
                  gap: 20px;
                `,
              }}
            />
          );

          cy.findByLabelText("title-container").should(
            "have.css",
            "gap",
            "20px"
          );
        });
      });
    });

    context("headerTitleSectionStyle", () => {
      context("when given gap 12px", () => {
        it("renders the title text container with gap 12px", () => {
          cy.mount(
            <ProductCard
              styles={{
                headerTitleSectionStyle: css`
                  gap: 12px;
                `,
              }}
            />
          );

          cy.findByLabelText("title-text-container").should(
            "have.css",
            "gap",
            "12px"
          );
        });
      });
    });

    context("actionContainerStyle", () => {
      context("when given padding 10px", () => {
        it("renders the right section with padding 10px", () => {
          cy.mount(
            <ProductCard
              styles={{
                actionContainerStyle: css`
                  padding: 10px;
                `,
              }}
            />
          );

          cy.findByLabelText("title-right-section").should(
            "have.css",
            "padding",
            "10px"
          );
        });
      });
    });

    context("contentStyle", () => {
      context("when given background red", () => {
        it("renders content with custom background", () => {
          cy.mount(
            <ProductCard
              title="Product Title"
              styles={{
                contentStyle: css`
                  background: red;
                `,
              }}
            />
          );

          cy.findByLabelText("card-content").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("footerStyle", () => {
      context("when given justify-content center", () => {
        it("renders footer with centered content", () => {
          cy.mount(
            <ProductCard
              title="Product Title"
              footerContent="Footer"
              styles={{
                footerStyle: css`
                  justify-content: center;
                `,
              }}
            />
          );

          cy.findByLabelText("card-footer").should(
            "have.css",
            "justify-content",
            "center"
          );
        });
      });
    });

    context("titleStyle", () => {
      context("when given font-size 30px", () => {
        it("renders title with font-size 30px", () => {
          cy.mount(
            <ProductCard
              title="Product Title"
              styles={{
                titleStyle: css`
                  font-size: 30px;
                `,
              }}
            />
          );

          cy.findByLabelText("title-title").should(
            "have.css",
            "font-size",
            "30px"
          );
        });
      });
    });

    context("subtitleStyle", () => {
      context("when given opacity 0.5", () => {
        it("renders subtitle with opacity 0.5", () => {
          cy.mount(
            <ProductCard
              title="Product Title"
              subtitle="Subtitle"
              styles={{
                subtitleStyle: css`
                  opacity: 0.5;
                `,
              }}
            />
          );

          cy.findByLabelText("title-subtitle").should(
            "have.css",
            "opacity",
            "0.5"
          );
        });
      });
    });
  });

  context("toggleable", () => {
    context("when given", () => {
      it("renders the card using toggle", () => {
        cy.mount(<ProductCard toggleable />);
        cy.findByLabelText("toggle-wrapper").should("exist");
      });

      it("renders with height by 24px (by default)", () => {
        cy.mount(<ProductCard toggleable />);
        cy.findByLabelText("toggle-wrapper")
          .should("exist")
          .should("have.css", "height", "24px");
      });

      context("when clicking", () => {
        it("should collapsing the card content", () => {
          cy.mount(<ProductCard toggleable />);
          cy.findByLabelText("card-content").should("exist");
          cy.findByLabelText("toggle-wrapper").should("exist").click();
          cy.findByLabelText("card-content").should("not.exist");
        });
      });
    });

    context("when given footer", () => {
      context("when clicking", () => {
        it("should collapsing the card content and the footer", () => {
          cy.mount(
            <ProductCard toggleable footerContent="Card footer content" />
          );
          cy.findByLabelText("card-content").should("exist");
          cy.findByLabelText("card-footer").should("exist");
          cy.findByLabelText("toggle-wrapper").should("exist").click();
          cy.findByLabelText("card-content").should("not.exist");
          cy.findByLabelText("card-footer").should("not.exist");
        });
      });
    });
  });

  context("onMouseEnter", () => {
    context("when hovering", () => {
      it("should give callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<ProductCard />);
        cy.findByLabelText("card-container").trigger("mouseover");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is hovering card"
        );
      });
    });
  });

  context("onMouseLeave", () => {
    context("when hover & leave", () => {
      it("should give callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<ProductCard />);
        cy.findByLabelText("card-container")
          .trigger("mouseover")
          .trigger("mouseout");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is hovering card"
        );
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is leaving card"
        );
      });
    });
  });

  context("onClick", () => {
    context("when clicking", () => {
      it("should give callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<ProductCard />);
        cy.findByLabelText("card-container").click();

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is clicking card"
        );
      });
    });
  });

  context("with header", () => {
    const value = {
      pretitle: "Organization Structure",
      title: "Department",
      subtitle: "Departments and their leaders",
    };

    const renderDormantTextField = (
      name: "title" | "subtitle" | "pretitle",
      sizeText?: number
    ) => {
      return (
        <DormantText
          acceptChangeOn={"enter"}
          content={value?.[name]}
          cancelable
          styles={{
            dormantedStyle: css`
              padding: 0px;
            `,
          }}
          dormantedFontSize={sizeText ?? 16}
        >
          <Textbox value={value?.[name]} />
        </DormantText>
      );
    };

    context("with title", () => {
      it("can be given ReactNode to render", () => {
        cy.mount(
          <ProductCard
            title={renderDormantTextField("title")}
            styles={{
              titleStyle: css`
                width: 100%;
              `,
              headerTitleSectionStyle: css`
                width: 100%;
              `,
              containerStyle: css`
                padding-left: 0px;
                padding-right: 0px;
                min-width: 1000px;
                padding-bottom: 0px;
              `,
              headerStyle: css`
                padding-left: 15px;
                padding-right: 15px;
                border-bottom: 1px solid #d1d5db;
              `,
            }}
          />
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

    context("with pretitle", () => {
      it("can be given ReactNode to render", () => {
        cy.mount(
          <Card
            pretitle={renderDormantTextField("pretitle")}
            styles={{
              pretitleStyle: css`
                width: 100%;
              `,
              textContainerStyle: css`
                width: 100%;
              `,
              containerStyle: css`
                padding-left: 0px;
                padding-right: 0px;
                min-width: 1000px;
                padding-bottom: 0px;
              `,
              headerStyle: css`
                padding-left: 15px;
                padding-right: 15px;
              `,
            }}
          >
            test
          </Card>
        );

        cy.get("input[type='text']").should("not.exist");
        cy.findByText("Organization Structure").click();
        cy.get("input[type='text']")
          .should("exist")
          .and("have.value", "Organization Structure");
      });

      it("should render the text", () => {
        cy.mount(
          <Card pretitle="Food & Dining" title="Systatum Food Services">
            Test
          </Card>
        );
        cy.findByText("Food & Dining").should("exist");
      });
    });

    context("with subtitle", () => {
      it("can be given ReactNode to render", () => {
        cy.mount(
          <Card
            subtitle={renderDormantTextField("subtitle", 14)}
            styles={{
              titleStyle: css`
                width: 100%;
              `,
              headerTitleSectionStyle: css`
                width: 100%;
              `,
              containerStyle: css`
                padding-left: 0px;
                padding-right: 0px;
                min-width: 1000px;
                padding-bottom: 0px;
              `,
              headerStyle: css`
                padding-left: 15px;
                padding-right: 15px;
                border-bottom: 1px solid #d1d5db;
              `,
            }}
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
  });

  context("headerActions", () => {
    it("should render the action button", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.mount(<ProductCard />);

      cy.findByText("Edit fields").should("exist").click();

      cy.get("@consoleLog").should(
        "have.been.calledWith",
        "Edit button was clicked"
      );

      cy.findByLabelText("action-button-icon").should("not.exist");
    });

    context("when given hidden action", () => {
      it("should render without hidden action", () => {
        cy.mount(
          <ProductCard
            headerActions={[
              {
                caption: "Edit fields",
                icon: { image: RiEdit2Line },
                onClick: () => {
                  console.log(`Edit button was clicked`);
                },
              },
              {
                hidden: true,
                caption: "Delete fields",
                icon: { image: RiDeleteBack2Fill },
                onClick: () => {
                  console.log(`Delete button was clicked`);
                },
              },
            ]}
          />
        );

        cy.findByText("Edit fields").should("exist");
        cy.findByText("Delete fields").should("not.exist");
      });
    });

    context("when given with icon", () => {
      it("should render the action button with button", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(
          <ProductCard
            headerActions={[
              {
                caption: "Edit fields",
                icon: { image: RiEdit2Line },
                onClick: () => {
                  console.log(`Edit button was clicked`);
                },
              },
            ]}
          />
        );

        cy.findByText("Edit fields").should("exist").click();

        cy.findByLabelText("action-button-icon").should("exist");
      });
    });
  });

  context("with footer", () => {
    it("should render the footer content", () => {
      cy.mount(
        <ProductCard
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
        />
      );

      cy.findByText("Cancel").should("exist");
      cy.findByText("Import").should("exist");
    });
  });
});
