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
    isLoading: false,
    columns: [],
    actions: [],
    emptySlate: "No data available.",
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
    isLoading: {
      description: "Show loading overlay on the table.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    columns: {
      description: "Defines the column headers of the table.",
      control: "object",
      table: {
        type: { summary: "ColumnTableProps[]" },
      },
    },
    actions: {
      description:
        "Array of actions displayed when one or more rows are selected.",
      control: "object",
      table: {
        type: { summary: "TableActionsProps[]" },
      },
    },
    onItemsSelected: {
      description:
        "Callback triggered with selected rowId array when selection changes.",
      action: "items selected",
      table: {
        type: { summary: "(data: string[]) => void" },
      },
    },
    children: {
      description:
        "Table rows (`Table.Row`) or groups (`TableRow.Group`) passed as children.",
      control: false,
      table: {
        type: { summary: "ReactNode" },
      },
    },
    containerStyle: {
      description: "Class applied to the main container.",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    tableRowContainerStyle: {
      description: "Class applied to the container holding all table rows.",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    isOpen: {
      description: "Open state for the sorting menu. Controlled externally.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
    setIsOpen: {
      description:
        "Function to toggle the sorting menu. Controlled externally.",
      table: {
        type: { summary: "() => void" },
      },
    },
    subMenuList: {
      description:
        "Function to generate menu list for sorting options per column.",
      table: {
        type: {
          summary: "(columnCaption: string) => SubMenuListTableProps[]",
        },
      },
    },
    emptySlate: {
      description:
        "Fallback content shown when no rows are rendered (e.g., 'No data').",
      control: "text",
      table: {
        type: { summary: "ReactNode" },
      },
    },
    onLastRowReached: {
      description:
        "Callback fired when the last row becomes visible (used for infinite scrolling).",
      table: {
        type: { summary: "() => void" },
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
        caption: "Name",
        sortable: false,
      },
      {
        caption: "Type",
        sortable: false,
      },
    ];

    return (
      <Table
        tableRowContainerStyle={css`
          max-height: 400px;
        `}
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
        caption: "From",
        sortable: true,
        width: "40%",
      },
      {
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

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
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
        tableRowContainerStyle={css`
          max-height: 400px;
        `}
        columns={columns}
        onItemsSelected={handleItemsSelected}
        subMenuList={TIP_MENU_ACTION}
        onLastRowReached={handleFetchData}
        totalSelectedItemText={(n) => `${n} emails selected`}
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
        caption: "From",
        sortable: true,
        width: "40%",
      },
      {
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

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
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
        tableRowContainerStyle={css`
          max-height: 400px;
        `}
        columns={columns}
        onItemsSelected={handleItemsSelected}
        subMenuList={TIP_MENU_ACTION}
        onLastRowReached={handleFetchData}
        totalSelectedItemText={(n) => `${n} emails selected`}
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
        caption: "Name",
        sortable: true,
      },
      {
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

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
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
          selectable
          showPagination
          columns={columns}
          onItemsSelected={handleItemsSelected}
          subMenuList={TIP_MENU_ACTION}
          pageNumberText={page}
          onPreviousPageRequested={handlePrevious}
          onNextPageRequested={handleNext}
          disableNextPageButton={isDisabledNext}
          disablePreviousPageButton={isDisabledPrev}
        >
          {pagedRows?.map((dataRow, index) => (
            <Table.Row
              onClick={({ toggleCheckbox }) => {
                toggleCheckbox();
              }}
              key={index}
              rowId={`${dataRow.name}-${dataRow.type}`}
            >
              {[dataRow.name, dataRow.type].map((dataCell, i) => (
                <Table.Row.Cell
                  key={`${dataRow.name}-${dataRow.type}-${dataCell}`}
                  width={columns[i].width}
                >
                  {dataCell}
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
        caption: "Name",
        sortable: false,
      },
      {
        caption: "Type",
        sortable: false,
      },
    ];

    const handleItemsSelected = (data: string[]) => {
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

export const WithEmptySlate: Story = {
  render: () => {
    const emptyRows = [];

    const columns: ColumnTableProps[] = [
      {
        caption: "Name",
        sortable: false,
      },
      {
        caption: "Type",
        sortable: false,
      },
    ];

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
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
              buttonStyle={{
                fontSize: "12px",
              }}
            >
              Add Item
            </Button>
            <Button
              variant="primary"
              buttonStyle={{
                fontSize: "12px",
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

export const WithRowGroup: Story = {
  render: () => {
    interface TableItemProps {
      title: string;
      subtitle?: string;
      items: { title: string; category: string; author: string }[];
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
          {
            title: "Clean Code Practices",
            category: "General",
            author: "Nina Hart",
          },
          {
            title: "Intro to WebAssembly",
            category: "Experimental",
            author: "Tom K.",
          },
          {
            title: "Rust for JavaScript Devs",
            category: "Backend",
            author: "Lia Wang",
          },
          {
            title: "Next.js Performance Tips",
            category: "Frontend",
            author: "Hugo Lin",
          },
          {
            title: "Database Indexing 101",
            category: "Backend",
            author: "Sara Lee",
          },
          {
            title: "Scaling with Redis",
            category: "DevOps",
            author: "David Kim",
          },
          { title: "AI in the Browser", category: "AI/ML", author: "Zara T." },
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
          {
            title: "Design Systems",
            category: "UI/UX",
            author: "Figma Academy",
          },
          {
            title: "AI with TensorFlow.js",
            category: "AI/ML",
            author: "Coursera",
          },
          {
            title: "Intro to TypeScript",
            category: "Frontend",
            author: "FreeCodeCamp",
          },
          {
            title: "AWS Lambda in Practice",
            category: "Cloud",
            author: "Egghead.io",
          },
          {
            title: "Security for Developers",
            category: "Security",
            author: "HackerOne",
          },
          {
            title: "Building Design Tools",
            category: "DevTools",
            author: "ToolingLab",
          },
        ],
      },
      {
        title: "Open Source Tools",
        subtitle: "Top GitHub projects by community",
        items: [
          { title: "Vite", category: "Frontend", author: "Evan You" },
          { title: "Zod", category: "Validation", author: "Colin McDonnell" },
          { title: "tRPC", category: "API", author: "Julian Fahrer" },
          { title: "Remix", category: "Fullstack", author: "Remix Team" },
          { title: "Nx", category: "Monorepo", author: "Nrwl" },
          { title: "SWR", category: "Data Fetching", author: "Vercel" },
          {
            title: "Drizzle ORM",
            category: "Database",
            author: "Drizzle Team",
          },
          { title: "Playwright", category: "Testing", author: "Microsoft" },
          { title: "Astro", category: "Static Site", author: "Astro Team" },
          { title: "React Hook Form", category: "Forms", author: "Bluebill" },
        ],
      },
    ];

    const [rows, setRows] = useState(TABLE_ITEMS);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [activeTab, setActiveTab] = useState("new");

    const columns: ColumnTableProps[] = [
      {
        caption: "Title",
        sortable: true,
        width: "45%",
      },
      {
        caption: "Category",
        sortable: true,
        width: "30%",
      },
      {
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

      const sortedRows = rows.map((data) => {
        const sortedItems = [...data.items].sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];
          return typeof aVal === "string" && typeof bVal === "string"
            ? mode === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal)
            : 0;
        });

        return {
          ...data,
          items: sortedItems,
        };
      });

      setRows(sortedRows);
    };

    const VIEW_MODES: CapsuleContentProps[] = [
      {
        id: "new",
        title: "New",
      },
      {
        id: "list",
        title: "List",
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
        title: "Delete",
        disabled: selected.length === 0,
        icon: RiDeleteBin2Line,
        onClick: () => {
          console.log(`Delete ${selected.length} clicked`);
        },
      },
      {
        title: "Copy",
        icon: RiClipboardFill,
        onClick: () => {
          console.log("Copy clicked");
        },
        subMenu: ({ list }) => list(COPY_ACTIONS),
        showSubMenuOn: "self",
      },
      {
        type: "capsule",
        capsuleProps: {
          activeTab: activeTab,
          tabs: VIEW_MODES,
          setActiveTab: setActiveTab,
        },
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
      .map((data) => {
        const filteredItems = data.items.filter(
          (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase()) ||
            item.author.toLowerCase().includes(search.toLowerCase())
        );

        return {
          ...data,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
      setSelected(data);
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
          selectable
          tableRowContainerStyle={css`
            max-height: 400px;
          `}
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
          caption: "Name",
          sortable: sortableValue,
        },
        {
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
        caption: "Title",
        sortable: true,
        width: "45%",
      },
      {
        caption: "Category",
        sortable: true,
        width: "30%",
      },
      {
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

        const sortedRows = rows.map((data) => {
          const sortedItems = [...data.items].sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            return typeof aVal === "string" && typeof bVal === "string"
              ? mode === "asc"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
              : 0;
          });

          return {
            ...data,
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
        title: "Delete",
        disabled: selected.length === 0,
        icon: RiDeleteBin2Line,
        onClick: () => {
          console.log(`Delete ${selected.length} clicked`);
        },
      },
      {
        title: "Copy",
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
          .map((data) => {
            const filteredItems = data.items.filter(
              (item) =>
                item.title.toLowerCase().includes(search.toLowerCase()) ||
                item.category.toLowerCase().includes(search.toLowerCase()) ||
                item.author.toLowerCase().includes(search.toLowerCase())
            );

            return {
              ...data,
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

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
      setSelected(data);
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
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
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
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
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
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
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
