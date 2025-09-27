import { Meta, StoryObj } from "@storybook/react";
import { Chips } from "./chips";
import { ChangeEvent, useState } from "react";
import { BadgeActionProps, BadgeProps } from "./badge";
import { ColorPickProps } from "./colorbox";
import { css } from "styled-components";
import { RiCloseLine } from "@remixicon/react";

const meta: Meta<typeof Chips> = {
  title: "Input Elements/Chips",
  component: Chips,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Chips>;

export const Default: Story = {
  render: () => {
    const BADGE_OPTIONS: BadgeProps[] = [
      {
        id: 1,
        caption: "Anime",
      },
      {
        id: 2,
        caption: "Manga",
      },
      {
        id: 3,
        caption: "Comics",
      },
      {
        id: 4,
        caption: "Movies",
      },
      {
        id: 5,
        caption: "Podcasts",
      },
      {
        id: 6,
        caption: "TV Shows",
      },
      {
        id: 7,
        caption: "Novels",
      },
      {
        id: 8,
        caption: "Music",
      },
      {
        id: 9,
        caption: "Games",
      },
      {
        id: 10,
        caption: "Webtoons",
      },
    ];

    const [inputValue, setInputValue] = useState({
      search: "",
      name_tag: "",
      background_color: "",
      text_color: "",
      circle_color: "",
    });
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

    const onChangeValue = (
      e: ChangeEvent<HTMLInputElement>,
      type?: ColorPickProps
    ) => {
      const { name, value } = e.target;

      if (type === "color-text") {
        let val = value;
        if (!val.startsWith("#")) {
          val = "#" + val;
        }
        setInputValue((prev) => ({ ...prev, [name]: val }));
      } else {
        setInputValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    const handleOptionClicked = (val: BadgeProps) => {
      const valId = val?.id;
      const isAlreadySelected = selectedOptions.some((data) => data === valId);

      if (isAlreadySelected) {
        setSelectedOptions((prev) => prev.filter((data) => data !== valId));
      } else {
        setSelectedOptions([...selectedOptions, valId]);
      }
    };

    const handleNewTagClicked = () => {
      console.log("clicked new tag");
    };

    return (
      <Chips
        inputValue={inputValue}
        setInputValue={onChangeValue}
        chipStyle={css`
          min-width: 300px;
          gap: 8px;
          border-color: transparent;
        `}
        chipContainerStyle={css`
          gap: 4px;
        `}
        chipsDrawerStyle={css`
          max-width: 300px;
        `}
        onOptionClicked={handleOptionClicked}
        selectedOptions={selectedOptions}
        options={BADGE_OPTIONS as BadgeProps[]}
        onNewTagCreated={handleNewTagClicked}
        creatable
      />
    );
  },
};

export const DarkBackground: Story = {
  render: () => {
    const BADGE_OPTIONS: BadgeProps[] = [
      {
        id: 1,
        backgroundColor: "#1c0f13",
        textColor: "#ffffff",
        caption: "Anime",
        circleColor: "#ff6f61",
      },
      {
        id: 2,
        backgroundColor: "#120f1f",
        textColor: "#ffffff",
        caption: "Manga",
        circleColor: "#6b5b95",
      },
      {
        id: 3,
        backgroundColor: "#0e1a0e",
        textColor: "#ffffff",
        caption: "Comics",
        circleColor: "#88b04b",
      },
      {
        id: 4,
        backgroundColor: "#1a1212",
        textColor: "#ffffff",
        caption: "Movies",
        circleColor: "#f7cac9",
      },
      {
        id: 5,
        backgroundColor: "#0e1626",
        textColor: "#ffffff",
        caption: "Podcasts",
        circleColor: "#92a8d1",
      },
      {
        id: 6,
        backgroundColor: "#1b0d0d",
        textColor: "#ffffff",
        caption: "TV Shows",
        circleColor: "#955251",
      },
      {
        id: 7,
        backgroundColor: "#160d18",
        textColor: "#ffffff",
        caption: "Novels",
        circleColor: "#b565a7",
      },
      {
        id: 8,
        backgroundColor: "#0d1a17",
        textColor: "#ffffff",
        caption: "Music",
        circleColor: "#009b77",
      },
      {
        id: 9,
        backgroundColor: "#1c0e0c",
        textColor: "#ffffff",
        caption: "Games",
        circleColor: "#dd4124",
      },
      {
        id: 10,
        backgroundColor: "#0d1c1a",
        textColor: "#ffffff",
        caption: "Webtoons",
        circleColor: "#45b8ac",
      },
    ];

    const [inputValue, setInputValue] = useState({
      search: "",
      name_tag: "",
      background_color: "",
      text_color: "",
      circle_color: "",
    });
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

    const onChangeValue = (
      e: ChangeEvent<HTMLInputElement>,
      type?: ColorPickProps
    ) => {
      const { name, value } = e.target;

      if (type === "color-text") {
        let val = value;
        if (!val.startsWith("#")) {
          val = "#" + val;
        }
        setInputValue((prev) => ({ ...prev, [name]: val }));
      } else {
        setInputValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    const handleOptionClicked = (val: BadgeProps) => {
      const valId = val?.id;
      const isAlreadySelected = selectedOptions.some((data) => data === valId);

      if (isAlreadySelected) {
        setSelectedOptions((prev) => prev.filter((data) => data !== valId));
      } else {
        setSelectedOptions([...selectedOptions, valId]);
      }
    };

    const handleNewTagClicked = () => {
      console.log("clicked new tag");
    };

    return (
      <Chips
        inputValue={inputValue}
        setInputValue={onChangeValue}
        chipStyle={css`
          width: 100%;
          gap: 8px;
          border-color: transparent;
        `}
        chipContainerStyle={css`
          gap: 8px;
          justify-content: start;
        `}
        onOptionClicked={handleOptionClicked}
        selectedOptions={selectedOptions}
        options={BADGE_OPTIONS as BadgeProps[]}
        onNewTagCreated={handleNewTagClicked}
        creatable
      />
    );
  },
};

export const Deletable: Story = {
  render: () => {
    const BADGE_OPTIONS: BadgeProps[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
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
          icon: RiCloseLine,
          onClick: (badge) => {
            console.log(badge);
          },
          size: 16,
          style: css`
            opacity: 0;
          `,
        },
      ],
    }));

    const [inputValue, setInputValue] = useState({
      search: "",
      name_tag: "",
      background_color: "",
      text_color: "",
      circle_color: "",
    });
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

    const onChangeValue = (
      e: ChangeEvent<HTMLInputElement>,
      type?: ColorPickProps
    ) => {
      const { name, value } = e.target;

      if (type === "color-text") {
        let val = value;
        if (!val.startsWith("#")) {
          val = "#" + val;
        }
        setInputValue((prev) => ({ ...prev, [name]: val }));
      } else {
        setInputValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    const handleOptionClicked = (val: BadgeProps) => {
      const valId = val?.id;
      const isAlreadySelected = selectedOptions.some((data) => data === valId);

      if (isAlreadySelected) {
        setSelectedOptions((prev) => prev.filter((data) => data !== valId));
      } else {
        setSelectedOptions([...selectedOptions, valId]);
      }
    };

    const handleNewTagClicked = () => {
      console.log("clicked new tag");
    };

    return (
      <Chips
        inputValue={inputValue}
        setInputValue={onChangeValue}
        chipStyle={css`
          width: 100%;
          gap: 8px;
          border-color: transparent;
        `}
        chipContainerStyle={css`
          gap: 4px;
        `}
        chipsDrawerStyle={css`
          max-width: 250px;
        `}
        onOptionClicked={handleOptionClicked}
        selectedOptions={selectedOptions}
        options={BADGE_OPTIONS as BadgeProps[]}
        onNewTagCreated={handleNewTagClicked}
        creatable
      />
    );
  },
};
