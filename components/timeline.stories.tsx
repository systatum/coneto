import { Meta, StoryObj } from "@storybook/react";
import { Timeline, TimelineItemProps } from "./timeline";
import { Separator } from "./separator";
import { css } from "styled-components";

const meta: Meta<typeof Timeline> = {
  title: "Controls/Timeline",
  component: Timeline,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
Timeline is a flexible component for displaying sequential events or steps in a vertical layout. 
It supports custom items (\`Timeline.Item\`), clickable states, variant-based colors, line styles, and full style overrides.

---

### ✨ Features
- 🏗 **Composable**: Each step is a \`Timeline.Item\` that can render title, subtitle, and optional sidenotes.
- 🎨 **Variants**: Item colors can reflect status such as 'todo', 'inProgress', 'done', etc.
- 👆 **Clickable items**: Enable \`isClickable\` to allow clicks on each timeline item.
- 🖌 **Styling flexibility**: Customize circles, text, lines, and containers via the \`styles\` prop.
- 🔗 **Line types**: Connectors can be 'solid', 'dash', or 'dot'.

---

### 🔧 Timeline Props
- \`children\` (ReactNode): Timeline.Item components to render.
- \`isClickable\` (boolean): Makes all timeline items clickable.

### 🔧 Timeline.Item Props
- \`title\` (string): Main title text of the step.
- \`subtitle\` (string): Secondary description or detail under the title.
- \`sidenote\` (ReactNode): Optional content displayed beside the item.
- \`variant\` (string): Status/variant of the item, affects colors. Options from \`TEXT_VARIANT_COLOR\`.
- \`styles\` (TimelineItemStylesProps): Customize styling for item sub-elements.
  - \`self\` – container wrapper
  - \`textWrapperStyle\` – wrapper for title & subtitle
  - \`titleStyle\` – title text
  - \`subtitleStyle\` – subtitle text
  - \`sidenoteStyle\` – sidenote container
- \`isClickable\` (boolean): Override for item-specific clickability.
- \`id\` (string | number): Optional ID for the item (defaults to index).
- \`onClick\` (function): Callback when the item is clicked.
- \`line\` ('solid' | 'dash' | 'dot'): Line style for the connector below the item circle.

---

### 📌 Usage

\`\`\`tsx
<Timeline isClickable>
  <Timeline.Item
    title="Step 1"
    subtitle="Initial setup"
    variant="todo"
    line="solid"
    onClick={() => console.log('Step 1 clicked')}
  />
  <Timeline.Item
    title="Step 2"
    subtitle="In progress"
    variant="inProgress"
    line="dash"
    sidenote={<span>Optional note</span>}
  />
  <Timeline.Item
    title="Step 3"
    subtitle="Completed"
    variant="done"
    line="dot"
  />
</Timeline>
\`\`\`

- Use \`isClickable\` on \`Timeline\` to make all items interactive.
- Use \`Timeline.Item\` for each step; customize title, subtitle, variant, line, and optional sidenotes.
- Styles can be overridden via the \`styles\` prop for full layout and color control.
      `,
      },
    },
  },
  argTypes: {
    children: {
      description: "Timeline.Item components to render inside the timeline.",
      control: { type: null },
      table: { type: { summary: "ReactNode" } },
    },
    isClickable: {
      control: "boolean",
      description:
        "Makes the timeline items clickable. When true, items show pointer cursor and respond to clicks.",
      defaultValue: false,
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  render: () => {
    const TIMELINE_ITEMS: TimelineItemProps[] = [
      {
        title: "Traveled to Japan",
        subtitle: (
          <span>
            - Visited Tokyo, Kyoto, and Osaka
            <br />- Tried authentic sushi and stayed in a ryokan
          </span>
        ),
        sidenote: <span style={{ fontSize: "14px" }}>Oct 2025</span>,
        variant: "todo",
        line: "dash",
      },
      {
        title: "Started Daily Meditation Habit",
        subtitle: (
          <span>Practicing mindfulness for 10 minutes every morning</span>
        ),

        sidenote: <span style={{ fontSize: "14px" }}>Jan 2023</span>,
        variant: "error",
        line: "dash",
      },
      {
        title: "Ran First Half Marathon",
        subtitle: <span>variant 21 km in under 2 hours</span>,
        sidenote: <span style={{ fontSize: "14px" }}>Sep 2022</span>,
        variant: "completed",
      },
      {
        title: "Adopted a Dog",
        subtitle: <span>Golden Retriever named Mochi</span>,
        sidenote: <span style={{ fontSize: "14px" }}>Jun 2022</span>,
        variant: "completed",
      },
    ];

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
    const TIMELINE_ITEMS: TimelineItemProps[] = [
      {
        title: "Traveled to Japan",
        subtitle: (
          <span>
            - Visited Tokyo, Kyoto, and Osaka
            <br />- Tried authentic sushi and stayed in a ryokan
          </span>
        ),
        onClick: () => {
          console.log("Traveled to Japan");
        },
        sidenote: <span style={{ fontSize: "14px" }}>Oct 2025</span>,
        variant: "todo",
        line: "dash",
      },
      {
        title: "Started Daily Meditation Habit",
        subtitle: "Practicing mindfulness for 10 minutes every morning",
        onClick: () => {
          console.log("Started Daily Meditation Habit");
        },
        sidenote: <span style={{ fontSize: "14px" }}>Jan 2023</span>,
        variant: "error",
        line: "dash",
      },
      {
        title: "Ran First Half Marathon",
        subtitle: "variant 21 km in under 2 hours",
        onClick: () => {
          console.log("Ran First Half Marathon");
        },
        sidenote: <span style={{ fontSize: "14px" }}>Sep 2022</span>,
        variant: "completed",
      },
      {
        title: "Adopted a Dog",
        subtitle: "Golden Retriever named Mochi",
        onClick: () => {
          console.log("Adopted a Dog");
        },
        sidenote: <span style={{ fontSize: "14px" }}>Jun 2022</span>,
        variant: "completed",
      },
    ];

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
        subtitle: (
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
          </div>
        ),
      },
      {
        title: "Alim Naufal | 2 weeks ago",
        subtitle: (
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
          </div>
        ),
      },
      {
        title: "HR Team | 1 week ago",
        subtitle: (
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
          </div>
        ),
      },
    ];

    return (
      <Timeline isClickable>
        {EMAIL_TIMELINE_ITEMS.map((data, index) => (
          <Timeline.Item
            styles={{
              self: css`
                padding: 1rem;
                border: 1px solid #d1d5db;
                border-radius: 0.125rem;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                margin-top: 0.5rem;
              `,
            }}
            {...data}
            key={index}
          />
        ))}
      </Timeline>
    );
  },
};
