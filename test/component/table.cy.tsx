import {
  RiArrowUpSLine,
  RiClipboardFill,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
  RiForbid2Line,
  RiSpam2Line,
} from "@remixicon/react";
import {
  ColumnTableProps,
  Table,
  TableActionsProps,
} from "./../../components/table";
import { TipMenuItemProps } from "./../../components/tip-menu";
import { css } from "styled-components";
import { CapsuleContentProps } from "./../../components/capsule";

interface TableItemProps {
  title: string;
  subtitle?: string;
  items: { title: string; category: string; author: string }[];
}

describe("Table", () => {
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

  const TOP_ACTIONS: TableActionsProps[] = [
    {
      caption: "Delete",
      icon: RiDeleteBin2Line,
      onClick: () => {
        console.log("Delete clicked");
      },
    },
    {
      caption: "Copy",
      icon: RiClipboardFill,
      onClick: () => {
        console.log("Copy clicked");
      },
    },
  ];

  const columns: ColumnTableProps[] = [
    {
      id: "title",
      caption: "Title",
      sortable: false,
      width: "45%",
    },
    {
      id: "category",
      caption: "Category",
      sortable: false,
      width: "30%",
    },
    {
      id: "author",
      caption: "Author",
      sortable: false,
      width: "25%",
    },
  ];

  const rows = TABLE_ITEMS;

  const ONE_ROW_ACTION = (rowId: string): TipMenuItemProps[] => {
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

  const ROW_ACTIONS = (rowId: string): TipMenuItemProps[] => {
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

  context("pagination", () => {
    const DEFAULT_TOP_ACTIONS: TableActionsProps[] = [
      {
        caption: "Copy",
        icon: RiArrowUpSLine,
        onClick: () => {
          console.log("Copy clicked");
        },
      },
    ];

    context("with pagination wrapper style", () => {
      context("when given width full and justify-end", () => {
        it("renders on the end content", () => {
          cy.mount(
            <Table
              selectable
              paginationWrapperStyle={css`
                width: 100%;
                justify-content: end;
              `}
              tableRowContainerStyle={css`
                max-height: 400px;
              `}
              selectedItems={[
                "Tech Articles-Understanding React 18-Frontend-John Doe",
              ]}
              columns={columns}
            >
              {TABLE_ITEMS?.map((groupValue, groupIndex) => (
                <Table.Row.Group
                  key={groupIndex}
                  title={groupValue.title}
                  subtitle={groupValue.subtitle}
                >
                  {groupValue.items.map((rowValue, rowIndex) => (
                    <Table.Row
                      key={rowIndex}
                      rowId={`${groupValue.title}-${rowValue.title}-${rowValue.category}-${rowValue.author}`}
                      content={[
                        rowValue.title,
                        rowValue.category,
                        rowValue.author,
                      ]}
                      actions={ROW_ACTIONS}
                    />
                  ))}
                </Table.Row.Group>
              ))}
            </Table>
          );

          cy.findByLabelText("pagination-wrapper")
            .should("have.css", "width", "432px")
            .and("have.css", "justify-content", "end");
        });
      });
    });

    context("with totalSelectedItemStyle", () => {
      context("when given 100px", () => {
        it("renders text with 100px", () => {
          cy.mount(
            <Table
              selectable
              totalSelectedItemStyle={css`
                font-size: 100px;
              `}
              tableRowContainerStyle={css`
                max-height: 400px;
              `}
              selectedItems={[
                "Tech Articles-Understanding React 18-Frontend-John Doe",
              ]}
              columns={columns}
            >
              {TABLE_ITEMS?.map((groupValue, groupIndex) => (
                <Table.Row.Group
                  key={groupIndex}
                  title={groupValue.title}
                  subtitle={groupValue.subtitle}
                >
                  {groupValue.items.map((rowValue, rowIndex) => (
                    <Table.Row
                      key={rowIndex}
                      rowId={`${groupValue.title}-${rowValue.title}-${rowValue.category}-${rowValue.author}`}
                      content={[
                        rowValue.title,
                        rowValue.category,
                        rowValue.author,
                      ]}
                      actions={ROW_ACTIONS}
                    />
                  ))}
                </Table.Row.Group>
              ))}
            </Table>
          );

          cy.findByLabelText("pagination-selected-item").should(
            "have.css",
            "font-size",
            "100px"
          );
        });
      });
    });

    context("with paginationNumberStyle", () => {
      context("when given 30px", () => {
        it("renders text with 30px", () => {
          cy.mount(
            <Table
              selectable
              showPagination
              pageNumberText={30}
              paginationNumberStyle={css`
                font-size: 30px;
              `}
              tableRowContainerStyle={css`
                max-height: 400px;
              `}
              selectedItems={[
                "Tech Articles-Understanding React 18-Frontend-John Doe",
              ]}
              columns={columns}
            >
              {TABLE_ITEMS?.map((groupValue, groupIndex) => (
                <Table.Row.Group
                  key={groupIndex}
                  title={groupValue.title}
                  subtitle={groupValue.subtitle}
                >
                  {groupValue.items.map((rowValue, rowIndex) => (
                    <Table.Row
                      key={rowIndex}
                      rowId={`${groupValue.title}-${rowValue.title}-${rowValue.category}-${rowValue.author}`}
                      content={[
                        rowValue.title,
                        rowValue.category,
                        rowValue.author,
                      ]}
                      actions={ROW_ACTIONS}
                    />
                  ))}
                </Table.Row.Group>
              ))}
            </Table>
          );

          cy.findByLabelText("pagination-number").should(
            "have.css",
            "font-size",
            "30px"
          );
          cy.findByText("Pg. 30");
        });
      });
    });
  });

  context("with summary", () => {
    interface TableSummaryProps {
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

    const TABLE_SUMMARY: TableSummaryProps[] = [
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

    function parseCost(val: string) {
      return Number(val.replace(/,/g, ""));
    }

    function calculateTotals(groups: TableSummaryProps[]) {
      let totalCost = 0;
      let totalQty = 0;

      groups.map((group) =>
        group.items.map((item) => {
          totalCost += parseCost(item.cost);
          totalQty += Number(item.quantity);
        })
      );

      return {
        totalCost,
        totalQty,
      };
    }

    const DEFAULT_TOP_ACTIONS: TableActionsProps[] = [
      {
        caption: "Copy",
        icon: RiArrowUpSLine,
        onClick: () => {
          console.log("Copy clicked");
        },
      },
    ];

    const { totalCost, totalQty } = calculateTotals(TABLE_SUMMARY);

    it("renders summary on footer", () => {
      cy.mount(
        <Table
          tableRowContainerStyle={css`
            max-height: 400px;
          `}
          columns={columns}
          actions={DEFAULT_TOP_ACTIONS}
          sumRow={[
            {
              span: 2,
              content: "Total",
              bold: true,
            },
            {
              content: totalCost.toLocaleString("en-US"),
            },
            {
              content: totalQty,
            },
          ]}
          searchable
        >
          {TABLE_SUMMARY?.map((groupValue, groupIndex) => (
            <Table.Row.Group
              key={groupIndex}
              title={groupValue.title}
              subtitle={groupValue.subtitle}
            >
              {groupValue.items.map((rowValue, rowIndex) => (
                <Table.Row
                  key={rowIndex}
                  rowId={`${groupValue.id}-${rowValue.cost}-${rowValue.itemId}-${rowValue.name}-${rowValue.quantity}`}
                  content={[
                    rowValue.itemId,
                    rowValue.name,
                    rowValue.cost,
                    rowValue.quantity,
                  ]}
                  actions={ROW_ACTIONS}
                />
              ))}
            </Table.Row.Group>
          ))}
        </Table>
      );

      cy.findByText("Total").should("have.css", "font-weight", "600");
      cy.findByText("32,000").should("have.css", "font-weight", "400");
      cy.findByText("22").should("have.css", "font-weight", "400");
    });

    context("with selectable", () => {
      it("renders with selectable and add padding right on wrapper", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={DEFAULT_TOP_ACTIONS}
            sumRow={[
              {
                span: 2,
                content: "Total",
                bold: true,
              },
              {
                content: totalCost.toLocaleString("en-US"),
              },
              {
                content: totalQty,
              },
            ]}
            searchable
          >
            {TABLE_SUMMARY?.map((groupValue, groupIndex) => (
              <Table.Row.Group
                key={groupIndex}
                title={groupValue.title}
                subtitle={groupValue.subtitle}
              >
                {groupValue.items.map((rowValue, rowIndex) => (
                  <Table.Row
                    key={rowIndex}
                    rowId={`${groupValue.id}-${rowValue.cost}-${rowValue.itemId}-${rowValue.name}-${rowValue.quantity}`}
                    content={[
                      rowValue.itemId,
                      rowValue.name,
                      rowValue.cost,
                      rowValue.quantity,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findAllByLabelText("table-summary-wrapper")
          .eq(0)
          .should("have.css", "padding-left", "42px");
      });
    });
  });

  context("with selectable", () => {
    context("checkbox style", () => {
      it("renders with transparent wrapper", () => {
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

        const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

        const rawRows = Array.from({ length: 20 }, (_, i) => ({
          name: `Load Balancer ${i + 1}`,
          type: TYPES_DATA[i % TYPES_DATA.length],
        }));

        cy.mount(
          <Table selectable columns={columns}>
            {rawRows?.map((row, index) => (
              <Table.Row key={index} rowId={`${row.name}-${row.type}`}>
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
        );

        cy.findAllByLabelText("input-wrapper-checkbox")
          .eq(0)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
        cy.findAllByLabelText("input-wrapper-checkbox")
          .eq(1)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
        cy.findAllByLabelText("input-wrapper-checkbox")
          .eq(2)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
      });
    });

    context("when initialize", () => {
      it("renders content with checked value", () => {
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
        const selectedItems = [
          "Load Balancer 1-HTTP",
          "Load Balancer 3-TCP",
          "Load Balancer 4-UDP",
        ];

        const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

        const rawRows = Array.from({ length: 20 }, (_, i) => ({
          name: `Load Balancer ${i + 1}`,
          type: TYPES_DATA[i % TYPES_DATA.length],
        }));

        cy.mount(
          <Table selectable selectedItems={selectedItems} columns={columns}>
            {rawRows?.map((row, index) => (
              <Table.Row key={index} rowId={`${row.name}-${row.type}`}>
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
        );

        cy.get('input[type="checkbox"]').eq(0).should("not.be.checked");
        cy.get('input[type="checkbox"]').eq(1).should("be.checked");
        cy.get('input[type="checkbox"]').eq(2).should("not.be.checked");
        cy.get('input[type="checkbox"]').eq(3).should("be.checked");
        cy.get('input[type="checkbox"]').eq(4).should("be.checked");
      });
    });

    context("when given totalSelectedItemText", () => {
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

      const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

      const rawRows = Array.from({ length: 20 }, (_, i) => ({
        name: `Load Balancer ${i + 1}`,
        type: TYPES_DATA[i % TYPES_DATA.length],
      }));
      it("renders with text", () => {
        cy.mount(
          <Table selectable columns={columns}>
            {rawRows?.map((row, index) => (
              <Table.Row key={index} rowId={`${row.name}-${row.type}`}>
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
        );

        cy.findByLabelText("header-wrapper").should("not.exist");
        cy.findByText("20 items selected").should("not.exist");
        cy.get('input[type="checkbox"]').eq(0).click();
        cy.findByLabelText("header-wrapper").should("exist");
        cy.findByText("20 items selected").should("exist");
      });

      context("when given function", () => {
        it("renders with customize text", () => {
          cy.mount(
            <Table
              selectable
              totalSelectedItemText={(count) => `${count} email selected`}
              columns={columns}
            >
              {rawRows?.map((row, index) => (
                <Table.Row key={index} rowId={`${row.name}-${row.type}`}>
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
          );

          cy.findByLabelText("header-wrapper").should("not.exist");
          cy.findByText("20 email selected").should("not.exist");
          cy.get('input[type="checkbox"]').eq(0).click();
          cy.findByLabelText("header-wrapper").should("exist");
          cy.findByText("20 email selected").should("exist");
        });
      });

      context("when given null", () => {
        it("renders without number of selected text", () => {
          cy.mount(
            <Table selectable totalSelectedItemText={null} columns={columns}>
              {rawRows?.map((row, index) => (
                <Table.Row key={index} rowId={`${row.name}-${row.type}`}>
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
          );

          cy.findByLabelText("header-wrapper").should("not.exist");
          cy.findByText("items selected").should("not.exist");
          cy.get('input[type="checkbox"]').eq(0).click();
          cy.findByLabelText("header-wrapper").should("not.exist");
          cy.findByText("items selected").should("not.exist");
        });
      });
    });
  });

  context("with top actions", () => {
    context("when given default", () => {
      const DEFAULT_TOP_ACTIONS: TableActionsProps[] = [
        {
          caption: "Copy",
          icon: RiArrowUpSLine,
          onClick: () => {
            console.log("Copy clicked");
          },
        },
      ];

      it("renders default button", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={DEFAULT_TOP_ACTIONS}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findByText("Copy").click();

        cy.wait(100);
        cy.get("@consoleLog").should("have.been.calledWith", "Copy clicked");
      });
    });

    context("when given subMenu", () => {
      const TIP_MENU_ITEMS = [
        {
          caption: "Report Phishing",
          icon: RiSpam2Line,
          iconColor: "blue",
          onClick: () => console.log("Phishing reported"),
        },
        {
          caption: "Report Junk",
          icon: RiForbid2Line,
          iconColor: "red",
          onClick: () => console.log("Junk reported"),
        },
      ];

      const DEFAULT_TOP_ACTIONS: TableActionsProps[] = [
        {
          caption: "Copy",
          icon: RiArrowUpSLine,
          onClick: () => {
            console.log("Copy clicked");
          },
          subMenu: ({ list }) => list(TIP_MENU_ITEMS),
          showSubMenuOn: "self",
        },
      ];

      it("renders button self to open tip.", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={DEFAULT_TOP_ACTIONS}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findByText("Copy").click();

        cy.wait(100);
        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "Copy clicked"
        );
      });

      it("renders slightly closer (4px) than usual", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={DEFAULT_TOP_ACTIONS}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByText("Copy").click();
        cy.findAllByLabelText("button-tip-menu-container")
          .eq(0)
          .should("have.css", "transform", "matrix(1, 0, 0, 1, 0, -4)");
      });
    });

    context("when given capsule", () => {
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

      const DEFAULT_TOP_ACTIONS: TableActionsProps[] = [
        {
          type: "capsule",
          capsuleProps: {
            activeTab: "new",
            tabs: VIEW_MODES,
          },
        },
      ];

      it("renders capsule button", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={DEFAULT_TOP_ACTIONS}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByText("New").should("exist");
        cy.findByText("List").should("exist");
      });
    });
  });

  context("with searchable", () => {
    context("when there are action buttons and right-side info panel", () => {
      it("renders searchbox the middle", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={TOP_ACTIONS}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "margin-left",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "margin-right",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "max-height",
          "33px"
        );
      });
    });
    context("when there is only right-side info panel", () => {
      it("renders searchbox in the left side", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "margin-right",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "not.have.css",
          "margin-left",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "max-height",
          "33px"
        );
      });
    });

    context("When there is action buttons and no right-side panel", () => {
      it("renders searchbox in the right side", () => {
        cy.mount(
          <Table
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={TOP_ACTIONS}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "margin-left",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "not.have.css",
          "margin-right",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "max-height",
          "33px"
        );
      });
    });

    context("When there is no action buttons and no right-side panel", () => {
      it("renders searchbox in the all row", () => {
        cy.mount(
          <Table
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );

        cy.findByLabelText("textbox-search-wrapper").should(
          "not.have.css",
          "margin-left",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "not.have.css",
          "margin-right",
          "40px"
        );
        cy.findByLabelText("textbox-search-wrapper").should(
          "have.css",
          "max-height",
          "33px"
        );
      });
    });
  });

  context("with row actions", () => {
    context("when only one action", () => {
      it("render action button", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={TOP_ACTIONS}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ONE_ROW_ACTION}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByLabelText("table-row").eq(2).trigger("mouseover");
        cy.findAllByLabelText("action-button")
          .eq(2)
          .should("be.visible")
          .and("have.attr", "title", "Delete")
          .click();

        cy.wait(100);
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "Tech Articles-Async Patterns in JS was deleted"
        );
      });
    });
    context("when given multiple actions", () => {
      it("render with tip menu", () => {
        cy.mount(
          <Table
            selectable
            tableRowContainerStyle={css`
              max-height: 400px;
            `}
            columns={columns}
            actions={TOP_ACTIONS}
            searchable
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
                    rowId={`${groupValue.title}-${rowValue.title}`}
                    content={[
                      rowValue.title,
                      rowValue.category,
                      rowValue.author,
                    ]}
                    actions={ROW_ACTIONS}
                  />
                ))}
              </Table.Row.Group>
            ))}
          </Table>
        );
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByLabelText("table-row").eq(2).trigger("mouseover");
        cy.findAllByLabelText("action-button")
          .eq(2)
          .should("be.visible")
          .click();
        cy.findByText("Edit").click();

        cy.wait(100);
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "Tech Articles-Async Patterns in JS was edited"
        );
      });
    });
  });
});
