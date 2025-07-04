import { Meta, StoryObj } from "@storybook/react/*";
import { Stepline, SteplineItemProps } from "./stepline";

const meta: Meta<typeof Stepline> = {
  title: "Controls/Stepline",
  component: Stepline,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Stepline>;

export const Default: Story = {
  render: () => {
    return (
      <Stepline>
        {Array.from({ length: 5 }).map((_, index) => {
          return <Stepline.Item key={index} variant={"todo"} />;
        })}
      </Stepline>
    );
  },
};

export const Reversable: Story = {
  render: () => {
    const STEPLINE_ITEMS: SteplineItemProps[] = [
      {
        title: "Application Submitted",
        subtitle: ["Your application has been received"],
        variant: "completed",
      },
      {
        title: "Initial Screening",
        subtitle: ["Resume and profile review"],
        variant: "completed",
      },
      {
        title: "Technical Interview",
        subtitle: ["Assessment of technical skills"],
        variant: "error",
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
      <Stepline reversable>
        {STEPLINE_ITEMS.map((data, index) => (
          <Stepline.Item
            title={data.title}
            subtitle={data.subtitle}
            variant={data.variant}
            key={index}
          />
        ))}
      </Stepline>
    );
  },
};
