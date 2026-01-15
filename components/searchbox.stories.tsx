import type { Meta, StoryObj } from "@storybook/react";
import { Searchbox, SearchboxResultMenuItemProps } from "./searchbox";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent, useMemo, useState } from "react";
import {
  RiUserLine,
  RiUserStarLine,
  RiUserSmileLine,
  RiUserHeartLine,
  RiUserVoiceLine,
  RiUserSettingsLine,
  RiUserSharedLine,
  RiUserSearchLine,
  RiUserAddLine,
  RiUserUnfollowLine,
} from "@remixicon/react";

const meta: Meta<typeof Searchbox> = {
  title: "Input Elements/Searchbox",
  component: Searchbox,
  argTypes: {
    name: {
      control: "text",
      description: "Name attribute for the input",
    },
    value: {
      control: "text",
      description: "Input value",
    },
    onChange: { action: "changed" },
    styles: {
      description: `
Custom styles for the Searchbox component. This object allows you to override styles for individual parts:

- **self**: Styles applied directly to the input element.
- **containerStyle**: Styles applied to the outer wrapper div.
- **iconStyle**: Styles applied to the search icon.

Each field accepts a \`CSSProp\` (styled-components compatible). Use it to adjust spacing, colors, or any CSS properties.
    `,
      control: false,
    },
  },
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Searchbox>;

export const Default: Story = {
  args: {
    name: "search",
    value: "",
    placeholder: "Search here...",
  },
  render: (args) => {
    const [{ value }, setUpdateArgs] = useArgs();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUpdateArgs({ value: e.target.value });
      args.onChange?.(e);
    };

    return <Searchbox {...args} value={value} onChange={handleChange} />;
  },
};

export const WithResultMenu: Story = {
  args: {
    name: "search",
    value: "",
    placeholder: "Search here...",
  },
  render: (args) => {
    const PEOPLE_MENU: SearchboxResultMenuItemProps[] = [
      {
        caption: "Adam Noto Hakarsa",
        icon: RiUserSmileLine,
        onClick: () => console.log("Clicked Adam"),
      },
      {
        caption: "Alim Naufal",
        icon: RiUserStarLine,
        onClick: () => console.log("Clicked Alim"),
      },
      {
        caption: "Michael Chen",
        icon: RiUserLine,
        onClick: () => console.log("Clicked Michael"),
      },
      {
        caption: "Ayu Pratama",
        icon: RiUserHeartLine,
        onClick: () => console.log("Clicked Ayu"),
      },
      {
        caption: "Daniel Rodriguez",
        icon: RiUserVoiceLine,
        onClick: () => console.log("Clicked Daniel"),
      },
      {
        caption: "Rina Sari",
        icon: RiUserSettingsLine,
        onClick: () => console.log("Clicked Rina"),
      },
      {
        caption: "Tom Williams",
        icon: RiUserSharedLine,
        onClick: () => console.log("Clicked Tom"),
      },
      {
        caption: "Nabila Zahra",
        icon: RiUserSearchLine,
        onClick: () => console.log("Clicked Nabila"),
      },
      {
        caption: "Kevin Park",
        icon: RiUserAddLine,
        onClick: () => console.log("Clicked Kevin"),
      },
      {
        caption: "Remove User",
        icon: RiUserUnfollowLine,
        isDangerous: true,
        onClick: () => console.log("Remove user"),
      },
    ];

    const [{ value }, setUpdateArgs] = useArgs();
    const [people, setPeople] = useState(PEOPLE_MENU);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUpdateArgs({ value: e.target.value });
      args.onChange?.(e);
    };

    const filteredContent = useMemo(() => {
      const search = args.value.toLowerCase();
      return people.filter((props) =>
        props.caption.toLowerCase().includes(search)
      );
    }, [args.value]);

    return (
      <Searchbox
        {...args}
        value={value}
        showResultMenu
        autoComplete="off"
        onChange={handleChange}
        resultMenu={({ list }) => list(filteredContent)}
      />
    );
  },
};
