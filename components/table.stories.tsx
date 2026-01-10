import { Meta, StoryObj } from "@storybook/react";
import {
  ColumnTableProps,
  SubMenuListTableProps,
  Table,
  TableActionsProps,
} from "./table";
import { useEffect, useMemo, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiClipboardFill,
  RiClipboardLine,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
  RiFileCopy2Line,
  RiRefreshLine,
} from "@remixicon/react";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";
import { css } from "styled-components";
import { CapsuleContentProps } from "./capsule";

const meta: Meta<typeof Table> = {
  title: "Content/Table",
  component: Table,
  tags: ["autodocs"],
  args: {
    selectable: false,
    searchable: false,
    draggable: false,
    isLoading: false,
    showPagination: false,
    columns: [],
    actions: [],
    emptySlate: "No data available.",
    disableNextPageButton: false,
    disablePreviousPageButton: false,
  },
  argTypes: {
    selectable: {
      description: "Enable row selection with checkboxes.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    searchable: {
      description: "Show search box in the table header.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
    draggable: {
      description: "Enable drag-and-drop reordering for rows.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
    isLoading: {
      description: "Show loading overlay on top of the table.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
    columns: {
      description: "Defines table columns.",
      control: false,
      table: {
        type: { summary: "ColumnTableProps[]" },
      },
    },
    actions: {
      description: "Action buttons shown in the header when rows are selected.",
      control: false,
      table: {
        type: { summary: "TableActionsProps[]" },
      },
    },
    onItemsSelected: {
      description: "Triggered when selected row IDs change.",
      action: "items-selected",
      table: {
        type: { summary: "(ids: string[]) => void" },
      },
    },
    children: {
      description:
        "Table rows (`Table.Row`) or grouped rows (`TableRow.Group`).",
      control: false,
      table: {
        type: { summary: "ReactNode" },
      },
    },
    subMenuList: {
      description: "Generate sorting menu per column (by column id).",
      control: false,
      table: {
        type: {
          summary: "(columnId: string) => SubMenuListTableProps[]",
        },
      },
    },
    emptySlate: {
      description: "Content shown when there are no rows.",
      control: "text",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    onLastRowReached: {
      description:
        "Called when the last row becomes visible (infinite scroll).",
      action: "last-row-reached",
      table: {
        type: { summary: "() => void" },
      },
    },
    showPagination: {
      description: "Enable pagination controls.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
    onNextPageRequested: {
      description: "Called when next page button is clicked.",
      action: "next-page",
      table: {
        type: { summary: "() => void" },
      },
    },
    onPreviousPageRequested: {
      description: "Called when previous page button is clicked.",
      action: "previous-page",
      table: {
        type: { summary: "() => void" },
      },
    },
    disableNextPageButton: {
      description: "Disable next page button.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
    disablePreviousPageButton: {
      description: "Disable previous page button.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
    labels: {
      description: "Custom labels for selected items text.",
      control: false,
      table: {
        type: { summary: "TableLabelsProps | null" },
      },
    },
    sumRow: {
      description: "Summary row displayed at the bottom of the table.",
      control: false,
      table: {
        type: { summary: "SummaryRowProps[]" },
      },
    },
    styles: {
      containerStyle: {
        description: "Custom styles for the table wrapper.",
        control: false,
        table: {
          type: { summary: "CSSProp" },
        },
      },
      tableRowContainerStyle: {
        description: "Custom styles for scrollable row container.",
        control: false,
        table: {
          type: { summary: "CSSProp" },
        },
      },
      paginationWrapperStyle: {
        description: "Custom styles for pagination wrapper.",
        control: false,
        table: {
          type: { summary: "CSSProp" },
        },
      },
      paginationNumberStyle: {
        description: "Custom styles for pagination number text.",
        control: false,
        table: {
          type: { summary: "CSSProp" },
        },
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
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

    return (
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
    );
  },
};

export const Appendable: Story = {
  render: () => {
    const columns: ColumnTableProps[] = [
      {
        id: "from",
        caption: "From",
        sortable: true,
        width: "40%",
      },
      {
        id: "content",
        caption: "Content",
        sortable: true,
        width: "60%",
      },
    ];

    const generate20RandomSender = () => {
      const names = [
        "adam.h",
        "alim.y",
        "zuma.l",
        "john.d",
        "emma.s",
        "mike.t",
        "nina.b",
        "ryan.k",
        "sara.w",
        "kevin.j",
      ];
      const domains = ["example.org", "mail.com", "test.net"];
      const senders = [];

      while (senders.length < 20) {
        const name = names[Math.floor(Math.random() * names.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const email = `${name}@${domain}`;
        if (!senders.includes(email)) senders.push(email);
      }

      return senders;
    };

    const generate20RandomSubject = () => {
      const subjects = [
        "Hello",
        "What's up",
        "Yo!",
        "Can we meet?",
        "Help please",
        "Project discussion",
        "Quick question",
        "Meeting reminder",
        "Check this out",
        "Weekend plan",
        "Catch up?",
        "Important update",
        "Heads up",
        "FYI",
        "Urgent task",
        "Proposal idea",
        "Follow-up",
        "Congrats!",
        "Welcome!",
        "Random thought",
      ];
      return subjects;
    };

    const generate20RandomLoremIpsum = () => {
      const baseText = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sodales dui nec ex commodo, nec volutpat quam viverra.",
        "Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Curabitur vitae nunc vel nisi egestas tempus. Sed feugiat sagittis orci, non iaculis justo fermentum ac.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec at orci non magna fermentum blandit.",
        "Integer ac malesuada nulla. Cras ac nisl vel lectus hendrerit cursus. Duis volutpat eros a metus pretium varius.",
      ];
      return baseText;
    };

    const generate20RandomEmails = ({ senders, subjects, contents }) => {
      const emails = [];
      for (let i = 0; i < 20; i++) {
        const from = senders[i % senders.length];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const content = contents[Math.floor(Math.random() * contents.length)];
        emails.push({
          from,
          subject,
          content,
        });
      }
      return emails;
    };

    const emails = generate20RandomEmails({
      senders: generate20RandomSender(),
      subjects: generate20RandomSubject(),
      contents: generate20RandomLoremIpsum(),
    });

    const [rows, setRows] = useState(emails);

    const handleSortingRequested = ({
      mode,
      column,
    }: {
      mode: "asc" | "desc" | "original";
      column: "from" | "content";
    }) => {
      if (mode === "original") {
        setRows([...emails]);
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

    const handleItemsSelected = (ids: string[]) => {
      console.log("Selected rows:", ids);
    };

    const TIP_MENU_ACTION = (
      columnCaption: "from" | "content"
    ): SubMenuListTableProps[] => {
      return [
        {
          caption: "Sort Ascending",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "asc", column: columnCaption });
          },
        },
        {
          caption: "Sort Descending",
          icon: RiArrowDownSLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "desc", column: columnCaption });
          },
        },
        {
          caption: "Reset Sorting",
          icon: RiRefreshLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "original", column: columnCaption });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): SubMenuListTableProps[] => {
      return [
        {
          caption: "Edit",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: RiDeleteBin2Fill,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was deleted`);
          },
        },
      ];
    };

    const handleFetchData = () => {
      const moreEmails = generate20RandomEmails({
        senders: generate20RandomSender(),
        subjects: generate20RandomSubject(),
        contents: generate20RandomLoremIpsum(),
      });
      setRows((prev) => [...prev, ...moreEmails]);
    };

    return (
      <Table
        selectable
        styles={{
          tableRowContainerStyle: css`
            max-height: 400px;
          `,
        }}
        labels={{ totalSelectedItemText: null }}
        columns={columns}
        onItemsSelected={handleItemsSelected}
        subMenuList={TIP_MENU_ACTION}
        onLastRowReached={handleFetchData}
      >
        {rows.map((rowValue, rowIndex) => (
          <Table.Row
            onClick={({ toggleCheckbox }) => {
              console.log(
                `Selected to this ${`${rowValue.from}-${rowValue.content}-${rowValue.subject}`}`
              );
              toggleCheckbox();
            }}
            key={rowIndex}
            rowId={`${rowValue.from}-${rowValue.content}-${rowValue.subject}`}
            actions={ROW_ACTION}
          >
            <Table.Row.Cell>{rowValue.from}</Table.Row.Cell>
            <Table.Row.Cell
              contentStyle={{
                display: "block",
              }}
            >
              <strong>{rowValue.subject}</strong> — {rowValue.content}
            </Table.Row.Cell>
          </Table.Row>
        ))}
      </Table>
    );
  },
};

export const WithOneAction: Story = {
  render: () => {
    const columns: ColumnTableProps[] = [
      {
        id: "from",
        caption: "From",
        sortable: true,
        width: "40%",
      },
      {
        id: "content",
        caption: "Content",
        sortable: true,
        width: "60%",
      },
    ];

    const generate20RandomSender = () => {
      const names = [
        "adam.h",
        "alim.y",
        "zuma.l",
        "john.d",
        "emma.s",
        "mike.t",
        "nina.b",
        "ryan.k",
        "sara.w",
        "kevin.j",
      ];
      const domains = ["example.org", "mail.com", "test.net"];
      const senders = [];

      while (senders.length < 20) {
        const name = names[Math.floor(Math.random() * names.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];
        const email = `${name}@${domain}`;
        if (!senders.includes(email)) senders.push(email);
      }

      return senders;
    };

    const generate20RandomSubject = () => {
      const subjects = [
        "Hello",
        "What's up",
        "Yo!",
        "Can we meet?",
        "Help please",
        "Project discussion",
        "Quick question",
        "Meeting reminder",
        "Check this out",
        "Weekend plan",
        "Catch up?",
        "Important update",
        "Heads up",
        "FYI",
        "Urgent task",
        "Proposal idea",
        "Follow-up",
        "Congrats!",
        "Welcome!",
        "Random thought",
      ];
      return subjects;
    };

    const generate20RandomLoremIpsum = () => {
      const baseText = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sodales dui nec ex commodo, nec volutpat quam viverra.",
        "Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        "Curabitur vitae nunc vel nisi egestas tempus. Sed feugiat sagittis orci, non iaculis justo fermentum ac.",
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec at orci non magna fermentum blandit.",
        "Integer ac malesuada nulla. Cras ac nisl vel lectus hendrerit cursus. Duis volutpat eros a metus pretium varius.",
      ];
      return baseText;
    };

    const generate20RandomEmails = ({ senders, subjects, contents }) => {
      const emails = [];
      for (let i = 0; i < 20; i++) {
        const from = senders[i % senders.length];
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const content = contents[Math.floor(Math.random() * contents.length)];
        emails.push({
          from,
          subject,
          content,
        });
      }
      return emails;
    };

    const emails = generate20RandomEmails({
      senders: generate20RandomSender(),
      subjects: generate20RandomSubject(),
      contents: generate20RandomLoremIpsum(),
    });

    const [rows, setRows] = useState(emails);

    const handleSortingRequested = ({
      mode,
      column,
    }: {
      mode: "asc" | "desc" | "original";
      column: "from" | "content";
    }) => {
      if (mode === "original") {
        setRows([...emails]);
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

    const handleItemsSelected = (ids: string[]) => {
      console.log("Selected rows:", ids);
    };

    const TIP_MENU_ACTION = (
      columnCaption: "from" | "content"
    ): SubMenuListTableProps[] => {
      return [
        {
          caption: "Sort Ascending",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "asc", column: columnCaption });
          },
        },
        {
          caption: "Sort Descending",
          icon: RiArrowDownSLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "desc", column: columnCaption });
          },
        },
        {
          caption: "Reset Sorting",
          icon: RiRefreshLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({ mode: "original", column: columnCaption });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): SubMenuListTableProps[] => {
      return [
        {
          caption: "Delete",
          icon: RiDeleteBin2Fill,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was deleted`);
          },
        },
      ];
    };

    const handleFetchData = () => {
      const moreEmails = generate20RandomEmails({
        senders: generate20RandomSender(),
        subjects: generate20RandomSubject(),
        contents: generate20RandomLoremIpsum(),
      });
      setRows((prev) => [...prev, ...moreEmails]);
    };

    return (
      <Table
        selectable
        styles={{
          tableRowContainerStyle: css`
            max-height: 400px;
          `,
        }}
        columns={columns}
        onItemsSelected={handleItemsSelected}
        subMenuList={TIP_MENU_ACTION}
        onLastRowReached={handleFetchData}
        labels={{ totalSelectedItemText: (n) => `${n} emails selected` }}
      >
        {rows.map((rowValue, rowIndex) => (
          <Table.Row
            onClick={({ toggleCheckbox }) => {
              console.log(
                `Selected to this ${`${rowValue.from}-${rowValue.content}-${rowValue.subject}`}`
              );
              toggleCheckbox();
            }}
            key={rowIndex}
            rowId={`${rowValue.from}-${rowValue.content}-${rowValue.subject}`}
            actions={ROW_ACTION}
          >
            <Table.Row.Cell>{rowValue.from}</Table.Row.Cell>
            <Table.Row.Cell
              contentStyle={{
                display: "block",
              }}
            >
              <strong>{rowValue.subject}</strong> — {rowValue.content}
            </Table.Row.Cell>
          </Table.Row>
        ))}
      </Table>
    );
  },
};

export const SortableWithPagination: Story = {
  render: () => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;
    const totalItems = 200;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const isDisabledPrev = page === 1;
    const isDisabledNext = page === totalPages;

    const handlePrevious = () => {
      if (!isDisabledPrev) {
        const newValue = page - 1;
        setPage(newValue);
      }
    };

    const handleNext = () => {
      if (!isDisabledNext) {
        const newValue = page + 1;
        setPage(newValue);
      }
    };

    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const rawRows = useMemo(
      () =>
        Array.from({ length: totalItems }, (_, i) => ({
          name: `Load Balancer ${i + 1}`,
          type: TYPES_DATA[i % TYPES_DATA.length],
        })),
      []
    );

    const [pagedRows, setPagedRows] = useState(() => {
      const start = 0;
      return rawRows.slice(start, start + itemsPerPage);
    });

    useEffect(() => {
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      setPagedRows(rawRows.slice(start, end));
    }, [page, rawRows]);

    const handleSortingRequested = ({
      mode,
      column,
    }: {
      mode: "asc" | "desc" | "original";
      column: keyof (typeof rawRows)[0];
    }) => {
      if (mode === "original") {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setPagedRows(rawRows.slice(start, end));
        return;
      }

      const sorted = [...pagedRows].sort((a, b) => {
        const aVal = a[column];
        const bVal = b[column];
        return typeof aVal === "string" && typeof bVal === "string"
          ? mode === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
          : 0;
      });

      setPagedRows(sorted);
    };

    const columns: ColumnTableProps[] = [
      {
        id: "name",
        caption: "Name",
        sortable: true,
      },
      {
        id: "type",
        caption: "Type",
        sortable: true,
      },
    ];

    const TIP_MENU_ACTION = (
      columnCaption: string
    ): SubMenuListTableProps[] => {
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

    const handleItemsSelected = (ids: string[]) => {
      setSelectedItems(ids);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3
          style={{
            fontWeight: 600,
            fontSize: "1.25rem",
            fontFamily: "monospace",
          }}
        >
          Data Load Balancer 2025
        </h3>

        <Table
          selectedItems={selectedItems}
          selectable
          showPagination
          columns={columns}
          onItemsSelected={handleItemsSelected}
          subMenuList={TIP_MENU_ACTION}
          labels={{ pageNumberText: page }}
          onPreviousPageRequested={handlePrevious}
          onNextPageRequested={handleNext}
          disableNextPageButton={isDisabledNext}
          disablePreviousPageButton={isDisabledPrev}
        >
          {pagedRows?.map((row, index) => (
            <Table.Row
              onClick={({ toggleCheckbox }) => {
                toggleCheckbox();
              }}
              key={index}
              rowId={`${row.name}-${row.type}`}
            >
              {[row.name, row.type].map((rowCell, i) => (
                <Table.Row.Cell
                  key={`${row.name}-${row.type}-${rowCell}`}
                  width={columns[i].width}
                >
                  {rowCell}
                </Table.Row.Cell>
              ))}
            </Table.Row>
          ))}
        </Table>
      </div>
    );
  },
};

export const WithLoading: Story = {
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

    const handleItemsSelected = (ids: string[]) => {
      console.log("Selected rows:", ids);
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

export const WithEmptySlate: Story = {
  render: () => {
    const emptyRows = [];

    const columns: ColumnTableProps[] = [
      {
        id: "name",
        caption: "Name",
      },
      {
        id: "type",
        caption: "Type",
      },
    ];

    const handleItemsSelected = (ids: string[]) => {
      console.log("Selected rows:", ids);
    };

    const TableEmptySlate = (
      <EmptySlate
        imageUrl="https://picsum.photos/200?random=1"
        title="Manage your inventory transfers"
        subtitle="Track and receive your incoming inventory from suppliers."
        actions={
          <>
            <Button
              variant="default"
              styles={{
                buttonStyle: {
                  fontSize: "12px",
                },
              }}
            >
              Add Item
            </Button>
            <Button
              variant="primary"
              styles={{
                buttonStyle: {
                  fontSize: "12px",
                },
              }}
            >
              Learn More
            </Button>
          </>
        }
      />
    );

    return (
      <Table
        columns={columns}
        onItemsSelected={handleItemsSelected}
        emptySlate={TableEmptySlate}
      >
        {emptyRows}
      </Table>
    );
  },
};

export const WithSummary: Story = {
  render: () => {
    interface TableItemProps {
      id?: string;
      title: string;
      subtitle?: string;
      items: {
        itemId?: string;
        name: string;
        cost: string;
        quantity: string;
      }[];
    }

    const TABLE_ITEMS: TableItemProps[] = [
      {
        id: "food",
        title: "Food",
        subtitle: "List of Food Items",
        items: [
          {
            itemId: "F1583",
            name: "Ayam Geprek",
            cost: "5,000",
            quantity: "5",
          },
          {
            itemId: "F9311",
            name: "Laksa Singapore",
            cost: "4,500",
            quantity: "1",
          },
          { itemId: "F2210", name: "Nasi Lemak", cost: "3,500", quantity: "2" },
          {
            itemId: "F7721",
            name: "Soto Betawi",
            cost: "4,000",
            quantity: "1",
          },
          {
            itemId: "F6622",
            name: "Bakso Malang",
            cost: "6,000",
            quantity: "4",
          },
        ],
      },
      {
        id: "beverages",
        title: "Beverages",
        subtitle: "Cold and Hot Refreshments",
        items: [
          { itemId: "B1010", name: "Iced Tea", cost: "1,000", quantity: "3" },
          {
            itemId: "B3911",
            name: "Mineral Water",
            cost: "500",
            quantity: "1",
          },
          { itemId: "B5512", name: "Lemonade", cost: "2,000", quantity: "2" },
          { itemId: "B6619", name: "Hot Coffee", cost: "3,000", quantity: "1" },
          {
            itemId: "B8821",
            name: "Orange Juice",
            cost: "2,500",
            quantity: "2",
          },
        ],
      },
    ];

    const [rows, setRows] = useState(TABLE_ITEMS);
    const [search, setSearch] = useState("");

    const columns: ColumnTableProps[] = [
      {
        id: "itemId",
        caption: "Item ID",
        sortable: true,
      },
      {
        id: "name",
        caption: "Name",
        sortable: true,
        width: "40%",
      },
      {
        id: "cost",
        caption: "Cost",
        sortable: true,
      },
      {
        id: "quantity",
        caption: "Quantity",
        sortable: true,
        width: "20%",
      },
    ];

    const handleSortingRequested = ({
      mode,
      column,
    }: {
      mode: "asc" | "desc" | "original";
      column: keyof (typeof TABLE_ITEMS)[0]["items"][0];
    }) => {
      if (mode === "original") {
        setRows([...TABLE_ITEMS]);
        return;
      }

      const sortedRows = rows.map((row) => {
        const sortedItems = [...row.items].sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];
          return typeof aVal === "string" && typeof bVal === "string"
            ? mode === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal)
            : 0;
        });

        return {
          ...row,
          items: sortedItems,
        };
      });

      setRows(sortedRows);
    };

    const TIP_MENU_ACTION = (
      columnCaption: string
    ): SubMenuListTableProps[] => {
      const column = columnCaption as keyof (typeof TABLE_ITEMS)[0]["items"][0];
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

    const ROW_ACTION = (rowId: string): SubMenuListTableProps[] => {
      return [
        {
          caption: "Edit",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: RiDeleteBin2Fill,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was deleted`);
          },
        },
      ];
    };

    const filteredRows = rows
      .map((group) => {
        const filteredItems = group.items.filter((item) => {
          return Object.values(item).some((val) =>
            val.toLowerCase().includes(search.toLowerCase())
          );
        });

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);

    function parseCost(val: string) {
      return Number(val.replace(/,/g, ""));
    }

    function calculateTotals(groups: TableItemProps[]) {
      let totalCost = 0;
      let totalQty = 0;

      groups.map((group) =>
        group.items.map((item) => {
          totalCost += parseCost(item.cost) * Number(item.quantity);
          totalQty += Number(item.quantity);
        })
      );

      return {
        totalCost,
        totalQty,
      };
    }

    const { totalCost, totalQty } = calculateTotals(TABLE_ITEMS);

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3
          style={{
            fontWeight: 600,
            fontSize: "1.25rem",
            fontFamily: "monospace",
          }}
        >
          Dine-in Tab
        </h3>

        <Table
          styles={{
            tableRowContainerStyle: css`
              max-height: 400px;
            `,
          }}
          columns={columns}
          subMenuList={TIP_MENU_ACTION}
          onSearchboxChange={(e) => setSearch(e.target.value)}
          sumRow={[
            {
              span: 2,
              content: "Total",
              bold: true,
            },
            {
              content: totalCost.toLocaleString("en-US"),
              style: css`
                justify-content: end;
              `,
            },
            {
              content: totalQty,
              style: css`
                justify-content: end;
              `,
            },
          ]}
          searchable
        >
          {filteredRows?.map((groupValue, groupIndex) => (
            <Table.Row.Group
              key={groupIndex}
              title={groupValue.title}
              subtitle={groupValue.subtitle}
            >
              {groupValue.items.map((rowValue, rowIndex) => (
                <Table.Row
                  key={rowIndex}
                  rowId={`${groupValue.id}-${rowValue.cost}-${rowValue.itemId}-${rowValue.name}-${rowValue.quantity}`}
                  actions={ROW_ACTION}
                >
                  <Table.Row.Cell>{rowValue.itemId}</Table.Row.Cell>
                  <Table.Row.Cell>{rowValue.name}</Table.Row.Cell>
                  <Table.Row.Cell
                    contentStyle={css`
                      justify-content: end;
                    `}
                  >
                    {rowValue.cost}
                  </Table.Row.Cell>
                  <Table.Row.Cell
                    contentStyle={css`
                      justify-content: end;
                    `}
                  >
                    {rowValue.quantity}
                  </Table.Row.Cell>
                </Table.Row>
              ))}
            </Table.Row.Group>
          ))}
        </Table>
      </div>
    );
  },
};

export const WithRowGroup: Story = {
  render: () => {
    interface TableItemProps {
      title: string;
      subtitle?: string;
      items: {
        taken?: boolean;
        title: string;
        category: string;
        author: string;
      }[];
    }

    const TABLE_ITEMS: TableItemProps[] = [
      {
        title: "Tech Articles",
        subtitle: "Curated articles on web tech trends",
        items: [
          {
            title: "Understanding React 18",
            category: "Frontend",
            author: "John Doe",
            taken: true,
          },
          {
            title: "TypeScript Deep Dive",
            category: "Backend",
            author: "Jane Smith",
            taken: false,
          },
          {
            title: "Async Patterns in JS",
            category: "Frontend",
            author: "Ali Rahman",
            taken: true,
          },
          {
            title: "Clean Code Practices",
            category: "General",
            author: "Nina Hart",
            taken: false,
          },
          {
            title: "Intro to WebAssembly",
            category: "Experimental",
            author: "Tom K.",
            taken: false,
          },
          {
            title: "Rust for JavaScript Devs",
            category: "Backend",
            author: "Lia Wang",
            taken: true,
          },
          {
            title: "Next.js Performance Tips",
            category: "Frontend",
            author: "Hugo Lin",
            taken: false,
          },
          {
            title: "Database Indexing 101",
            category: "Backend",
            author: "Sara Lee",
            taken: true,
          },
          {
            title: "Scaling with Redis",
            category: "DevOps",
            author: "David Kim",
            taken: false,
          },
          {
            title: "AI in the Browser",
            category: "AI/ML",
            author: "Zara T.",
            taken: true,
          },
        ],
      },
      {
        title: "Online Courses",
        subtitle: "Popular tech courses this month",
        items: [
          {
            title: "React & Redux Bootcamp",
            category: "Frontend",
            author: "Codecademy",
            taken: false,
          },
          {
            title: "Docker Essentials",
            category: "DevOps",
            author: "Pluralsight",
            taken: true,
          },
          {
            title: "Fullstack with Node.js",
            category: "Backend",
            author: "Udemy",
            taken: false,
          },
          {
            title: "GraphQL Mastery",
            category: "API",
            author: "Frontend Masters",
            taken: true,
          },
          {
            title: "Design Systems",
            category: "UI/UX",
            author: "Figma Academy",
            taken: false,
          },
          {
            title: "AI with TensorFlow.js",
            category: "AI/ML",
            author: "Coursera",
            taken: true,
          },
          {
            title: "Intro to TypeScript",
            category: "Frontend",
            author: "FreeCodeCamp",
            taken: false,
          },
          {
            title: "AWS Lambda in Practice",
            category: "Cloud",
            author: "Egghead.io",
            taken: true,
          },
          {
            title: "Security for Developers",
            category: "Security",
            author: "HackerOne",
            taken: false,
          },
          {
            title: "Building Design Tools",
            category: "DevTools",
            author: "ToolingLab",
            taken: true,
          },
        ],
      },
      {
        title: "Open Source Tools",
        subtitle: "Top GitHub projects by community",
        items: [
          {
            title: "Vite",
            category: "Frontend",
            author: "Evan You",
            taken: false,
          },
          {
            title: "Zod",
            category: "Validation",
            author: "Colin McDonnell",
            taken: true,
          },
          {
            title: "tRPC",
            category: "API",
            author: "Julian Fahrer",
            taken: false,
          },
          {
            title: "Remix",
            category: "Fullstack",
            author: "Remix Team",
            taken: true,
          },
          { title: "Nx", category: "Monorepo", author: "Nrwl", taken: false },
          {
            title: "SWR",
            category: "Data Fetching",
            author: "Vercel",
            taken: true,
          },
          {
            title: "Drizzle ORM",
            category: "Database",
            author: "Drizzle Team",
            taken: false,
          },
          {
            title: "Playwright",
            category: "Testing",
            author: "Microsoft",
            taken: true,
          },
          {
            title: "Astro",
            category: "Static Site",
            author: "Astro Team",
            taken: false,
          },
          {
            title: "React Hook Form",
            category: "Forms",
            author: "Bluebill",
            taken: true,
          },
        ],
      },
    ];

    const [rows, setRows] = useState(TABLE_ITEMS);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [activeTab, setActiveTab] = useState("taken");

    const columns: ColumnTableProps[] = [
      {
        id: "title",
        caption: "Title",
        sortable: true,
        width: "45%",
      },
      {
        id: "category",
        caption: "Category",
        sortable: true,
        width: "30%",
      },
      {
        id: "author",
        caption: "Author",
        sortable: true,
        width: "25%",
      },
    ];

    const handleSortingRequested = ({
      mode,
      column,
    }: {
      mode: "asc" | "desc" | "original";
      column: keyof (typeof TABLE_ITEMS)[0]["items"][0];
    }) => {
      if (mode === "original") {
        setRows([...TABLE_ITEMS]);
        return;
      }

      const sortedRows = rows.map((row) => {
        const sortedItems = [...row.items].sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];
          return typeof aVal === "string" && typeof bVal === "string"
            ? mode === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal)
            : 0;
        });

        return {
          ...row,
          items: sortedItems,
        };
      });

      setRows(sortedRows);
    };

    const VIEW_MODES: CapsuleContentProps[] = [
      {
        id: "taken",
        title: "Taken",
      },
      {
        id: "all",
        title: "All",
      },
    ];

    const COPY_ACTIONS: SubMenuListTableProps[] = [
      {
        caption: "Copy to parent",
        icon: RiFileCopy2Line,
        iconColor: "gray",
        isDangerous: true,
        onClick: () => {
          console.log(`${selected} copied to parent`);
        },
      },
      {
        caption: "Copy to link",
        icon: RiClipboardLine,
        iconColor: "gray",
        onClick: () => {
          console.log(`${selected} was copied to link`);
        },
      },
    ];

    const TOP_ACTIONS: TableActionsProps[] = [
      {
        type: "capsule",
        capsuleProps: {
          activeTab: activeTab,
          tabs: VIEW_MODES,
          onTabChange: setActiveTab,
        },
      },
      {
        caption: "Delete",
        disabled: selected.length === 0,
        icon: RiDeleteBin2Line,
        onClick: () => {
          console.log(`Delete ${selected.length} clicked`);
        },
      },
      {
        caption: "Copy",
        icon: RiClipboardFill,
        onClick: () => {
          console.log("Copy clicked");
        },
        subMenu: ({ list }) => list(COPY_ACTIONS),
      },
    ];

    const TIP_MENU_ACTION = (
      columnCaption: string
    ): SubMenuListTableProps[] => {
      const column =
        columnCaption.toLowerCase() as keyof (typeof TABLE_ITEMS)[0]["items"][0];
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

    const ROW_ACTION = (rowId: string): SubMenuListTableProps[] => {
      return [
        {
          caption: "Edit",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: RiDeleteBin2Fill,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was deleted`);
          },
        },
      ];
    };

    const filteredRows = rows
      .map((props) => {
        const filteredItems = props.items
          .filter(
            (item) =>
              item.title.toLowerCase().includes(search.toLowerCase()) ||
              item.category.toLowerCase().includes(search.toLowerCase()) ||
              item.author.toLowerCase().includes(search.toLowerCase())
          )
          .filter((item) => (activeTab === "taken" ? item.taken : item));

        return {
          ...props,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);

    const handleItemsSelected = (ids: string[]) => {
      console.log("Selected rows:", ids);
      setSelected(ids);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <h3
          style={{
            fontWeight: 600,
            fontSize: "1.25rem",
            fontFamily: "monospace",
          }}
        >
          JavaScript Courses
        </h3>

        <Table
          selectable
          styles={{
            tableRowContainerStyle: css`
              max-height: 400px;
            `,
          }}
          columns={columns}
          onItemsSelected={handleItemsSelected}
          subMenuList={TIP_MENU_ACTION}
          actions={TOP_ACTIONS}
          onSearchboxChange={(e) => setSearch(e.target.value)}
          searchable
        >
          {filteredRows?.map((groupValue, groupIndex) => (
            <Table.Row.Group
              key={groupIndex}
              title={groupValue.title}
              subtitle={groupValue.subtitle}
            >
              {groupValue.items.map((rowValue, rowIndex) => (
                <Table.Row
                  key={rowIndex}
                  rowId={`${groupValue.title}-${rowValue.title}`}
                  content={[rowValue.title, rowValue.category, rowValue.author]}
                  actions={ROW_ACTION}
                />
              ))}
            </Table.Row.Group>
          ))}
        </Table>
      </div>
    );
  },
};

export const Draggable: Story = {
  render: () => {
    interface TableItemProps {
      id: string;
      title: string;
      subtitle?: string;
      items: { title: string; category: string; author: string }[];
    }

    interface TableItemSimpleProps {
      name: string;
      type: string;
    }

    type TableCategoryState = "simple" | "group";

    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const columnsDefault = (sortable?: boolean): ColumnTableProps[] => {
      let sortableValue = sortable;
      return [
        {
          id: "name",
          caption: "Name",
          sortable: sortableValue,
        },
        {
          id: "type",
          caption: "Type",
          sortable: sortableValue,
        },
      ];
    };

    const TABLE_ITEMS_DEFAULT = Array.from({ length: 20 }, (_, i) => {
      const type = TYPES_DATA[i % TYPES_DATA.length];
      return {
        name: `Load Balancer ${i + 1}`,
        type: type,
      };
    });

    const TABLE_ITEMS_GROUPS: TableItemProps[] = [
      {
        id: "tech-articles",
        title: "Tech Articles",
        subtitle: "Curated articles on web tech trends",
        items: [
          {
            title: "Understanding React 18",
            category: "Frontend",
            author: "John Doe",
          },
          {
            title: "TypeScript Deep Dive",
            category: "Backend",
            author: "Jane Smith",
          },
          {
            title: "Async Patterns in JS",
            category: "Frontend",
            author: "Ali Rahman",
          },
        ],
      },
      {
        id: "online-courses",
        title: "Online Courses",
        subtitle: "Popular tech courses this month",
        items: [
          {
            title: "React & Redux Bootcamp",
            category: "Frontend",
            author: "Codecademy",
          },
          {
            title: "Docker Essentials",
            category: "DevOps",
            author: "Pluralsight",
          },
          {
            title: "Fullstack with Node.js",
            category: "Backend",
            author: "Udemy",
          },
          {
            title: "GraphQL Mastery",
            category: "API",
            author: "Frontend Masters",
          },
        ],
      },
      {
        id: "open-source-tools",
        title: "Open Source Tools",
        subtitle: "Top GitHub projects by community",
        items: [
          { title: "Vite", category: "Frontend", author: "Evan You" },
          { title: "Zod", category: "Validation", author: "Colin McDonnell" },
          { title: "tRPC", category: "API", author: "Julian Fahrer" },
          { title: "Remix", category: "Fullstack", author: "Remix Team" },
          { title: "Nx", category: "Monorepo", author: "Nrwl" },
        ],
      },
    ];

    const [rowsDefault, setRowsDefault] = useState<TableItemSimpleProps[][]>(
      Array(2).fill(TABLE_ITEMS_DEFAULT)
    );
    const [rowsStates, setRowsStates] = useState<TableItemProps[]>(
      TABLE_ITEMS_GROUPS ?? []
    );
    const [searchStates, setSearchStates] = useState<string[]>(
      Array(3).fill("")
    );

    const [selected, setSelected] = useState([]);

    const columnsGroup: ColumnTableProps[] = [
      {
        id: "title",
        caption: "Title",
        sortable: true,
        width: "45%",
      },
      {
        id: "category",
        caption: "Category",
        sortable: true,
        width: "30%",
      },
      {
        id: "author",
        caption: "Author",
        sortable: true,
        width: "25%",
      },
    ];

    const getRowsState = (rowNumber: number, category?: TableCategoryState) => {
      let rows;
      let setRows;
      if (category === "simple") {
        rows = rowsDefault;
        setRows = setRowsDefault;
        return {
          rows: rows[rowNumber - 1],
          setRows: (newRows: TableItemSimpleProps[] | TableItemProps[]) =>
            setRows((prev) => {
              const copy = [...prev];
              copy[rowNumber - 1] = newRows;
              return copy;
            }),
        };
      } else {
        rows = rowsStates;
        setRows = setRowsStates;
        return { rows, setRows };
      }
    };

    const getSearchState = (rowNumber: number) => {
      if (rowNumber < 1 || rowNumber > searchStates.length) {
        throw new Error(`No search found for rowNumber: ${rowNumber}`);
      }

      return {
        search: searchStates[rowNumber - 1],
        setSearch: (value: string) =>
          setSearchStates((prev) => {
            const copy = [...prev];
            copy[rowNumber - 1] = value;
            return copy;
          }),
      };
    };

    type GroupItem = (typeof TABLE_ITEMS_GROUPS)[0]["items"][0];
    type DefaultItem = (typeof TABLE_ITEMS_DEFAULT)[0];

    const handleSortingRequested = ({
      mode,
      column,
      rowNumber,
      category,
    }: {
      mode: "asc" | "desc" | "original";
      column: keyof GroupItem | keyof DefaultItem;
      rowNumber?: number;
      category?: TableCategoryState;
    }) => {
      const { setRows, rows } = getRowsState(rowNumber, category);

      if (category === "group") {
        if (mode === "original") {
          setRows([...TABLE_ITEMS_GROUPS]);
          return;
        }

        const sortedRows = rows.map((row) => {
          const sortedItems = [...row.items].sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            return typeof aVal === "string" && typeof bVal === "string"
              ? mode === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
              : 0;
          });

          return {
            ...row,
            items: sortedItems,
          };
        });
        setRows(sortedRows);
      } else {
        if (mode === "original") {
          setRows([...TABLE_ITEMS_DEFAULT]);
          return;
        }

        const sortedRows = [...rows].sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];

          if (typeof aVal === "string" && typeof bVal === "string") {
            return mode === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }

          return 0;
        });

        setRows(sortedRows);
      }
    };

    const COPY_ACTIONS: SubMenuListTableProps[] = [
      {
        caption: "Copy to parent",
        icon: RiFileCopy2Line,
        iconColor: "gray",
        isDangerous: true,
        onClick: () => {
          console.log(`${selected} copied to parent`);
        },
      },
      {
        caption: "Copy to link",
        icon: RiClipboardLine,
        iconColor: "gray",
        onClick: () => {
          console.log(`${selected} was copied to link`);
        },
      },
    ];

    const TOP_ACTIONS: TableActionsProps[] = [
      {
        caption: "Delete",
        disabled: selected.length === 0,
        icon: RiDeleteBin2Line,
        onClick: () => {
          console.log(`Delete ${selected.length} clicked`);
        },
      },
      {
        caption: "Copy",
        icon: RiClipboardFill,
        onClick: () => {
          console.log("Copy clicked");
        },
        subMenu: ({ list }) => list(COPY_ACTIONS),
      },
    ];

    const TIP_MENU_ACTION = (
      columnCaption: string,
      rowNumber?: number,
      category?: TableCategoryState
    ): SubMenuListTableProps[] => {
      const column =
        columnCaption.toLowerCase() as keyof (typeof TABLE_ITEMS_GROUPS)[0]["items"][0];
      return [
        {
          caption: "Sort Ascending",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({
              mode: "asc",
              column,
              rowNumber,
              category,
            });
          },
        },
        {
          caption: "Sort Descending",
          icon: RiArrowDownSLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({
              mode: "desc",
              column,
              rowNumber,
              category,
            });
          },
        },
        {
          caption: "Reset Sorting",
          icon: RiRefreshLine,
          iconColor: "gray",
          onClick: () => {
            handleSortingRequested({
              mode: "original",
              column,
              rowNumber,
              category,
            });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): SubMenuListTableProps[] => {
      return [
        {
          caption: "Edit",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: RiDeleteBin2Fill,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was deleted`);
          },
        },
      ];
    };

    function filteredRows(rowNumber: number, category?: TableCategoryState) {
      const { rows } = getRowsState(rowNumber, category);
      const { search } = getSearchState(rowNumber);

      if (category === "group") {
        return (rows as TableItemProps[])
          .map((props) => {
            const filteredItems = props.items.filter(
              (item) =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.category.toLowerCase().includes(search.toLowerCase()) ||
                item.author.toLowerCase().includes(search.toLowerCase())
            );

            return {
              ...props,
              items: filteredItems,
            };
          })
          .filter((group) => group.items.length > 0);
      }

      if (category === "simple") {
        return (rows as TableItemSimpleProps[]).filter(
          (item: { name: string; type: string }) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.type.toLowerCase().includes(search.toLowerCase())
        );
      }
    }

    const reorderItems = (
      oldPosition: number,
      newPosition: number,
      oldGroupId?: string,
      newGroupId?: string,
      rowNumber?: number,
      category?: TableCategoryState
    ) => {
      const { rows, setRows } = getRowsState(rowNumber, category);

      if (category === "group") {
        if (oldGroupId === newGroupId) {
          const updated = rows.map((group) => {
            if (group.id !== oldGroupId) return group;

            const newItems = [...group.items];
            const [movedItem] = newItems.splice(oldPosition, 1);
            newItems.splice(newPosition, 0, movedItem);

            return { ...group, items: newItems };
          });

          setRows(updated);
          return;
        }

        const itemToMove = rows.find((group) => group.id === oldGroupId)?.items[
          oldPosition
        ];
        if (!itemToMove) return;

        const updated = rows.map((group) => {
          if (group.id === oldGroupId) {
            const newItems = group.items.filter(
              (_, index) => index !== oldPosition
            );
            return { ...group, items: newItems };
          }

          if (group.id === newGroupId) {
            const newItems = [...group.items];
            newItems.splice(newPosition, 0, itemToMove);
            return { ...group, items: newItems };
          }

          return group;
        });

        setRows(updated);
        return;
      }

      if (category === "simple") {
        const newRows = [...(rows as TableItemSimpleProps[])];
        const [movedItem] = newRows.splice(oldPosition, 1);
        newRows.splice(newPosition, 0, movedItem);

        setRows(newRows);
        return;
      }
    };

    const onDragged = ({
      oldPosition,
      newPosition,
      oldGroupId,
      newGroupId,
      rowNumber,
      category,
    }: {
      oldPosition: number;
      newPosition: number;
      oldGroupId: string;
      newGroupId: string;
      rowNumber?: number;
      category?: TableCategoryState;
    }) => {
      reorderItems(
        oldPosition,
        newPosition,
        oldGroupId,
        newGroupId,
        rowNumber,
        category
      );
    };

    const handleItemsSelected = (ids: string[]) => {
      console.log("Selected rows:", ids);
      setSelected(ids);
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3
            style={{
              fontWeight: 600,
              fontSize: "1.25rem",
              fontFamily: "monospace",
            }}
          >
            Default
          </h3>

          <Table
            styles={{
              tableRowContainerStyle: css`
                max-height: 400px;
              `,
            }}
            columns={columnsDefault(false)}
            subMenuList={(props) => TIP_MENU_ACTION(props, 1, "simple")}
            onItemsSelected={handleItemsSelected}
            onSearchboxChange={(e) => {
              const { setSearch } = getSearchState(1);
              setSearch(e.target.value);
            }}
            onDragged={(props) =>
              onDragged({
                ...props,
                rowNumber: 1,
                category: "simple",
              })
            }
            searchable
            draggable
            selectable
          >
            {filteredRows(1, "simple")?.map((rowValue, index) => (
              <Table.Row
                key={index}
                index={index}
                rowId={`${rowValue.name}-${rowValue.type}`}
                content={[rowValue.name, rowValue.type]}
              />
            ))}
          </Table>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3
            style={{
              fontWeight: 600,
              fontSize: "1.25rem",
              fontFamily: "monospace",
            }}
          >
            With Action
          </h3>

          <Table
            selectable
            styles={{
              tableRowContainerStyle: css`
                max-height: 400px;
              `,
            }}
            columns={columnsDefault(true)}
            onItemsSelected={handleItemsSelected}
            subMenuList={(props) => TIP_MENU_ACTION(props, 2, "simple")}
            actions={TOP_ACTIONS}
            onSearchboxChange={(e) => {
              const { setSearch } = getSearchState(2);
              setSearch(e.target.value);
            }}
            onDragged={(props) =>
              onDragged({
                ...props,
                rowNumber: 2,
                category: "simple",
              })
            }
            searchable
            draggable
          >
            {filteredRows(2, "simple")?.map((rowValue, rowIndex) => (
              <Table.Row
                key={rowIndex}
                rowId={`${rowValue.name}-${rowValue.type}`}
                content={[rowValue.name, rowValue.type]}
                actions={ROW_ACTION}
              />
            ))}
          </Table>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h3
            style={{
              fontWeight: 600,
              fontSize: "1.25rem",
              fontFamily: "monospace",
            }}
          >
            With Group
          </h3>

          <Table
            selectable
            styles={{
              tableRowContainerStyle: css`
                max-height: 400px;
              `,
            }}
            columns={columnsGroup}
            onItemsSelected={handleItemsSelected}
            subMenuList={(props) => TIP_MENU_ACTION(props, 1, "group")}
            actions={TOP_ACTIONS}
            onSearchboxChange={(e) => {
              const { setSearch } = getSearchState(3);
              setSearch(e.target.value);
            }}
            onDragged={(props) =>
              onDragged({
                ...props,
                rowNumber: 3,
                category: "group",
              })
            }
            searchable
            draggable
          >
            {filteredRows(3, "group")?.map((groupValue, groupIndex) => (
              <Table.Row.Group
                key={groupIndex}
                id={groupValue.id}
                title={groupValue.title}
                subtitle={groupValue.subtitle}
              >
                {groupValue.items.map((rowValue, rowIndex) => (
                  <Table.Row
                    key={rowIndex}
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTION}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        </div>
      </div>
    );
  },
};
