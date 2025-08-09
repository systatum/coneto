import { Meta, StoryObj } from "@storybook/react";
import { Keynote } from "./keynote";

const meta: Meta<typeof Keynote> = {
  title: "Content/Keynote",
  component: Keynote,
  tags: ["autodocs"],
  argTypes: {
    data: {
      control: "object",
      description: "The source object whose keys and values will be rendered.",
    },
    keys: {
      control: false,
      description: "Array of keys to display from the `data` object.",
    },
    keyLabels: {
      control: false,
      description: "Display labels corresponding to each key.",
    },
    renderer: {
      control: false,
      description:
        "Custom renderers for specific keys. Example: `{ amount: val => <b>{val}</b> }`",
    },
    children: {
      control: false,
      description:
        "Optional children (used if no data/keys/keyLabels are provided).",
    },
    style: {
      control: false,
      description: "Optional styled-components style override for wrapper.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Keynote>;

export const Default: Story = {
  render: () => {
    const data = {
      modelType: "MXQ83700F3",
      requestCreatedBy: "adam@systatum.com",
      lastSynced: "2025-06-20",
      createdOn: "2025-06-19",
      desc: "Backup unit installed on site",
    };

    return (
      <Keynote
        data={data}
        keys={[
          "modelType",
          "requestCreatedBy",
          "lastSynced",
          "createdOn",
          "desc",
        ]}
        keyLabels={[
          "Model Type",
          "Request Created By",
          "Last Synced",
          "Created On",
          "Description",
        ]}
      />
    );
  },
};

export const CustomRendering: Story = {
  render: () => {
    const data = {
      modelType: "MXQ83700F3",
      requestCreatedBy: "alim@systatum.com",
      lastSynced: "2025-06-20",
      createdOn: "2025-06-19",
      desc: "Backup unit installed on site",
    };

    return (
      <Keynote
        data={data}
        keys={[
          "modelType",
          "requestCreatedBy",
          "lastSynced",
          "createdOn",
          "desc",
        ]}
        keyLabels={[
          "Model Type",
          "Request Created By",
          "Last Synced",
          "Created On",
          "Description",
        ]}
        renderer={{
          requestCreatedBy: (value) => (
            <div
              onClick={() => console.log("Email was sent")}
              style={{
                fontWeight: 500,
                cursor: "pointer",
                color: "#3b82f6",
              }}
            >
              {value}
            </div>
          ),
        }}
      />
    );
  },
};
