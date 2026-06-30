import {
  RiArchive2Fill,
  RiArrowDownLine,
  RiArrowUpDownLine,
  RiArrowUpLine,
  RiArrowUpSLine,
  RiBookMarkedLine,
  RiCheckboxMultipleLine,
  RiClipboardFill,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
  RiForbid2Line,
  RiInformationLine,
  RiReactjsLine,
  RiRefreshLine,
  RiSettings3Line,
  RiSpam2Line,
} from "@remixicon/react";
import {
  TableColumn,
  TableSubMenuList,
  Table,
  TableAction,
  TableProps,
  TableRowProps,
  TableRowGroupProps,
  TableSummaryRowColumn,
  TableColumnAction,
} from "./../../components/table";
import { TipMenuItemProps } from "./../../components/tip-menu";
import styled, { css } from "styled-components";
import { CapsuleTab } from "./../../components/capsule";
import { Button } from "./../../components/button";
import { Card } from "./../../components/card";
import { ReactNode, useMemo, useState } from "react";
import { generateSentence } from "./../../lib/text";
import { TableThemeConfig, useTheme } from "./../../theme";

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

interface TableItemProps {
  title: string;
  subtitle?: string;
  items: { title: string; category: string; author: string }[];
}

describe("Table", () => {
  const columnsBasic: TableColumn[] = [
    {
      id: "name",
      caption: "Name",
    },
    {
      id: "type",
      caption: "Type",
    },
  ];

  const VIEW_MODES: CapsuleTab[] = [
    {
      id: "new",
      title: "New",
    },
    {
      id: "list",
      title: "List",
    },
  ];

  const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

  const rawRows = Array.from({ length: 20 }, (_, i) => ({
    name: `Load Balancer ${i + 1}`,
    type: TYPES_DATA[i % TYPES_DATA.length],
  }));

  function BasicTable(
    props: Partial<Omit<TableProps, "children">> & { hasRowGroup?: boolean }
  ) {
    const [selectedItems, setSelectedItems] = useState([]);

    const pageNumberText = props?.labels?.pageNumberText ?? "12";

    const groupedRows = props.hasRowGroup
      ? TYPES_DATA.map((type) => ({
          type,
          rows: rawRows.filter((r) => r.type === type),
        }))
      : null;

    return (
      <Table
        selectable
        columns={columnsBasic}
        selectedItems={selectedItems}
        onItemsSelected={setSelectedItems}
        labels={{
          pageNumberText: pageNumberText,
        }}
        {...props}
      >
        {props.hasRowGroup
          ? groupedRows?.map((group, gi) => (
              <Table.Row.Group key={gi} id={group.type}>
                {group.rows.map((row, ri) => (
                  <Table.Row
                    key={`${group.type}-${ri}`}
                    rowId={`${row.name}-${row.type}`}
                  >
                    {[row.name, row.type].map((cell) => (
                      <Table.Row.Cell key={`${row.name}-${cell}`}>
                        {cell}
                      </Table.Row.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Row.Group>
            ))
          : rawRows?.map((row, index) => (
              <Table.Row key={index} rowId={`${row.name}-${row.type}`}>
                {[row.name, row.type].map((rowCell) => (
                  <Table.Row.Cell key={`${row.name}-${row.type}-${rowCell}`}>
                    {rowCell}
                  </Table.Row.Cell>
                ))}
              </Table.Row>
            ))}
      </Table>
    );
  }

  context("loose", () => {
    function ProductTableLoose({ loose = true }: { loose?: boolean }) {
      const { currentTheme } = useTheme();
      const tableTheme = currentTheme?.table;

      interface LoadBalancerRow {
        id: string;
        name: string;
        type: string;
        region: string;
        status: string;
        version: string;
        uptime: string;

        requests: number;
        latency: number;
        errorRate: number;
        cpu: number;
        memory: number;
        connections: number;
        bandwidth: number;

        zone: string;
        provider: string;
      }

      const TYPES_DATA = [
        {
          name: "HTTP",
          description: "Standard protocol for transferring web pages.",
        },
        {
          name: "HTTPS",
          description: "Secure version of HTTP using TLS encryption.",
        },
        {
          name: "TCP",
          description: "Reliable, connection-oriented transport protocol.",
        },
        {
          name: "UDP",
          description:
            "Fast, connectionless protocol for low-latency communication.",
        },
        {
          name: "QUIC",
          description:
            "Modern transport protocol providing faster and more secure connections.",
        },
      ];
      const REGIONS = ["SG", "ID", "US-W", "EU", "JP"];
      const STATUS = ["active", "idle", "degraded"];
      const PROVIDERS = [
        "AWS",
        "Google Cloud",
        "Microsoft Azure",
        "Cloudflare",
        "DigitalOcean",
        "Oracle Cloud",
        "Alibaba Cloud",
        "IBM Cloud",
        "Linode",
        "Vultr",
        "Hetzner",
        "Akamai",
      ];

      const initialRows = useMemo<LoadBalancerRow[]>(
        () =>
          Array.from({ length: 15 }, (_, i) => {
            const type = TYPES_DATA[i % TYPES_DATA.length].name;
            const region = REGIONS[i % REGIONS.length];
            const status = STATUS[i % STATUS.length];

            const seed = (i + 1) * 17;
            const req = 200 + (seed % 200);
            const lat = 50 + (seed % 50);
            const errRate = (seed % 500) / 100;
            const cpu = 80 + (seed % 80);
            const mem = 70 + (seed % 70);
            const conn = 1000 + (seed % 1000);
            const bw = 100 + (seed % 100);
            const provider = PROVIDERS[i % PROVIDERS.length];

            return {
              id: `lb-${i}`,
              name: `lb-${region}-${i + 1}`,
              type,
              region,
              status,
              version: `v${1 + (i % 3)}.${i % 10}`,
              uptime: `${10 + i}d`,

              requests: req,
              latency: lat,
              errorRate: errRate,
              cpu,
              memory: mem,
              connections: conn,
              bandwidth: bw,

              zone: `zone-${(i % 3) + 1}`,
              provider,
            };
          }),
        []
      );

      const [rows, setRows] = useState(initialRows);
      const [activeTab, setActiveTab] = useState({
        withCheckbox: false,
        withActions: false,
        withSummary: false,
        withSorter: false,
      });

      const [status, setStatus] = useState<"desc" | "asc" | "original">(
        "original"
      );

      const TOP_ACTIONS: TableAction[] = [
        {
          type: "button",
          caption: "With Checkbox",
          pressed: activeTab.withCheckbox,
          icon: { image: RiCheckboxMultipleLine },
          onClick: () =>
            setActiveTab((prev) => ({
              ...prev,
              withCheckbox: !prev.withCheckbox,
            })),
        },
        {
          type: "button",
          caption: "With Row Actions",
          pressed: activeTab.withActions,
          icon: { image: RiSettings3Line },
          onClick: () =>
            setActiveTab((prev) => ({
              ...prev,
              withActions: !prev.withActions,
            })),
        },
        {
          type: "button",
          caption: "With Summary",
          pressed: activeTab.withSummary,
          icon: { image: RiBookMarkedLine },
          onClick: () =>
            setActiveTab((prev) => ({
              ...prev,
              withSummary: !prev.withSummary,
            })),
        },
        {
          type: "button",
          caption: "With Sorter",
          pressed: activeTab.withSorter,
          icon: { image: RiArrowUpDownLine },
          onClick: () =>
            setActiveTab((prev) => ({ ...prev, withSorter: !prev.withSorter })),
        },
      ];

      const ROW_ACTION = (rowId: string): TableSubMenuList[] => [
        {
          caption: "Edit",
          icon: { image: RiArrowUpSLine },
          onClick: () => console.log(`${rowId} was edited`),
        },
        {
          caption: "Delete",
          icon: { image: RiDeleteBin2Fill },
          variant: "danger",
          onClick: () => console.log(`${rowId} was deleted`),
        },
      ];

      const handleSortingRequested = ({
        mode,
        column,
      }: {
        mode: "asc" | "desc" | "original";
        column: keyof (typeof initialRows)[number];
      }) => {
        setStatus(mode);

        if (mode === "original") {
          setRows(initialRows);
          return;
        }

        const sorted = [...rows].sort((a, b) => {
          const aVal = a[column];
          const bVal = b[column];

          if (typeof aVal === "string" && typeof bVal === "string") {
            return mode === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }

          if (typeof aVal === "number" && typeof bVal === "number") {
            return mode === "asc" ? aVal - bVal : bVal - aVal;
          }

          return 0;
        });

        setRows(sorted);
      };

      const COLUMN_ACTIONS = (
        columnId: keyof (typeof initialRows)[number]
      ): TableSubMenuList[] => {
        return [
          {
            caption: "Sort Ascending",
            icon: {
              image: RiArrowUpLine,
            },
            onClick: () => {
              handleSortingRequested({ mode: "asc", column: columnId });
            },
          },
          {
            caption: "Sort Descending",
            icon: {
              image: RiArrowDownLine,
            },
            onClick: () => {
              handleSortingRequested({ mode: "desc", column: columnId });
            },
          },
          {
            caption: "Reset Sorting",
            icon: {
              image: RiArrowUpDownLine,
            },
            onClick: () => {
              handleSortingRequested({ mode: "original", column: columnId });
            },
          },
        ];
      };

      const imageStatus =
        status === "asc"
          ? RiArrowUpLine
          : status === "desc"
            ? RiArrowDownLine
            : RiArrowUpDownLine;

      const columnActions = (
        id: keyof (typeof initialRows)[number]
      ): TableColumnAction | null => {
        if (!activeTab.withSorter) {
          return null;
        }

        if (id === "type") {
          return {
            title: "Info Action",
            icon: {
              image: RiInformationLine,
            },
            subMenu: ({ show }) =>
              show(
                TYPES_DATA.map((protocol, index) => (
                  <ProtocolItem $theme={tableTheme} key={index}>
                    <ProtocolName $theme={tableTheme}>
                      {protocol.name}
                    </ProtocolName>
                    <ProtocolDescription $theme={tableTheme}>
                      {protocol.description}
                    </ProtocolDescription>
                  </ProtocolItem>
                )),
                {
                  drawerStyle: css`
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    padding: 6px;
                  `,
                }
              ),
          };
        }

        return {
          title: "Sorter Action",
          icon: {
            image: imageStatus,
          },
          subMenu: ({ list }) => list(COLUMN_ACTIONS(id)),
        };
      };

      const columns: TableColumn[] = [
        { id: "name", caption: "Name", actions: columnActions },
        { id: "type", caption: "Protocol", actions: columnActions },
        { id: "region", caption: "Region" },
        { id: "status", caption: "Status" },
        { id: "version", caption: "Version" },
        { id: "uptime", caption: "Uptime" },
        { id: "requests", caption: "Requests/s" },
        { id: "latency", caption: "Latency (ms)" },
        { id: "errorRate", caption: "Error Rate" },
        { id: "cpu", caption: "CPU %" },
        { id: "memory", caption: "Memory %" },
        { id: "connections", caption: "Connections" },
        { id: "bandwidth", caption: "Bandwidth" },
        { id: "zone", caption: "Zone" },
        { id: "provider", caption: "Provider" },
      ];

      const totals = useMemo(
        () => ({
          requests: rows.reduce((s, r) => s + r.requests, 0),
          latency: Math.round(
            rows.reduce((s, r) => s + r.latency, 0) / rows.length
          ),
          errorRate: (
            rows.reduce((s, r) => s + r.errorRate, 0) / rows.length
          ).toFixed(2),
          cpu: Math.round(rows.reduce((s, r) => s + r.cpu, 0) / rows.length),
          memory: Math.round(
            rows.reduce((s, r) => s + r.memory, 0) / rows.length
          ),
          connections: rows.reduce((s, r) => s + r.connections, 0),
          bandwidth: rows.reduce((s, r) => s + r.bandwidth, 0),
        }),
        [rows]
      );

      const sampleRows = rows.map((row) => (
        <Table.Row
          key={row.id}
          rowId={row.id}
          actions={activeTab.withActions ? ROW_ACTION : null}
          content={[
            row.name,
            row.type,
            row.region,
            row.status,
            row.version,
            row.uptime,
            row.requests,
            row.latency,
            row.errorRate,
            row.cpu,
            row.memory,
            row.connections,
            row.bandwidth,
            row.zone,
            row.provider,
          ]}
        />
      ));

      const sumRow: TableSummaryRowColumn[] = [
        { content: "Totals / Avg", bold: true },
        { content: "" },
        { content: "" },
        { content: "" },
        { content: "" },
        { content: "" },
        { content: totals.requests, bold: true },
        { content: `${totals.latency} ms`, bold: true },
        { content: `${totals.errorRate}%`, bold: true },
        { content: `${totals.cpu}%`, bold: true },
        { content: `${totals.memory}%`, bold: true },
        { content: totals.connections, bold: true },
        { content: `${totals.bandwidth}Mbps`, bold: true },
        { content: "" },
        { content: "" },
      ];

      return (
        <Table
          styles={{
            tableBodyStyle: css`
              max-height: 250px;
            `,
          }}
          loose={loose}
          actions={TOP_ACTIONS}
          columns={columns}
          selectable={activeTab.withCheckbox}
          sumRow={activeTab.withSummary && sumRow}
        >
          {sampleRows}
        </Table>
      );
    }

    context("when given false", () => {
      it("should render the body element with overflow x hidden", () => {
        cy.mount(<ProductTableLoose loose={false} />);

        cy.findByLabelText("table-body")
          .parent()
          .should("have.css", "overflow-x", "hidden")
          .and("have.css", "overflow-y", "scroll");
      });
    });

    context("when given true", () => {
      it("should render the by overflow auto in body element", () => {
        cy.mount(<ProductTableLoose loose />);

        cy.findByLabelText("table-body")
          .parent()
          .should("have.css", "overflow-x", "scroll")
          .and("have.css", "overflow-y", "scroll");
      });

      context("height in table header", () => {
        it("renders height with 65px", () => {
          cy.mount(<ProductTableLoose loose />);
          cy.findByLabelText("table-header").should(
            "have.css",
            "height",
            "65px"
          );
        });

        context("when given actions in table column", () => {
          it("should consistently with height 65px", () => {
            cy.mount(<ProductTableLoose loose />);
            cy.findByLabelText("table-header").should(
              "have.css",
              "height",
              "65px"
            );
            cy.findAllByLabelText("column-action").should("not.exist");

            cy.findAllByRole("button").eq(3).click();

            cy.findByLabelText("table-header").should(
              "have.css",
              "height",
              "65px"
            );
            cy.findAllByLabelText("table-column-action")
              .should("exist")
              .and("have.length", 2);
          });
        });
      });

      context("loose effect", () => {
        context("first column", () => {
          it("shouldn't render loose effect on the first column", () => {
            cy.mount(<ProductTableLoose loose />);

            cy.findAllByLabelText("table-row-cell")
              .first()
              .then(($el) => {
                const after = window.getComputedStyle($el[0], "::after");

                expect(after.backgroundImage).to.not.equal(
                  "linear-gradient(to right, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0))"
                );
              });
          });

          context("when scrolling to the right", () => {
            it("should render loose effect on the first column", () => {
              cy.mount(<ProductTableLoose loose />);

              cy.findByLabelText("table-body")
                .parent()
                .then(($el) => {
                  const el = $el[0];

                  const scrollToEnd = () => {
                    const maxScroll = el.scrollWidth - el.clientWidth;
                    el.scrollLeft = maxScroll;
                    el.dispatchEvent(new Event("scroll", { bubbles: true }));

                    if (el.scrollLeft < maxScroll) {
                      scrollToEnd();
                    }
                  };

                  scrollToEnd();
                });
              cy.wait(300);

              cy.findAllByLabelText("table-row-cell")
                .first()
                .then(($el) => {
                  const after = window.getComputedStyle($el[0], "::after");

                  expect(after.backgroundImage).to.equal(
                    "linear-gradient(to right, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0))"
                  );
                });
            });
          });
        });

        context("last column", () => {
          context("with actions", () => {
            it("should render loose effect on the last column", () => {
              cy.mount(<ProductTableLoose loose />);

              cy.findAllByLabelText("action-button").eq(1).click();
              cy.findAllByLabelText("action-button").eq(2).click();

              cy.wait(300);

              cy.get(".coneto-button")
                .eq(4)
                .then(($el) => {
                  const after = window.getComputedStyle($el[0], "::before");

                  expect(after.backgroundImage).to.equal(
                    "linear-gradient(to left, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0))"
                  );
                });
            });

            it("renders header loose actions with width 48px", () => {
              cy.mount(<ProductTableLoose loose />);

              cy.findAllByLabelText("action-button").eq(1).click();
              cy.findAllByLabelText("action-button").eq(2).click();

              cy.wait(300);

              cy.findByLabelText("header-row-loose-action")
                .should("have.css", "width", "48px")
                .then(($el) => {
                  const after = window.getComputedStyle($el[0], "::before");

                  expect(after.backgroundImage).to.equal(
                    "linear-gradient(to left, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0))"
                  );
                });
            });

            it("renders summary row loose actions with width 48px", () => {
              cy.mount(<ProductTableLoose loose />);

              cy.findAllByLabelText("action-button").eq(1).click();
              cy.findAllByLabelText("action-button").eq(2).click();

              cy.wait(300);

              cy.findByLabelText("summary-row-loose-action")
                .should("have.css", "width", "48px")
                .then(($el) => {
                  const after = window.getComputedStyle($el[0], "::before");

                  expect(after.backgroundImage).to.equal(
                    "linear-gradient(to left, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0))"
                  );
                });
            });

            context("when scrolling to the right", () => {
              it("shouldn't render loose effect on the last column", () => {
                cy.mount(<ProductTableLoose loose />);

                cy.findAllByLabelText("action-button").eq(1).click();
                cy.findAllByLabelText("action-button").eq(2).click();

                cy.findByLabelText("table-body")
                  .parent()
                  .then(($el) => {
                    const el = $el[0];

                    const scrollToEnd = () => {
                      const maxScroll = el.scrollWidth - el.clientWidth;
                      el.scrollLeft = maxScroll;
                      el.dispatchEvent(new Event("scroll", { bubbles: true }));

                      if (el.scrollLeft < maxScroll) {
                        scrollToEnd();
                      }
                    };

                    scrollToEnd();
                  });

                cy.wait(300);

                cy.get(".coneto-button")
                  .eq(4)
                  .then(($el) => {
                    const after = window.getComputedStyle($el[0], "::before");

                    expect(after.backgroundImage).to.not.equal(
                      "linear-gradient(to right, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0))"
                    );
                  });
              });
            });
          });

          context("when activate summary", () => {
            it("renders the summary row loose action", () => {
              cy.mount(<ProductTableLoose loose />);

              cy.findAllByLabelText("action-button").eq(1).click();
              cy.findAllByLabelText("action-button").eq(2).click();
              cy.wait(300);

              cy.findByLabelText("summary-row-loose-action")
                .should("exist")
                .and("have.css", "width", "48px");
            });
          });
        });
      });

      context("with checkbox", () => {
        it("renders checkbox stick in the left side", () => {
          cy.mount(<ProductTableLoose loose />);

          cy.findAllByLabelText("action-button").eq(0).click();

          cy.get(".coneto-checkbox")
            .eq(0)
            .parent()
            .should("be.visible")
            .and("have.css", "position", "sticky")
            .and("have.css", "left", "0px");

          cy.findAllByText("AWS").eq(0).should("not.be.visible");

          cy.findAllByText("AWS").eq(0).scrollIntoView().should("be.visible");

          cy.get(".coneto-checkbox").eq(0).parent().should("be.visible");
        });

        it("renders height same with table-row-cell", () => {
          cy.mount(<ProductTableLoose loose />);

          cy.findAllByLabelText("action-button").eq(0).click();

          ["field-lane-control", "table-row-cell"].forEach((label) => {
            cy.findAllByLabelText(label)
              .eq(0)
              .should("have.css", "height", "48px");
          });
        });
      });

      context("with actions", () => {
        it("renders the row actions sticky in the right side", () => {
          cy.mount(<ProductTableLoose loose />);

          cy.findAllByLabelText("action-button").eq(1).click();
          cy.wait(300);

          cy.get(".coneto-button")
            .eq(4)
            .should("have.css", "position", "sticky")
            .and("have.css", "right", "0px");
        });
      });

      context("with summary", () => {
        it("renders the first column summary stick in the left side", () => {
          cy.mount(<ProductTableLoose loose />);

          cy.findAllByLabelText("action-button").eq(2).click();
          cy.wait(300);

          cy.findByText("Totals / Avg").should("be.visible");

          cy.findAllByText("AWS").eq(0).should("not.be.visible");

          cy.findAllByText("AWS").eq(0).scrollIntoView().should("be.visible");

          cy.findByText("Totals / Avg").should("be.visible");
        });
      });

      context("when scrolling to the right", () => {
        it("shows the most right content", () => {
          cy.mount(<ProductTableLoose loose />);

          cy.findByLabelText("table-body")
            .parent()
            .should("have.css", "overflow-x", "scroll")
            .and("have.css", "overflow-y", "scroll");

          cy.findAllByText("AWS").eq(0).should("not.be.visible");

          cy.findAllByText("AWS").eq(0).scrollIntoView().should("be.visible");
        });

        it("the first column still visible", () => {
          cy.mount(<ProductTableLoose loose />);

          cy.findByText("Name").should("be.visible");
          cy.findByText("lb-SG-1").should("be.visible");
          cy.findByText("lb-ID-2").should("be.visible");

          cy.findAllByText("AWS").eq(0).should("not.be.visible");

          cy.findAllByText("AWS").eq(0).scrollIntoView().should("be.visible");

          cy.findByText("Name").should("be.visible");
          cy.findByText("lb-SG-1").should("be.visible");
          cy.findByText("lb-ID-2").should("be.visible");
        });
      });
    });
  });

  context("columns prop", () => {
    beforeEach(() => {
      const columnsWithShow: TableColumn[] = [
        {
          id: "name",
          caption: "Name",
          actions: () => ({
            subMenu: ({ show }) => show(<div aria-label="test">test</div>),
            className: "test",
            id: "test",
          }),
        },
        {
          id: "type",
          caption: "Type",
          actions: () => ({
            subMenu: ({ show }) => show(<div aria-label="test">test</div>),
            className: "test",
            hidden: true,
          }),
        },
      ];
      cy.mount(<BasicTable columns={columnsWithShow} />);
    });

    context("actions", () => {
      it("renders with height and width 40px", () => {
        cy.findByLabelText("table-column-action")
          .should("have.css", "height", "40px")
          .and("have.css", "width", "40px");
      });

      const ICON_DEFAULT =
        "M11.9498 7.94975L10.5356 9.36396L8.00079 6.828L8.00004 20H6.00004L6.00079 6.828L3.46451 9.36396L2.05029 7.94975L7.00004 3L11.9498 7.94975ZM21.9498 16.0503L17 21L12.0503 16.0503L13.4645 14.636L16.0008 17.172L16 4H18L18.0008 17.172L20.5356 14.636L21.9498 16.0503Z";

      context("icon", () => {
        it("renders with up and down arrow (by default)", () => {
          cy.get("svg path")
            .eq(0)
            .invoke("attr", "d")
            .should("equal", ICON_DEFAULT);
        });
        context("when given another icon", () => {
          it("should not equal value on icon default", () => {
            const columnsWithShow: TableColumn[] = [
              {
                id: "name",
                caption: "Name",
                actions: () => ({
                  subMenu: ({ show }) =>
                    show(<div aria-label="test">test</div>),
                  className: "test",
                  id: "test",
                  icon: {
                    image: RiArchive2Fill,
                  },
                }),
              },
              {
                id: "type",
                caption: "Type",
                actions: () => ({
                  subMenu: ({ show }) =>
                    show(<div aria-label="test">test</div>),
                  className: "test",
                  hidden: true,
                }),
              },
            ];
            cy.mount(<BasicTable columns={columnsWithShow} />);
            cy.get("svg path")
              .eq(0)
              .invoke("attr", "d")
              .should("not.equal", ICON_DEFAULT);
          });
        });
      });

      context("hidden", () => {
        context("when given true in another action", () => {
          it("should renders only with hidden false", () => {
            cy.findByLabelText("table-column-action").should(
              "not.have.length",
              2
            );
          });
        });
      });

      context("id", () => {
        context("when given with test", () => {
          it("should render id with test", () => {
            cy.get("#test").should("exist");
          });
        });
      });

      context("className", () => {
        it("should render coneto-button by default", () => {
          cy.get(".coneto-button").should("exist");
        });

        context("when given test", () => {
          it("should render test", () => {
            cy.get(".test").should("exist");
          });
        });
      });

      context("subMenu", () => {
        context("list()", () => {
          beforeEach(() => {
            const onAscending = cy.stub().as("onAscending");
            const onDescending = cy.stub().as("onDescending");
            const onReset = cy.stub().as("onReset");

            const COLUMN_ACTIONS = (): TableSubMenuList[] => [
              {
                caption: "Sort Ascending",
                icon: { image: RiArrowUpLine },
                onClick: onAscending,
              },
              {
                caption: "Sort Descending",
                icon: { image: RiArrowDownLine },
                onClick: onDescending,
              },
              {
                caption: "Reset Sorting",
                icon: { image: RiArrowUpDownLine },
                onClick: onReset,
              },
            ];

            const columnsWithList: TableColumn[] = [
              {
                id: "name",
                caption: "Name",
                actions: () => ({
                  subMenu: ({ list }) => list(COLUMN_ACTIONS()),
                }),
              },
              {
                id: "type",
                caption: "Type",
              },
            ];
            cy.mount(<BasicTable columns={columnsWithList} />);
          });

          context("when clicking action", () => {
            it("shows the tip-menu", () => {
              cy.findByLabelText("table-column-action").click();
              cy.findByLabelText("tip-menu").should("exist");
            });

            context("when clicking the tip menu item", () => {
              it("should render the console", () => {
                cy.findByLabelText("table-column-action").click();
                cy.findByLabelText("tip-menu").should("exist");
                cy.findByText("Sort Ascending").click();
                cy.get("@onAscending").should("have.been.calledOnce");
              });
            });
          });
        });

        context("show()", () => {
          context("when given show", () => {
            const columnsWithShow: TableColumn[] = [
              {
                id: "name",
                caption: "Name",
                actions: () => ({
                  subMenu: ({ show }) =>
                    show(<div aria-label="test">test</div>),
                }),
              },
              {
                id: "type",
                caption: "Type",
              },
            ];
            it("renders with tooltip container", () => {
              cy.mount(<BasicTable columns={columnsWithShow} />);
              cy.findByLabelText("table-column-action").click();

              cy.findByLabelText("tooltip-drawer").should("exist");
              cy.findByLabelText("test").should("exist");
            });
          });
        });

        context("render()", () => {
          context("when given render", () => {
            const columnWithRender: TableColumn[] = [
              {
                id: "name",
                caption: "Name",
                actions: () => ({
                  subMenu: ({ render }) =>
                    render(<div aria-label="render">render content</div>),
                }),
              },
              {
                id: "type",
                caption: "Type",
              },
            ];
            it("renders just drawer", () => {
              cy.mount(<BasicTable columns={columnWithRender} />);
              cy.findByLabelText("table-column-action").click();

              cy.findByLabelText("tooltip-drawer").should("not.exist");
              cy.findByLabelText("render").should("exist");
            });
          });
        });
      });
    });

    context("styles", () => {
      context("containerStyle", () => {
        context("when given background with red color", () => {
          it("renders background color with rgb(255, 0, 0)", () => {
            cy.mount(
              <BasicTable
                columns={[
                  {
                    id: "name",
                    caption: "Name",

                    styles: {
                      containerStyle: css`
                        background-color: red;
                      `,
                    },
                  },
                  {
                    id: "type",
                    caption: "Type",
                  },
                ]}
              />
            );

            cy.findAllByLabelText("table-row-cell")
              .eq(0)
              .should("have.css", "background-color", "rgb(255, 0, 0)");
          });
        });
      });

      context("labelStyle", () => {
        context("when given blue color", () => {
          it("renders the text column header with rgb(0, 0, 255)", () => {
            cy.mount(
              <BasicTable
                columns={[
                  {
                    id: "name",
                    caption: "Name",

                    styles: {
                      labelStyle: css`
                        color: blue;
                      `,
                    },
                  },
                  {
                    id: "type",
                    caption: "Type",
                  },
                ]}
              />
            );

            cy.findAllByLabelText("table-column-label")
              .eq(0)
              .should("have.css", "color", "rgb(0, 0, 255)");
            cy.findAllByLabelText("table-column-label")
              .eq(1)
              .should("have.css", "color", "rgb(0, 0, 0)");
          });
        });
      });
    });
  });

  context("when children with function", () => {
    type SeparateMode = "row" | "group" | "group-separate-row";

    function TableSeparateContent({ mode = "row" }: { mode?: SeparateMode }) {
      const columns: TableColumn[] = [
        { id: "itemId", caption: "Item ID" },
        { id: "name", caption: "Name", width: "60%" },
      ];

      function TableSeparateRow({ test }: { test: boolean }) {
        return <Table.Row content={["02", "Test 123"]} />;
      }

      function TableSeparateGroup({ test }: { test: boolean }) {
        return (
          <Table.Row.Group title="Group Title" subtitle="Group Subtitle">
            <Table.Row content={["02", "Test 123"]} />
          </Table.Row.Group>
        );
      }

      /**
       * very rare case, but just to make sure that when both separate group
       * and row function are given, it should still render the content correctly/
       */
      function TableSeparateGroupSeparateRow({ test }: { test: boolean }) {
        return (
          <Table.Row.Group title="Group Title" subtitle="Group Subtitle">
            <TableSeparateRow test={true} />
          </Table.Row.Group>
        );
      }

      const contentMap: Record<SeparateMode, ReactNode> = {
        row: <TableSeparateRow test={true} />,
        group: <TableSeparateGroup test={true} />,
        "group-separate-row": <TableSeparateGroupSeparateRow test={true} />,
      };

      return <Table columns={columns}>{contentMap[mode]}</Table>;
    }

    it("should still resolve and render the row content correctly", () => {
      cy.mount(<TableSeparateContent />);

      cy.findByText("02").should("exist");
      cy.findByText("Test 123").should("exist");
    });

    context("with separate group function", () => {
      it("should render the group title and subtitle", () => {
        cy.mount(<TableSeparateContent mode="group" />);

        cy.findByText("Group Title").should("exist");
        cy.findByText("Group Subtitle").should("exist");
      });
    });

    context("when separate group, and separate row function", () => {
      it("should render the group text, and row content", () => {
        cy.mount(<TableSeparateContent mode="group-separate-row" />);

        cy.findByText("Group Title").should("exist");
        cy.findByText("Group Subtitle").should("exist");

        cy.findByText("02").should("exist");
        cy.findByText("Test 123").should("exist");
      });
    });
  });

  context("isLoading", () => {
    context("when given true", () => {
      it("renders spinner ~14px from top and left relative to overlay", () => {
        cy.mount(<BasicTable isLoading />);

        cy.findByLabelText("overlay-blocker").then(($overlay) => {
          const overlayRect = $overlay[0].getBoundingClientRect();

          cy.findByLabelText("circle").then(($spinner) => {
            const spinnerRect = $spinner[0].getBoundingClientRect();

            const paddingTop = spinnerRect.top - overlayRect.top;
            const paddingLeft = spinnerRect.left - overlayRect.left;

            expect(paddingTop).to.be.closeTo(14, 1);
            expect(paddingLeft).to.be.closeTo(14, 1);
          });
        });
      });

      it("renders spinner with padding 4px and with caption loading", () => {
        cy.mount(<BasicTable isLoading />);

        cy.findByText("Loading").should("exist");

        cy.findByLabelText("loading-spinner")
          .should("have.css", "background-color", "rgb(0, 0, 0)")
          .and("have.css", "opacity", "0.8")
          .and("have.css", "padding", "4px 8px 4px 4px");
      });
    });
  });

  context("selected", () => {
    context("when selected", () => {
      it("should render with selected background-color (rgb(219, 234, 254))", () => {
        cy.mount(<BasicTable />);
        cy.findAllByLabelText("table-row")
          .eq(0)
          .should("have.css", "background-color", "rgb(249, 250, 251)");
        cy.findAllByRole("checkbox").eq(1).click();
        cy.findAllByLabelText("table-row")
          .eq(0)
          .trigger("mouseout")
          .should("have.css", "background-color", "rgb(219, 234, 254)");
      });

      context("when hovering the selected item", () => {
        it("should render the hover background-color rgb(231, 242, 252)", () => {
          cy.mount(<BasicTable />);
          cy.findAllByLabelText("table-row")
            .eq(0)
            .should("have.css", "background-color", "rgb(249, 250, 251)");
          cy.findAllByRole("checkbox").eq(1).click();
          cy.findAllByLabelText("table-row")
            .eq(0)
            .trigger("mouseover")
            .should("have.css", "background-color", "rgb(231, 242, 252)");
        });
      });
    });
  });

  context("actions in main table", () => {
    context("when not given type", () => {
      it("should render with button", () => {
        cy.mount(
          <BasicTable
            actions={[
              {
                caption: "Test Button",
              },
            ]}
          />
        );

        cy.findByLabelText("action-button")
          .should("exist")
          .should("have.css", "height", "32px");
        cy.findByLabelText("capsule").should("not.exist");
      });
    });

    context("when given type button", () => {
      it("should render with button component", () => {
        cy.mount(
          <BasicTable
            actions={[
              {
                caption: "Test Button",
                type: "button",
              },
            ]}
          />
        );

        cy.findByLabelText("action-button")
          .should("exist")
          .should("have.css", "height", "32px");

        cy.findByLabelText("capsule").should("not.exist");
      });
    });

    context("when given capsule props with type button", () => {
      it("should render with button with height 32px", () => {
        cy.mount(
          <BasicTable
            actions={[
              {
                caption: "Test Button",
                type: "button",
                capsuleProps: {
                  tabs: VIEW_MODES,
                },
              },
            ]}
          />
        );

        cy.findByLabelText("action-button")
          .should("exist")
          .should("have.css", "height", "32px");
        cy.findByLabelText("capsule").should("not.exist");
      });
    });

    context("when given capsule props with type capsule", () => {
      it("should render with capsule with height 32px", () => {
        cy.mount(
          <BasicTable
            actions={[
              {
                type: "capsule",
                capsuleProps: {
                  activeTab: "1",
                  tabs: VIEW_MODES,
                },
              },
            ]}
          />
        );

        cy.findByLabelText("action-button").should("not.exist");
        cy.findByLabelText("capsule")
          .should("exist")
          .should("have.css", "height", "32px");
      });
    });
  });

  function TableGroup(props: TableRowGroupProps) {
    return (
      <Table
        styles={{
          tableBodyStyle: css`
            max-height: 400px;
          `,
        }}
        columns={columns}
        searchable
      >
        {TABLE_SUMMARY?.map((groupValue, groupIndex) => (
          <Table.Row.Group
            key={groupIndex}
            title={groupValue.title}
            subtitle={groupValue.subtitle}
            {...props}
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
  }

  context("styles", () => {
    context("table row group", () => {
      context("bodyStyle", () => {
        context("when given max-height 150px", () => {
          it("renders the table group with height 150px", () => {
            cy.mount(
              <TableGroup
                styles={{
                  bodyStyle: css`
                    max-height: 150px;
                  `,
                }}
              />
            );

            cy.findAllByLabelText("table-row-group-body")
              .eq(0)
              .should("have.css", "height", "150px");
          });
        });
      });

      context("chevronStyle", () => {
        context("when given margin left 20px", () => {
          it("renders the margin left with 20px", () => {
            cy.mount(
              <TableGroup
                styles={{
                  chevronStyle: css`
                    margin-left: 20px;
                  `,
                }}
              />
            );

            cy.findAllByLabelText("table-row-group-chevron")
              .eq(0)
              .parent()
              .should("have.css", "margin-left", "20px");
          });
        });
      });

      context("titleStyle", () => {
        it("renders the title with size 16px", () => {
          cy.mount(<TableGroup />);

          cy.findAllByLabelText("table-row-group-title")
            .eq(0)
            .should("have.css", "font-size", "16px");
        });

        context("when given size 25px", () => {
          it("renders the title with size 25px", () => {
            cy.mount(
              <TableGroup
                styles={{
                  titleStyle: css`
                    font-size: 25px;
                  `,
                }}
              />
            );

            cy.findAllByLabelText("table-row-group-title")
              .eq(0)
              .should("have.css", "font-size", "25px");
          });
        });
      });

      context("subtitleStyle", () => {
        it("renders the title 14px", () => {
          cy.mount(<TableGroup />);

          cy.findAllByLabelText("table-row-group-subtitle")
            .eq(0)
            .should("have.css", "font-size", "14px");
        });

        context("when given size 25px", () => {
          it("renders the title with size 25px", () => {
            cy.mount(
              <TableGroup
                styles={{
                  subtitleStyle: css`
                    font-size: 25px;
                  `,
                }}
              />
            );

            cy.findAllByLabelText("table-row-group-subtitle")
              .eq(0)
              .should("have.css", "font-size", "25px");
          });
        });
      });

      context("headerStyle", () => {
        it("renders with padding 12px", () => {
          cy.mount(<TableGroup />);

          cy.findAllByLabelText("table-row-group-header")
            .eq(0)
            .should("have.css", "padding", "12px");
        });

        context("when given padding 25px", () => {
          it("renders the header with padding 25px", () => {
            cy.mount(
              <TableGroup
                styles={{
                  headerStyle: css`
                    padding: 25px;
                  `,
                }}
              />
            );

            cy.findAllByLabelText("table-row-group-header")
              .eq(0)
              .should("have.css", "padding", "25px");
          });
        });
      });

      context("headerStyle", () => {
        it("renders with normal gap", () => {
          cy.mount(<TableGroup />);

          cy.findAllByLabelText("table-row-group-text-wrapper")
            .eq(0)
            .should("have.css", "gap", "normal");
        });

        context("when given gap 10px", () => {
          it("renders the wrapper text with gap 10px", () => {
            cy.mount(
              <TableGroup
                styles={{
                  textWrapperStyle: css`
                    gap: 10px;
                  `,
                }}
              />
            );

            cy.findAllByLabelText("table-row-group-text-wrapper")
              .eq(0)
              .should("have.css", "gap", "10px");
          });
        });
      });
    });

    context("tableBodyStyle", () => {
      context("when given max-height 250px", () => {
        it("should render the table body with a height of 250px", () => {
          cy.mount(
            <Table
              styles={{
                tableBodyStyle: css`
                  max-height: 250px;
                `,
              }}
              columns={columnsBasic}
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

          cy.findAllByLabelText("table-body")
            .eq(0)
            .should("have.css", "height", "250px");
        });
      });
    });

    context("tableHeaderStyle", () => {
      context("when given padding 20px", () => {
        it("should render the table header with a padding of 20px", () => {
          cy.mount(
            <Table
              styles={{
                tableHeaderStyle: css`
                  padding: 20px;
                `,
              }}
              columns={columnsBasic}
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

          cy.findAllByLabelText("table-header")
            .eq(0)
            .should("have.css", "padding", "20px");
        });
      });
    });
  });

  function TableWithAppendix(props: TableRowProps) {
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

    const DEFAULT_TOP_ACTIONS: TableAction[] = [
      {
        caption: "Copy",
        icon: { image: RiArrowUpSLine },
        onClick: () => {
          console.log("Copy clicked");
        },
      },
    ];

    const { totalCost, totalQty } = calculateTotals(TABLE_SUMMARY);

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
            headerTitleSectionStyle: css`
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
          {generateSentence({ minLen: 30, maxLen: 40 })}
        </Card>
      );
    }

    return (
      <Table
        styles={{
          tableBodyStyle: css`
            max-height: 400px;
          `,
        }}
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
        selectable
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
                actions={ROW_ACTIONS}
                {...props}
              />
            ))}
          </Table.Row.Group>
        ))}
      </Table>
    );
  }

  context("with row appendix", () => {
    context("when using isFirstClick, open() and close()", () => {
      context("when clicking the row 'open()'", () => {
        it("should expand the row appendix", () => {
          cy.mount(<TableWithAppendix />);

          cy.findAllByText("Ayam Geprek").eq(0).click();

          cy.findAllByText("Ayam Geprek").eq(1).should("be.visible");
          cy.findAllByText("IDR 5,000").eq(0).should("be.visible");
          cy.findAllByText("Qty: 5").eq(0).should("be.visible");
        });

        context("when clicking 'close()' via row", () => {
          it("should collapse the row appendix", () => {
            cy.mount(<TableWithAppendix />);

            cy.findByText("Ayam Geprek").click();

            cy.findAllByText("Ayam Geprek").eq(1).should("be.visible");
            cy.findAllByText("IDR 5,000").eq(0).should("be.visible");
            cy.findAllByText("Qty: 5").eq(0).should("be.visible");

            cy.findAllByText("Ayam Geprek").eq(0).click();

            cy.findAllByText("Ayam Geprek").eq(1).should("not.be.visible");
            cy.findAllByText("IDR 5,000").eq(0).should("not.be.visible");
            cy.findAllByText("Qty: 5").eq(0).should("not.be.visible");
          });
        });

        context("when clicking 'close()' via button", () => {
          it("should collapse the row appendix", () => {
            cy.mount(<TableWithAppendix />);

            cy.findByText("Ayam Geprek").click();

            cy.findAllByText("Ayam Geprek").eq(1).should("be.visible");
            cy.findAllByText("IDR 5,000").eq(0).should("be.visible");
            cy.findAllByText("Qty: 5").eq(0).should("be.visible");

            cy.findAllByText("Close").eq(0).click();

            cy.findAllByText("Ayam Geprek").eq(1).should("not.be.visible");
            cy.findAllByText("IDR 5,000").eq(0).should("not.be.visible");
            cy.findAllByText("Qty: 5").eq(0).should("not.be.visible");
          });
        });
      });
    });

    context("when only open()", () => {
      context("when clicking the row", () => {
        it("renders the row appendix", () => {
          cy.mount(
            <TableWithAppendix
              onClick={({ open }) => open("Table.Row appendix still opened")}
            />
          );

          cy.findByText("Table.Row appendix still opened").should("not.exist");

          cy.findByText("Ayam Geprek").click();

          cy.findByText("Table.Row appendix still opened")
            .eq(0)
            .should("exist");
        });

        context("when clicking the row", () => {
          it("still render the row appendix", () => {
            cy.mount(
              <TableWithAppendix
                onClick={({ open }) => open("Table.Row appendix still opened")}
              />
            );

            cy.findByText("Table.Row appendix still opened").should(
              "not.exist"
            );

            cy.findByText("Ayam Geprek").click();

            cy.findByText("Table.Row appendix still opened")
              .eq(0)
              .should("exist");

            cy.findByText("Ayam Geprek").click();

            cy.findByText("Table.Row appendix still opened")
              .eq(0)
              .should("exist");
          });
        });
      });
    });
  });

  context("with summary", () => {
    it("renders summary on footer", () => {
      cy.mount(<TableWithAppendix />);

      cy.findByText("Total").should("have.css", "font-weight", "600");
      cy.findByText("32,000").should("have.css", "font-weight", "400");
      cy.findByText("22").should("have.css", "font-weight", "400");
    });

    context("with selectable", () => {
      it("renders with empty checkbox", () => {
        cy.mount(<TableWithAppendix />);

        cy.findAllByLabelText("empty-checkbox").eq(0).should("exist");
      });
    });
  });

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

  const TOP_ACTIONS: TableAction[] = [
    {
      caption: "Delete",
      icon: { image: RiDeleteBin2Line },
      onClick: () => {
        console.log("Delete clicked");
      },
    },
    {
      caption: "Copy",
      icon: { image: RiClipboardFill },
      onClick: () => {
        console.log("Copy clicked");
      },
    },
  ];

  const columns: TableColumn[] = [
    {
      id: "title",
      caption: "Title",
      width: "45%",
    },
    {
      id: "category",
      caption: "Category",
      width: "30%",
    },
    {
      id: "author",
      caption: "Author",
      width: "25%",
    },
  ];

  const rows = TABLE_ITEMS;

  const ONE_ROW_ACTION = (rowId: string): TipMenuItemProps[] => {
    return [
      {
        caption: "Delete",
        icon: { image: RiDeleteBin2Fill, color: "gray" },
        onClick: () => {
          console.log(`${rowId} was deleted`);
        },
      },
    ];
  };

  const ROW_ACTIONS = (rowId: string): TableSubMenuList[] => {
    return [
      {
        caption: "Edit",
        icon: { image: RiArrowUpSLine },
        onClick: () => {
          console.log(`${rowId} was edited`);
        },
      },
      {
        caption: "Delete",
        icon: { image: RiDeleteBin2Fill },
        onClick: () => {
          console.log(`${rowId} was deleted`);
        },
      },
      {
        hidden: true,
        caption: "Archive",
        icon: { image: RiArchive2Fill },
        onClick: () => {
          console.log(`${rowId} was archive`);
        },
      },
    ];
  };

  context("labels", () => {
    context("pageNumberText", () => {
      it("renders the page number", () => {
        cy.mount(
          <Table
            selectable
            showPagination
            labels={{ pageNumberText: 10 }}
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
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

        cy.findByLabelText("pagination-number").should("have.text", "Pg. 10");
      });
    });

    context("totalSelectedItemText", () => {
      it("renders with selected text", () => {
        cy.mount(
          <Table selectable columns={columnsBasic}>
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
              labels={{
                totalSelectedItemText: (count) => `${count} email selected`,
              }}
              columns={columnsBasic}
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
            <Table
              selectable
              labels={{ totalSelectedItemText: null }}
              columns={columnsBasic}
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
          cy.findByText("items selected").should("not.exist");
          cy.get('input[type="checkbox"]').eq(0).click();
          cy.findByLabelText("header-wrapper").should("not.exist");
          cy.findByText("items selected").should("not.exist");
        });
      });
    });
  });

  context("alwaysShowDragIcon", () => {
    context("when given false", () => {
      it("renders when hovered", () => {
        cy.mount(
          <Table
            selectable
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
            draggable
            alwaysShowDragIcon={false}
            columns={columns}
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

        cy.findAllByLabelText("draggable-request")
          .eq(0)
          .should("not.be.visible")
          .and("have.css", "opacity", "0");
        cy.findAllByLabelText("table-row")
          .eq(0)
          .trigger("mouseover")
          .then(() =>
            cy
              .findAllByLabelText("draggable-request")
              .eq(0)
              .should("have.css", "opacity", "1")
          );
      });
    });

    context("when given true", () => {
      it("always show the drag icon", () => {
        cy.mount(
          <Table
            selectable
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
            draggable
            alwaysShowDragIcon={true}
            columns={columns}
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

        cy.findAllByLabelText("draggable-request")
          .eq(0)
          .should("have.css", "opacity", "1");
      });
    });

    context("when not given", () => {
      it("defaults to always showing the drag icon", () => {
        cy.mount(
          <Table
            selectable
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
            draggable
            columns={columns}
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

        cy.findAllByLabelText("draggable-request")
          .eq(0)
          .should("have.css", "opacity", "1");
      });
    });
  });

  context("pagination", () => {
    context("with pagination wrapper style", () => {
      context("when given width full and justify-end", () => {
        it("renders on the end content", () => {
          cy.viewport(515, 720);
          cy.mount(
            <Table
              selectable
              styles={{
                paginationWrapperStyle: css`
                  width: 100%;
                  justify-content: end;
                `,
              }}
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
            .should("have.css", "width", "447px")
            .and("have.css", "justify-content", "end");
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
              labels={{ pageNumberText: 10 }}
              styles={{
                paginationNumberStyle: css`
                  font-size: 30px;
                `,
                tableBodyStyle: css`
                  max-height: 400px;
                `,
              }}
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

          cy.findByLabelText("pagination-number")
            .should("have.css", "font-size", "30px")
            .and("have.text", "Pg. 10");
        });
      });
    });
  });

  context("with selectable", () => {
    context("checkbox style", () => {
      it("renders with transparent wrapper", () => {
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

        cy.findAllByLabelText("checkbox-label")
          .eq(0)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
        cy.findAllByLabelText("checkbox-label")
          .eq(1)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
        cy.findAllByLabelText("checkbox-label")
          .eq(2)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
      });
    });

    context("when initialize", () => {
      it("renders content with checked value", () => {
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
        cy.get('input[type="checkbox"]').eq(4).should("be.checked");
        cy.get('input[type="checkbox"]').eq(4).should("be.checked");
      });
    });

    context("with totalSelectedItemTextStyle", () => {
      context("when given 100px", () => {
        it("renders text with 100px", () => {
          cy.mount(
            <Table
              selectable
              styles={{
                totalSelectedItemTextStyle: css`
                  font-size: 100px;
                `,
                tableBodyStyle: css`
                  max-height: 400px;
                `,
              }}
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
  });

  context("with top actions", () => {
    context("when given default", () => {
      const DEFAULT_TOP_ACTIONS: TableAction[] = [
        {
          id: "copy",
          caption: "Copy",
          icon: { image: RiArrowUpSLine },
          onClick: () => {
            console.log("Copy clicked");
          },
        },
      ];

      it("renders default button", () => {
        cy.mount(
          <Table
            selectable
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
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
          icon: { image: RiSpam2Line, color: "blue" },
          onClick: () => console.log("Phishing reported"),
        },
        {
          caption: "Report Junk",
          icon: { image: RiForbid2Line, color: "red" },
          onClick: () => console.log("Junk reported"),
        },
      ];

      const DEFAULT_TOP_ACTIONS: TableAction[] = [
        {
          caption: "Copy",
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
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
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

        cy.findByText("Report Phishing").should("exist");
      });
    });

    context("when given capsule", () => {
      const VIEW_MODES: CapsuleTab[] = [
        {
          id: "new",
          title: "New",
        },
        {
          id: "list",
          title: "List",
        },
      ];

      const DEFAULT_TOP_ACTIONS: TableAction[] = [
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
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
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

      context("when given only with icon", () => {
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

        const DEFAULT_TOP_ACTIONS: TableAction[] = [
          {
            type: "capsule",
            capsuleProps: {
              activeTab: "new",
              tabs: VIEW_MODES_WITH_ICON,
            },
          },
        ];

        it("renders capsule only with icon", () => {
          cy.mount(
            <Table
              selectable
              styles={{
                tableBodyStyle: css`
                  max-height: 400px;
                `,
              }}
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

          cy.findAllByLabelText("capsule-icon")
            .should("have.length", 2)
            .should("exist");
        });
      });
    });
  });

  context("with searchable", () => {
    context("when there are action buttons and right-side info panel", () => {
      it("renders searchbox the middle", () => {
        cy.mount(
          <Table
            selectable
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
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
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
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
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
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
            styles={{
              tableBodyStyle: css`
                max-height: 400px;
              `,
            }}
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
    function TableWithRowActions({
      actions,
    }: {
      actions?: (columnId: string) => TableSubMenuList[];
    }) {
      return (
        <Table
          selectable
          styles={{
            tableBodyStyle: css`
              max-height: 400px;
            `,
          }}
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
                  content={[rowValue.title, rowValue.category, rowValue.author]}
                  actions={actions}
                />
              ))}
            </Table.Row.Group>
          ))}
        </Table>
      );
    }

    context("modes", () => {
      context("dark mode", () => {
        context("when clicking", () => {
          it("renders the tip-menu with inherit color", () => {
            cy.mount(<TableWithRowActions actions={ROW_ACTIONS} />, {
              mode: "dark",
            });
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.findAllByLabelText("table-row").eq(0).trigger("mouseover");
            cy.findAllByLabelText("action-button")
              .eq(2)
              .should("be.visible")
              .click();
            cy.findByLabelText("tip-menu").within(() => {
              cy.findByText("Edit").should(
                "have.css",
                "color",
                "rgb(202, 206, 212)"
              );

              cy.findAllByLabelText("tip-menu-icon")
                .first()
                .should("have.css", "color", "rgb(202, 206, 212)");
            });
          });
        });
      });

      context("light mode", () => {
        context("when clicking", () => {
          it("renders the tip-menu with inherit color", () => {
            cy.mount(<TableWithRowActions actions={ROW_ACTIONS} />);
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.findAllByLabelText("table-row").eq(0).trigger("mouseover");
            cy.findAllByLabelText("action-button")
              .eq(2)
              .should("be.visible")
              .click();
            cy.findByLabelText("tip-menu").within(() => {
              cy.findByText("Edit").should(
                "have.css",
                "color",
                "rgb(17, 17, 17)"
              );

              cy.findAllByLabelText("tip-menu-icon")
                .first()
                .should("have.css", "color", "rgb(17, 17, 17)");
            });
          });
        });
      });
    });

    context("when hover another after opened", () => {
      it("should always opened", () => {
        cy.mount(<TableWithRowActions actions={ROW_ACTIONS} />);
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByLabelText("table-row").eq(0).trigger("mouseover");
        cy.findAllByLabelText("action-button").eq(2).should("be.visible");
        cy.findAllByLabelText("table-row").eq(1).trigger("mouseover");
        cy.findAllByLabelText("action-button").eq(2).should("be.visible");
      });
    });

    context("when scroll after 100px", () => {
      it("should closed the TipMenu", () => {
        cy.mount(<TableWithRowActions actions={ROW_ACTIONS} />);
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByLabelText("table-row").eq(0).trigger("mouseover");
        cy.findAllByLabelText("action-button")
          .eq(2)
          .should("be.visible")
          .click();
        cy.findByLabelText("button-dropdown-wrapper")
          .should("exist")
          .and("be.visible");

        cy.findByLabelText("table-body")
          .parent()
          .then(($el) => {
            const start = $el[0].scrollTop;
            cy.wrap($el).scrollTo(0, start + 101);
          });

        cy.findByLabelText("button-dropdown-wrapper").should("not.exist");
      });
    });

    context("when only one action", () => {
      it("render action button", () => {
        cy.mount(<TableWithRowActions actions={ONE_ROW_ACTION} />);
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByLabelText("table-row").eq(2).trigger("mouseover");
        cy.findAllByLabelText("action-button")
          .eq(4)
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
        cy.mount(<TableWithRowActions actions={ROW_ACTIONS} />);
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByLabelText("table-row").eq(2).trigger("mouseover");
        cy.findAllByLabelText("action-button")
          .eq(4)
          .should("be.visible")
          .click();
        cy.findByText("Edit").click();

        cy.wait(100);
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "Tech Articles-Async Patterns in JS was edited"
        );
      });

      context("when given with hidden field", () => {
        it("renders without hidden action", () => {
          cy.mount(<TableWithRowActions actions={ROW_ACTIONS} />);

          cy.findAllByLabelText("table-row").eq(2).trigger("mouseover");
          cy.findAllByLabelText("action-button")
            .eq(4)
            .should("be.visible")
            .click();
          cy.findAllByText("Edit").should("exist");
          cy.findAllByText("Delete").should("exist");
          cy.findAllByText("Archive").should("not.exist");
        });
      });
    });
  });
});

const ProtocolItem = styled.div<{ $theme?: TableThemeConfig }>`
  padding: 10px 12px;
  border-radius: 6px;
  background: ${({ $theme }) => $theme?.backgroundColor};
`;

const ProtocolName = styled.div<{ $theme?: TableThemeConfig }>`
  font-weight: 600;
  font-size: 13px;
  color: ${({ $theme }) => $theme?.textColor};
`;

const ProtocolDescription = styled.div<{ $theme?: TableThemeConfig }>`
  margin-top: 2px;
  font-size: 12px;
  color: ${({ $theme }) => $theme?.rowGroupSubtitleTextColor};
`;
