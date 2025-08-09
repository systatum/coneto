import { Meta, StoryObj } from "@storybook/react";
import { Timeline, TimelineItemProps } from "./timeline";
import { Separator } from "./separator";
import { css } from "styled-components";

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
        sidenote: [<span style={{ fontSize: "14px" }}>Oct 2025</span>],
        variant: "todo",
      },
      {
        title: "Started Daily Meditation Habit",
        subtitle: ["Practicing mindfulness for 10 minutes every morning"],
        sidenote: [<span style={{ fontSize: "14px" }}>Jan 2023</span>],
        variant: "error",
      },
      {
        title: "Ran First Half Marathon",
        subtitle: ["variant 21 km in under 2 hours"],
        sidenote: [<span style={{ fontSize: "14px" }}>Sep 2022</span>],
        variant: "completed",
      },
      {
        title: "Adopted a Dog",
        subtitle: ["Golden Retriever named Mochi"],
        sidenote: [<span style={{ fontSize: "14px" }}>Jun 2022</span>],
        variant: "completed",
      },
    ];

    const TIMELINE_ITEMS = [...RAW_TIMELINE_ITEMS].reverse();

    return (
      <Timeline>
        {TIMELINE_ITEMS.map((data, index) => (
          <Timeline.Item {...data} key={index} />
        ))}
      </Timeline>
    );
  },
};

export const Clickable: Story = {
  render: () => {
    const RAW_TIMELINE_ITEMS: TimelineItemProps[] = [
      {
        title: "Traveled to Japan",
        subtitle: [
          "- Visited Tokyo, Kyoto, and Osaka",
          "- Tried authentic sushi and stayed in a ryokan",
        ],
        sidenote: [<span style={{ fontSize: "14px" }}>Oct 2025</span>],
        variant: "todo",
      },
      {
        title: "Started Daily Meditation Habit",
        subtitle: ["Practicing mindfulness for 10 minutes every morning"],
        sidenote: [<span style={{ fontSize: "14px" }}>Jan 2023</span>],
        variant: "error",
      },
      {
        title: "Ran First Half Marathon",
        subtitle: ["variant 21 km in under 2 hours"],
        sidenote: [<span style={{ fontSize: "14px" }}>Sep 2022</span>],
        variant: "completed",
      },
      {
        title: "Adopted a Dog",
        subtitle: ["Golden Retriever named Mochi"],
        sidenote: [<span style={{ fontSize: "14px" }}>Jun 2022</span>],
        variant: "completed",
      },
    ];

    const TIMELINE_ITEMS = [...RAW_TIMELINE_ITEMS].reverse();

    return (
      <Timeline isClickable>
        {TIMELINE_ITEMS.map((data, index) => (
          <Timeline.Item {...data} key={index} />
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "#1f2937",
              }}
            >
              to hr@systatum.com
            </span>
            <Separator title="Jun 5, 2025" textFloat="right" depth="10px" />
            <span
              style={{
                fontWeight: 500,
                color: "#111827",
              }}
            >
              Application for Frontend Engineer
            </span>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#374151",
                paddingRight: "120px",
              }}
            >
              Hi, I'm applying for the Frontend Engineer position. I've attached
              my resume and portfolio.
            </div>
          </div>,
        ],
      },
      {
        title: "HR Team | 5 weeks ago",
        subtitle: [
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "#1f2937",
              }}
            >
              to alim@systatum.com
            </span>
            <Separator title="Jun 6, 2025" textFloat="right" depth="10px" />
            <span
              style={{
                fontWeight: 500,
                color: "#111827",
              }}
            >
              Re: Application for Frontend Engineer
            </span>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#374151",
                paddingRight: "120px",
              }}
            >
              Thank you for applying, Alim. We'd like to invite you for an
              initial HR interview.
            </div>
          </div>,
        ],
      },
      {
        title: "Adam Hakarsa | 3 weeks ago",
        subtitle: [
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "#1f2937",
              }}
            >
              to alim@systatum.com
            </span>
            <Separator title="Jun 14, 2025" textFloat="right" depth="10px" />
            <span
              style={{
                fontWeight: 500,
                color: "#111827",
              }}
            >
              Re: Technical Interview Invitation
            </span>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#374151",
                paddingRight: "120px",
              }}
            >
              We'd like to invite you to a technical interview this Friday. The
              test will involve React and component architecture.
            </div>
          </div>,
        ],
      },
      {
        title: "HR Team | 2 weeks ago",
        subtitle: [
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "#1f2937",
              }}
            >
              to alim@systatum.com
            </span>
            <Separator title="Jun 24, 2025" textFloat="right" depth="10px" />
            <span
              style={{
                fontWeight: 500,
                color: "#111827",
              }}
            >
              Re: Frontend Engineer Offer
            </span>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#374151",
                paddingRight: "140px",
              }}
            >
              We’re excited to offer you the Frontend Engineer position. Please
              review the offer letter attached.
            </div>
          </div>,
        ],
      },
      {
        title: "Alim Naufal | 2 weeks ago",
        subtitle: [
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "#1f2937",
              }}
            >
              to hr@systatum.com
            </span>
            <Separator title="Jun 25, 2025" textFloat="right" depth="10px" />
            <span
              style={{
                fontWeight: 500,
                color: "#111827",
              }}
            >
              Re: Frontend Engineer Offer — Confirmation
            </span>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#374151",
                paddingRight: "120px",
              }}
            >
              Thank you for the offer. I'm happy to accept the Frontend Engineer
              position. Looking forward to joining the team!
            </div>
          </div>,
        ],
      },
      {
        title: "HR Team | 1 week ago",
        subtitle: [
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                color: "#1f2937",
              }}
            >
              to alim@systatum.com
            </span>
            <Separator title="Jun 27, 2025" textFloat="right" depth="10px" />
            <span
              style={{
                fontWeight: 500,
                color: "#111827",
              }}
            >
              Onboarding Details
            </span>
            <div
              style={{
                fontSize: "0.875rem",
                color: "#374151",
                paddingRight: "120px",
              }}
            >
              Here are the onboarding instructions. Please follow the steps and
              reach out if you have any questions.
            </div>
          </div>,
        ],
      },
    ];

    return (
      <Timeline isClickable>
        {EMAIL_TIMELINE_ITEMS.map((data, index) => (
          <Timeline.Item
            containerStyle={css`
              padding: 1rem;
              border: 1px solid #d1d5db;
              border-radius: 0.125rem;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              margin-top: 0.5rem;
            `}
            {...data}
            key={index}
          />
        ))}
      </Timeline>
    );
  },
};
