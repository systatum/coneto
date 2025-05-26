import { Meta, StoryObj } from "@storybook/react";
import { RowData, Table } from "./table";
import { Toolbar } from "./toolbar";
import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { useState } from "react";

const meta: Meta<typeof Table> = {
  title: "Content/Table",
  component: Table,
  args: {},

  tags: ["autodocs"],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Table>;

const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

const sampleRows = Array.from({ length: 20 }, (_, i) => {
  const type = TYPES_DATA[i % TYPES_DATA.length];
  return <Table.Row key={i} content={[`Load Balancer ${i + 1}`, type]} />;
});

const rawRows = Array.from({ length: 20 }, (_, i) => ({
  name: `Load Balancer ${i + 1}`,
  type: TYPES_DATA[i % TYPES_DATA.length],
}));

export const TableDefault: Story = {
  render: () => {
    const columns = ["Name", "Type"];

    return (
      <Table classNameTableRow="max-h-[400px]" columns={columns}>
        {sampleRows}
      </Table>
    );
  },
};

export const TableSelectable: Story = {
  render: () => {
    const columns = ["Name", "Type"];

    const handleItemsSelected = (data: RowData[]) => {
      console.log("Selected rows:", data);
    };

    return (
      <Table selectable columns={columns} onItemsSelected={handleItemsSelected}>
        {sampleRows}
      </Table>
    );
  },
};

export const TableSelectableWithSorting: Story = {
  render: () => {
    const [rows, setRows] = useState(rawRows);
    const [isOpen, setIsOpen] = useState<boolean | null>(false);

    const handleSortAsc = () => {
      const sorted = [...rows].sort((a, b) => a.type.localeCompare(b.type));
      setRows(sorted);
    };

    const handleSortDesc = () => {
      const sorted = [...rows].sort((a, b) => b.type.localeCompare(a.type));
      setRows(sorted);
    };

    const originalRows = [...rawRows];

    const handleResetSort = () => {
      setRows(originalRows);
      setIsOpen(null);
    };

    const columns = ["Name", "Type"];
    const TIP_MENU_ACTION = [
      {
        caption: "Sort Ascending",
        icon: ArrowDown,
        iconColor: "gray",
        onClick: () => {
          handleSortAsc();
          setIsOpen(null);
        },
      },
      {
        caption: "Sort Descending",
        icon: ArrowUp,
        iconColor: "gray",
        onClick: () => {
          handleSortDesc();
          setIsOpen(null);
        },
      },
      {
        caption: "Reset Sorting",
        icon: RefreshCw,
        iconColor: "gray",
        onClick: handleResetSort,
      },
    ];

    const handleItemsSelected = (data: RowData[]) => {
      console.log("Selected rows:", data);
    };

    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-xl font-mono">
          Data Load Balancer 2025
        </h3>
        <Toolbar className="w-fit">
          <Toolbar.Menu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            className="min-w-[235px]"
            onClick={() => {
              console.log("good for click");
              alert("Your button clickked!");
            }}
            caption="Sorted by"
            iconColor="red"
            subMenuList={TIP_MENU_ACTION}
          />
        </Toolbar>

        <Table
          selectable
          columns={columns}
          onItemsSelected={handleItemsSelected}
        >
          {rows?.map((data, index) => (
            <Table.Row key={index} content={[data.name, data.type]} />
          ))}
        </Table>
      </div>
    );
  },
};

export const TableWithLoading: Story = {
  render: () => {
    const columns = ["Name", "Type"];

    const handleItemsSelected = (data: RowData[]) => {
      console.log("Selected rows:", data);
    };

    return (
      <Table
        isLoading={true}
        selectable
        columns={columns}
        onItemsSelected={handleItemsSelected}
      >
        {sampleRows}
      </Table>
    );
  },
};
