import { Meta, StoryObj } from "@storybook/react";
import { TableColumn, TableSubMenuList, Table, TableAction } from "./table";
import { useEffect, useMemo, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiClipboardFill,
  RiClipboardLine,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
  RiDownload2Fill,
  RiFileCopy2Line,
  RiReactjsLine,
  RiRefreshLine,
} from "@remixicon/react";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";
import { css } from "styled-components";
import { CapsuleTab } from "./capsule";
import { List } from "./list";
import { Card } from "./card";
import { generateSentence } from "./../lib/text";

const meta: Meta<typeof Table> = {
  title: "Content/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The **Table** component is a powerful and flexible data display component designed for handling complex datasets with rich interactions such as selection, drag-and-drop, grouping, and pagination.

---

### ✨ Features
- ✅ **Row selection** with checkbox support (single/multi)
- 🔍 Optional **search filtering** via integrated Searchbox
- 🧲 **Drag-and-drop** row reordering (with grouping support)
- 📂 **Grouped rows** with collapsible sections
- ⚡ **Infinite scroll** support via last row detection
- 📊 Built-in **pagination controls**
- 🎯 Custom **row actions** & contextual menus
- 🧩 Fully customizable **styles per section**
- 📌 Support for **summary rows**
- ⏳ Built-in **loading overlay**

---

### 🧱 Component Structure

\`\`\`tsx
<Table>
  // only row
  <Table.Row rowId="1" content={["Name", "Email"]} />
  
  // with group
  <Table.Row.Group title="Group A">
    <Table.Row rowId="2" content={["Grouped Row"]} />
  </Table.Row.Group>
</Table>
\`\`\`

---

### 📦 Column Definition

\`\`\`tsx
{
  id: string;
  caption: string;
  sortable?: boolean;
  width?: string;
  styles?: {
    self?: CSSProp;
  };
}
\`\`\`

---

### ⚙️ Core Behaviors

#### Selection
- Enable with \`selectable\`
- Controlled via \`selectedItems\`
- Callback: \`onItemsSelected(ids: string[])\`

#### Drag & Drop
- Enable with \`draggable\`
- Works across groups
- Callback provides:
\`\`\`
{
  id: string;
  oldGroupId: string;
  newGroupId: string;
  oldPosition: number;
  newPosition: number;
}
\`\`\`

#### Search
- Enable with \`searchable\`
- Customize using \`searchbox\` props
- Integrates seamlessly with header

#### Pagination
- Enable with \`showPagination\`
- Supports:
  - Next / Previous callbacks
  - Disabled states
  - Custom labels

#### Infinite Scroll
- Use \`onLastRowReached\` to detect bottom visibility
- Ideal for lazy loading / large datasets

---

### 🧩 Row Types

#### Basic Row
\`\`\`tsx
<Table.Row
  rowId="1"
  content={["John Doe", "john@mail.com"]}
/>
\`\`\`

#### Custom Cell Rendering
\`\`\`tsx
<Table.Row rowId="1">
  <Table.Row.Cell>Custom Content</Table.Row.Cell>
</Table.Row>
\`\`\`

#### Grouped Row
\`\`\`tsx
<Table.Row.Group title="Team A">
  <Table.Row rowId="2" content={["Alice"]} />
</Table.Row.Group>
\`\`\`

---

### 🎯 Actions

- Header actions via \`actions\`
- Row-level actions via \`actions(rowId)\`
- Supports:
  - Button
  - Capsule (toggle-like UI)

---

### 📊 Summary Row

\`\`\`tsx
[
  {
    span?: number;
    content?: ReactNode;
    bold?: boolean;
  }
]
\`\`\`

- Rendered at the bottom
- Supports column spanning


---

### 📌 Usage Guidelines
- Use **grouped rows** for hierarchical or categorized data
- Enable **dragging** only when ordering matters
- Use **controlled selection** for syncing with external state
- Combine **pagination + infinite scroll** carefully (avoid overlap)
- Provide meaningful **emptySlate** content for better UX
- Use **summary rows** for totals or aggregated data

      `,
      },
    },
  },
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
      description: `
Enable row selection using checkboxes.

- Adds a checkbox column to the table
- Supports multi-selection
- Works with \`selectedItems\` (controlled) or internal state (uncontrolled)
    `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    selectedItems: {
      description: `
Controls the selected row IDs (**controlled mode**).

- Provide an array of \`rowId\` values
- Must be used together with \`onItemsSelected\`
- If omitted, selection is handled internally (uncontrolled)

📌 Use this when syncing selection with external state (e.g. Redux, form, API)
    `,
      control: false,
      table: {
        type: { summary: "string[]" },
        defaultValue: { summary: "[]" },
      },
    },

    searchable: {
      description: `
Displays a search input in the table header.

- Uses built-in \`Searchbox\` component
- Can be customized via \`searchbox\` prop
- Useful for filtering large datasets
    `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    draggable: {
      description: `
Enables drag-and-drop row reordering.

- Supports reordering within and across groups
- Requires \`onDragged\` to handle updates externally
- Shows drag handle icon per row
    `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    isLoading: {
      description: `
Displays a loading overlay on top of the table.

- Prevents interaction while loading
- Useful for async data fetching states
    `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    columns: {
      description: `
Defines the table columns.

Each column includes:
- \`id\`: unique identifier
- \`caption\`: header label
- \`sortable\`: enable sorting menu
- \`width\`: optional fixed width
    `,
      control: false,
      table: {
        type: { summary: "TableColumn[]" },
      },
    },

    actions: {
      description: `
Header-level actions displayed when rows are selected.

- Supports button or capsule type
- Automatically hidden if \`hidden: true\`
- Common use: bulk actions (delete, export, etc.)
    `,
      control: false,
      table: {
        type: { summary: "TableAction[]" },
      },
    },

    onItemsSelected: {
      description: `
Callback triggered when selected rows change.

\`\`\`ts
(ids: string[]) => void
\`\`\`

- Fires on individual selection or "select all"
- Required for controlled selection mode
    `,
      action: "items-selected",
      table: {
        type: { summary: "(ids: string[]) => void" },
      },
    },

    children: {
      description: `
Table content.

Accepts:
- \`Table.Row\`
- \`Table.Row.Group\`

Used to define rows and grouping structure.
    `,
      control: false,
      table: {
        type: { summary: "ReactNode" },
      },
    },

    subMenuList: {
      description: `
Generates sorting menu for each column.

\`\`\`ts
(columnId: string) => TableSubMenuList[]
\`\`\`

- Used when \`sortable: true\` in column
- Allows custom sorting options (ASC, DESC, etc.)
    `,
      control: false,
      table: {
        type: {
          summary: "(columnId: string) => TableSubMenuList[]",
        },
      },
    },

    emptySlate: {
      description: `
Content displayed when there are no rows.

- Can be string, JSX, or custom component
- Recommended to provide meaningful empty state UX
    `,
      control: "text",
      table: {
        type: { summary: "ReactNode" },
        defaultValue: { summary: '"No data available."' },
      },
    },

    onLastRowReached: {
      description: `
Triggered when the last row becomes visible.

- Used for infinite scrolling / lazy loading
- Fires via IntersectionObserver
    `,
      action: "last-row-reached",
      table: {
        type: { summary: "() => void" },
      },
    },

    showPagination: {
      description: `
Enables pagination controls in the header.

- Displays next/previous buttons
- Works with pagination callbacks
    `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    onNextPageRequested: {
      description: `
Triggered when the next page button is clicked.

- Used for controlled pagination
    `,
      action: "next-page",
      table: {
        type: { summary: "() => void" },
      },
    },

    onPreviousPageRequested: {
      description: `
Triggered when the previous page button is clicked.

- Used for controlled pagination
    `,
      action: "previous-page",
      table: {
        type: { summary: "() => void" },
      },
    },

    disableNextPageButton: {
      description: `
Disables the next page button.

- Useful when reaching the last page
    `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    disablePreviousPageButton: {
      description: `
Disables the previous page button.

- Useful when on the first page
    `,
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },

    labels: {
      description: `
Custom labels for UI text.

Supports:
- \`totalSelectedItemText(count)\`
- \`pageNumberText\`

Used to override default text (i18n, UX customization)
    `,
      control: false,
      table: {
        type: { summary: "TableLabels | null" },
      },
    },

    sumRow: {
      description: `
Summary row displayed at the bottom.

- Supports column spanning via \`span\`
- Useful for totals, aggregations, etc.
    `,
      control: false,
      table: {
        type: { summary: "TableSummaryRow[]" },
      },
    },

    styles: {
      description: `
Custom styles override for the table.

Available fields:
- containerStyle
- tableHeaderStyle
- tableBodyStyle
- paginationWrapperStyle
- paginationNumberStyle
- totalSelectedItemTextStyle

All accept \`CSSProp\` (styled-components).
    `,
      control: false,
      table: {
        type: { summary: "TableStyles" },
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

    const columns: TableColumn[] = [
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
          tableBodyStyle: css`
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
    const columns: TableColumn[] = [
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

    const getRandom = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const generate20RandomLoremIpsum = () => {
      return Array.from({ length: 5 }, () =>
        generateSentence({
          minLen: getRandom(20, 45),
          maxLen: getRandom(20, 45),
        })
      );
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
    ): TableSubMenuList[] => {
      return [
        {
          caption: "Sort Ascending",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "asc", column: columnCaption });
          },
        },
        {
          caption: "Sort Descending",
          icon: {
            image: RiArrowDownSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "desc", column: columnCaption });
          },
        },
        {
          caption: "Reset Sorting",
          icon: {
            image: RiRefreshLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "original", column: columnCaption });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): TableSubMenuList[] => {
      return [
        {
          caption: "Edit",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: {
            image: RiDeleteBin2Fill,
            color: "gray",
          },
          isDangerous: true,
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
          tableBodyStyle: css`
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
    const columns: TableColumn[] = [
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

    const getRandom = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const generate20RandomLoremIpsum = () => {
      return Array.from({ length: 5 }, () =>
        generateSentence({
          minLen: getRandom(20, 45),
          maxLen: getRandom(20, 45),
        })
      );
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
    ): TableSubMenuList[] => {
      return [
        {
          caption: "Sort Ascending",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "asc", column: columnCaption });
          },
        },
        {
          caption: "Sort Descending",
          icon: {
            image: RiArrowDownSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "desc", column: columnCaption });
          },
        },
        {
          caption: "Reset Sorting",
          icon: {
            image: RiRefreshLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "original", column: columnCaption });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): TableSubMenuList[] => {
      return [
        {
          caption: "Delete",
          icon: {
            image: RiDeleteBin2Fill,
          },
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
          tableBodyStyle: css`
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
    const [selectedItems, setSelectedItems] = useState([
      "Load Balancer 1-HTTP",
      "Load Balancer 2-HTTPS",
      "Load Balancer 3-TCP",
      "Load Balancer 4-UDP",
      "Load Balancer 5-QUIC",
      "Load Balancer 6-HTTP",
      "Load Balancer 7-HTTPS",
      "Load Balancer 8-TCP",
      "Load Balancer 9-UDP",
      "Load Balancer 10-QUIC",
    ]);
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

    const columns: TableColumn[] = [
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

    const TIP_MENU_ACTION = (columnCaption: string): TableSubMenuList[] => {
      const column = columnCaption.toLowerCase() as keyof (typeof rawRows)[0];

      return [
        {
          caption: "Sort Ascending",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "asc", column });
          },
        },
        {
          caption: "Sort Descending",
          icon: {
            image: RiArrowDownSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "desc", column });
          },
        },
        {
          caption: "Reset Sorting",
          icon: {
            image: RiRefreshLine,
            color: "gray",
          },
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
  parameters: {
    layout: "fullscreen",
  },
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
    const columns: TableColumn[] = [
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

    const columns: TableColumn[] = [
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
                self: {
                  fontSize: "12px",
                },
              }}
            >
              Add Item
            </Button>
            <Button
              variant="primary"
              styles={{
                self: {
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

    const columns: TableColumn[] = [
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

    const TIP_MENU_ACTION = (columnCaption: string): TableSubMenuList[] => {
      const column = columnCaption as keyof (typeof TABLE_ITEMS)[0]["items"][0];

      return [
        {
          caption: "Sort Ascending",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "asc", column });
          },
        },
        {
          caption: "Sort Descending",
          icon: {
            image: RiArrowDownSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "desc", column });
          },
        },
        {
          caption: "Reset Sorting",
          icon: {
            image: RiRefreshLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "original", column });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): TableSubMenuList[] => {
      return [
        {
          caption: "Edit",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: {
            image: RiDeleteBin2Fill,
            color: "gray",
          },
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
            tableBodyStyle: css`
              max-height: 400px;
            `,
          }}
          columns={columns}
          subMenuList={TIP_MENU_ACTION}
          searchbox={{ onChange: (e) => setSearch(e.target.value) }}
          sumRow={[
            {
              span: 2,
              content: "Total",
              bold: true,
            },
            {
              content: totalCost.toLocaleString("en-US"),
              styles: {
                self: css`
                  justify-content: end;
                `,
              },
            },
            {
              content: totalQty,
              styles: {
                self: css`
                  justify-content: end;
                `,
              },
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
            author: "Systatum",
            taken: true,
          },
          {
            title: "TypeScript Deep Dive",
            category: "Backend",
            author: "Pluralsight",
            taken: false,
          },
          {
            title: "Async Patterns in JS",
            category: "Frontend",
            author: "Egghead",
            taken: true,
          },
          {
            title: "Clean Code Practices",
            category: "General",
            author: "Coursera",
            taken: false,
          },
          {
            title: "Intro to WebAssembly",
            category: "Experimental",
            author: "Systatum",
            taken: false,
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
            author: "Coursera",
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
            author: "Egghead",
            taken: false,
          },
          {
            title: "GraphQL Mastery",
            category: "API",
            author: "Systatum",
            taken: true,
          },
          {
            title: "Design Systems",
            category: "UI/UX",
            author: "Coursera",
            taken: false,
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
            author: "Systatum",
            taken: false,
          },
          {
            title: "Zod",
            category: "Validation",
            author: "Egghead",
            taken: true,
          },
          { title: "tRPC", category: "API", author: "Coursera", taken: false },
          {
            title: "Remix",
            category: "Fullstack",
            author: "Pluralsight",
            taken: true,
          },
          {
            title: "Nx",
            category: "Monorepo",
            author: "Systatum",
            taken: false,
          },
        ],
      },
    ];

    const CATEGORY_MAP: Record<string, string[]> = {
      frontend: ["frontend", "fullstack", "monorepo"],
      backend: ["backend", "api", "devops", "validation"],
    };

    const [rows, setRows] = useState(TABLE_ITEMS);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [activeTab, setActiveTab] = useState({
      taken: "taken",
      category: "frontend",
    });
    const [isFocus, setIsFocus] = useState(false);

    const columns: TableColumn[] = [
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

    const VIEW_MODES: CapsuleTab[] = [
      {
        id: "taken",
        title: "Taken",
      },
      {
        id: "all",
        title: "All",
      },
    ];

    const VIEW_MODES_WITH_ICON: CapsuleTab[] = [
      {
        id: "frontend",
        icon: {
          image: RiReactjsLine,
        },
      },
      {
        id: "backend",
        icon: {
          image: "/backend.png",
        },
      },
    ];

    const COPY_ACTIONS: TableSubMenuList[] = [
      {
        caption: "Copy to parent",
        icon: {
          image: RiFileCopy2Line,
          color: "gray",
        },
        isDangerous: true,
        onClick: () => {
          console.log(`${selected} copied to parent`);
        },
      },
      {
        caption: "Copy to link",
        icon: {
          image: RiClipboardLine,
          color: "gray",
        },
        onClick: () => {
          console.log(`${selected} was copied to link`);
        },
      },
    ];

    const TOP_ACTIONS: TableAction[] = [
      {
        type: "capsule",
        capsuleProps: {
          activeTab: activeTab.taken,
          tabs: VIEW_MODES,
          onTabChange: (id) => setActiveTab((prev) => ({ ...prev, taken: id })),
        },
      },
      {
        type: "capsule",
        capsuleProps: {
          activeTab: activeTab.category,
          tabs: VIEW_MODES_WITH_ICON,
          onTabChange: (id) =>
            setActiveTab((prev) => ({ ...prev, category: id })),
        },
      },
      {
        caption: "Delete",
        disabled: selected.length === 0,
        icon: {
          image: RiDeleteBin2Line,
        },
        onClick: () => {
          console.log(`Delete ${selected.length} clicked`);
        },
      },
      {
        caption: "Copy",
        icon: {
          image: RiClipboardFill,
        },
        onClick: () => {
          console.log("Copy clicked");
        },
        showSubMenuOn: "caret",
        subMenu: ({ list }) => list(COPY_ACTIONS),
        styles: {
          dropdownStyle: css`
            min-width: 150px;
          `,
        },
      },
      {
        caption: "Download",
        disabled: selected.length === 0,
        icon: {
          image: RiDownload2Fill,
        },
        styles: {
          self: css`
            width: 60px;
          `,
        },
        onClick: () => {
          console.log(`Download ${selected.length} clicked`);
        },
      },
    ];

    const TIP_MENU_ACTION = (columnCaption: string): TableSubMenuList[] => {
      const column =
        columnCaption.toLowerCase() as keyof (typeof TABLE_ITEMS)[0]["items"][0];

      return [
        {
          caption: "Sort Ascending",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "asc", column });
          },
        },
        {
          caption: "Sort Descending",
          icon: {
            image: RiArrowDownSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "desc", column });
          },
        },
        {
          caption: "Reset Sorting",
          icon: {
            image: RiRefreshLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "original", column });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): TableSubMenuList[] => {
      return [
        {
          caption: "Edit",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: {
            image: RiDeleteBin2Fill,
            color: "gray",
          },
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
          .filter((item) =>
            activeTab.category === "taken" ? item.taken : item
          )
          .filter((item) => {
            const active = activeTab.category.toLowerCase();

            if (!CATEGORY_MAP[active]) return true;

            return CATEGORY_MAP[active].includes(item.category.toLowerCase());
          });

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

    const allItems = rows.flatMap((section) => section.items);

    const courseItems = Array.from(new Set(allItems.map((item) => item.title)))
      .map((title) => ({
        id: title,
        title: title,
      }))
      .filter((props) =>
        props.title.toLowerCase().includes(search.toLowerCase())
      );

    const authorItems = Array.from(new Set(allItems.map((item) => item.author)))
      .map((author) => ({
        id: author,
        title: author,
      }))
      .filter((props) =>
        props.title.toLowerCase().includes(search.toLowerCase())
      );

    const SearchSubMenu = () => {
      return (
        <List
          styles={{
            containerStyle: css`
              min-width: 300px;
              padding: 20px;
              border-radius: 4px;
              max-height: 500px;
              overflow: auto;

              scrollbar-width: thin;

              &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
              }

              &::-webkit-scrollbar-track {
                background: transparent;
              }
            `,
          }}
        >
          {courseItems.length > 0 && (
            <List.Group key={"course"} id={"course"} title={"Course"}>
              {courseItems.map((item) => (
                <List.Item
                  onMouseDown={async () => {
                    await setIsFocus(false);
                    await setSearch(item.title);
                  }}
                  key={item.title}
                  id={item.title}
                  title={item.title}
                />
              ))}
            </List.Group>
          )}

          {authorItems.length > 0 && (
            <List.Group
              styles={{
                emptySlateStyle:
                  authorItems.length === 0 &&
                  css`
                    display: none;
                  `,
              }}
              key={"author"}
              id={"author"}
              title={"Author"}
            >
              {authorItems.map((item) => (
                <List.Item
                  onMouseDown={async () => {
                    await setIsFocus(false);
                    await setSearch(item.title);
                  }}
                  key={item.title}
                  id={item.title}
                  title={item.title}
                />
              ))}
            </List.Group>
          )}
        </List>
      );
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
            tableBodyStyle: css`
              max-height: 400px;
            `,
          }}
          columns={columns}
          onItemsSelected={handleItemsSelected}
          subMenuList={TIP_MENU_ACTION}
          actions={TOP_ACTIONS}
          searchable
          searchbox={{
            onChange: (e) => setSearch(e.target.value),
            resultMenu: ({ render }) => render(<SearchSubMenu />),
            showResultMenu: isFocus,
            onMouseDown: () => setIsFocus(true),
            value: search,
          }}
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

export const WithRowAppendix: Story = {
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

    const columns: TableColumn[] = [
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

    const TIP_MENU_ACTION = (columnCaption: string): TableSubMenuList[] => {
      const column = columnCaption as keyof (typeof TABLE_ITEMS)[0]["items"][0];

      return [
        {
          caption: "Sort Ascending",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "asc", column });
          },
        },
        {
          caption: "Sort Descending",
          icon: {
            image: RiArrowDownSLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "desc", column });
          },
        },
        {
          caption: "Reset Sorting",
          icon: {
            image: RiRefreshLine,
            color: "gray",
          },
          onClick: () => {
            handleSortingRequested({ mode: "original", column });
          },
        },
      ];
    };

    const ROW_ACTION = (rowId: string): TableSubMenuList[] => {
      return [
        {
          caption: "Edit",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: {
            image: RiDeleteBin2Fill,
            color: "gray",
          },
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

    function RowContent({
      name,
      cost,
      quantity,
      onClose,
    }: {
      name: string;
      cost: string;
      quantity: string;
      onClose: () => void;
    }) {
      return (
        <Card
          title={
            <>
              <div>{name}</div>
              <div
                style={{
                  fontSize: 14,
                }}
              >
                Qty: {quantity}
              </div>
            </>
          }
          subtitle={
            <>
              <div>IDR {cost}</div>
              <Button
                styles={{
                  self: css`
                    padding: 4px 10px;
                    height: 24px;
                  `,
                }}
                onClick={() => onClose()}
              >
                Close
              </Button>
            </>
          }
          styles={{
            containerStyle: css`
              background-color: transparent;
            `,
            textContainerStyle: css`
              width: 100%;
            `,
            titleStyle: css`
              width: 100%;
              display: flex;
              flex-direction: row;
              font-size: 18px;
              justify-content: space-between;
            `,
            subtitleStyle: css`
              width: 100%;
              display: flex;
              font-size: 14px;
              flex-direction: row;
              justify-content: space-between;
            `,
            contentStyle: css`
              padding-left: 24px;
              padding-right: 24px;
              padding-bottom: 10px;
            `,
          }}
        >
          {generateSentence({
            minLen: 45,
            maxLen: 45,
          })}
        </Card>
      );
    }

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
            tableBodyStyle: css`
              max-height: 400px;
            `,
          }}
          columns={columns}
          subMenuList={TIP_MENU_ACTION}
          searchbox={{ onChange: (e) => setSearch(e.target.value) }}
          sumRow={[
            {
              span: 2,
              content: "Total",
              bold: true,
            },
            {
              content: totalCost.toLocaleString("en-US"),
              styles: {
                self: css`
                  justify-content: end;
                `,
              },
            },
            {
              content: totalQty,
              styles: {
                self: css`
                  justify-content: end;
                `,
              },
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
                  onClick={({ isFirstClick, open, close }) => {
                    isFirstClick
                      ? open(
                          <RowContent
                            name={rowValue.name}
                            cost={rowValue.cost}
                            quantity={rowValue.quantity}
                            onClose={close}
                          />
                        )
                      : close();
                  }}
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

    const columnsDefault = (sortable?: boolean): TableColumn[] => {
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

    const columnsGroup: TableColumn[] = [
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

    const COPY_ACTIONS: TableSubMenuList[] = [
      {
        caption: "Copy to parent",
        icon: {
          image: RiFileCopy2Line,
          color: "gray",
        },
        isDangerous: true,
        onClick: () => {
          console.log(`${selected} copied to parent`);
        },
      },
      {
        caption: "Copy to link",
        icon: {
          image: RiClipboardLine,
          color: "gray",
        },
        onClick: () => {
          console.log(`${selected} was copied to link`);
        },
      },
    ];

    const TOP_ACTIONS: TableAction[] = [
      {
        caption: "Delete",
        disabled: selected.length === 0,
        icon: {
          image: RiDeleteBin2Line,
        },
        onClick: () => {
          console.log(`Delete ${selected.length} clicked`);
        },
      },
      {
        caption: "Copy",
        icon: {
          image: RiClipboardFill,
        },
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
    ): TableSubMenuList[] => {
      const column =
        columnCaption.toLowerCase() as keyof (typeof TABLE_ITEMS_GROUPS)[0]["items"][0];

      return [
        {
          caption: "Sort Ascending",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
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
          icon: {
            image: RiArrowDownSLine,
            color: "gray",
          },
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
          icon: {
            image: RiRefreshLine,
            color: "gray",
          },
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

    const ROW_ACTION = (rowId: string): TableSubMenuList[] => {
      return [
        {
          caption: "Edit",
          icon: {
            image: RiArrowUpSLine,
            color: "gray",
          },
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: {
            image: RiDeleteBin2Fill,
            color: "gray",
          },
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
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
            columns={columnsDefault(false)}
            subMenuList={(props) => TIP_MENU_ACTION(props, 1, "simple")}
            onItemsSelected={handleItemsSelected}
            searchbox={{
              onChange: (e) => {
                const { setSearch } = getSearchState(1);
                setSearch(e.target.value);
              },
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
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
            columns={columnsDefault(true)}
            onItemsSelected={handleItemsSelected}
            subMenuList={(props) => TIP_MENU_ACTION(props, 2, "simple")}
            actions={TOP_ACTIONS}
            searchbox={{
              onChange: (e) => {
                const { setSearch } = getSearchState(2);
                setSearch(e.target.value);
              },
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
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
            columns={columnsGroup}
            onItemsSelected={handleItemsSelected}
            subMenuList={(props) => TIP_MENU_ACTION(props, 1, "group")}
            actions={TOP_ACTIONS}
            searchbox={{
              onChange: (e) => {
                const { setSearch } = getSearchState(3);
                setSearch(e.target.value);
              },
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
