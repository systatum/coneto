import { Meta, StoryObj } from "@storybook/react";
import { ChoiceGroup } from "./choice-group";
import { ChangeEvent, ComponentProps, useState } from "react";
import { Radio, RadioOption } from "./radio";
import { Checkbox } from "./checkbox";
import { useArgs } from "@storybook/preview-api";
import {
  RiAlignLeft,
  RiDatabase2Fill,
  RiChat3Fill,
  RiAtFill,
  RiUserFollowFill,
  RiNotificationOffFill,
  RiMusic2Fill,
  RiImage2Fill,
  RiVideoFill,
} from "@remixicon/react";
import styled from "styled-components";

const meta: Meta<typeof ChoiceGroup> = {
  title: "Content/ChoiceGroup",
  component: ChoiceGroup,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **ChoiceGroup** component is a wrapper for multiple selection inputs (like **Checkbox** or **Radio**) and ensures consistent layout, spacing, and styles. It can automatically detect if the children are radio buttons and switch to a row/grid layout.

---

### ✨ Features
- ✅ Supports checkboxe and radio components
- 🔹 Automatic layout detection: "button" mode renders radio buttons in a flat grid, otherwise render options/checkboxes vertically
- 🎨 Fully customizable styles via \`styles\` prop
- 🧩 Each child can still have individual styles

---

### ⚙️ Behavior
- Adds spacing and optional dividers between children
- Automatically sets \`highlightOnChecked\` for all children
- Radio buttons in "button" mode:
  - Display in a flat grid
  - Border applied to each button
- Checkbox as well as radio buttons (but not in "button mode") will be in vertical layout:
  - Full-width
  - Feature optional divider between each item

---

### 📌 Usage Guidelines
- Use for grouping related checkboxes or radio buttons in forms
- Use \`styles.containerStyle\` to adjust layout, width, or spacing
- Use \`styles.dividerStyle\` to override divider appearance
- Ideal for forms, selection cards, or segmented button groups
        `,
      },
    },
  },
  argTypes: {
    children: {
      control: "text",
      description:
        "The content inside the ChoiceGroup, usually `Radio` or `Checkbox` components.",
      table: { type: { summary: "ReactNode" } },
    },
    styles: {
      control: false,
      description: `
Custom styles for ChoiceGroup.

Available fields:

- **containerStyle** → Outer wrapper of the ChoiceGroup
- **dividerStyle** → Divider between each child (ignored for row/grid radio layout)

All fields accept \`CSSProp\`.
  `,
    },
  },
};

export default meta;

type ChoiceGroupProps = ComponentProps<typeof ChoiceGroup>;
type StoryRadio = StoryObj<
  ChoiceGroupProps & Partial<{ radioSelected?: string }>
>;
type StoryCheckbox = StoryObj<
  ChoiceGroupProps & Partial<{ valueSelected?: string[] }>
>;

export const WithRadio: StoryRadio = {
  argTypes: {
    radioSelected: {
      control: "radio",
    },
  },
  args: {
    radioSelected: "comments",
  },

  render: (args) => {
    const RADIO_OPTIONS: RadioOption[] = [
      {
        value: "comments",
        label: "Comments",
        description: "Get notified when someone posts a comment",
      },
      {
        value: "mentions",
        label: "Mentions",
        description: "Get notified when someone mentions you",
      },
      {
        value: "follows",
        label: "Follows",
        description: "Get notified when someone follows you",
      },
      {
        value: "none",
        label: "None",
        description: "Don't notify me",
      },
    ];

    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <ChoiceGroup>
        {RADIO_OPTIONS.map((option, index) => {
          return (
            <Radio
              key={index}
              name="radioSelected"
              value={option.value}
              label={option.label}
              description={option.description}
              checked={args.radioSelected === option.value}
              onChange={onChangeValue}
            />
          );
        })}
      </ChoiceGroup>
    );
  },
};

export const WithRadioAndIcon: StoryRadio = {
  argTypes: {
    radioSelected: {
      control: "radio",
    },
  },
  args: {
    radioSelected: "comments",
  },

  render: (args) => {
    const RADIO_OPTIONS: RadioOption[] = [
      {
        value: "comments",
        label: "Comments",
        description: "Get notified when someone posts a comment",
        icon: { image: RiChat3Fill },
      },
      {
        value: "mentions",
        label: "Mentions",
        description: "Get notified when someone mentions you",
        icon: { image: RiAtFill },
      },
      {
        value: "follows",
        label: "Follows",
        description: "Get notified when someone follows you",
        icon: { image: RiUserFollowFill },
      },
      {
        value: "none",
        label: "None",
        description: "Don't notify me",
        icon: { image: RiNotificationOffFill },
      },
    ];

    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      setUpdateArgs({
        ...args,
        [name]: value,
      });
    };

    return (
      <ChoiceGroup>
        {RADIO_OPTIONS.map((option, index) => {
          return (
            <Radio
              key={index}
              name="radioSelected"
              value={option.value}
              label={option.label}
              icon={{
                image: option.icon.image as string,
              }}
              description={option.description}
              checked={args.radioSelected === option.value}
              onChange={onChangeValue}
            />
          );
        })}
      </ChoiceGroup>
    );
  },
};

