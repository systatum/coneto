import { Meta, StoryObj } from "@storybook/react";
import { CapsuleTab } from "./capsule-tab";
import { Button } from "./button";
import Textbox from "./textbox";
import { ChangeEvent, useState } from "react";
import { expect, userEvent, waitFor, within } from "@storybook/test";

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
        <div className="p-2 text-sm flex flex-col gap-2">
          <h3 className="font-medium">Write Tab</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            malesuada, nisl a tincidunt scelerisque, velit sapien sollicitudin
            arcu, nec faucibus sem justo vitae sapien.
          </p>

          <Textbox
            rows={4}
            name="write"
            value={value.write}
            onChange={onChangeValue}
          />
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div className="p-2 text-sm flex flex-col gap-2">
          <h3 className="font-medium">Review Tab</h3>
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

    const TABS_ITEMS = [
      { id: 1, title: "Write", content: <WriteTabContent /> },
      { id: 2, title: "Review", content: <ReviewTabContent /> },
    ];

    return (
      <div className="flex flex-col gap-1 w-full">
        <CapsuleTab tabs={TABS_ITEMS} activeTab={2} />
        <div className="flex flex-row w-full justify-end gap-1">
          <Button>Close</Button>
          <Button disabled variant="primary">
            Comment
          </Button>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("Review Tab")).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("tab", { name: /Write/i }));

    await waitFor(() =>
      expect(canvas.getByText("Write Tab")).toBeInTheDocument()
    );

    const textarea = canvas.getByRole("textbox");
    await userEvent.type(textarea, "This is a test comment");

    await expect(textarea).toHaveValue("This is a test comment");
  },
};
