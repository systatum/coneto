import { useArgs } from "@storybook/preview-api";
import type { Args, Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./dialog";
import { Button } from "./button";
import { expect, userEvent, within } from "@storybook/test";

const meta: Meta = {
  title: "Stage/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    open: { control: "boolean" },
    hideClose: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj;

export const BasicDialog: Story = {
  args: {
    open: false,
  },
  argTypes: {
    open: { control: "boolean" },
  },
  render: () => {
    const [{ open }, updateArgs] = useArgs();
    return (
      <Dialog
        open={open}
        onOpenChange={(newOpen) => updateArgs({ open: newOpen })}
      >
        <Dialog.Trigger asChild>
          <Button>Basic Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <div className="flex flex-col gap-4 items-start">
            <div className="flex flex-col gap-1 items-start">
              <Dialog.Title>Basic Dialog</Dialog.Title>
              <Dialog.Description>
                This is a basic dialog example.
              </Dialog.Description>
            </div>
            <p className="text-xs">This is the dialog content.</p>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole("button", {
      name: /Basic Dialog/i,
    });
    await userEvent.click(button);

    const dialog = await within(document.body);

    await expect(
      dialog.findByText(/This is the dialog content/i)
    ).resolves.toBeInTheDocument();
  },
};

export const DialogWithButton: Story = {
  args: {
    open: false,
  },
  argTypes: {
    open: { control: "boolean" },
  },
  render: () => {
    const [{ open }, updateArgs] = useArgs();

    return (
      <Dialog
        open={open}
        onOpenChange={(newOpen) => updateArgs({ open: newOpen })}
      >
        <Dialog.Trigger asChild>
          <Button>Dialog With Button</Button>
        </Dialog.Trigger>
        <Dialog.Content className="p-3">
          <div className="flex flex-col w-full gap-2 items-start">
            <div className="flex flex-col gap-1">
              <Dialog.Title>Dialog With Button</Dialog.Title>
              <Dialog.Description>
                Dialog with actions in the footer.
              </Dialog.Description>
            </div>
            <p className="text-xs py-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div className="flex flex-row justify-end w-full mt-4 gap-2">
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <Button variant="primary">Confirm</Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole("button", {
      name: /Dialog With Button/i,
    });
    await userEvent.click(button);

    const dialog = await within(document.body);

    await expect(
      dialog.findByText(/You can put any content here./i)
    ).resolves.toBeInTheDocument();
  },
};

export const HideCloseButton: Story = {
  args: {
    open: false,
    hideClose: true,
  },
  argTypes: {
    open: { control: "boolean" },
    hideClose: { control: "boolean" },
  },

  render: (args: Args) => {
    const [{ open }, updateArgs] = useArgs();
    return (
      <Dialog
        open={open}
        onOpenChange={(newOpen) => updateArgs({ open: newOpen })}
      >
        <Dialog.Trigger asChild>
          <Button>Dialog (HideClose)</Button>
        </Dialog.Trigger>
        <Dialog.Content hideClose={args.hideClose}>
          <div className="flex flex-col gap-2 items-start">
            <Dialog.Header>
              <Dialog.Title>Dialog (HideClose)</Dialog.Title>
            </Dialog.Header>
            <p className="text-xs">
              This dialog does not include the close button in the top corner.
            </p>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const button = await canvas.findByRole("button", {
      name: /Dialog \(Hideclose\)/i,
    });
    await userEvent.click(button);

    const dialog = await within(document.body);

    await expect(
      dialog.findByText(/does not include the close button/i)
    ).resolves.toBeInTheDocument();

    await expect(
      dialog.queryByRole("button", { name: /close/i })
    ).not.toBeInTheDocument();
  },
};
