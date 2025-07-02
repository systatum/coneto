import { Meta, StoryObj } from "@storybook/react";
import { Timeline } from "./timeline";

const meta: Meta<typeof Timeline> = {
  title: "Controls/Timeline",
  component: Timeline,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => {
    const TIMELINE_ITEMS = [
      {
        title: "Traveled to Japan",
        subtitle: [
          "- Visited Tokyo, Kyoto, and Osaka",
          "- Tried authentic sushi and stayed in a ryokan",
        ],
        sidenote: [<span className="text-sm text-gray-700">Oct 2025</span>],
      },
      {
        title: "Started Daily Meditation Habit",
        subtitle: ["- Practicing mindfulness for 10 minutes every morning"],
        sidenote: [<span className="text-sm text-gray-700">Jan 2023</span>],
        completed: true,
      },
      {
        title: "Ran First Half Marathon",
        subtitle: ["- Completed 21 km in under 2 hours"],
        sidenote: [<span className="text-sm text-gray-700">Sep 2022</span>],
        completed: true,
      },
      {
        title: "Adopted a Dog",
        subtitle: ["- Golden Retriever named Mochi"],
        sidenote: [<span className="text-sm text-gray-700">Jun 2022</span>],
        completed: true,
      },
    ];

    return (
      <Timeline>
        {TIMELINE_ITEMS.map((data, index) => (
          <Timeline.Item
            title={data.title}
            subtitle={data.subtitle}
            sidenote={data.sidenote}
            completed={data.completed}
            key={index}
          />
        ))}
      </Timeline>
    );
  },
};
