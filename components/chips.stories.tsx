import { Meta, StoryObj } from "@storybook/react";
import Chips from "./chips";
import { ChangeEvent, useState } from "react";
import { BadgeProps } from "./badge";
import { ColorPickProps } from "./colorbox";

const meta: Meta<typeof Chips> = {
  title: "Input Elements/Chips",
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
    const [selected, setSelected] = useState<number[]>([]);

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
      const valId = val?.id;
      const isAlreadySelected = selected.some((data) => data === valId);

      if (isAlreadySelected) {
        setSelected((prev) => prev.filter((data) => data !== valId));
      } else {
        setSelected([...selected, valId]);
      }
    };

    const handleNewTagClicked = () => {
      console.log("clicked new tag");
    };

    return (
      <Chips
        inputValue={inputValue}
        setInputValue={onChangeValue}
        chipClassName="w-full gap-2 border-transparent"
        chipContainerClassName="gap-1"
        chipsDrawerClassName="max-w-[250px]"
        onOptionClicked={handleOptionClicked}
        selectedOption={selected}
        options={BADGE_OPTIONS as BadgeProps[]}
        onNewTagCreated={handleNewTagClicked}
        creatable
      />
    );
  },
};

export const WhiteBackground: Story = {
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
    const [selected, setSelected] = useState<number[]>([]);

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
      const valId = val?.id;
      const isAlreadySelected = selected.some((data) => data === valId);

      if (isAlreadySelected) {
        setSelected((prev) => prev.filter((data) => data !== valId));
      } else {
        setSelected([...selected, valId]);
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
        chipClassName="w-full gap-2 border-transparent"
        chipsDrawerClassName="max-w-[250px]"
        onOptionClicked={handleOptionClicked}
        selectedOption={selected}
        onDeleteRequested={handleDeleteClicked}
        options={BADGE_OPTIONS as BadgeProps[]}
        onNewTagCreated={handleNewTagClicked}
        creatable
      />
    );
  },
};

export const Deletable: Story = {
  render: () => {
    const BADGE_OPTIONS = [
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
    const [selected, setSelected] = useState<number[]>([]);

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
      const valId = val?.id;
      const isAlreadySelected = selected.some((data) => data === valId);

      if (isAlreadySelected) {
        setSelected((prev) => prev.filter((data) => data !== valId));
      } else {
        setSelected([...selected, valId]);
      }
    };

    const handleNewTagClicked = () => {
      console.log("clicked new tag");
    };

    const handleDeleteClicked = (option: BadgeProps) => {
      console.log(option);
    };

    return (
      <Chips
        inputValue={inputValue}
        setInputValue={onChangeValue}
        chipClassName="w-full gap-2 border-transparent"
        chipContainerClassName="gap-1"
        chipsDrawerClassName="max-w-[250px]"
        onOptionClicked={handleOptionClicked}
        selectedOption={selected}
        options={BADGE_OPTIONS as BadgeProps[]}
        onNewTagCreated={handleNewTagClicked}
        onDeleteRequested={handleDeleteClicked}
        creatable
        deletable
      />
    );
  },
};
