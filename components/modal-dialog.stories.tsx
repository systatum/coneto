import type { Meta, StoryObj } from "@storybook/react";
import { ModalDialog, ModalDialogProps } from "./modal-dialog";
import { Button } from "./button";
import { useArgs } from "@storybook/preview-api";
import { Ri24HoursFill } from "@remixicon/react";
import { useState } from "react";
import { Textbox } from "./textbox";

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
      description:
        "Controls the visibility of the ModalDialog. This is a controlled prop and must be managed externally.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onVisibilityChange: {
      description:
        "Callback triggered when the visibility state changes. Usually used to control `isOpen` externally.",
      table: {
        type: { summary: "(isOpen?: boolean) => void" },
      },
    },
    closable: {
      control: "boolean",
      description:
        "Determines whether the ModalDialog can be closed via the Escape key, overlay click, or close button.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    title: {
      description: "Title content displayed in the ModalDialog header.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    subtitle: {
      description:
        "Subtitle content displayed below the title in the ModalDialog header.",
      table: {
        type: { summary: "ReactNode" },
      },
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
      description:
        "Optional custom content rendered inside the ModalDialog body section.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    styles: {
      description:
        "Custom style overrides for different ModalDialog sections (container, content, overlay, etc.).",
      table: {
        type: { summary: "ModalDialogStylesProps" },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ModalDialog>;

export const Default: Story = {
  args: {
    title: "Default Modal",
    closable: true,
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
    icon: {
      image: Ri24HoursFill,
    },
  },
  render: (args: ModalDialogProps) => {
    const [{ isOpen }, setUpdateArgs] = useArgs();

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Button onClick={() => setUpdateArgs({ isOpen: true })}>
          Default Modal
        </Button>

        <Button
          onClick={() => {
            ModalDialog.show(args);
          }}
        >
          Default modal with show()
        </Button>

        <ModalDialog
          {...args}
          isOpen={isOpen}
          onClosed={() => console.log("testted")}
          onVisibilityChange={(isOpen) => setUpdateArgs({ isOpen })}
        />
      </div>
    );
  },
};

export const WithSubtitle: Story = {
  args: {
    title: "Default Modal with Subtitle",
    subtitle:
      "Temper, ex minor ipsum ego sit nostrud nisi Romana temper officia et sic labore conditum amet ex quis proident est, Asianus lorem. Nummifer ipsum Republicae exercitation quis.",
    closable: true,
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
    icon: {
      image: Ri24HoursFill,
    },
  },
  render: (args: ModalDialogProps) => {
    const [{ isOpen }, setUpdateArgs] = useArgs();

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Button onClick={() => setUpdateArgs({ isOpen: true })}>
          Default Modal
        </Button>

        <Button
          onClick={() => {
            ModalDialog.show(args);
          }}
        >
          Default modal with show()
        </Button>

        <ModalDialog
          {...args}
          isOpen={isOpen}
          onVisibilityChange={(isOpen) => setUpdateArgs({ isOpen })}
        />
      </div>
    );
  },
};

export const NonEscapable: Story = {
  render: () => {
    const [{ isOpen }, setUpdateArgs] = useArgs();

    function ProductTextbox() {
      const [value, setValue] = useState("");

      return (
        <div>
          <Textbox value={value} onChange={(e) => setValue(e.target.value)} />
          <p>
            Pressing the Escape key or clicking the background overlay will not
            close this modal. Use the buttons or the close icon to dismiss it.
          </p>
        </div>
      );
    }

    const args: ModalDialogProps = {
      title: "Non Closable",
      subtitle: "This modal cannot be closed using the Escape key",
      buttons: [
        {
          id: "ok",
          caption: "OK",
          variant: "primary",
        },
        {
          id: "cancel",
          caption: "Cancel",
        },
      ],
      onClick: ({ closeDialog }) => {
        closeDialog();
      },
      closable: false,
      children: <ProductTextbox />,
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Button onClick={() => setUpdateArgs({ isOpen: true })}>
          Non closable Dialog
        </Button>

        <Button
          onClick={() => {
            ModalDialog.show(args);
          }}
        >
          Non closable Dialog with show()
        </Button>

        <ModalDialog
          {...args}
          isOpen={isOpen}
          onVisibilityChange={(isOpen) => setUpdateArgs({ isOpen })}
        />
      </div>
    );
  },
};
