import { Meta, StoryObj } from "@storybook/react";
import { Crumb } from "./crumb";

const meta: Meta<typeof Crumb> = {
  title: "Stage/Crumbs",
  component: Crumb,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Crumb>;

export const Default: Story = {
  render: () => {
    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
    ];

    return (
      <Crumb className="text-sm" maxShown={3}>
        {CRUMB_ITEMS.map((data, index) => (
          <Crumb.Item path={data.path} key={index}>
            {data.label}
          </Crumb.Item>
        ))}
      </Crumb>
    );
  },
};
