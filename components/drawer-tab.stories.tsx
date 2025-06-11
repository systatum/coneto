import { Meta, StoryObj } from "@storybook/react/*";
import DrawerTab from "./drawer-tab";
import Textbox from "./textbox";
import { ChangeEvent, useState } from "react";
import { RiListCheck, RiNodeTree } from "@remixicon/react";

const meta: Meta<typeof DrawerTab> = {
  title: "Stage/Drawer Tab",
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
        <div className="text-sm flex flex-col gap-2">
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
        <div className="text-sm flex flex-col gap-2">
          <h3 className="">Review Tab</h3>
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
export const LeftPosition: Story = {
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
        <div className="text-sm flex flex-col gap-2">
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
        <div className="text-sm flex flex-col gap-2">
          <h3 className="">Review Tab</h3>
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
