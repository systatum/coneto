import { Meta, StoryObj } from "@storybook/react";
import { Stepline, SteplineItemProps } from "./stepline";
import { useState } from "react";

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
    const [active, setActive] = useState(10);

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
        line: "dash",
      },
      {
        title: "Final Interview",
        subtitle: ["Discussion with the team lead"],
        line: "dash",
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
            {...data}
            onClick={() => setActive(index)}
            active={active === index}
            key={index}
          />
        ))}
      </Stepline>
    );
  },
};
