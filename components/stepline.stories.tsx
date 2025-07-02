import { Meta, StoryObj } from "@storybook/react/*";
import { Stepline } from "./stepline";

const meta: Meta<typeof Stepline> = {
  title: "Controls/Stepline",
  component: Stepline,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Stepline>;

export const Default: Story = {
  render: () => {
    const STEPLINE_ITEMS = [
      {
        title: "Application Submitted",
        subtitle: ["Your application has been received"],
        completed: true,
      },
      {
        title: "Initial Screening",
        subtitle: ["Resume and profile review"],
        completed: true,
      },
      {
        title: "Technical Interview",
        subtitle: ["Assessment of technical skills"],
        completed: true,
      },
      {
        title: "Final Interview",
        subtitle: ["Discussion with the team lead"],
      },
      {
        title: "Offer Sent",
        subtitle: ["Waiting for your confirmation"],
      },
    ];

    return (
      <Stepline>
        {STEPLINE_ITEMS.map((data, index) => (
          <Stepline.Item
            title={data.title}
            subtitle={data.subtitle}
            completed={data.completed}
            key={index}
          />
        ))}
      </Stepline>
    );
  },
};
