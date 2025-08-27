import { Meta, StoryObj } from "@storybook/react";
import { Crumb } from "./crumb";

const meta: Meta<typeof Crumb> = {
  title: "Controls/Crumb",
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
      <Crumb fontSize={14} maxShown={3}>
        {CRUMB_ITEMS.map((data, index) => (
          <Crumb.Item path={data.path} key={index}>
            {data.label}
          </Crumb.Item>
        ))}
      </Crumb>
    );
  },
};

export const Custom: Story = {
  render: () => {
    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
      { label: "Item 6", path: "/item6" },
    ];

    return (
      <Crumb
        fontSize={16}
        maxShown={4}
        arrowColor="#A78BFA"
        hoverColor="#EC4899"
        textColor="#6B7280"
        lastTextColor="#1E293B"
      >
        {CRUMB_ITEMS.map((data, index) => (
          <Crumb.Item path={data.path} key={index}>
            {data.label}
          </Crumb.Item>
        ))}
      </Crumb>
    );
  },
};

export const OneData: Story = {
  render: () => {
    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
      { label: "Item 6", path: "/item6" },
    ];

    return (
      <Crumb fontSize={14} maxShown={1}>
        {CRUMB_ITEMS.map((data, index) => (
          <Crumb.Item path={data.path} key={index}>
            {data.label}
          </Crumb.Item>
        ))}
      </Crumb>
    );
  },
};
