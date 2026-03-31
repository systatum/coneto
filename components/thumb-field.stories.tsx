import { Meta, StoryObj } from "@storybook/react";
import { ThumbField } from "./thumb-field";
import { useArgs } from "@storybook/preview-api";
import { ChangeEvent } from "react";
import { css } from "styled-components";

const meta: Meta<typeof ThumbField> = {
  title: "Input Elements/ThumbField",
  component: ThumbField,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
ThumbField is a thumbs-up / thumbs-down input component designed for feedback, rating, or like/dislike functionality.

---

### ✨ Features
- 👍 **Thumb selection**: Users can select either "up" or "down" or leave blank.
- 🖌 **Custom colors**: Configure active thumbs colors via \`thumbsUpBackgroundColor\` and \`thumbsDownBackgroundColor\`.
- ⚠️ **Error state**: Shows an error icon when \`showError\` is true.
- 🛠 **Custom styling**: Style the triggers and wrapper via \`styles\`.
- 🔒 **Disabled support**: Disable user interaction with \`disabled\`.
- 📦 **Form integration**: Works with \`StatefulForm\` and hidden input for form submission.

---

### 📌 Usage

\`\`\`tsx
<ThumbField
  label="Do you like this feature?"
  value={null}
  thumbsUpBackgroundColor="#4CAF50"
  thumbsDownBackgroundColor="#F44336"
  onChange={(e) => console.log("Selected value:", e.target.value)}
  showError={false}
/>
\`\`\`

- Use \`value\` and \`onChange\` to control the field programmatically.
- Customize active thumb colors via \`thumbsUpBackgroundColor\` and \`thumbsDownBackgroundColor\`.
- Set \`disabled\` to prevent interactions.
- Wrap in \`FieldLane\` for label, helper, and error message support.
        `,
      },
    },
  },
  argTypes: {
    value: {
      control: {
        type: "select",
        options: [true, false, null],
      },
      description:
        "Current value: true = thumbs up, false = thumbs down, null = blank.",
    },
    onChange: {
      action: "changed",
      description: "Callback fired when value changes.",
    },
    thumbsUpBackgroundColor: {
      control: "color",
      description: "Color for active thumbs-up state.",
    },
    thumbsDownBackgroundColor: {
      control: "color",
      description: "Color for active thumbs-down state.",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input and prevents changes.",
    },
    name: { control: "text", description: "Input name for form submission." },
    id: {
      control: "text",
      description: "Optional ID, auto-generated if not provided.",
    },
    showError: { control: "boolean", description: "Displays the error icon." },
    styles: {
      control: false,
      description: "Custom styles for triggers and wrapper.",
    },
    label: { control: "text", description: "Optional label for the field." },
    helper: {
      control: "text",
      description: "Helper text displayed below the field.",
    },
    errorMessage: {
      control: "text",
      description: "Error message displayed below the field.",
    },
    required: {
      control: "boolean",
      description: "Marks the field as required.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ThumbField>;

export const Default: Story = {
  args: {
    value: null,
    name: "value",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...args, [name]: value });
    };

    return <ThumbField {...args} onChange={onChangeValue} />;
  },
};

export const WithLabel: Story = {
  args: {
    label: "Would you recommend this employer?",
    value: null,
    name: "value",
    styles: {
      labelStyle: css`
        font-size: 14px;
        font-family: monospace;
      `,
    },
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUpdateArgs({ ...args, [name]: value });
    };

    return <ThumbField {...args} onChange={onChangeValue} />;
  },
};

export const WithError: Story = {
  args: {
    label: "How would you rate this employee’s performance?",
    value: null,
    name: "value",
    styles: {
      labelStyle: css`
        font-size: 14px;
        font-weight: 500;
      `,
    },
    showError: true,
    errorMessage: "This field is required",
  },
  render: (args) => {
    const [, setUpdateArgs] = useArgs();

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      const isValidValue = value !== null;
      setUpdateArgs({
        value: value,
        showError: !isValidValue,
        errorMessage: isValidValue ? "" : "This field is required",
      });
    };

    return <ThumbField {...args} onChange={onChangeValue} />;
  },
};