export const WithRadioButton: StoryRadio = {
  render: () => {
    const [stateA, setStateA] = useState("text");
    const [stateB, setStateB] = useState("text");
    const [stateC, setStateC] = useState("text");

    console.log(stateA);

    const GROUP_A = "radio_group_a";
    const GROUP_B = "radio_group_b";
    const GROUP_C = "radio_group_c";

    const RADIO_OPTIONS_WITH_ICON: RadioOption[] = [
      {
        value: "text",
        label: "Text",
        icon: { image: RiAlignLeft },
      },
      {
        value: "database",
        label: "Database",
        icon: { image: RiDatabase2Fill },
      },
      {
        value: "music",
        label: "Music",
        icon: { image: RiMusic2Fill },
      },
      {
        value: "image",
        label: "Image",
        icon: { image: RiImage2Fill },
      },
      {
        value: "video",
        label: "Video",
        icon: { image: RiVideoFill },
      },
    ];

    const RADIO_OPTIONS_WITH_IMAGE: RadioOption[] = [
      {
        value: "text",
        label: "Text",
        icon: { image: "https://picsum.photos/seed/text/64/64" },
      },
      {
        value: "database",
        label: "Database",
        icon: { image: "https://picsum.photos/seed/database/64/64" },
      },
      {
        value: "music",
        label: "Music",
        icon: { image: "https://picsum.photos/seed/music/64/64" },
      },
      {
        value: "image",
        label: "Image",
        icon: { image: "https://picsum.photos/seed/image/64/64" },
      },
      {
        value: "video",
        label: "Video",
        icon: { image: "https://picsum.photos/seed/video/64/64" },
      },
    ];

    return (
      <Wrapper>
        <div
          style={{
            maxWidth: "400px",
            flexDirection: "column",
            display: "flex",
            gap: "4px",
            width: "100%",
          }}
        >
          <h2>Default</h2>
          <ChoiceGroup>
            {RADIO_OPTIONS_WITH_ICON.slice(0, 2).map((option, index) => {
              return (
                <Radio
                  mode="button"
                  key={index}
                  name={GROUP_A}
                  value={option.value}
                  label={option.label}
                  icon={{
                    image: option.icon.image as string,
                  }}
                  checked={stateA === option.value}
                  onChange={(e) => setStateA(e.target.value)}
                />
              );
            })}
          </ChoiceGroup>
        </div>
        <div
          style={{
            maxWidth: "600px",
            flexDirection: "column",
            display: "flex",
            gap: "4px",
            width: "100%",
          }}
        >
          <h2>Space constrained</h2>
          <ChoiceGroup>
            {RADIO_OPTIONS_WITH_ICON.map((option, index) => {
              return (
                <Radio
                  mode="button"
                  key={index}
                  name={GROUP_B}
                  value={option.value}
                  label={option.label}
                  icon={{
                    image: option.icon.image as string,
                  }}
                  checked={stateB === option.value}
                  onChange={(e) => setStateB(e.target.value)}
                />
              );
            })}
          </ChoiceGroup>
        </div>
        <div
          style={{
            maxWidth: "600px",
            flexDirection: "column",
            display: "flex",
            gap: "4px",
            width: "100%",
          }}
        >
          <h2>With Image</h2>
          <ChoiceGroup>
            {RADIO_OPTIONS_WITH_IMAGE.map((option, index) => {
              return (
                <Radio
                  mode="button"
                  key={index}
                  name={GROUP_C}
                  value={option.value}
                  label={option.label}
                  icon={{
                    image: option.icon.image as string,
                  }}
                  checked={stateC === option.value}
                  onChange={(e) => setStateC(e.target.value)}
                />
              );
            })}
          </ChoiceGroup>
        </div>
      </Wrapper>
    );
  },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const WithCheckbox: StoryCheckbox = {
  args: {
    valueSelected: [],
  },
  render: () => {
    interface CheckboxOption {
      value: string;
      label: string;
      description: string;
    }

    const CHECKBOX_OPTIONS: CheckboxOption[] = [
      {
        value: "email",
        label: "Email",
        description: "Receive updates via email",
      },
      {
        value: "push",
        label: "Push Notifications",
        description: "Receive updates via push notifications",
      },
      {
        value: "sms",
        label: "SMS",
        description: "Receive updates via text messages",
      },
    ];

    const [selected, setSelected] = useState([]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setSelected((prev) =>
        prev.includes(value)
          ? prev.filter((val) => val !== value)
          : [...prev, value]
      );
    };

    return (
      <ChoiceGroup>
        {CHECKBOX_OPTIONS.map((option, index) => (
          <Checkbox
            key={index}
            value={option.value}
            description={option.description}
            name={option.label}
            label={option.label}
            checked={selected.some((item) => item === option.value)}
            onChange={onChangeValue}
          />
        ))}
      </ChoiceGroup>
    );
  },
};
