import { Meta, StoryObj } from "@storybook/react";
import { NavTab, NavTabContentProps } from "./nav-tab";
import { Textbox } from "./textbox";
import { useState } from "react";
import { StatefulOnChangeType } from "./stateful-form";
import { Button } from "./button";

const meta: Meta<typeof NavTab> = {
  title: "Stage/NavTab",
  component: NavTab,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof NavTab>;

export const Default: Story = {
  render: () => {
    const WriteTabContent = () => {
      const [value, setValue] = useState({
        write: "",
      });

      const onChangeValue = (e?: StatefulOnChangeType) => {
        if (e && "target" in e) {
          const { name, value } = e.target;
          setValue((prev) => ({ ...prev, [name]: value }));
        }
      };
      return (
        <div
          style={{
            padding: "0.5rem",
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button>Submit</Button>
          </div>
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div
          style={{
            padding: "0.5rem",
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

    const TABS_ITEMS = [
      { id: "1", title: "Write", content: <WriteTabContent /> },
      { id: "2", title: "Review", content: <ReviewTabContent /> },
    ];

    return <NavTab tabs={TABS_ITEMS} activeTab={"2"} />;
  },
};

export const Link: Story = {
  render: () => {
    const WriteTabContent = () => {
      const [value, setValue] = useState({
        write: "",
      });

      const onChangeValue = (e?: StatefulOnChangeType) => {
        if (e && "target" in e) {
          const { name, value } = e.target;
          setValue((prev) => ({ ...prev, [name]: value }));
        }
      };
      return (
        <div
          style={{
            padding: "0.5rem",
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
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button>Submit</Button>
          </div>
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div
          style={{
            padding: "0.5rem",
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

    const TABS_ITEMS: NavTabContentProps[] = [
      {
        id: "write",
        title: "Write",
        content: <WriteTabContent />,
        href: "/test",
      },
      {
        id: "review",
        title: "Review",
        content: <ReviewTabContent />,
        href: "/test123",
      },
    ];

    return <NavTab tabs={TABS_ITEMS} activeTab={"review"} mode="link" />;
  },
};
