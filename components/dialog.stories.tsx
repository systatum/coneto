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
    isOpen: { control: "boolean" },
    closable: { control: "boolean" },
  },
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    isOpen: false,
  },
  argTypes: {
    isOpen: { control: "boolean" },
  },
  render: () => {
    const [{ isOpen }, updateArgs] = useArgs();
    return (
      <Dialog
        isOpen={isOpen}
        onVisibilityChange={(newOpen) => updateArgs({ isOpen: newOpen })}
      >
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Custom Dialog</Dialog.Title>
            <Dialog.Description>This is dialog customize</Dialog.Description>
          </Dialog.Header>
          <p
            style={{
              paddingTop: "16px",
              fontSize: 14,
            }}
          >
            This is the dialog body.
          </p>
          <Dialog.Footer style={{ marginTop: "20px" }}>
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
    isOpen: false,
  },
  argTypes: {
    isOpen: { control: "boolean" },
  },
  render: () => {
    const [{ isOpen }, updateArgs] = useArgs();

    return (
      <Dialog
        isOpen={isOpen}
        onVisibilityChange={(newOpen) => updateArgs({ isOpen: newOpen })}
      >
        <Dialog.Trigger>
          <Button>Dialog With Button</Button>
        </Dialog.Trigger>
        <Dialog.Content
          styles={{
            self: css`
              max-width: 400px;
            `,
          }}
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

export const ClosableButton: Story = {
  args: {
    isOpen: false,
    closable: true,
  },
  argTypes: {
    isOpen: { control: "boolean" },
    closable: { control: "boolean" },
  },

  render: (args: Args) => {
    const [{ isOpen }, updateArgs] = useArgs();
    return (
      <Dialog
        isOpen={isOpen}
        onVisibilityChange={(newOpen) => updateArgs({ isOpen: newOpen })}
      >
        <Dialog.Trigger>
          <Button>Dialog (closable)</Button>
        </Dialog.Trigger>
        <Dialog.Content
          closable={args.closable}
          styles={{
            self: css`
              max-width: 500px;
            `,
          }}
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
              <Dialog.Title>Dialog (Closable)</Dialog.Title>
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

export const NonEscapable: Story = {
  args: {
    isOpen: false,
  },
  render: (args: Args) => {
    const [{ isOpen }, updateArgs] = useArgs();

    return (
      <Dialog
        isOpen={isOpen}
        onVisibilityChange={(newOpen) => updateArgs({ isOpen: newOpen })}
        escapable={false}
      >
        <Dialog.Trigger>
          <Button>Open Non-Escapable Dialog</Button>
        </Dialog.Trigger>

        <Dialog.Content
          closable={args.closable}
          styles={{
            self: css`
              max-width: 500px;
            `,
          }}
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
              <Dialog.Title>Non-Escapable Dialog</Dialog.Title>
            </Dialog.Header>

            <p
              style={{
                fontSize: "12px",
                color: "#374151",
              }}
            >
              This dialog cannot be closed by pressing the Escape key or
              clicking the background overlay. If the close button is hidden,
              use the provided action buttons to dismiss the dialog.
            </p>
          </div>
        </Dialog.Content>
      </Dialog>
    );
  },
};
