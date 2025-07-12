import { Meta, StoryObj } from "@storybook/react";
import { Keynote } from "./keynote";
import { userEvent, within } from "@storybook/test";

const meta: Meta<typeof Keynote> = {
  title: "Content/Keynote",
  component: Keynote,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Keynote>;

export const Default: Story = {
  render: () => {
    const data = {
      modelType: "MXQ83700F3",
      requestCreatedBy: "jane@doe@email.com",
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

export const WithRendered: Story = {
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
              onClick={() => alert("Email was sent")}
              className="font-medium cursor-pointer text-blue-500"
            >
              {value}
            </div>
          ),
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const emailElement = await canvas.findByText("alim@systatum.com");
    await userEvent.click(emailElement);
  },
};
