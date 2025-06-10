import { Meta, StoryObj } from "@storybook/react";
import Chips from "./chips";
import { OptionsProps } from "./selectbox";
import { ChangeEvent, useState } from "react";
import Badge, { BadgeProps, BadgeVariantProps } from "./badge";
import { ColorPickProps } from "./colorbox";

const meta: Meta<typeof Chips> = {
  title: "Content/Chips",
  component: Chips,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Chips>;

export const Default: Story = {
  render: () => {
    const BADGE_OPTIONS = [
      {
        id: 1,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Anime",
        circleColor: "#ff6f61",
      },
      {
        id: 2,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Manga",
        circleColor: "#6b5b95",
      },
      {
        id: 3,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Comics",
        circleColor: "#88b04b",
      },
      {
        id: 4,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Movies",
        circleColor: "#f7cac9",
      },
      {
        id: 5,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Podcasts",
        circleColor: "#92a8d1",
      },
      {
        id: 6,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "TV Shows",
        circleColor: "#955251",
      },
      {
        id: 7,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Novels",
        circleColor: "#b565a7",
      },
      {
        id: 8,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Music",
        circleColor: "#009b77",
      },
      {
        id: 9,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Games",
        circleColor: "#dd4124",
      },
      {
        id: 10,
        backgroundColor: "transparent",
        textColor: "#000000",
        caption: "Webtoons",
        circleColor: "#45b8ac",
      },
    ];

    const [inputValue, setInputValue] = useState({
      search: "",
      name_tag: "",
      background_color: "",
      text_color: "#000000",
      circle_color: "#000000",
    });
    const [selected, setSelected] = useState<BadgeProps[]>([]);

    const onChangeValue = (
      e: ChangeEvent<HTMLInputElement>,
      type?: ColorPickProps
    ) => {
      const { name, value } = e.target;

      if (type === "text") {
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
      const isAlreadySelected = selected.some((data) => data.id === val.id);

      if (isAlreadySelected) {
        setSelected((prev) => prev.filter((data) => data.id !== val.id));
      } else {
        setSelected([...selected, val]);
      }
    };

    const handleDeleteClicked = (option: BadgeProps) => {
      console.log(option);
    };

    const handleNewTagClicked = () => {
      console.log("clicked new tag");
    };

    return (
      <Chips
        inputValue={inputValue}
        setInputValue={onChangeValue}
        containerClassName="max-w-[250px]"
        childClassName="w-full gap-2"
        onOptionClicked={handleOptionClicked}
        optionClicked={selected}
        onDeleteRequested={handleDeleteClicked}
        options={BADGE_OPTIONS as BadgeProps[]}
        onNewTagCreated={handleNewTagClicked}
        creatable
      />
    );
  },
};
