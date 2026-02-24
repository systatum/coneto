import { NavTab, NavTabContentProps } from "./../../components/nav-tab";
import { Card } from "./../../components/card";
import {
  RiAddBoxLine,
  RiAtLine,
  RiCheckLine,
  RiClipboardFill,
  RiDeleteBin2Line,
  RiForbid2Line,
  RiInboxArchiveLine,
  RiSearchLine,
  RiShieldLine,
  RiSpam2Line,
} from "@remixicon/react";
import { List, ListGroupContentProps } from "./../../components/list";
import { css } from "styled-components";
import { TipMenuItemProps } from "./../../components/tip-menu";
import {
  ColumnTableProps,
  Table,
  TableActionsProps,
} from "./../../components/table";

describe("ActionButton", () => {
  context("card", () => {
    context("when given variant", () => {
      it("should render button with variant", () => {
        function CardComponent() {
          return (
            <Card
              title="This is title"
              subtitle="This is subtitle"
              headerActions={[
                {
                  caption: "Button",
                  variant: "primary",
                },
              ]}
            >
              Test
            </Card>
          );
        }
        cy.mount(<CardComponent />);

        cy.findAllByLabelText("action-button")
          .eq(0)
          .should("have.css", "background-color", "rgb(86, 154, 236)");
      });
    });

    context("with subMenu", () => {
      context("when given variant", () => {
        it("should render button with variant", () => {
          function CardComponent() {
            return (
              <Card
                title="This is title"
                subtitle="This is subtitle"
                headerActions={[
                  {
                    caption: "Button",
                    variant: "primary",
                    subMenu: ({ list }) => list(LIST_OPTIONS),
                  },
                ]}
              >
                Test
              </Card>
            );
          }
          cy.mount(<CardComponent />);

          cy.findAllByLabelText("action-button")
            .eq(0)
            .should("have.css", "background-color", "rgb(86, 154, 236)");
          cy.findAllByLabelText("button-toggle")
            .eq(0)
            .should("have.css", "background-color", "rgb(86, 154, 236)");
        });
      });
    });
  });

  context("nav-tab", () => {
    context("when given variant", () => {
      it("should render button with variant", () => {
        function NavTabComponent() {
          return (
            <NavTab
              actions={[
                {
                  caption: "Add",
                  icon: { image: RiAddBoxLine },
                  onClick: () => {
                    console.log(`Add button was clicked`);
                  },
                  variant: "secondary",
                },
              ]}
              tabs={TABS_ITEMS}
              activeTab={"2"}
            />
          );
        }
        cy.mount(<NavTabComponent />);

        cy.findAllByLabelText("action-button")
          .eq(2)
          .should("have.css", "background-color", "rgb(221, 221, 221)");
      });
    });

    context("with subMenu", () => {
      context("when given variant", () => {
        it("should render button with variant", () => {
          function NavTabComponent() {
            return (
              <NavTab
                actions={[
                  {
                    caption: "Add",
                    icon: { image: RiAddBoxLine },
                    onClick: () => {
                      console.log(`Add button was clicked`);
                    },
                    variant: "secondary",
                    subMenu: ({ list }) => list(LIST_OPTIONS),
                  },
                ]}
                tabs={TABS_ITEMS}
                activeTab={"2"}
              />
            );
          }
          cy.mount(<NavTabComponent />);

          cy.findAllByLabelText("action-button")
            .eq(2)
            .should("have.css", "background-color", "rgb(221, 221, 221)");

          cy.findAllByLabelText("button-toggle")
            .eq(0)
            .should("have.css", "background-color", "rgb(221, 221, 221)");
        });
      });
    });
  });

  context("list", () => {
    context("when given variant", () => {
      it("should render button with variant", () => {
        function ListComponent() {
          return (
            <List
              styles={{
                containerStyle: css`
                  padding: 16px;
                  min-width: 400px;
                `,
              }}
            >
              {LIST_GROUPS.map((group, index) => {
                return (
                  <List.Group
                    key={index}
                    id={group.id}
                    subtitle={group.subtitle}
                    title={group.title}
                    actions={[
                      {
                        caption: "Back",
                        onClick: () => {},
                      },
                    ].filter(Boolean)}
                  >
                    {group.items.map((list, i) => (
                      <List.Item
                        key={i}
                        openable={list.openable}
                        id={list.id}
                        subtitle={list.subtitle}
                        title={list.title}
                        groupId={group.id}
                        leftSideContent={({ badge }) =>
                          badge(list.leftSideContent, {
                            withStyle: css`
                              background-color: #488cac;
                              color: white;
                              min-width: 30px;
                              max-width: 30px;
                            `,
                          })
                        }
                      >
                        {list.children}
                      </List.Item>
                    ))}
                  </List.Group>
                );
              })}
            </List>
          );
        }
        cy.mount(<ListComponent />);

        cy.findAllByLabelText("action-button")
          .eq(0)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
      });
    });

    context("with subMenu", () => {
      context("when given variant", () => {
        it("should render button with variant", () => {
          function ListComponent() {
            return (
              <List
                styles={{
                  containerStyle: css`
                    padding: 16px;
                    min-width: 400px;
                  `,
                }}
              >
                {LIST_GROUPS.map((group, index) => {
                  return (
                    <List.Group
                      key={index}
                      id={group.id}
                      subtitle={group.subtitle}
                      title={group.title}
                      actions={[
                        {
                          caption: "Back",
                          onClick: () => {},
                          subMenu: ({ list }) => list(LIST_OPTIONS),
                        },
                      ].filter(Boolean)}
                    >
                      {group.items.map((list, i) => (
                        <List.Item
                          key={i}
                          openable={list.openable}
                          id={list.id}
                          subtitle={list.subtitle}
                          title={list.title}
                          groupId={group.id}
                          leftSideContent={({ badge }) =>
                            badge(list.leftSideContent, {
                              withStyle: css`
                                background-color: #488cac;
                                color: white;
                                min-width: 30px;
                                max-width: 30px;
                              `,
                            })
                          }
                        >
                          {list.children}
                        </List.Item>
                      ))}
                    </List.Group>
                  );
                })}
              </List>
            );
          }
          cy.mount(<ListComponent />);

          cy.findAllByLabelText("action-button")
            .eq(0)
            .should("have.css", "background-color", "rgba(0, 0, 0, 0)");

          cy.findAllByLabelText("button-toggle")
            .eq(0)
            .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
        });
      });
    });
  });

  context("table", () => {
    context("when given variant", () => {
      it("should render button with variant", () => {
        function TableComponent() {
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

          return (
            <Table
              selectable
              styles={{
                tableRowContainerStyle: css`
                  max-height: 400px;
                `,
              }}
              columns={columns}
              actions={TOP_ACTIONS}
            >
              {sampleRows}
            </Table>
          );
        }
        cy.mount(<TableComponent />);

        cy.findAllByLabelText("action-button")
          .eq(0)
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
      });
    });

    context("with subMenu", () => {
      context("when given variant", () => {
        it("should render button with variant", () => {
          function TableComponent() {
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

            return (
              <Table
                selectable
                styles={{
                  tableRowContainerStyle: css`
                    max-height: 400px;
                  `,
                }}
                columns={columns}
                actions={TOP_ACTIONS}
              >
                {sampleRows}
              </Table>
            );
          }
          cy.mount(<TableComponent />);

          cy.findAllByLabelText("action-button")
            .eq(1)
            .should("have.css", "background-color", "rgb(206, 55, 93)");

          cy.findAllByLabelText("button-toggle")
            .eq(0)
            .should("have.css", "background-color", "rgb(206, 55, 93)");
        });
      });
    });
  });
});

