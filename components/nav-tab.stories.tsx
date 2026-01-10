import { Meta, StoryObj } from "@storybook/react";
import { NavTab, NavTabContentProps } from "./nav-tab";
import { Textbox } from "./textbox";
import { useState } from "react";
import { StatefulOnChangeType } from "./stateful-form";
import { Button } from "./button";
import {
  RiAddBoxLine,
  RiAtLine,
  RiCharacterRecognitionLine,
  RiSearchLine,
  RiTable2,
} from "@remixicon/react";
import { ColumnTableProps, Table } from "./table";
import { css } from "styled-components";

const meta: Meta<typeof NavTab> = {
  title: "Stage/NavTab",
  component: NavTab,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  excludeStories: ["WriteTabContent", "ReviewTabContent"],
};

export default meta;

type Story = StoryObj<typeof NavTab>;

export const Default: Story = {
  render: () => {
    const TABS_ITEMS: NavTabContentProps[] = [
      {
        id: "1",
        title: "Write",
        content: <WriteTabContent />,
        onClick: () => {
          console.log("test tab 1");
        },
      },
      {
        id: "2",
        title: "Review",
        content: <ReviewTabContent />,
        onClick: () => {
          console.log("test tab 2");
        },
      },
    ];

    return <NavTab tabs={TABS_ITEMS} activeTab={"2"} />;
  },
};

export const WithActions: Story = {
  render: () => {
    const TABS_ITEMS: NavTabContentProps[] = [
      {
        id: "1",
        title: "Write",
        content: <WriteTabContent />,
        onClick: () => {
          console.log("test tab 1");
        },
        actions: [
          {
            caption: "Discover",
            onClick: () => {
              console.log("Discover clicked");
            },
            icon: RiSearchLine,
          },
        ],
      },
      {
        id: "2",
        title: "Review",
        content: <ReviewTabContent />,
        onClick: () => {
          console.log("test tab 2");
        },
        actions: [
          {
            caption: "Discover",
            onClick: () => {
              console.log("Discover clicked");
            },
            icon: RiSearchLine,
          },
          {
            caption: "Mention",
            onClick: () => {
              console.log("Mention clicked");
            },
            icon: RiAtLine,
          },
        ],
      },
    ];

    return (
      <NavTab
        tabs={TABS_ITEMS}
        activeTab={"2"}
        actions={[
          {
            caption: "Add",
            icon: RiAddBoxLine,
            onClick: () => {
              console.log(`Add button was clicked`);
            },
          },
        ]}
      />
    );
  },
};

export const WriteTabContent = () => {
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada,
        nisl a tincidunt scelerisque, velit sapien sollicitudin arcu, nec
        faucibus sem justo vitae sapien.
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

export const WithSubItems: Story = {
  render: () => {
    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const sampleRows = Array.from({ length: 20 }, (_, i) => {
      const type = TYPES_DATA[i % TYPES_DATA.length];
      return (
        <Table.Row
          rowId={`${type}`}
          key={i}
          content={[`Load Balancer ${i + 1}`, type]}
        />
      );
    });

    const columns: ColumnTableProps[] = [
      {
        id: "name",
        caption: "Name",
        sortable: false,
      },
      {
        id: "type",
        caption: "Type",
        sortable: false,
      },
    ];

    const TABS_ITEMS: NavTabContentProps[] = [
      {
        id: "1",
        title: "Write",
        content: <WriteTabContent />,
        onClick: () => {
          console.log("test tab 1");
        },
      },
      {
        id: "2",
        title: "Review",
        content: <ReviewTabContent />,
        onClick: () => {
          console.log("test tab 2");
        },
        subItems: [
          {
            id: "2-1",
            icon: RiTable2,
            caption: "Table View",
            content: (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <h2
                  style={{
                    fontSize: "18px",
                  }}
                >
                  Table Content
                </h2>
                <Table
                  styles={{
                    tableRowContainerStyle: css`
                      max-height: 400px;
                    `,
                  }}
                  columns={columns}
                >
                  {sampleRows}
                </Table>
              </div>
            ),
          },
          {
            id: "2-2",
            icon: RiCharacterRecognitionLine,
            caption: "Chart",
            content: "This is chart content",
          },
        ],
      },
    ];

    return <NavTab tabs={TABS_ITEMS} activeTab={"2"} />;
  },
};

export const ReviewTabContent = () => {
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
        Vestibulum feugiat, libero a viverra consequat, lacus mi laoreet enim,
        at tristique velit quam a urna. Suspendisse potenti. In hac habitasse
        platea dictumst. Proin vel justo ac mauris laoreet sagittis.
      </p>
    </div>
  );
};
