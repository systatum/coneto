import { Chips, ChipsProps } from "./../../components/chips";
import { BadgeProps } from "./../../components/badge";
import { ChangeEvent, useState } from "react";
import { css } from "styled-components";
import { RiCloseLine } from "@remixicon/react";

describe("Chips", () => {
  function ProductChips({
    onActionClick,
    ...props
  }: ChipsProps & {
    onActionClick?: (props?: {
      badge?: BadgeProps;
      event?: React.MouseEvent;
    }) => void;
  }) {
    const BADGE_OPTIONS: BadgeProps[] = Array.from({ length: 10 }, (_, i) => ({
      id: String(i + 1),
      caption: (() => {
        switch (i + 1) {
          case 1:
            return "Anime";
          case 2:
            return "Manga";
          case 3:
            return "Comics";
          case 4:
            return "Movies";
          case 5:
            return "Podcasts";
          case 6:
            return "TV Shows";
          case 7:
            return "Novels";
          case 8:
            return "Music";
          case 9:
            return "Games";
          case 10:
            return "Webtoons";
          default:
            return "";
        }
      })(),
      actions: [
        {
          image: RiCloseLine,
          onClick: ({ badge, event }) => {
            onActionClick?.({ badge, event });
          },
          size: 16,
        },
      ],
    }));

    interface InputValueProps {
      search: string;
      name_tag: string;
      background_color: string;
      text_color: string;
      circle_color: string;
      selectedOptions: string[];
    }

    const [inputValue, setInputValue] = useState<InputValueProps>({
      search: "",
      name_tag: "",
      background_color: "",
      text_color: "",
      circle_color: "",
      selectedOptions: [],
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === "chips") {
        setInputValue((prev) => ({
          ...prev,
          ["search"]: value,
          ["name_tag"]: value,
        }));
      } else {
        setInputValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    return (
      <Chips
        inputValue={inputValue.search}
        setInputValue={onChangeValue}
        onChange={(selectedOptions: string[]) =>
          setInputValue((prev) => ({
            ...prev,
            selectedOptions,
          }))
        }
        selectedOptions={inputValue.selectedOptions}
        options={BADGE_OPTIONS as BadgeProps[]}
        creatable
        {...props}
      />
    );
  }

  context("mobile", () => {
    it("renders the drawer with in the bottom screen", () => {
      cy.mount(<ProductChips mobile />);
      cy.findByRole("button").click();

      cy.findByLabelText("combobox-drawer-mobile")
        .should("have.css", "bottom", "10px")
        .and("have.css", "position", "fixed");
    });

    it("renders the drawer with height 320px", () => {
      cy.mount(<ProductChips mobile />);

      cy.findByRole("button").click();

      cy.findByLabelText("combobox-drawer-mobile").should(
        "have.css",
        "height",
        "320px"
      );
    });

    context("drawerHeight", () => {
      context("when given 400px", () => {
        it("renders the drawer with height 400px", () => {
          cy.mount(<ProductChips mobile drawerHeight="400px" />);
          cy.findByRole("button").click();

          cy.findByLabelText("combobox-drawer-mobile").should(
            "have.css",
            "height",
            "400px"
          );
        });
      });
    });
  });

  context("actions", () => {
    context("when clicking", () => {
      it("should stop propagate to the selection behavior", () => {
        cy.mount(<ProductChips />);

        cy.findByRole("button").click();

        cy.findAllByLabelText("badge-action").eq(0).click();
        cy.findAllByLabelText("chips-selected").should("not.exist");
      });

      it("should call the callback", () => {
        const onClick = cy.stub().as("onClick");

        cy.mount(<ProductChips onActionClick={onClick} />);

        cy.findByRole("button").click();

        cy.findAllByLabelText("badge-action").eq(0).click();

        cy.get("@onClick").should("have.been.calledOnce");
      });

      context("when console the event", () => {
        it("should shows the event mouse", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductChips onActionClick={({ event }) => console.log(event)} />
          );

          cy.findByRole("button").click();

          cy.findAllByLabelText("badge-action").eq(0).click();

          cy.get("@consoleLog").then((spy: any) => {
            expect(spy).to.have.been.calledOnce;

            const event = spy.firstCall.args[0];

            expect(event).to.exist;
            expect(event.type).to.equal("mousedown");
          });
        });
      });

      context("when console the badge", () => {
        it("should shows the badge clicked", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <ProductChips
              onActionClick={({ badge }) => console.log(JSON.stringify(badge))}
            />
          );

          cy.findByRole("button").click();

          cy.findAllByLabelText("badge-action").eq(0).click();

          cy.get("@consoleLog").then((spy: any) => {
            expect(spy).to.have.been.calledOnce;

            const logged = spy.firstCall.args[0];

            expect(logged).to.equal(
              JSON.stringify({
                id: "1",
                caption: "Anime",
                variant: null,
                backgroundColor: "transparent",
                withCircle: true,
              })
            );
          });
        });
      });
    });
  });

  context("options", () => {
    it("renders the option with transparent badge option", () => {
      cy.mount(<ProductChips />);

      cy.findByRole("button").click();

      cy.findAllByLabelText("chips-option")
        .eq(0)
        .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
        .and("have.css", "border-color", "rgba(0, 0, 0, 0)");
    });

    context("when given backgroundColor on the options", () => {
      const BADGE_OPTIONS_WITH_COLORS: BadgeProps[] = [
        {
          id: "1",
          backgroundColor: "#1c0f13",
          textColor: "#ffffff",
          caption: "Anime",
          circleColor: "#ff6f61",
        },
        {
          id: "2",
          backgroundColor: "#120f1f",
          textColor: "#ffffff",
          caption: "Manga",
          circleColor: "#6b5b95",
        },
        {
          id: "3",
          backgroundColor: "#0e1a0e",
          textColor: "#ffffff",
          caption: "Comics",
          circleColor: "#88b04b",
        },
        {
          id: "4",
          backgroundColor: "#1a1212",
          textColor: "#ffffff",
          caption: "Movies",
          circleColor: "#f7cac9",
        },
        {
          id: "5",
          backgroundColor: "#0e1626",
          textColor: "#ffffff",
          caption: "Podcasts",
          circleColor: "#92a8d1",
        },
        {
          id: "6",
          backgroundColor: "#1b0d0d",
          textColor: "#ffffff",
          caption: "TV Shows",
          circleColor: "#955251",
        },
        {
          id: "7",
          backgroundColor: "#160d18",
          textColor: "#ffffff",
          caption: "Novels",
          circleColor: "#b565a7",
        },
        {
          id: "8",
          backgroundColor: "#0d1a17",
          textColor: "#ffffff",
          caption: "Music",
          circleColor: "#009b77",
        },
        {
          id: "9",
          backgroundColor: "#1c0e0c",
          textColor: "#ffffff",
          caption: "Games",
          circleColor: "#dd4124",
        },
        {
          id: "10",
          backgroundColor: "#0d1c1a",
          textColor: "#ffffff",
          caption: "Webtoons",
          circleColor: "#45b8ac",
        },
      ];
      it("renders options with coloring", () => {
        cy.mount(<ProductChips options={BADGE_OPTIONS_WITH_COLORS} />);
        cy.findByRole("button").click();

        cy.findAllByLabelText("chips-option").should(
          "not.have.css",
          "background-color",
          "rgba(0, 0, 0, 0)"
        );
      });

      context("when select one option", () => {
        it("renders option selected with coloring", () => {
          cy.mount(<ProductChips options={BADGE_OPTIONS_WITH_COLORS} />);
          cy.findByRole("button").click();

          cy.findAllByLabelText("chips-option")
            .eq(0)
            .should("have.css", "background-color", "rgb(28, 15, 19)")
            .click();
          cy.wait(400);
          cy.findAllByLabelText("chips-selected")
            .eq(0)
            .should("have.css", "background-color", "rgb(28, 15, 19)");
        });
      });
    });
  });
  context("styles", () => {
    it("renders gap in option wrapper with 4px (by default)", () => {
      cy.mount(<ProductChips />);
      cy.findByRole("button").click();

      cy.findAllByRole("option").eq(0).should("have.css", "gap", "4px");
    });

    context("chipOptionWrapperStyle", () => {
      context("when given gap 20px", () => {
        it("should render gap with 20px between checkbox and badge", () => {
          cy.mount(
            <ProductChips
              styles={{
                chipOptionWrapperStyle: css`
                  gap: 20px;
                `,
              }}
            />
          );
          cy.findByRole("button").click();

          cy.findAllByRole("option").eq(0).should("have.css", "gap", "20px");
        });
      });
    });

    context("chipsContainerStyle", () => {
      context("when given gap 20px", () => {
        it("should render gap with 20px between selected and button trigger", () => {
          cy.mount(
            <ProductChips
              styles={{
                chipsContainerStyle: css`
                  gap: 20px;
                `,
              }}
            />
          );
          cy.findByRole("button").click();

          cy.findByText("Anime").click();
          cy.findByText("Manga").click();

          cy.findByLabelText("chips-container-input").should(
            "have.css",
            "gap",
            "20px"
          );
        });
      });
    });

    context("chipsSelectedStyle", () => {
      context("when given radius 20px", () => {
        it("should render the chips selected with radius 20px", () => {
          cy.mount(
            <ProductChips
              styles={{
                chipSelectedStyle: css`
                  border-radius: 20px;
                `,
              }}
            />
          );
          cy.findByRole("button").click();

          cy.findByText("Anime").click();

          cy.findByLabelText("chips-selected").should(
            "have.css",
            "border-radius",
            "20px"
          );
        });
      });
    });

    context("chipOptionStyle", () => {
      context("when given border red", () => {
        it("should render option chip with border red", () => {
          cy.mount(
            <ProductChips
              styles={{
                chipOptionStyle: css`
                  border-color: red;
                `,
              }}
            />
          );
          cy.findByRole("button").click();

          cy.findAllByLabelText("chips-option").should(
            "have.css",
            "border-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("chipsDrawerStyle", () => {
      context("when given min-height 400px", () => {
        it("should render the drawer with 400px", () => {
          cy.mount(
            <ProductChips
              styles={{
                chipsDrawerStyle: css`
                  min-height: 400px;
                `,
              }}
            />
          );
          cy.findByRole("button").click();

          cy.findByLabelText("combobox-drawer").should(
            "have.css",
            "height",
            "400px"
          );
        });
      });
    });
  });

  context("focus behavior", () => {
    context("when clicking open the searchbox", () => {
      it("focusing to the searchbox", () => {
        cy.mount(<ProductChips />);
        cy.findByRole("button").click();

        cy.findByLabelText("textbox-search")
          .should("be.focused")
          .and("have.css", "border-color", "rgb(97, 169, 249)");
      });

      context("when selecting one option", () => {
        it("still focusing to the searchbox", () => {
          cy.mount(<ProductChips />);
          cy.findByRole("button").click();

          const onFocus = cy.stub().as("focus");
          const onBlur = cy.stub().as("blur");

          cy.findByLabelText("textbox-search")
            .should("be.focused")
            .and("have.css", "border-color", "rgb(97, 169, 249)")
            .then(($input) => {
              $input.on("focus", onFocus);
              $input.on("blur", onBlur);
            });

          cy.wait(300);

          cy.findByText("Anime").click();

          cy.findByLabelText("textbox-search")
            .should("be.focused")
            .and("have.css", "border-color", "rgb(97, 169, 249)");

          cy.get("@blur").should("not.have.been.called");
        });
      });
    });
  });
});
