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

export const TableDefault: Story = {
  render: () => {
    const columns = ["Name", "Type"];

    return (
      <Table columns={columns}>
        <Table.Row content={["Load Balancer 3", "HTTP"]} />
        <Table.Row content={["Load Balancer 1", "HTTP"]} />
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
        <Table.Row content={["Load Balancer 3", "HTTP"]} />
        <Table.Row content={["Load Balancer 1", "HTTP"]} />
        <Table.Row content={["Load Balancer 2", "HTTP"]} />
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
        <Table.Row content={["Load Balancer 3", "HTTP"]} />
        <Table.Row content={["Load Balancer 1", "HTTP"]} />
        <Table.Row content={["Load Balancer 2", "HTTP"]} />
      </Table>
    );
  },
};
