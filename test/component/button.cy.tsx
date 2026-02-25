import styled, { css } from "styled-components";
import { Button } from "./../../components/button";
import {
  RiSpam2Line,
  RiForbid2Line,
  RiShieldLine,
  RiCheckLine,
  RiInboxArchiveLine,
  RiDownloadLine,
  RiLink,
  RiShareLine,
  RiEditLine,
} from "@remixicon/react";
import { Calendar } from "./../../components/calendar";
import { TipMenuItemProps } from "./../../components/tip-menu";

describe("Button", () => {
  const TIP_MENU_ITEMS: TipMenuItemProps[] = [
    {
      caption: "Report Phishing",
      icon: { image: RiSpam2Line, color: "blue" },
      onClick: () => console.log("Phishing reported"),
    },
    {
      caption: "Report Junk",
      icon: { image: RiForbid2Line, color: "red" },
      onClick: () => console.log("Junk reported"),
    },
    {
      caption: "Block Sender",
      icon: { image: RiShieldLine, color: "orange" },
      isDangerous: true,
      onClick: () => console.log("Sender blocked"),
    },
    {
      caption: "Mark as Read",
      icon: { image: RiCheckLine, color: "green" },
      onClick: () => console.log("Marked as read"),
    },
    {
      caption: "Move to Spam",
      icon: { image: RiInboxArchiveLine, color: "purple" },
      onClick: () => console.log("Moved to spam"),
    },
    {
      caption: "Download Attachment",
      icon: { image: RiDownloadLine, color: "teal" },
      onClick: () => console.log("Downloading"),
    },
    {
      caption: "Copy Link",
      icon: { image: RiLink, color: "gray" },
      onClick: () => console.log("Link copied"),
    },
    {
      caption: "Share",
      icon: { image: RiShareLine, color: "indigo" },
      isDangerous: true,
      onClick: () => console.log("Shared"),
    },
    {
      caption: "Edit",
      icon: { image: RiEditLine, color: "yellow" },
      onClick: () => console.log("Edit mode"),
    },
  ];

  context("tipMenu", () => {
    context("when given content", () => {
      context("when using list", () => {
        context("when clicked", () => {
          it("renders the menu list", () => {
            cy.viewport(800, 700);
            cy.mount(
              <Button
                variant="default"
                styles={{
                  dropdownStyle: css`
                    min-width: 240px;
                  `,
                }}
                subMenu={({ list }) => list(TIP_MENU_ITEMS)}
              >
                Test
              </Button>
            );

            cy.findByLabelText("button-toggle").click();
            TIP_MENU_ITEMS.forEach((item) => {
              cy.contains(item.caption).should("exist");
            });
          });

          it("renders with border tip menu #e5e7eb", () => {
            cy.viewport(800, 700);
            cy.mount(
              <Button
                variant="default"
                styles={{
                  dropdownStyle: css`
                    min-width: 240px;
                  `,
                }}
                subMenu={({ list }) => list(TIP_MENU_ITEMS)}
              >
                Test
              </Button>
            );

            cy.findByLabelText("button-toggle").click();
            cy.findByLabelText("button-tip-menu-container").should(
              "have.css",
              "border-color",
              "rgb(229, 231, 235)"
            );
          });
        });

        context("when hovered", () => {
          it("renders background color based on the variant", () => {
            cy.mount(
              <Button
                variant="default"
                styles={{
                  dropdownStyle: css`
                    min-width: 240px;
                  `,
                }}
                subMenu={({ list }) => list(TIP_MENU_ITEMS)}
              >
                Test
              </Button>
            );
            cy.findByLabelText("button-toggle")
              .realHover()
              .wait(300)
              .should("have.css", "background-color", "rgb(226, 226, 226)");
          });
        });
      });

      context("when using show", () => {
        it("renders content inside the tip menu container", () => {
          cy.mount(
            <Button
              variant="default"
              styles={{
                dropdownStyle: css`
                  min-width: 240px;
                `,
              }}
              subMenu={({ show }) =>
                show(
                  <div
                    style={{
                      padding: "10px",
                    }}
                  >
                    This button using show function
                  </div>
                )
              }
            >
              Test
            </Button>
          );
          cy.findByLabelText("button-toggle")
            .click()
            .then(($button) => {
              cy.wrap($button).should(
                "have.css",
                "background-color",
                "rgb(207, 207, 207)"
              );
            });
          cy.findByText("This button using show function").should("exist");
          cy.findByLabelText("tooltip-drawer").should("exist");
        });
      });

      context("when using render", () => {
        it("renders custom content as designed", () => {
          cy.mount(
            <Button
              variant="default"
              styles={{
                dropdownStyle: css`
                  min-width: 240px;
                `,
              }}
              subMenu={({ render }) =>
                render(
                  <Button.TipMenuContainer
                    style={css`
                      padding: 10px;
                      display: flex;
                      flex-direction: column;
                      gap: 4px;
                    `}
                  >
                    <MenuContainer>
                      <MenuTitle>Information</MenuTitle>
                      <MenuDescription>
                        This button uses a render function to show custom
                        content inside TipMenu.
                      </MenuDescription>
                    </MenuContainer>
                    <Button variant="primary">Got it</Button>
                  </Button.TipMenuContainer>
                )
              }
            >
              Test
            </Button>
          );
          cy.findByLabelText("button-toggle")
            .click()
            .then(($button) => {
              cy.wrap($button).should(
                "have.css",
                "background-color",
                "rgb(207, 207, 207)"
              );
            });
          cy.findByText("Information").should("exist");
          cy.findByText(
            "This button uses a render function to show custom content inside TipMenu."
          ).should("exist");
          cy.findByText("Got it").should("exist");
          cy.findByLabelText("button-tip-menu-container").should("exist");
        });
      });
    });

    context("with showSubMenuOn", () => {
      context("when set to caret", () => {
        it("renders toggle button", () => {
          cy.mount(
            <Button
              variant="default"
              styles={{
                dropdownStyle: css`
                  min-width: 240px;
                `,
              }}
              subMenu={({ render }) =>
                render(
                  <Button.TipMenuContainer
                    style={css`
                      padding: 10px;
                      display: flex;
                      flex-direction: column;
                      gap: 4px;
                    `}
                  >
                    <MenuContainer>
                      <MenuTitle>Information</MenuTitle>
                      <MenuDescription>
                        This button uses a render function to show custom
                        content inside TipMenu.
                      </MenuDescription>
                    </MenuContainer>
                    <Button variant="primary">Got it</Button>
                  </Button.TipMenuContainer>
                )
              }
            >
              With Caret
            </Button>
          );
          cy.findAllByRole("button").eq(0).should("contain.text", "With Caret");
          cy.findByLabelText("button-toggle").should("exist").click();
          cy.findByText("Information").should("exist");
          cy.findByText(
            "This button uses a render function to show custom content inside TipMenu."
          ).should("exist");
          cy.findByText("Got it").should("exist");
          cy.findByLabelText("button-tip-menu-container").should("exist");
        });
      });

      context("when set to self", () => {
        it("renders just only a button", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.mount(
            <Button
              variant="default"
              styles={{
                dropdownStyle: css`
                  min-width: 240px;
                `,
              }}
              showSubMenuOn="self"
              onClick={() => {
                console.log("console log");
              }}
              subMenu={({ render }) =>
                render(
                  <Button.TipMenuContainer
                    style={css`
                      padding: 10px;
                      display: flex;
                      flex-direction: column;
                      gap: 4px;
                    `}
                  >
                    <MenuContainer>
                      <MenuTitle>Information</MenuTitle>
                      <MenuDescription>
                        This button uses a render function to show custom
                        content inside TipMenu.
                      </MenuDescription>
                    </MenuContainer>
                    <Button variant="primary">Got it</Button>
                  </Button.TipMenuContainer>
                )
              }
            >
              With Self
            </Button>
          );
          cy.findByRole("button").should("contain.text", "With Self").click();
          cy.findByText("Information").should("exist");
          cy.findByText(
            "This button uses a render function to show custom content inside TipMenu."
          ).should("exist");
          cy.findByText("Got it").should("exist");

          cy.findByLabelText("button-toggle").should("not.exist");

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "console log"
          );
        });
      });
    });

    context("safeAreaAriaLabels", () => {
      context("when given element with any drawer", () => {
        it("shouldn't close the tip menu", () => {
          cy.mount(
            <Button
              variant="default"
              styles={{
                dropdownStyle: css`
                  min-width: 240px;
                `,
              }}
              subMenu={({ show }) =>
                show(<Calendar monthNames={MONTH_NAMES} />)
              }
            >
              Test
            </Button>
          );
          cy.findByLabelText("button-toggle")
            .click()
            .then(($button) => {
              cy.wrap($button).should(
                "have.css",
                "background-color",
                "rgb(207, 207, 207)"
              );
              cy.findAllByLabelText("calendar-select-date").eq(0).click();
              cy.findByLabelText("combobox-month").click();
              cy.findByText("SEP").should("exist").click();
              cy.findByLabelText("combobox-year").click();
              cy.findByText("2025").should("exist").click();
              cy.findByText("22")
                .click()
                .should("have.css", "color", "rgb(255, 255, 255)")
                .and("have.css", "background-color", "rgb(97, 169, 249)");
            });
        });
      });
    });
  });

  context("onMouseEnter", () => {
    context("when hovering", () => {
      it("should show the console", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });
        cy.mount(
          <Button
            variant="default"
            onMouseEnter={() => {
              console.log("test on mouse enter");
            }}
          >
            onMouseEnter
          </Button>
        );

        cy.findByText("onMouseEnter").closest("button").trigger("mouseenter");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "test on mouse enter"
        );
      });
    });
  });

  context("onMouseLeave", () => {
    context("when hover & leave", () => {
      it("should show the console", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });
        cy.mount(
          <Button
            variant="default"
            onMouseLeave={() => {
              console.log("test on mouse leave");
            }}
          >
            onMouseLeave
          </Button>
        );

        cy.findByText("onMouseLeave").closest("button").trigger("mouseenter");

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "test on mouse leave"
        );

        cy.get("body").realMouseMove(0, 0);

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "test on mouse leave"
        );
      });
    });
  });
});

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MenuTitle = styled.div`
  font-weight: 600;
  font-size: 15px;
  color: #111827;
`;

const MenuDescription = styled.div`
  font-size: 13px;
  color: #6b7280;
`;

const MONTH_NAMES = [
  { text: "JAN", value: "1" },
  { text: "FEB", value: "2" },
  { text: "MAR", value: "3" },
  { text: "APR", value: "4" },
  { text: "MAY", value: "5" },
  { text: "JUN", value: "6" },
  { text: "JUL", value: "7" },
  { text: "AUG", value: "8" },
  { text: "SEP", value: "9" },
  { text: "OCT", value: "10" },
  { text: "NOV", value: "11" },
  { text: "DEC", value: "12" },
];
