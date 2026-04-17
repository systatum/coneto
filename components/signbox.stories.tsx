import * as RemixIcons from "@remixicon/react";
import { useArgs } from "@storybook/preview-api";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { css } from "styled-components";
import { FieldLaneDropdownOption } from "./field-lane";
import { Signbox } from "./signbox";
import { StatefulOnChangeType } from "./stateful-form";

const meta: Meta<typeof Signbox> = {
  title: "Input Elements/Signbox",
  component: Signbox,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
**Signbox** is a component that allows users to draw their signature directly on a canvas.

---

### ✨ Features
- 🖊 **Draw signature**: Users can draw directly on a canvas.
- 🧹 **Clearable**: Optional clear button to reset the signature.
- 🖌 **Customizable style**: Control the canvas, border, and size through styles.
- ⚡ **Responsive**: Canvas auto-scales on window resize for high-DPI displays.
- 🔒 **Disabled mode**: Prevent drawing when needed.
- 💡 **Error state**: Visual feedback when the signature is required or invalid.
- 🧩 First-class **stateful form integration**

        `,
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
      description: "Base64 string representing the signature.",
    },
    onChange: {
      action: "changed",
      description: "Callback fired when signature changes.",
    },
    clearable: {
      control: "boolean",
      description: "Shows clear button if true.",
    },
    disabled: {
      control: "boolean",
      description: "Disables drawing and interactions.",
    },
    height: { control: "text", description: "Canvas height." },
    width: { control: "text", description: "Canvas width." },
    name: { control: "text", description: "Name of the input field." },
    showError: {
      control: "boolean",
      description: "Shows error border if true.",
    },
    errorMessage: { control: "text", description: "Error message to display." },
    helper: {
      control: "text",
      description: "Helper text displayed below the input.",
    },
    id: { control: "text", description: "HTML id for the canvas element." },
    styles: {
      control: false,
      description: "Custom styles for the canvas container.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Signbox>;

export const Default: Story = {
  render: (args) => {
    const [, setArgs] = useArgs();

    const onChangeForm = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { name, value } = e.target;

        setArgs({ ...args, [name]: value });
      }
    };

    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Signbox
          width="400px"
          height="200px"
          clearable
          value={args.value}
          label="Signature"
          name={"signature"}
          onChange={onChangeForm}
        />
      </div>
    );
  },
};

export const WithDropdown: Story = {
  render: () => {
    const [value, setValue] = useState({
      selectedText: "WFH",
      selectedOption: "2",
      value: "",
    });

    const ATTENDANCE_OPTIONS: FieldLaneDropdownOption[] = [
      {
        text: "On-site",
        value: "1",
        icon: { image: RemixIcons.RiHome2Line },
      },
      {
        text: "WFH",
        value: "2",
        icon: { image: RemixIcons.RiUser2Line },
      },
      {
        text: "Sick leave",
        value: "3",
        icon: { image: RemixIcons.RiSettings2Line },
      },
      {
        text: "Annual leave",
        value: "4",
        icon: { image: RemixIcons.RiLogoutBoxLine },
      },
    ];

    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Signbox
          clearable
          width="400px"
          height="150px"
          value={value.value}
          label="Signature"
          name="signature"
          onChange={(e) =>
            setValue((prev) => ({ ...prev, value: e.target.value }))
          }
          dropdowns={[
            {
              width: "150px",
              styles: {
                drawerStyle: css`
                  width: 300px;
                `,
              },
              caption: value.selectedText,
              options: ATTENDANCE_OPTIONS,
              onChange: (id) => {
                const selected = ATTENDANCE_OPTIONS.find(
                  (option) => option.value === id
                );
                if (selected) {
                  setValue((prev) => ({
                    ...prev,
                    selectedOption: id,
                    selectedText: selected.text,
                  }));
                }
              },
              withFilter: true,
            },
          ]}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    value: "",
    showError: true,
    errorMessage: "Signature is required",
    clearable: true,
  },
  render: (args) => {
    const [, setArgs] = useArgs();

    const onChangeForm = (e: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const { name, value } = e.target;

        setArgs({
          ...args,
          [name]: value,
          showError: !value,
          errorMessage: !value ? "Signature is required" : "",
        });
      }
    };

    return (
      <div
        style={{
          padding: 40,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          maxWidth: 500,
        }}
      >
        <Signbox
          {...args}
          label="Signature"
          name={"signature"}
          onChange={onChangeForm}
        />
      </div>
    );
  },
};
