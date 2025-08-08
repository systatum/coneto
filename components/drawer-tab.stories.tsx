import { Meta, StoryObj } from "@storybook/react";
import { DrawerTab } from "./drawer-tab";
import { Textbox } from "./textbox";
import { ChangeEvent, useState } from "react";
import { RiListCheck, RiNodeTree } from "@remixicon/react";

const meta: Meta<typeof DrawerTab> = {
  title: "Stage/DrawerTab",
  component: DrawerTab,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof DrawerTab>;

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
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Write Tab</h3>
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
        <div
          style={{
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Review Tab</h3>
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

    const tabs = [
      {
        id: 1,
        title: "File Attributes",
        icon: RiListCheck,
        content: <WriteTabContent />,
      },
      {
        id: 2,
        title: "Page Structure",
        icon: RiNodeTree,
        content: <ReviewTabContent />,
      },
    ];

    return <DrawerTab position="left" tabs={tabs} />;
  },
};

export const FixedRight: Story = {
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
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Write Tab</h3>
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
        <div
          style={{
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Review Tab</h3>
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
    const tabs = [
      {
        id: 1,
        title: "File Attributes",
        icon: RiListCheck,
        content: <WriteTabContent />,
      },
      {
        id: 2,
        title: "Page Structure",
        icon: RiNodeTree,
        content: <ReviewTabContent />,
      },
    ];

    return <DrawerTab tabs={tabs} />;
  },
};
