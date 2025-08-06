import { useArgs } from "@storybook/preview-api";
import type { Args, Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./dialog";
import { Button } from "./button";
import { css } from "styled-components";

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

export const Default: Story = {
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
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Custom Dialog</Dialog.Title>
            <Dialog.Description>
              Fully styled with styled-components.
            </Dialog.Description>
          </Dialog.Header>
          <p
            style={{
              paddingTop: "16px",
              fontSize: 14,
            }}
          >
            This is the dialog body.
          </p>
          <Dialog.Footer>
            <Dialog.Close>
              <Button>Close</Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );
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
        <Dialog.Trigger>
          <Button>Dialog With Button</Button>
        </Dialog.Trigger>
        <Dialog.Content
          style={css`
            max-width: 400px;
          `}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: "0.5rem",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <Dialog.Title>Dialog With Button</Dialog.Title>
              <Dialog.Description>
                Dialog with actions in the footer.
              </Dialog.Description>
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                paddingTop: "1rem",
                paddingBottom: "1rem",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                width: "100%",
                marginTop: "1rem",
                gap: "0.5rem",
              }}
            >
              <Dialog.Close>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button variant="primary">Confirm</Button>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog>
    );
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
        <Dialog.Trigger>
          <Button>Dialog (HideClose)</Button>
        </Dialog.Trigger>
        <Dialog.Content
          hideClose={args.hideClose}
          style={css`
            max-width: 500px;
          `}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              alignItems: "start",
            }}
          >
            <Dialog.Header>
              <Dialog.Title>Dialog (HideClose)</Dialog.Title>
            </Dialog.Header>
            <p
              style={{
                fontSize: "12px",
              }}
            >
              This dialog does not include the close button in the top corner.
            </p>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  },
};
