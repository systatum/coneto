import {
  ReviewTabContent,
  WriteTabContent,
} from "./../../components/nav-tab.stories";
import { NavTab, NavTabProps, NavTabTab } from "./../../components/nav-tab";
import { Button } from "./../../components/button";
import { css } from "styled-components";
import {
  RiAddBoxLine,
  RiAtLine,
  RiCharacterRecognitionLine,
  RiExchangeDollarLine,
  RiHome3Line,
  RiLogoutBoxFill,
  RiMenuLine,
  RiPieChartLine,
  RiProfileFill,
  RiSearchLine,
  RiSettings5Line,
  RiTranslate2,
  RiUserLine,
  RiWallet2Line,
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

  context("mobile", () => {
    function MobileNavTabProduct(props: NavTabProps) {
      const [activeTab, setActiveTab] = useState("2");

      const TABS_ITEMS: NavTabTab[] = [
        {
          id: "1",
          title: "Home",
          content: "This is home content",
          icon: {
            image: RiHome3Line,
            notificationBadge: { content: "99+", fontSize: "8px" },
          },
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
          title: "Account",
          icon: {
            image: RiWallet2Line,
          },
          content: "This is account content",
          onClick: () => {
            console.log("test tab 2");
          },
        },
        {
          id: "3",
          title: "Transfer",
          content: "This is transfer content",
          icon: {
            image: RiExchangeDollarLine,
          },
          onClick: () => {
            console.log("test tab 1");
          },
          withCircle: true,
        },
        {
          id: "4",
          title: "Household",
          content: "This is household content",
          icon: {
            image: RiPieChartLine,
            notificationBadge: { content: "99+", fontSize: "8px" },
          },
          onClick: () => {
            console.log("test tab 1");
          },
        },
        {
          id: "5",
          title: "Menu",
          content: "This is setting content",
          icon: {
            image: RiMenuLine,
          },
          onClick: () => {
            console.log("test tab 1");
          },
          subItems: [
            {
              id: "5-1",
              icon: { image: RiUserLine },
              caption: "Privacy & security settings",
              content: "This is privacy and security settings content",
            },
            {
              id: "5-2",
              icon: { image: RiTranslate2 },
              caption: "Language",
              content: "This is language content",
            },
            {
              id: "5-3",
              icon: { image: RiLogoutBoxFill },
              caption: "Logout",
              onClick: () => {
                console.log("logout");
              },
            },
          ],
        },
      ];

      return (
        <NavTab
          mobile
          tabs={TABS_ITEMS}
          activeTab={activeTab}
          onChange={(activeTab) => setActiveTab(activeTab)}
          {...props}
        />
      );
    }

    it("render in the bottom of content", () => {
      cy.mount(<MobileNavTabProduct />);

      cy.findByLabelText("nav-tab-bar")
        .should("have.css", "position", "fixed")
        .and("have.css", "bottom", "0px");
    });

    context("when given actions", () => {
      context("when given in parent level", () => {
        it("should render as a Tab", () => {
          cy.mount(
            <MobileNavTabProduct
              actions={[
                {
                  icon: { image: RiSettings5Line },
                  onClick: () => {},
                  caption: "Test",
                },
              ]}
            />
          );

          cy.findAllByLabelText("nav-tab-tab").should("have.length", 6);
        });
      });

      context("when given inside of the tab", () => {
        it("should not render the action item", () => {
          cy.mount(
            <MobileNavTabProduct
              tabs={[
                {
                  id: "1",
                  title: "Home",
                  content: "This is home content",
                  icon: {
                    image: RiHome3Line,
                    notificationBadge: { content: "99+", fontSize: "8px" },
                  },
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
              ]}
            />
          );

          cy.findByText("Home").realHover();
          cy.findByLabelText("action-button").should("not.exist");
        });
      });
    });

    context("when given subItems", () => {
      context("when when clicking", () => {
        it("renders all submenu", () => {
          cy.mount(<MobileNavTabProduct />);

          const TEXTS = ["Logout", "Language", "Privacy & security settings"];

          TEXTS.map((text) => {
            cy.findByText(text).should("not.exist");
          });

          cy.findAllByLabelText("nav-tab-tab").eq(4).trigger("pointerdown");

          cy.wait(500);

          cy.findAllByLabelText("nav-tab-tab").eq(4).trigger("pointerup");

          TEXTS.map((text) => {
            cy.findByText(text).should("exist");
          });
        });

        it("renders in the bottom of screen", () => {
          cy.mount(<MobileNavTabProduct />);

          cy.findAllByLabelText("nav-tab-tab").eq(4).trigger("pointerdown");

          cy.wait(500);

          cy.findAllByLabelText("nav-tab-tab").eq(4).trigger("pointerup");
          cy.findByLabelText("tooltip-drawer").should(
            "have.css",
            "bottom",
            "-4px"
          );
        });
      });
    });

    context("when given withCircle", () => {
      it("should renders a bit striking upwards from bottom", () => {
        cy.mount(<MobileNavTabProduct />);

        cy.findAllByLabelText("nav-tab-circle").should(
          "have.css",
          "bottom",
          "4px"
        );
      });

      it("should with circle in a Tab", () => {
        cy.mount(<MobileNavTabProduct />);

        cy.findAllByLabelText("nav-tab-circle").should("have.length", 1);
      });

      it("should renders the circle with darker color (rgb(60, 73, 95))", () => {
        cy.mount(<MobileNavTabProduct />);

        cy.findAllByLabelText("nav-tab-circle")
          .eq(0)
          .should("have.css", "background-color", "rgb(60, 73, 95)");
      });

      context("when selected the tab withCircle", () => {
        it("underline would be transparent", () => {
          cy.mount(<MobileNavTabProduct />);

          cy.findByLabelText("nav-tab-underscore").should(
            "have.css",
            "opacity",
            "1"
          );

          cy.findAllByLabelText("nav-tab-circle").eq(0).click();

          cy.findByLabelText("nav-tab-underscore").should(
            "have.css",
            "opacity",
            "0"
          );
        });

        it("should renders the circle with the lighter color (rgb(59, 130, 246))", () => {
          cy.mount(<MobileNavTabProduct />);

          cy.findAllByLabelText("nav-tab-circle")
            .eq(0)
            .click()
            .should("have.css", "background-color", "rgb(59, 130, 246)");
        });
      });
    });
  });

  context("tabs", () => {
    context("when given hidden", () => {
      it("renders without hidden tab", () => {
        cy.mount(<NavTab tabs={TABS_ITEMS} activeTab={"2"} />);
        cy.findAllByLabelText("nav-tab-tab").should("have.length", 2);
        cy.findByText("Write").should("exist");
        cy.findByText("Review").should("exist");
        cy.findByText("Empty").should("not.exist");
      });
    });
  });

  context("hidden tab", () => {
    function NavTabWithHidden({ hidden }: { hidden?: boolean }) {
      const [activeTab, setActiveTab] = useState("2");

      return (
        <NavTab
          size="sm"
          tabs={[
            {
              id: "1",
              title: "Write",
              content: "Write tab content",
            },
            {
              id: "2",
              title: "Review",
              content: "Review tab content",
              ...(hidden ? { hidden: true } : {}),
            },
          ]}
          actions={[
            {
              icon: { image: RiSettings5Line },
              onClick: () => {
                setActiveTab("2");
              },
              active: activeTab === "2",
            },
          ]}
          onChange={(activeTab) => setActiveTab(activeTab)}
          activeTab={activeTab}
        />
      );
    }
    context("when given true", () => {
      it("should not render the hidden tab in the navigation", () => {
        cy.mount(<NavTabWithHidden hidden={true} />);

        cy.findAllByLabelText("nav-tab-tab").should("have.length", 1);
      });

      context("when given active tab", () => {
        it("renders the action button with a bottom border", () => {
          cy.mount(<NavTabWithHidden hidden={true} />);

          cy.findAllByLabelText("action-button")
            .eq(0)
            .should("have.css", "border-bottom", "2px solid rgb(59, 130, 246)");
        });

        it("should still render the hidden tab content", () => {
          cy.mount(<NavTabWithHidden hidden={true} />);

          cy.findByText("Review tab content").should("exist");
        });
      });

      context("when pressing action with setActive function", () => {
        it("should render the hidden content", () => {
          cy.mount(<NavTabWithHidden hidden={true} />);

          // Initially active: Review (hidden)
          cy.findByText("Review tab content").should("exist");
          cy.findByText("Write tab content").should("not.exist");

          // Click visible tab (Write)
          cy.findAllByLabelText("nav-tab-tab").eq(0).click();
          cy.findByText("Review tab content").should("not.exist");
          cy.findByText("Write tab content").should("exist");

          // Trigger action to activate hidden tab again
          cy.findAllByLabelText("action-button").eq(0).click();
          cy.findByText("Review tab content").should("exist");
          cy.findByText("Write tab content").should("not.exist");
        });
      });
    });

    context("when given false", () => {
      it("should render all tabs normally", () => {
        cy.mount(<NavTabWithHidden hidden={false} />);

        cy.findAllByLabelText("nav-tab-tab").should("have.length", 2);
      });
    });

    context("when not given", () => {
      it("should render all tabs normally", () => {
        cy.mount(<NavTabWithHidden />);

        cy.findAllByLabelText("nav-tab-tab").should("have.length", 2);
      });
    });
  });

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

        cy.findAllByLabelText("nav-tab-tab")
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

        cy.findAllByLabelText("nav-tab-tab")
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

        cy.findAllByLabelText("nav-tab-tab")
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

        cy.findAllByLabelText("nav-tab-tab")
          .eq(1)
          .should("have.css", "background-color", "rgba(243, 244, 246, 0.5)");

        cy.findAllByLabelText("nav-tab-underscore")
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

        cy.findAllByLabelText("nav-tab-tab")
          .eq(1)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");

        cy.findAllByLabelText("nav-tab-underscore")
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

        cy.findAllByLabelText("nav-tab-tab")
          .eq(1)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");

        cy.findAllByLabelText("nav-tab-underscore")
          .eq(0)
          .should("have.css", "background-color", "rgb(59, 130, 246)")
          .and("have.css", "opacity", "0");
      });
    });
  });

  context("actions", () => {
    function NavTabWithActions() {
      return (
        <NavTab
          actions={[
            {
              hidden: true,
              caption: "Settings",
              icon: { image: RiSettings5Line },
              onClick: () => {
                console.log("Settings button was clicked");
              },
            },
            {
              caption: "Add",
              icon: { image: RiAddBoxLine },
              onClick: () => {
                console.log("Add button was clicked");
              },
            },
          ]}
          tabs={TABS_ITEMS}
          activeTab={"2"}
        />
      );
    }
    it("renders with gap 6px (by default)", () => {
      cy.mount(<NavTabWithActions />);

      cy.findByLabelText("nav-tab-actions-wrapper").should(
        "have.css",
        "gap",
        "6px"
      );
    });

    context("when clicking", () => {
      it("renders the console", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<NavTabWithActions />);
        cy.findByText("Add").click();
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "Add button was clicked"
        );
      });
    });

    context("when given with hidden", () => {
      it("should render without hidden actions", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<NavTabWithActions />);
        cy.findByText("Settings").should("not.exist");
        cy.findByText("Add").should("exist");
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
            icon: { image: RiCharacterRecognitionLine },
            caption: "Chart",
            content: "This is chart content",
            onClick: () => console.log("chart was clicked"),
          },
          {
            id: "2-2",
            hidden: true,
            icon: { image: RiProfileFill },
            caption: "Identity",
            content: "This is identity content",
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

    context("when given with hidden subitem", () => {
      it("renders without hidden subitem", () => {
        cy.mount(<NavTab tabs={tabsWithSubItems} activeTab={"2"} />);
        cy.findByText("This is review content").should("exist");
        cy.findByText("Review").realHover();
        cy.findByText("Chart").should("exist");
        cy.findByText("Identity").should("not.exist");
      });
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
              icon: { image: RiCharacterRecognitionLine },
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
        cy.findByLabelText("nav-tab-underscore").should(
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
              tabStyle: css`
                padding: 20px;
                color: red;
              `,
            }}
          />
        );
        cy.wait(200);
        cy.findAllByLabelText("nav-tab-tab")
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
              tabStyle: css`
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

const TABS_ITEMS: NavTabTab[] = [
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
  {
    hidden: true,
    id: "3",
    title: "Empty",
    content: "Empty",
    onClick: () => {},
  },
];
