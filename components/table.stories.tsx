import { Meta, StoryObj } from "@storybook/react";
import { RowData, Table } from "./table";

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
