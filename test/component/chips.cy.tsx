import { Chips } from "./../../components/chips";
import { BadgeProps } from "./../../components/badge";
import { ChangeEvent, useState } from "react";
import { css } from "styled-components";

describe("Chips", () => {
  function ProductChips() {
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
      selectedOptions: BadgeProps[];
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

    const handleOptionClicked = (badge: BadgeProps) => {
      const isAlreadySelected = inputValue.selectedOptions.some(
        (data) => data.id === badge.id
      );

      setInputValue((prev) => ({
        ...prev,
        selectedOptions: isAlreadySelected
          ? prev.selectedOptions.filter((data) => data.id !== badge.id)
          : [...prev.selectedOptions, badge],
      }));
    };

    return (
      <Chips
        inputValue={inputValue.search}
        setInputValue={onChangeValue}
        styles={{
          chipStyle: css`
            width: 100%;
            gap: 8px;
            border-color: transparent;
          `,
          chipContainerStyle: css`
            gap: 4px;
          `,
          chipsDrawerStyle: css`
            max-width: 300px;
          `,
        }}
        onOptionClicked={handleOptionClicked}
        selectedOptions={inputValue.selectedOptions}
        options={BADGE_OPTIONS as BadgeProps[]}
        creatable
      />
    );
  }
  context("focus behavior", () => {
    context("when clicking open the searchbox", () => {
      it("focusing to the searchbox", () => {
        cy.mount(<ProductChips />);
        cy.findByRole("button").click();

        cy.findByLabelText("chip-input-box")
          .should("be.focused")
          .and("have.css", "border-color", "rgb(97, 169, 249)");
      });

      context("when selecting one option", () => {
        it("still focusing to the searchbox", () => {
          cy.mount(<ProductChips />);
          cy.findByRole("button").click();

          const onFocus = cy.stub().as("focus");
          const onBlur = cy.stub().as("blur");

          cy.findByLabelText("chip-input-box")
            .should("be.focused")
            .and("have.css", "border-color", "rgb(97, 169, 249)")
            .then(($input) => {
              $input.on("focus", onFocus);
              $input.on("blur", onBlur);
            });

          cy.wait(300);

          cy.findByText("Anime").click();

          cy.findByLabelText("chip-input-box")
            .should("be.focused")
            .and("have.css", "border-color", "rgb(97, 169, 249)");

          cy.get("@blur").should("not.have.been.called");
        });
      });
    });
  });
});
