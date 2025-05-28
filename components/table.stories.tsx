import { Meta, StoryObj } from "@storybook/react";
import { RowData, Table } from "./table";
import { useState } from "react";
import { TipMenuItemProps } from "./tip-menu";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiRefreshLine,
} from "@remixicon/react";

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
    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const sampleRows = Array.from({ length: 20 }, (_, i) => {
      const type = TYPES_DATA[i % TYPES_DATA.length];
      return <Table.Row key={i} content={[`Load Balancer ${i + 1}`, type]} />;
    });

    const columns = [
      {
        caption: "Name",
        sortable: false,
      },
      {
        caption: "Type",
        sortable: false,
      },
    ];

    return (
      <Table classNameTableRow="max-h-[400px]" columns={columns}>
        {sampleRows}
      </Table>
    );
  },
};

export const TableSelectable: Story = {
  render: () => {
    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const sampleRows = Array.from({ length: 20 }, (_, i) => {
      const type = TYPES_DATA[i % TYPES_DATA.length];
      return <Table.Row key={i} content={[`Load Balancer ${i + 1}`, type]} />;
    });

    const columns = [
      {
        caption: "Name",
        sortable: false,
      },
      {
        caption: "Type",
        sortable: false,
      },
    ];

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
    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const rawRows = Array.from({ length: 20 }, (_, i) => ({
      name: `Load Balancer ${i + 1}`,
      type: TYPES_DATA[i % TYPES_DATA.length],
    }));
    const [rows, setRows] = useState(rawRows);

    const handleSortingRequested = ({
      mode,
      column,
    }: {
      mode: "asc" | "desc" | "original";
      column: keyof (typeof rawRows)[0];
    }) => {
      if (mode === "original") {
        setRows([...rawRows]);
        return;
      }

      const sorted = [...rows].sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        return typeof aVal === "string" && typeof bVal === "string"
          ? mode === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
          : 0;
      });

      setRows(sorted);
    };

    const columns = [
      {
        caption: "Name",
        sortable: true,
      },
      {
        caption: "Type",
        sortable: true,
      },
    ];

    const TIP_MENU_ACTION = (columnCaption: string): TipMenuItemProps[] => {
      const column = columnCaption.toLowerCase() as keyof (typeof rawRows)[0];
      return [
        {
          caption: "Sort Ascending",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "asc", column });
          },
        },
        {
          caption: "Sort Descending",
          icon: RiArrowDownSLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "desc", column });
          },
        },
        {
          caption: "Reset Sorting",
          icon: RiRefreshLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "original", column });
          },
        },
      ];
    };

    const handleItemsSelected = (data: RowData[]) => {
      console.log("Selected rows:", data);
    };

    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-xl font-mono">
          Data Load Balancer 2025
        </h3>

        <Table
          selectable
          columns={columns}
          onItemsSelected={handleItemsSelected}
          subMenuList={TIP_MENU_ACTION}
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
    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const sampleRows = Array.from({ length: 20 }, (_, i) => {
      const type = TYPES_DATA[i % TYPES_DATA.length];
      return <Table.Row key={i} content={[`Load Balancer ${i + 1}`, type]} />;
    });
    const columns = [
      {
        caption: "Name",
        sortable: false,
      },
      {
        caption: "Type",
        sortable: false,
      },
    ];

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
