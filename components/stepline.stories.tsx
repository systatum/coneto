import { Meta, StoryObj } from "@storybook/react";
import { Stepline, SteplineItemProps } from "./stepline";
import { useState } from "react";
import { userEvent, within } from "@storybook/test";

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
    const [active, setActive] = useState(4);

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
            {...data}
            onClick={() => setActive(index)}
            active={active === index}
            key={index}
          />
        ))}
      </Stepline>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const allTitles = [
      "Application Submitted",
      "Initial Screening",
      "Technical Interview",
      "Final Interview",
      "Offer Sent",
    ];

    for (const title of allTitles) {
      const step = await canvas.findByText(title);
      await userEvent.click(step);
    }
  },
};