const LIST_GROUPS: ListGroupContentProps[] = [
  {
    id: "employees",
    title: "Employees",
    items: [
      { id: "birthday", title: "Birthday", leftSideContent: 2 },
      { id: "new-hires", title: "New Hires", leftSideContent: 1 },
      {
        id: "terminated-employees",
        title: "Terminated Employees",
        leftSideContent: 0,
      },
      { id: "anniversaries", title: "Anniversaries", leftSideContent: 3 },
      { id: "promotions", title: "Promotions", leftSideContent: 1 },
      { id: "trainings", title: "Trainings", leftSideContent: 2 },
      { id: "sick-leave", title: "Sick Leave", leftSideContent: 1 },
    ],
  },
];

const TOP_ACTIONS: TableActionsProps[] = [
  {
    caption: "Delete",
    icon: {
      image: RiDeleteBin2Line,
    },
    onClick: () => {},
  },
  {
    caption: "Copy",
    icon: {
      image: RiClipboardFill,
    },
    onClick: () => {},
    subMenu: ({ list }) => list(LIST_OPTIONS),
    variant: "danger",
    styles: {
      dropdownStyle: css`
        min-width: 150px;
      `,
    },
  },
];

const TABS_ITEMS: NavTabContentProps[] = [
  {
    id: "1",
    title: "Write",
    content: <></>,
    onClick: () => {
      console.log("test tab 1");
    },
    actions: [
      {
        caption: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: {
          image: RiSearchLine,
        },
      },
    ],
  },
  {
    id: "2",
    title: "Review",
    content: <></>,
    onClick: () => {
      console.log("test tab 2");
    },
    actions: [
      {
        caption: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: {
          image: RiSearchLine,
        },
      },
      {
        caption: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: {
          image: RiAtLine,
        },
      },
    ],
  },
];

const LIST_OPTIONS: TipMenuItemProps[] = [
  {
    caption: "Report Phishing",
    icon: {
      image: RiSpam2Line,
      color: "blue",
    },
    onClick: () => console.log("Phishing reported"),
  },
  {
    caption: "Report Junk",
    icon: {
      image: RiForbid2Line,
      color: "red",
    },
    onClick: () => console.log("Junk reported"),
  },
  {
    caption: "Block Sender",
    icon: {
      image: RiShieldLine,
      color: "orange",
    },
    isDangerous: true,
    onClick: () => console.log("Sender blocked"),
  },
  {
    caption: "Mark as Read",
    icon: {
      image: RiCheckLine,
      color: "green",
    },
    onClick: () => console.log("Marked as read"),
  },
  {
    caption: "Move to Spam",
    icon: {
      image: RiInboxArchiveLine,
      color: "purple",
    },
    onClick: () => console.log("Moved to spam"),
  },
];
