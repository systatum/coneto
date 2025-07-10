import { Meta, StoryObj } from "@storybook/react";
import { Table } from "./table";
import { useState } from "react";
import { TipMenuItemProps } from "./tip-menu";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiClipboardFill,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
  RiRefreshLine,
} from "@remixicon/react";
import EmptySlate from "./empty-slate";
import { Button } from "./button";

const meta: Meta<typeof Table> = {
  title: "Content/Table",
  component: Table,
  args: {},

  tags: ["autodocs"],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
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

export const Appendable: Story = {
  render: () => {
    const columns = [
      {
        caption: "From",
        sortable: true,
      },
      {
        caption: "Content",
        sortable: true,
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
          content: `${subject} — ${content}`,
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
      column: keyof (typeof emails)[0];
    }) => {
      if (mode === "original") {
        setRows([...emails]);
        return;
      }

      const sorted = [...emails].sort((a, b) => {
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

    const TIP_MENU_ACTION = (columnCaption: string): TipMenuItemProps[] => {
      const column = columnCaption.toLowerCase() as keyof (typeof emails)[0];
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

    const ROW_ACTION = (rowId: string): TipMenuItemProps[] => {
      return [
        {
          caption: "Edit",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            alert(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: RiDeleteBin2Fill,
          iconColor: "gray",
          onClick: () => {
            alert(`${rowId} was deleted`);
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
        classNameTableRow="max-h-[400px]"
        columns={columns}
        onItemsSelected={handleItemsSelected}
        subMenuList={TIP_MENU_ACTION}
        onLastRowReached={handleFetchData}
      >
        {rows.map((rowValue, rowIndex) => (
          <Table.Row
            key={rowIndex}
            dataId={`${rowValue.from}-${rowValue.content}`}
            actions={ROW_ACTION}
          >
            {[rowValue.from, rowValue.content]?.map((data, index, array) => (
              <Table.Row.Cell
                key={index}
                col={data}
                className={index === array.length - 1 ? "pr-8" : ""}
              />
            ))}
          </Table.Row>
        ))}
      </Table>
    );
  },
};

export const WithSelectAndSorting: Story = {
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

    const handleItemsSelected = (data: string[]) => {
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

export const WithLoading: Story = {
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
            <Button variant="default" className="text-xs">
              Add Item
            </Button>
            <Button variant="primary" className="text-xs">
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

export const WithCustom: Story = {
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

    const TOP_ACTIONS = [
      {
        title: "Delete",
        icon: RiDeleteBin2Line,
        onClick: () => {
          alert("Delete clicked");
        },
      },
      {
        title: "Copy",
        icon: RiClipboardFill,
        onClick: () => {
          alert("Copy clicked");
        },
      },
    ];

    const [rows, setRows] = useState(TABLE_ITEMS);

    const columns = [
      {
        caption: "Title",
        sortable: true,
      },
      {
        caption: "Category",
        sortable: true,
      },
      {
        caption: "Author",
        sortable: true,
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

    const TIP_MENU_ACTION = (columnCaption: string): TipMenuItemProps[] => {
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

    const ROW_ACTION = (rowId: string): TipMenuItemProps[] => {
      return [
        {
          caption: "Edit",
          icon: RiArrowUpSLine,
          iconColor: "gray",
          onClick: () => {
            alert(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: RiDeleteBin2Fill,
          iconColor: "gray",
          onClick: () => {
            alert(`${rowId} was deleted`);
          },
        },
      ];
    };

    const handleItemsSelected = (data: string[]) => {
      console.log("Selected rows:", data);
    };

    return (
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-xl font-mono">
          Data Load Balancer 2025
        </h3>

        <Table
          selectable
          classNameTableRow="max-h-[400px]"
          columns={columns}
          onItemsSelected={handleItemsSelected}
          subMenuList={TIP_MENU_ACTION}
          actions={TOP_ACTIONS}
        >
          {rows?.map((groupValue, groupIndex) => (
            <Table.Row.Group
              key={groupIndex}
              title={groupValue.title}
              subtitle={groupValue.subtitle}
            >
              {groupValue.items.map((rowValue, rowIndex) => (
                <Table.Row
                  key={rowIndex}
                  dataId={`${groupValue.title}-${rowValue.title}`}
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
