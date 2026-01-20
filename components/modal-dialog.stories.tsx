import type { Meta, StoryObj } from "@storybook/react";
import { ModalDialog, ModalDialogProps } from "./modal-dialog";
import { Button } from "./button";
import { useArgs } from "@storybook/preview-api";
import { css } from "styled-components";

const meta: Meta<typeof ModalDialog> = {
  title: "Stage/ModalDialog",
  component: ModalDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Controls whether the modal dialog is visible.",
    },
    onVisibilityChange: {
      control: false,
      description:
        "Callback fired when the dialog open state changes. Used to open or close the modal.",
    },
    title: {
      control: "text",
      description: "Main title displayed at the top of the modal.",
    },
    subTitle: {
      control: "text",
      description: "Optional subtitle displayed below the main title.",
    },
    hasCloseButton: {
      control: "boolean",
      description:
        "Whether the close (×) button should be shown in the dialog header.",
    },
    buttons: {
      control: false,
      description: `
List of action buttons displayed in the modal footer.

Each button object supports:
- **id**: Unique identifier for the button
- **caption**: Button label
- **variant**: Button visual style (from \`ButtonVariants\`)
- **isLoading**: Shows loading spinner
- **disabled**: Disables the button
    `,
    },
    children: {
      control: false,
      description:
        "Content rendered inside the modal body. Can be any React node.",
    },
    onClick: {
      control: false,
      description: `Callback fired when any footer button is clicked. Receives the button id and a \`closeDialog\` helper.`,
    },
    styles: {
      control: false,
      description: `
Custom styles for the ModalDialog component. This object allows you to override styles for individual parts:

- **containerStyle**: Styles applied to the dialog container (width, border, padding, shadow, etc)
- **contentStyle**: Styles applied to the modal body content area

Each field accepts a \`CSSProp\` (styled-components compatible) and can be used to customize layout, spacing, colors, and visual appearance.
    `,
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalDialog>;

export const Default: Story = {
  args: {
    title: "Default Modal",
    subTitle: "This is a subtitle",
    hasCloseButton: true,
    isOpen: false,
    buttons: [
      {
        id: "confirm",
        caption: "Confirm",
        variant: "primary",
      },
      {
        id: "cancel",
        caption: "Cancel",
        variant: "default",
      },
    ],
    onClick: ({ closeDialog }) => {
      closeDialog();
    },
    children: (
      <div
        style={{
          fontSize: "0.875rem",
          color: "#374151",
        }}
      >
        Here is the content of the modal dialog.
      </div>
    ),
  },
  render: (args: ModalDialogProps) => {
    const [{ isOpen }, setUpdateArgs] = useArgs();

    return (
      <>
        <Button onClick={() => setUpdateArgs({ isOpen: true })}>
          Default Modal
        </Button>
        <ModalDialog
          {...args}
          isOpen={isOpen}
          onVisibilityChange={(isOpen) => setUpdateArgs({ isOpen })}
        />
      </>
    );
  },
};

export const NoCloseButton: Story = {
  args: {
    title: "No Close Button",
    subTitle: "Close icon hidden",
    hasCloseButton: false,
    isOpen: false,
    buttons: [
      {
        id: "ok",
        caption: "OK",
        variant: "danger",
      },
      {
        id: "cancel",
        caption: "Cancel",
        variant: "default",
      },
    ],
    onClick: ({ closeDialog }) => {
      closeDialog();
    },
    children: <p>Modal without the top-right close button.</p>,
  },
  render: (args: ModalDialogProps) => {
    const [{ isOpen }, setUpdateArgs] = useArgs();

    return (
      <>
        <Button onClick={() => setUpdateArgs({ isOpen: true })}>
          Default With HideClose
        </Button>
        <ModalDialog
          {...args}
          isOpen={isOpen}
          onVisibilityChange={(isOpen) => setUpdateArgs({ isOpen })}
        />
      </>
    );
  },
};
