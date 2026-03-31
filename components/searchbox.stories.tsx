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
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Searchbox** is a flexible search input component with optional result menu support and clear button.  

---

### ✨ Features
- 📝 **Controlled or uncontrolled input**
- ❌ **Clearable input**: Delete the current value with a click
- 📋 **Optional result menu**: Pass a render function for dropdown search results
- 🎨 **Custom styling** via \`styles\` prop
- ⌨️ **Keyboard & focus handling** supported
- ♿ **Accessible**: ARIA labels and roles included

---

### 📌 Usage

\`\`\`tsx
<Searchbox
  name="search"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  styles={{
    self: css\`border-color: #ccc;\`,
    containerStyle: css\`margin: 0 auto; width: 300px;\`,
    iconStyle: css\`color: blue;\`,
  }}
  showResultMenu={true}
  resultMenu={(props) => <div {...props}>Result Item</div>}
/>
\`\`\`
      `,
      },
    },
  },
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
        icon: { image: RiUserSmileLine },
      },
      {
        caption: "Alim Naufal",
        icon: { image: RiUserStarLine },
      },
      {
        caption: "Michael Chen",
        icon: { image: RiUserLine },
      },
      {
        caption: "Ayu Pratama",
        icon: { image: RiUserHeartLine },
      },
      {
        caption: "Daniel Rodriguez",
        icon: { image: RiUserVoiceLine },
      },
      {
        caption: "Rina Sari",
        icon: { image: RiUserSettingsLine },
      },
      {
        caption: "Tom Williams",
        icon: { image: RiUserSharedLine },
      },
      {
        caption: "Nabila Zahra",
        icon: { image: RiUserSearchLine },
      },
      {
        caption: "Kevin Park",
        icon: { image: RiUserAddLine },
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
