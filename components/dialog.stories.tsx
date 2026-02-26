import { useArgs } from "@storybook/preview-api";
import type { Args, Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./dialog";
import { Button } from "./button";
import { RiErrorWarningFill, RiInboxArchiveFill } from "@remixicon/react";

const meta: Meta<typeof Dialog> = {
  title: "Stage/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description:
        "Controls the visibility of the Dialog. This is a controlled prop and must be managed externally.",
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
        "Determines whether the Dialog can be closed via the Escape key, overlay click, or close button.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "true" },
      },
    },
    title: {
      description: "Title content displayed in the Dialog header.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    subtitle: {
      description:
        "Subtitle content displayed below the title in the Dialog header.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    icon: {
      description:
        "Optional icon displayed above the title. Accepts FigureProps (image, color, size, styles).",
      table: {
        type: { summary: "FigureProps" },
      },
    },
    buttons: {
      description:
        "Array of action buttons rendered in the footer. Each button supports `id`, `caption`, `variant`, `isLoading`, and `disabled`.",
      table: {
        type: { summary: "DialogButtonProps[]" },
      },
    },
    onClick: {
      description:
        "Callback triggered when a footer button is clicked. Receives `{ id, closeDialog }`.",
      table: {
        type: {
          summary: "(args: { id: string; closeDialog: () => void }) => void",
        },
      },
    },
    children: {
      description:
        "Optional custom content rendered inside the Dialog body section.",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    styles: {
      description:
        "Custom style overrides for different Dialog sections (container, header, title, subtitle, footer, overlay, etc.).",
      table: {
        type: { summary: "DialogStylesProps" },
      },
    },
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
      <>
        <Dialog
          isOpen={isOpen}
          onVisibilityChange={(newOpen) => updateArgs({ isOpen: newOpen })}
          title="Archive Project"
          subtitle="The project will be moved to the archive section and will no longer appear in your active projects list."
          icon={{ image: RiInboxArchiveFill, color: "#2563eb" }}
          onClick={({ closeDialog }) => closeDialog()}
          buttons={[
            { id: "cancel", caption: "Cancel" },
            { id: "archive", caption: "Archive", variant: "primary" },
          ]}
        />
        <Button onClick={() => updateArgs({ isOpen: !isOpen })}>Toggle</Button>
      </>
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
      <>
        <Dialog
          isOpen={isOpen}
          onVisibilityChange={(newOpen) => updateArgs({ isOpen: newOpen })}
          title="Delete Project"
          closable={false}
          onClick={({ closeDialog }) => closeDialog()}
          subtitle="Youre going to delete the demo project. Are you sure?"
          icon={{ image: RiErrorWarningFill, color: "#ce375d" }}
          buttons={[
            {
              id: "no",
              caption: "No",
            },
            {
              id: "delete",
              caption: "Yes, Delete!",
              variant: "danger",
            },
          ]}
        />
        <Button onClick={() => updateArgs({ isOpen: !isOpen })}>Toggle</Button>
      </>
    );
  },
};
