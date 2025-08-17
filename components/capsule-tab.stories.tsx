import { Meta, StoryObj } from "@storybook/react";
import { CapsuleTab, CapsuleTabContentProps } from "./capsule-tab";
import { Button } from "./button";
import { ChangeEvent, useState } from "react";
import { Textbox } from "./textbox";

const meta: Meta<typeof CapsuleTab> = {
  title: "Stage/CapsuleTab",
  component: CapsuleTab,
  tags: ["autodocs"],
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
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            malesuada, nisl a tincidunt scelerisque, velit sapien sollicitudin
            arcu, nec faucibus sem justo vitae sapien.
          </p>

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
      { id: 1, title: "Write", content: <WriteTabContent /> },
      { id: 2, title: "Review", content: <ReviewTabContent /> },
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
        <CapsuleTab tabs={TABS_ITEMS} activeTab={2} />
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
