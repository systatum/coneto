import { Meta, StoryObj } from "@storybook/react";
import { Timeline, TimelineItemProps } from "./timeline";
import Separator from "./separator";

const meta: Meta<typeof Timeline> = {
  title: "Controls/Timeline",
  component: Timeline,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => {
    const RAW_TIMELINE_ITEMS: TimelineItemProps[] = [
      {
        title: "Traveled to Japan",
        subtitle: [
          "- Visited Tokyo, Kyoto, and Osaka",
          "- Tried authentic sushi and stayed in a ryokan",
        ],
        sidenote: [<span className="text-sm text-gray-700">Oct 2025</span>],
        variant: "todo",
      },
      {
        title: "Started Daily Meditation Habit",
        subtitle: ["Practicing mindfulness for 10 minutes every morning"],
        sidenote: [<span className="text-sm text-gray-700">Jan 2023</span>],
        variant: "error",
      },
      {
        title: "Ran First Half Marathon",
        subtitle: ["variant 21 km in under 2 hours"],
        sidenote: [<span className="text-sm text-gray-700">Sep 2022</span>],
        variant: "completed",
      },
      {
        title: "Adopted a Dog",
        subtitle: ["Golden Retriever named Mochi"],
        sidenote: [<span className="text-sm text-gray-700">Jun 2022</span>],
        variant: "completed",
      },
    ];

    const TIMELINE_ITEMS = [...RAW_TIMELINE_ITEMS].reverse();

    return (
      <Timeline>
        {TIMELINE_ITEMS.map((data, index) => (
          <Timeline.Item
            title={data.title}
            subtitle={data.subtitle}
            sidenote={data.sidenote}
            variant={data.variant}
            key={index}
          />
        ))}
      </Timeline>
    );
  },
};

export const WithClickable: Story = {
  render: () => {
    const RAW_TIMELINE_ITEMS: TimelineItemProps[] = [
      {
        title: "Traveled to Japan",
        subtitle: [
          "- Visited Tokyo, Kyoto, and Osaka",
          "- Tried authentic sushi and stayed in a ryokan",
        ],
        sidenote: [<span className="text-sm text-gray-700">Oct 2025</span>],
        variant: "todo",
      },
      {
        title: "Started Daily Meditation Habit",
        subtitle: ["Practicing mindfulness for 10 minutes every morning"],
        sidenote: [<span className="text-sm text-gray-700">Jan 2023</span>],
        variant: "error",
      },
      {
        title: "Ran First Half Marathon",
        subtitle: ["variant 21 km in under 2 hours"],
        sidenote: [<span className="text-sm text-gray-700">Sep 2022</span>],
        variant: "completed",
      },
      {
        title: "Adopted a Dog",
        subtitle: ["Golden Retriever named Mochi"],
        sidenote: [<span className="text-sm text-gray-700">Jun 2022</span>],
        variant: "completed",
      },
    ];

    const TIMELINE_ITEMS = [...RAW_TIMELINE_ITEMS].reverse();

    return (
      <Timeline isClickable>
        {TIMELINE_ITEMS.map((data, index) => (
          <Timeline.Item
            title={data.title}
            subtitle={data.subtitle}
            sidenote={data.sidenote}
            variant={data.variant}
            key={index}
          />
        ))}
      </Timeline>
    );
  },
};

export const Custom: Story = {
  render: () => {
    const EMAIL_TIMELINE_ITEMS = [
      {
        title: "Alim Naufal | 5 weeks ago",
        subtitle: [
          <div className="flex flex-col gap-1 w-full">
            <h2 className="text-sm text-gray-800">to hr@systatum.com</h2>
            <Separator
              className="my-2"
              title="Jun 5, 2025"
              textFloat="right"
              depth="10px"
            />
            <span className="font-medium text-gray-900">
              Application for Frontend Engineer
            </span>
            <div className="text-sm text-gray-700 pr-[120px]">
              Hi, I'm applying for the Frontend Engineer position. I've attached
              my resume and portfolio.
            </div>
          </div>,
        ],
      },
      {
        title: "HR Team | 5 weeks ago",
        subtitle: [
          <div className="flex flex-col gap-1 w-full">
            <h2 className="text-sm text-gray-800">to alim@systatum.com</h2>
            <Separator
              className="my-2"
              title="Jun 6, 2025"
              textFloat="right"
              depth="10px"
            />
            <span className="font-medium text-gray-900">
              Re: Application for Frontend Engineer
            </span>
            <div className="text-sm text-gray-700 pr-[120px]">
              Thank you for applying, Alim. We'd like to invite you for an
              initial HR interview.
            </div>
          </div>,
        ],
      },
      {
        title: "Adam Hakarsa | 3 weeks ago",
        subtitle: [
          <div className="flex flex-col gap-1 w-full">
            <h2 className="text-sm text-gray-800">to alim@systatum.com</h2>
            <Separator
              className="my-2"
              title="Jun 14, 2025"
              textFloat="right"
              depth="10px"
            />
            <span className="font-medium text-gray-900">
              Re: Technical Interview Invitation
            </span>
            <div className="text-sm text-gray-700 pr-[120px]">
              We'd like to invite you to a technical interview this Friday. The
              test will involve React and component architecture.
            </div>
          </div>,
        ],
      },
      {
        title: "HR Team | 2 weeks ago",
        subtitle: [
          <div className="flex flex-col gap-1 w-full">
            <h2 className="text-sm text-gray-800">to alim@systatum.com</h2>
            <Separator
              className="my-2"
              title="Jun 24, 2025"
              textFloat="right"
              depth="10px"
            />
            <span className="font-medium text-gray-900">
              Re: Frontend Engineer Offer
            </span>
            <div className="text-sm text-gray-700 pr-[140px]">
              We’re excited to offer you the Frontend Engineer position. Please
              review the offer letter attached.
            </div>
          </div>,
        ],
      },
      {
        title: "Alim Naufal | 2 weeks ago",
        subtitle: [
          <div className="flex flex-col gap-1 w-full">
            <h2 className="text-sm text-gray-800">to hr@systatum.com</h2>
            <Separator
              className="my-2"
              title="Jun 25, 2025"
              textFloat="right"
              depth="10px"
            />
            <span className="font-medium text-gray-900">
              Re: Frontend Engineer Offer — Confirmation
            </span>
            <div className="text-sm text-gray-700 pr-[120px]">
              Thank you for the offer. I'm happy to accept the Frontend Engineer
              position. Looking forward to joining the team!
            </div>
          </div>,
        ],
      },
      {
        title: "HR Team | 1 week ago",
        subtitle: [
          <div className="flex flex-col gap-1 w-full">
            <h2 className="text-sm text-gray-800">to alim@systatum.com</h2>
            <Separator
              className="my-2"
              title="Jun 27, 2025"
              textFloat="right"
              depth="10px"
            />
            <span className="font-medium text-gray-900">
              Onboarding Details
            </span>
            <div className="text-sm text-gray-700 pr-[120px]">
              Here are the onboarding instructions. Please follow the steps and
              reach out if you have any questions.
            </div>
          </div>,
        ],
      },
    ];

    return (
      <Timeline>
        {EMAIL_TIMELINE_ITEMS.map((data, index) => (
          <Timeline.Item
            className="p-4 border rounded-xs border-gray-300 shadow-xs mt-2"
            title={data.title}
            subtitle={data.subtitle}
            key={index}
          />
        ))}
      </Timeline>
    );
  },
};
