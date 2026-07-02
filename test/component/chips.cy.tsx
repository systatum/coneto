import { Chips, ChipsProps } from "./../../components/chips";
import { BadgeProps } from "./../../components/badge";
import { ChangeEvent, useState } from "react";
import { css } from "styled-components";

describe("Chips", () => {
  function ProductChips(props: ChipsProps) {
    const BADGE_OPTIONS: BadgeProps[] = [
      {
        id: "1",
        caption: "Anime",
      },
      {
        id: "2",
        caption: "Manga",
      },
      {
        id: "3",
        caption: "Comics",
      },
      {
        id: "4",
        caption: "Movies",
      },
      {
        id: "5",
        caption: "Podcasts",
      },
      {
        id: "6",
        caption: "TV Shows",
      },
      {
        id: "7",
        caption: "Novels",
      },
      {
        id: "8",
        caption: "Music",
      },
      {
        id: "9",
        caption: "Games",
      },
      {
        id: "10",
        caption: "Webtoons",
      },
    ];

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
        styles={{
          chipOptionStyle: css`
            width: 100%;
            gap: 8px;
          `,
          chipOptionWrapperStyle: css`
            gap: 4px;
          `,
        }}
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

  context("styles", () => {
    it("renders the option with transparent badge option", () => {
      cy.mount(<ProductChips />);

      cy.findByRole("button").click();

      cy.findAllByLabelText("chips-option")
        .eq(0)
        .should("have.css", "background-color", "rgba(0, 0, 0, 0)")
        .and("have.css", "border-color", "rgba(0, 0, 0, 0)");
    });

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

    context("chipContainerStyle", () => {});

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

          cy.findByLabelText("chip-selected").should(
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
