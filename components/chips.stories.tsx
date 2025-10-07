import { Meta, StoryObj } from "@storybook/react";
import { Chips, MissingOptionFormProps } from "./chips";
import { ChangeEvent, useState } from "react";
import { Badge, BadgeProps } from "./badge";
import { Colorbox, ColorPickProps } from "./colorbox";
import styled, { css } from "styled-components";
import { RiAddBoxFill, RiCloseLine } from "@remixicon/react";
import { Textbox } from "./textbox";
import { Button } from "./button";

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
      } else if (name === "chips") {
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

    const handleNewTagClicked = () => {
      console.log("clicked new tag");
    };

    const MissingOptionForm = ({
      firstInputRef,
      closeForm,
    }: MissingOptionFormProps) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: "240px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "8px 12px",
            gap: "8px",
            fontSize: "0.75rem",
            fontWeight: 500,
            alignItems: "center",
          }}
        >
          <RiAddBoxFill size={18} />
          <span
            style={{
              paddingTop: "2px",
            }}
          >
            Create a new tag
          </span>
        </div>
        <Divider aria-label="divider" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "12px",
            gap: "12px",
          }}
        >
          <Textbox
            ref={firstInputRef}
            name="name_tag"
            placeholder={"Create a new label"}
            value={inputValue.name_tag}
            autoComplete="off"
            onChange={onChangeValue}
          />
          <Colorbox
            placeholder="Select background color..."
            name={"background_color"}
            value={inputValue.background_color}
            onChange={onChangeValue}
          />
          <Colorbox
            placeholder="Select text color..."
            name={"text_color"}
            value={inputValue.text_color}
            onChange={onChangeValue}
          />
          <Colorbox
            placeholder="Select circle color..."
            name={"circle_color"}
            value={inputValue.circle_color}
            onChange={onChangeValue}
          />
          <Badge
            textColor={inputValue.text_color}
            backgroundColor={inputValue.background_color}
            circleColor={inputValue.circle_color}
            caption={inputValue.name_tag}
            withCircle
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              onClick={async () => {
                const inputSearchEvent = {
                  target: {
                    name: "search",
                    value: inputValue.name_tag,
                  },
                } as ChangeEvent<HTMLInputElement>;
                await onChangeValue(inputSearchEvent);
                await closeForm();
              }}
              size="sm"
              buttonStyle={{
                fontSize: "12px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewTagClicked}
              size="sm"
              variant="primary"
              buttonStyle={{
                fontSize: "12px",
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    );

    return (
      <Chips
        inputValue={inputValue.search}
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
        selectedOptions={inputValue.selectedOptions}
        options={BADGE_OPTIONS as BadgeProps[]}
        missingOptionForm={MissingOptionForm}
        creatable
      />
    );
  },
};

export const DarkBackground: Story = {
  render: () => {
    const BADGE_OPTIONS: BadgeProps[] = [
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
    interface InputValueProps {
      search: string;
      selectedOptions: BadgeProps[];
    }

    const [inputValue, setInputValue] = useState<InputValueProps>({
      search: "",
      selectedOptions: [],
    });

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
        setInputValue={(e) =>
          setInputValue((prev) => ({ ...prev, searchText: e.target.value }))
        }
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
        selectedOptions={inputValue.selectedOptions}
        options={BADGE_OPTIONS as BadgeProps[]}
      />
    );
  },
};

export const Deletable: Story = {
  render: () => {
    interface InputValueProps {
      search: string;
      name_tag: string;
      background_color: string;
      text_color: string;
      circle_color: string;
      selectedOptions: BadgeProps[];
    }

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

    const [inputValue, setInputValue] = useState<InputValueProps>({
      search: "",
      name_tag: "",
      background_color: "",
      text_color: "",
      circle_color: "",
      selectedOptions: [],
    });

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
      } else if (name === "chips") {
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

    const handleNewTagClicked = () => {
      console.log("clicked new tag");
    };

    const MissingOptionForm = ({
      firstInputRef,
      closeForm,
    }: MissingOptionFormProps) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minWidth: "240px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "8px 12px",
            gap: "8px",
            fontSize: "0.75rem",
            fontWeight: 500,
            alignItems: "center",
          }}
        >
          <RiAddBoxFill size={18} />
          <span
            style={{
              paddingTop: "2px",
            }}
          >
            Create a new tag
          </span>
        </div>
        <Divider aria-label="divider" />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "12px",
            gap: "12px",
          }}
        >
          <Textbox
            ref={firstInputRef}
            name="name_tag"
            placeholder={"Create a new label"}
            value={inputValue.name_tag}
            autoComplete="off"
            onChange={onChangeValue}
          />
          <Colorbox
            placeholder="Select background color..."
            name={"background_color"}
            value={inputValue.background_color}
            onChange={onChangeValue}
          />
          <Colorbox
            placeholder="Select text color..."
            name={"text_color"}
            value={inputValue.text_color}
            onChange={onChangeValue}
          />
          <Colorbox
            placeholder="Select circle color..."
            name={"circle_color"}
            value={inputValue.circle_color}
            onChange={onChangeValue}
          />
          <Badge
            textColor={inputValue.text_color}
            backgroundColor={inputValue.background_color}
            circleColor={inputValue.circle_color}
            caption={inputValue.name_tag}
            withCircle
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              onClick={async () => {
                const inputSearchEvent = {
                  target: {
                    name: "search",
                    value: inputValue.name_tag,
                  },
                } as ChangeEvent<HTMLInputElement>;
                await onChangeValue(inputSearchEvent);
                await closeForm();
              }}
              size="sm"
              buttonStyle={{
                fontSize: "12px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleNewTagClicked}
              size="sm"
              variant="primary"
              buttonStyle={{
                fontSize: "12px",
              }}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    );

    return (
      <Chips
        inputValue={inputValue.search}
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
        selectedOptions={inputValue.selectedOptions}
        options={BADGE_OPTIONS as BadgeProps[]}
        missingOptionForm={MissingOptionForm}
        creatable
      />
    );
  },
};

const Divider = styled.div`
  width: 100%;
  height: 1px;
  border-bottom: 1px solid #d1d5db;
`;
