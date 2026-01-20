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
      },
      {
        caption: "Alim Naufal",
        icon: RiUserStarLine,
      },
      {
        caption: "Michael Chen",
        icon: RiUserLine,
      },
      {
        caption: "Ayu Pratama",
        icon: RiUserHeartLine,
      },
      {
        caption: "Daniel Rodriguez",
        icon: RiUserVoiceLine,
      },
      {
        caption: "Rina Sari",
        icon: RiUserSettingsLine,
      },
      {
        caption: "Tom Williams",
        icon: RiUserSharedLine,
      },
      {
        caption: "Nabila Zahra",
        icon: RiUserSearchLine,
      },
      {
        caption: "Kevin Park",
        icon: RiUserAddLine,
      },
    ];

    const [{ value }, setUpdateArgs] = useArgs();
    const [people] = useState(PEOPLE_MENU);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setUpdateArgs({ value: e.target.value });
      args.onChange?.(e);
    };

    const filteredContent = useMemo(() => {
      const search = args.value.toLowerCase();
      return people
        .filter((props) => props.caption.toLowerCase().includes(search))
        .map((props) => ({
          ...props,
          onClick: () => setUpdateArgs({ ...args, value: props.caption }),
        }));
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
