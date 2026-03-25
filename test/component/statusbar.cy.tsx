import {
  Ri24HoursFill,
  RiAlignItemLeftLine,
  RiAlignLeft,
  RiFocus3Line,
  RiFullscreenLine,
  RiPagesLine,
  RiUserFollowLine,
  RiWindow2Fill,
} from "@remixicon/react";
import { Statusbar, StatusbarProps } from "./../../components/statusbar";
import { useState } from "react";
import { Textbox } from "./../../components/textbox";
import { css } from "styled-components";

describe("Statusbar", () => {
  function ProductStatusbar(props: StatusbarProps) {
    const [pressedItems, setPressedItems] = useState<Set<string>>(new Set());

    const PRESSED_KEYS = {
      FOCUS: "focus",
      PAGES: "pages",
      WINDOW: "window",
      ALIGN_ITEM_LEFT: "align-item-left",
      ALIGN_LEFT: "align-left",
    } as const;

    const isPressed = (key: string) => pressedItems.has(key);

    const togglePressed = (key: string) => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
    };

    const setPressed = (key: string, value: boolean) => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        value ? next.add(key) : next.delete(key);
        return next;
      });
    };

    const focusIcon = isPressed(PRESSED_KEYS.FOCUS)
      ? RiFullscreenLine
      : RiFocus3Line;

    return (
      <Statusbar
        content={{
          left: [
            {
              button: {
                children: "Page 1 of 53",
                showSubMenuOn: "self",
                subMenu: ({ show }) =>
                  show(<Textbox value={"@systatum/coneto 🚀"} />),
              },
            },
            {
              width: "60px",
              text: "17455 words",
            },
            {
              width: "100px",
              text: "English (United States)",
            },
            {
              icon: {
                image: RiUserFollowLine,
              },
              text: "Accessibility: Good to go",
            },
          ],
          right: [
            {
              button: {
                showSubMenuOn: "self",
                icon: {
                  image: focusIcon,
                },
                subMenu: ({ list }) =>
                  list([
                    {
                      caption: "Full window",
                      icon: { image: RiFullscreenLine },
                      onClick: () => setPressed(PRESSED_KEYS.FOCUS, true),
                    },
                    {
                      caption: "Zen mode",
                      icon: { image: RiFocus3Line },
                      onClick: () => setPressed(PRESSED_KEYS.FOCUS, false),
                    },
                  ]),
                children: "Focus",
              },
            },
            {
              button: {
                pressed: isPressed(PRESSED_KEYS.PAGES),
                onClick: () => togglePressed(PRESSED_KEYS.PAGES),
                icon: { image: RiPagesLine },
              },
            },
            {
              button: {
                pressed: isPressed(PRESSED_KEYS.WINDOW),
                onClick: () => togglePressed(PRESSED_KEYS.WINDOW),
                icon: { image: RiWindow2Fill },
              },
            },
            {
              button: {
                pressed: isPressed(PRESSED_KEYS.ALIGN_ITEM_LEFT),
                onClick: () => togglePressed(PRESSED_KEYS.ALIGN_ITEM_LEFT),
                icon: { image: RiAlignItemLeftLine },
              },
            },
            {
              button: {
                pressed: isPressed(PRESSED_KEYS.ALIGN_LEFT),
                onClick: () => togglePressed(PRESSED_KEYS.ALIGN_LEFT),
                icon: { image: RiAlignLeft },
              },
            },
          ],
        }}
        {...props}
      />
    );
  }

  beforeEach(() => {
    cy.viewport(550, 750);
  });

  context("styles", () => {
    it("renders in the most bottom, justify-between, and position absolute", () => {
      cy.mount(<ProductStatusbar />);

      cy.findByLabelText("statusbar-wrapper")
        .should("have.css", "position", "absolute")
        .and("have.css", "bottom", "0px")
        .and("have.css", "justify-content", "space-between");
    });

    context("self", () => {
      context("when given justify-start", () => {
        it("should render in the left side", () => {
          cy.mount(
            <ProductStatusbar
              styles={{
                self: css`
                  justify-content: start;
                `,
              }}
            />
          );

          cy.findByLabelText("statusbar-wrapper").should(
            "have.css",
            "justify-content",
            "start"
          );
        });
      });
    });

    context("itemStyle", () => {
      context("when given padding 10px", () => {
        it("should render on each item have padding by 10px", () => {
          cy.mount(
            <ProductStatusbar
              styles={{
                itemStyle: css`
                  padding: 10px;
                `,
              }}
            />
          );

          cy.findAllByLabelText("statusbar-button").should(
            "have.css",
            "padding",
            "10px"
          );
        });
      });
    });

    context("leftWrapperStyle", () => {
      context("when given gap 10px", () => {
        it("should render in the left side have gap 10px", () => {
          cy.mount(
            <ProductStatusbar
              styles={{
                leftWrapperStyle: css`
                  gap: 10px;
                `,
              }}
            />
          );

          cy.findAllByLabelText("statusbar-content-wrapper")
            .eq(0)
            .should("have.css", "gap", "10px");
          cy.findAllByLabelText("statusbar-content-wrapper")
            .eq(1)
            .should("not.have.css", "gap", "10px");
        });
      });
    });

    context("rightWrapperStyle", () => {
      context("when given gap 10px", () => {
        it("should render in the right side have gap 10px", () => {
          cy.mount(
            <ProductStatusbar
              styles={{
                rightWrapperStyle: css`
                  gap: 10px;
                `,
              }}
            />
          );

          cy.findAllByLabelText("statusbar-content-wrapper")
            .eq(0)
            .should("not.have.css", "gap", "10px");
          cy.findAllByLabelText("statusbar-content-wrapper")
            .eq(1)
            .should("have.css", "gap", "10px");
        });
      });
    });
  });

  context("transparent", () => {
    context("when given false", () => {
      it("should render the button, border wrapper, with gray-ish", () => {
        cy.mount(<ProductStatusbar transparent={false} />);
        cy.findAllByLabelText("statusbar-button")
          .eq(0)
          .should("exist")
          .and("have.css", "background-color", "rgb(236, 236, 236)");

        cy.findByLabelText("statusbar-wrapper").should(
          "have.css",
          "border-width",
          "1px 0px 0px"
        );
      });
    });

    context("when given true", () => {
      it("should render the button, border wrapper to be transparent", () => {
        cy.mount(<ProductStatusbar transparent />);
        cy.findAllByLabelText("statusbar-button")
          .eq(0)
          .should("exist")
          .and("have.css", "border-color", "rgb(0, 0, 0)");

        cy.findByLabelText("statusbar-wrapper")
          .should("have.css", "border-width", "0px")
          .and("have.css", "border-width", "0px");
      });
    });
  });

  context("size", () => {
    it("renders by default is 11 (implementing into text, icon)", () => {
      cy.mount(<ProductStatusbar />);

      cy.findByText("Page 1 of 53").should("have.css", "font-size", "11px");
      cy.findAllByLabelText("statusbar-icon").should(
        "have.css",
        "width",
        "11px"
      );
    });

    context("when given with 14", () => {
      it("should render with 14px (implementing into text, icon)", () => {
        cy.mount(<ProductStatusbar size={14} />);

        cy.findByText("Page 1 of 53").should("have.css", "font-size", "14px");
        cy.findAllByLabelText("statusbar-icon").should(
          "have.css",
          "width",
          "14px"
        );
      });
    });
  });

  context("activeBackgroundColor", () => {
    context("when clicking", () => {
      it("renders with background color red when opened subMenu", () => {
        cy.mount(<ProductStatusbar activeBackgroundColor="red" />);

        cy.findAllByLabelText("statusbar-button")
          .eq(0)
          .should("exist")
          .and("have.css", "background-color", "rgb(236, 236, 236)");

        cy.findAllByLabelText("statusbar-button")
          .eq(0)
          .should("exist")
          .click()
          .should("have.css", "background-color", "rgb(255, 0, 0)");
      });

      it("renders with background color red when pressed", () => {
        cy.mount(<ProductStatusbar activeBackgroundColor="red" />);

        cy.findAllByLabelText("statusbar-button")
          .eq(2)
          .should("exist")
          .and("have.css", "background-color", "rgb(236, 236, 236)");

        cy.findAllByLabelText("statusbar-button")
          .eq(2)
          .should("exist")
          .click()
          .should("have.css", "background-color", "rgb(255, 0, 0)");
      });
    });

    context("when given red color", () => {
      context("when hovering", () => {
        it("should replace hover color with red (if not given hoverBackgroundColor)", () => {
          cy.mount(<ProductStatusbar activeBackgroundColor="red" />);
          cy.wait(500);

          cy.findAllByLabelText("statusbar-button")
            .eq(0)
            .then(($el) => {
              cy.wrap($el).realHover();

              cy.wait(100);

              cy.wrap($el).should(
                "have.css",
                "background-color",
                "rgb(255, 0, 0)"
              );
            });
        });
      });
    });
  });

  context("hoverBackgroundColor", () => {
    context("when given red color", () => {
      context("when hovering", () => {
        it("should replace hover color with red", () => {
          cy.mount(<ProductStatusbar hoverBackgroundColor="red" />);
          cy.wait(500);

          cy.findAllByLabelText("statusbar-button")
            .eq(0)
            .then(($el) => {
              cy.wrap($el).realHover();

              cy.wait(100);

              cy.wrap($el).should(
                "have.css",
                "background-color",
                "rgb(255, 0, 0)"
              );
            });
        });
      });
    });
  });

  context("content", () => {
    context("text", () => {
      it("renders the text with 11px (by default)", () => {
        cy.mount(
          <ProductStatusbar
            content={{
              left: [
                {
                  text: "Test",
                },
              ],
            }}
          />
        );

        cy.findByText("Test")
          .should("exist")
          .and("have.css", "font-size", "11px");
      });

      context("when given width less than text", () => {
        it("should render the ellipsis", () => {
          cy.mount(
            <ProductStatusbar
              content={{
                left: [
                  {
                    text: "Test, this is a Text",
                    width: "60px",
                  },
                ],
              }}
            />
          );

          cy.findByText("Test, this is a Text")
            .should("exist")
            .and("have.css", "text-overflow", "ellipsis")
            .parent()
            .should("have.css", "width", "60px");
        });
      });

      context("when given icon", () => {
        it("renders the icon with 10px (by default)", () => {
          cy.mount(
            <ProductStatusbar
              content={{
                left: [
                  {
                    text: "Test",
                    icon: { image: Ri24HoursFill },
                  },
                ],
              }}
            />
          );

          cy.findByLabelText("statusbar-text-wrapper").should("exist");
          cy.findByLabelText("statusbar-icon").should("exist");
        });
      });

      context("when given button", () => {
        it("renders only on the button", () => {
          cy.mount(
            <ProductStatusbar
              content={{
                left: [
                  {
                    text: "Test, this is a Text",
                    button: {
                      children: "This is the button",
                    },
                  },
                ],
              }}
            />
          );

          cy.findByText("Test, this is a Text").should("not.exist");
          cy.findByText("This is the button").should("exist");
        });
      });

      context("when given hidden", () => {
        it("should render without hidden button", () => {
          cy.mount(
            <ProductStatusbar
              transparent={false}
              content={{
                left: [
                  {
                    text: "Test",
                  },
                  {
                    hidden: true,
                    text: "Hidden",
                  },
                ],
              }}
            />
          );
          cy.findAllByLabelText("statusbar-text-wrapper").eq(0).should("exist");
          cy.findAllByLabelText("statusbar-text-wrapper")
            .eq(1)
            .should("not.exist");
        });
      });
    });

    context("button", () => {
      it("renders with background color #ececec", () => {
        cy.mount(
          <ProductStatusbar
            content={{
              left: [
                {
                  button: {
                    children: "Button",
                  },
                },
              ],
            }}
          />
        );

        cy.findByLabelText("statusbar-button")
          .should("exist")
          .and("have.css", "background-color", "rgb(236, 236, 236)");
      });

      context("when given hidden", () => {
        it("should render without hidden button", () => {
          cy.mount(
            <ProductStatusbar
              transparent={false}
              content={{
                left: [
                  {
                    button: {
                      children: "Button",
                    },
                  },
                  {
                    hidden: true,
                    button: {
                      children: "Button",
                    },
                  },
                ],
              }}
            />
          );
          cy.findAllByLabelText("statusbar-button").eq(0).should("exist");
          cy.findAllByLabelText("statusbar-button").eq(1).should("not.exist");
        });
      });
    });
  });
});
