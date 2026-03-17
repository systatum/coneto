import { Meta, StoryObj } from "@storybook/react";
import { CapsuleTab, CapsuleTabContentProps } from "./capsule-tab";
import { Button } from "./button";
import { ChangeEvent, useState } from "react";
import { Textbox } from "./textbox";
import { generateSentence } from "./../lib/text";

const meta: Meta<typeof CapsuleTab> = {
  title: "Stage/CapsuleTab",
  component: CapsuleTab,
  tags: ["autodocs"],
  argTypes: {
    tabs: {
      description:
        "List of tabs with id, title, and content to render inside the CapsuleTab layout.",
      control: false,
    },
    activeTab: {
      description:
        "ID of the initially active tab. Defaults to the first tab if not provided.",
      control: "text",
    },
    onTabChange: {
      description:
        "Callback triggered when the active tab changes. If provided, the parent component can control the active tab externally. If not provided, CapsuleTab manages the active tab internally.",
      control: false,
    },
    activeBackgroundColor: {
      description: "Background color of the active capsule indicator.",
      control: "color",
    },
    styles: {
      control: false,
      description: `
Custom styles for the CapsuleTab component. This object allows you to override styles for individual parts:

- **self**: Styles applied to the outer \`CapsuleTabWrapper\`. Useful for controlling borders, spacing, layout, shadows, or overall appearance.

- **contentStyle**: Styles applied to the \`ContentWrapper\` that contains the active tab content. You can control padding, layout direction, background, etc.

- **capsuleWrapperStyle**: Styles forwarded to the \`Capsule\` component's container wrapper. Useful for adjusting border radius, alignment, or capsule layout behavior.

- **tabStyle**: Styles applied to individual capsule tabs inside the \`Capsule\` component. You can control tab border radius, colors, padding, hover states, and visual appearance.

Each field accepts a \`CSSProp\` (styled-components compatible) and can be used to customize the layout and appearance of specific parts of the component.
`,
    },
  },
};

export default meta;

type Story = StoryObj<typeof CapsuleTab>;

export const Default: Story = {
  render: () => {
    const WriteTabContent = () => {
      const [value, setValue] = useState({
        write: "",
      });

      const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      };
      return (
        <div
          style={{
            padding: "0.8rem",
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3
            style={{
              fontWeight: 500,
            }}
          >
            Write Tab
          </h3>
          <p>{generateSentence()}</p>

          <Textbox name="write" value={value.write} onChange={onChangeValue} />
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div
          style={{
            padding: "0.8rem",
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3
            style={{
              fontWeight: 500,
            }}
          >
            Review Tab
          </h3>
          <p>
            This tab is meant to review the content that has been submitted. It
            includes multiple paragraphs to simulate a longer layout.
          </p>
          <p>
            Vestibulum feugiat, libero a viverra consequat, lacus mi laoreet
            enim, at tristique velit quam a urna. Suspendisse potenti. In hac
            habitasse platea dictumst. Proin vel justo ac mauris laoreet
            sagittis.
          </p>
        </div>
      );
    };

    const TABS_ITEMS: CapsuleTabContentProps[] = [
      {
        id: "1",
        title: "Write",
        content: <WriteTabContent key={"write-tab"} />,
      },
      {
        id: "2",
        title: "Review",
        content: <ReviewTabContent key={"review-tab"} />,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: "100%",
        }}
      >
        <CapsuleTab tabs={TABS_ITEMS} activeTab={"2"} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "4px",
            width: "100%",
            justifyContent: "end",
          }}
        >
          <Button>Close</Button>
          <Button disabled variant="primary">
            Comment
          </Button>
        </div>
      </div>
    );
  },
};
