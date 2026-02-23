import {
  ReviewTabContent,
  WriteTabContent,
} from "./../../components/nav-tab.stories";
import { NavTab, NavTabContentProps } from "./../../components/nav-tab";
import { Button } from "./../../components/button";
import { css } from "styled-components";
import {
  RiAddBoxLine,
  RiAtLine,
  RiCharacterRecognitionLine,
  RiSearchLine,
} from "@remixicon/react";
import { useState } from "react";

describe("NavTab", () => {
  const ACTION_BUTTON = [
    {
      caption: "Add",
      icon: { image: RiAddBoxLine },
      onClick: () => {
        console.log(`Add button was clicked`);
      },
    },
  ];

  context("when triggering externally (without tab)", () => {
    it("should switch to the corresponding tab", () => {
      function NavTabWithState() {
        const [activeTab, setActiveTab] = useState("1");

        return (
          <NavTab
            actions={ACTION_BUTTON}
            size="sm"
            tabs={[
              {
                id: "1",
                title: "Write",
                content: (
                  <Button onClick={() => setActiveTab("2")}>
                    Move to tab Review
                  </Button>
                ),
              },
              {
                id: "2",
                title: "Review",
                content: (
                  <Button onClick={() => setActiveTab("1")}>
                    Move to tab Write
                  </Button>
                ),
              },
            ]}
            onChange={(activeTab) => setActiveTab(activeTab)}
            activeTab={activeTab}
          />
        );
      }

      cy.mount(<NavTabWithState />);

      cy.findByText("Move to tab Write").should("not.exist");
      cy.findByText("Move to tab Review").click();

      cy.findByText("Move to tab Review").should("not.exist");
      cy.findByText("Move to tab Write").click();
    });
  });

  context("size", () => {
    context("when given sm", () => {
      it("renders tab with 35px and action button with 27px", () => {
        cy.mount(
          <NavTab
            actions={ACTION_BUTTON}
            size="sm"
            tabs={TABS_ITEMS}
            activeTab={"2"}
          />
        );

        cy.findAllByLabelText("nav-tab-item")
          .eq(0)
          .should("have.css", "height", "35px");
        cy.findAllByLabelText("action-button")
          .eq(2)
          .should("have.css", "height", "27px");
      });
    });

    context("when given md", () => {
      it("renders tab with 45px and action button with 32px", () => {
        cy.mount(
          <NavTab
            actions={ACTION_BUTTON}
            size="md"
            tabs={TABS_ITEMS}
            activeTab={"2"}
          />
        );

        cy.findAllByLabelText("nav-tab-item")
          .eq(0)
          .should("have.css", "height", "45px");
        cy.findAllByLabelText("action-button")
          .eq(2)
          .should("have.css", "height", "32px");
      });
    });

    context("when not given", () => {
      it("renders tab with 45px and action button with 32px", () => {
        cy.mount(
          <NavTab actions={ACTION_BUTTON} tabs={TABS_ITEMS} activeTab={"2"} />
        );

        cy.findAllByLabelText("nav-tab-item")
          .eq(0)
          .should("have.css", "height", "45px");
        cy.findAllByLabelText("action-button")
          .eq(2)
          .should("have.css", "height", "32px");
      });
    });
  });

  context("activeTab", () => {
    context("when given", () => {
      it("renders with content active tab", () => {
        cy.mount(<NavTab tabs={TABS_ITEMS} activeTab={"2"} />);
        cy.findByText(
          "This tab is meant to review the content that has been submitted. It includes multiple paragraphs to simulate a longer layout."
        ).should("be.visible");

        cy.findAllByLabelText("nav-tab-item")
          .eq(1)
          .should("have.css", "background-color", "rgba(243, 244, 246, 0.5)");

        cy.findAllByLabelText("nav-tab-list")
          .eq(0)
          .should("have.css", "background-color", "rgb(59, 130, 246)")
          .and("have.css", "opacity", "1");
      });
    });

    context("when not given", () => {
      it("renders without content", () => {
        cy.mount(<NavTab tabs={TABS_ITEMS} activeTab={undefined} />);

        ["Review Tab", "Write Tab"].map((text) =>
          cy.findByText(text).should("not.exist")
        );

        cy.findAllByLabelText("nav-tab-item")
          .eq(1)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");

        cy.findAllByLabelText("nav-tab-list")
          .eq(0)
          .should("have.css", "background-color", "rgb(59, 130, 246)")
          .and("have.css", "opacity", "0");
      });
    });

    context("when given null", () => {
      it("renders without content", () => {
        cy.mount(<NavTab tabs={TABS_ITEMS} activeTab={null} />);

        ["Review Tab", "Write Tab"].map((text) =>
          cy.findByText(text).should("not.exist")
        );

        cy.findAllByLabelText("nav-tab-item")
          .eq(1)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");

        cy.findAllByLabelText("nav-tab-list")
          .eq(0)
          .should("have.css", "background-color", "rgb(59, 130, 246)")
          .and("have.css", "opacity", "0");
      });
    });
  });

  context("actions", () => {
    context("when clicking", () => {
      it("renders the console", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(
          <NavTab
            actions={[
              {
                caption: "Add",
                icon: { image: RiAddBoxLine },
                onClick: () => {
                  console.log(`Add button was clicked`);
                },
              },
            ]}
            tabs={TABS_ITEMS}
            activeTab={"2"}
          />
        );
        cy.findByText("Add").click();
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "Add button was clicked"
        );
      });
    });
  });

  context("with subItems", () => {
    const tabsWithSubItems = [
      {
        id: "2",
        title: "Review",
        content: "This is review content",
        subItems: [
          {
            id: "2-1",
            icon: RiCharacterRecognitionLine,
            caption: "Chart",
            content: "This is chart content",
            onClick: () => console.log("chart was clicked"),
          },
        ],
      },
    ];

    it("renders with content subitem", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.mount(<NavTab tabs={tabsWithSubItems} activeTab={"2"} />);
      cy.findByText("This is review content").should("exist");
      cy.findByText("Review").realHover();
      cy.findByText("Chart").click({ force: true });
      cy.findByText("This is review content").should("not.exist");
      cy.findByText("This is chart content").should("exist");
      cy.get("@consoleLog").should("have.been.calledWith", "chart was clicked");
    });

    it("renders with top -4px", () => {
      cy.mount(<NavTab tabs={tabsWithSubItems} activeTab={"2"} />);
      cy.findByText("This is review content").should("exist");
      cy.findByText("Review").realHover();
      cy.wait(100);
      cy.findByLabelText("tooltip-drawer").should("have.css", "top", "-4px");
    });

    context("when empty content", () => {
      const tabsWithSubItemsEmptyContent = [
        {
          id: "2",
          title: "Review",
          content: "This is review content",
          subItems: [
            {
              id: "2-1",
              icon: RiCharacterRecognitionLine,
              caption: "Chart",
              onClick: () => console.log("chart was clicked"),
            },
          ],
        },
      ];
      it("renders only the console", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(
          <NavTab tabs={tabsWithSubItemsEmptyContent} activeTab={"2"} />
        );
        cy.findByText("This is review content").should("exist");
        cy.findByText("Review").realHover();
        cy.findByText("Chart").click();
        cy.findByText("This is review content").should("exist");
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "chart was clicked"
        );
      });
    });
  });

  context("actions item", () => {
    it("renders with one button", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.mount(<NavTab tabs={TABS_ITEMS} activeTab={"2"} />);
      cy.findByText("Write").realHover();
      cy.findAllByLabelText("action-button").eq(0).should("be.visible").click();
      cy.get("@consoleLog").should("have.been.calledWith", "Discover clicked");
    });

    context("when multiple actions", () => {
      it("renders with tip menu", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<NavTab tabs={TABS_ITEMS} activeTab={"2"} />);
        cy.findByText("Review").realHover();
        cy.findAllByLabelText("action-button")
          .eq(1)
          .should("be.visible")
          .click();
        cy.findByText("Mention").should("be.visible").click();

        cy.get("@consoleLog").should("have.been.calledWith", "Mention clicked");
      });
    });
  });

  context("active color", () => {
    context("when given", () => {
      it("renders with color", () => {
        cy.mount(
          <NavTab tabs={TABS_ITEMS} activeTab={"2"} activeColor="red" />
        );
        cy.findByLabelText("nav-tab-list").should(
          "have.css",
          "background-color",
          "rgb(255, 0, 0)"
        );
      });
    });
  });

  context("with box style", () => {
    context("when given", () => {
      it("renders with expected", () => {
        cy.mount(
          <NavTab
            tabs={TABS_ITEMS}
            activeTab={"2"}
            styles={{
              boxStyle: css`
                padding: 20px;
                color: red;
              `,
            }}
          />
        );
        cy.wait(200);
        cy.findAllByLabelText("nav-tab-item")
          .eq(0)
          .should("have.css", "padding", "20px")
          .and("have.css", "color", "rgb(255, 0, 0)");
      });
    });
  });

  context("with children", () => {
    context("when given", () => {
      it("renders with expected", () => {
        cy.mount(
          <NavTab
            tabs={TABS_ITEMS}
            activeTab={"2"}
            styles={{
              boxStyle: css`
                padding: 20px;
                background-color: white;
              `,
            }}
          >
            <div
              style={{
                padding: "8px",
              }}
            >
              This is description from children
            </div>
          </NavTab>
        );
        cy.findByText("This is description from children").should("be.visible");
      });
    });
  });
});

const TABS_ITEMS: NavTabContentProps[] = [
  {
    id: "1",
    title: "Write",
    content: <WriteTabContent />,
    onClick: () => {
      console.log("test tab 1");
    },
    actions: [
      {
        caption: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: { image: RiSearchLine },
      },
    ],
  },
  {
    id: "2",
    title: "Review",
    content: <ReviewTabContent />,
    onClick: () => {
      console.log("test tab 2");
    },
    actions: [
      {
        caption: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: { image: RiSearchLine },
      },
      {
        caption: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: { image: RiAtLine },
      },
    ],
  },
];
