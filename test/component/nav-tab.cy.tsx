import {
  ReviewTabContent,
  WriteTabContent,
} from "./../../components/nav-tab.stories";
import { NavTab, NavTabContentProps } from "./../../components/nav-tab";
import { css } from "styled-components";
import {
  RiAddBoxLine,
  RiAtLine,
  RiCharacterRecognitionLine,
  RiSearchLine,
} from "@remixicon/react";

describe("NavTab", () => {
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
                title: "Add",
                icon: RiAddBoxLine,
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
      cy.findByText("Chart").click();
      cy.findByText("This is review content").should("not.exist");
      cy.findByText("This is chart content").should("exist");
      cy.get("@consoleLog").should("have.been.calledWith", "chart was clicked");
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
      cy.findByLabelText("list-action-button").should("be.visible").click();
      cy.get("@consoleLog").should("have.been.calledWith", "Discover clicked");
    });

    context("when multiple actions", () => {
      it("renders with tip menu", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<NavTab tabs={TABS_ITEMS} activeTab={"2"} />);
        cy.findByText("Review").realHover();
        cy.findByLabelText("list-action-button").should("be.visible").click();
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
            boxStyle={css`
              padding: 20px;
              color: red;
            `}
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
            boxStyle={css`
              padding: 20px;
              background-color: white;
            `}
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
        icon: RiSearchLine,
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
        icon: RiSearchLine,
      },
      {
        caption: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ],
  },
];
