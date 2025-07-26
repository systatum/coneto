import type { Meta, StoryObj } from "@storybook/react";
import { ModalDialog, ModalDialogProps } from "./modal-dialog";
import { Button } from "./button";
import { useArgs } from "@storybook/preview-api";

const meta: Meta<typeof ModalDialog> = {
  title: "Stage/ModalDialog",
  component: ModalDialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ModalDialog>;

export const Default: Story = {
  args: {
    title: "Default Modal",
    subTitle: "This is a subtitle",
    hasCloseButton: true,
    open: false,
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
      <div className="text-sm text-gray-700">
        Here is the content of the modal dialog.
      </div>
    ),
  },
  render: (args: ModalDialogProps) => {
    const [{ open }, setUpdateArgs] = useArgs();

    return (
      <>
        <Button onClick={() => setUpdateArgs({ open: true })}>
          Default Modal
        </Button>
        <ModalDialog
          {...args}
          open={open}
          onOpenChange={(open) => setUpdateArgs({ open })}
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
    open: false,
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
    const [{ open }, setUpdateArgs] = useArgs();

    return (
      <>
        <Button onClick={() => setUpdateArgs({ open: true })}>
          Default With HideClose
        </Button>
        <ModalDialog
          {...args}
          open={open}
          onOpenChange={(open) => setUpdateArgs({ open })}
        />
      </>
    );
  },
};
