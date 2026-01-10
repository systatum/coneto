import {
  RiArrowRightSLine,
  RiAtLine,
  RiCalendar2Fill,
  RiDeleteBack2Line,
  RiDeleteBin2Line,
  RiEdit2Line,
  RiFileCopyLine,
  RiHome2Fill,
  RiMailFill,
  RiNotification3Fill,
  RiSearchLine,
  RiSettings3Fill,
  RiShareForwardLine,
  RiUser3Fill,
} from "@remixicon/react";
import {
  List,
  ListGroupContentProps,
  ListItemActionProps,
} from "./../../components/list";
import { css } from "styled-components";
import {
  SubMenuTreeList,
  TreeList,
  TreeListContentProps,
} from "./../../components/treelist";
import {
  ColumnTableProps,
  SubMenuListTableProps,
  Table,
} from "./../../components/table";
import { NavTab } from "./../../components/nav-tab";

const checkMenuAlignment = () => {
  return cy
    .findAllByLabelText("action-button")
    .eq(0)
    .then(($btn) => {
      const btnRect = $btn[0].getBoundingClientRect();
      const btnDistanceFromRight = window.innerWidth - btnRect.right;

      cy.findAllByLabelText("tip-menu-item").each(($item, index) => {
        const itemRect = $item[0].getBoundingClientRect();
        const itemDistanceFromRight = window.innerWidth - itemRect.right;

        cy.log(
          `Tip menu item ${index} distance from right: ${itemDistanceFromRight}`
        );

        expect(itemDistanceFromRight).to.be.closeTo(btnDistanceFromRight, 6);
      });
    });
};

describe("context-menu", () => {
  context("when given in List component", () => {
    const LIST_ACTION_ITEMS_PROPS = (id: string): ListItemActionProps[] => [
      {
        caption: "Add",
        icon: RiArrowRightSLine,
        onClick: () => {
          console.log(`action was clicked ${id}`);
        },
      },
    ];

    const LIST_GROUPS: ListGroupContentProps[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        subtitle: "Your latest activity",
        items: [
          {
            id: "messages",
            title: "Messages",
            subtitle: "Check your inbox",
            leftIcon: RiMailFill,
            actions: LIST_ACTION_ITEMS_PROPS,
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            leftIcon: RiNotification3Fill,
          },
          {
            id: "calendar",
            title: "Calendar",
            subtitle: "Upcoming events",
            leftIcon: RiCalendar2Fill,
          },
        ],
      },
      {
        id: "all-content",
        title: "All Content",
        subtitle: "With warning rightSideContent",
        items: [
          {
            id: "home",
            title: "Home",
            subtitle: "Go to homepage",
            leftIcon: RiHome2Fill,
            actions: LIST_ACTION_ITEMS_PROPS,
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            leftIcon: RiUser3Fill,
          },
          {
            id: "settings",
            title: "Settings",
            subtitle: "Adjust preferences",
            leftIcon: RiSettings3Fill,
          },
        ],
      },
    ];

    const ROW_ACTIONS = (id: string) => [
      {
        caption: "Edit",
        icon: RiEdit2Line,
        onClick: () => {
          console.log(`Edit content for ${id}`);
        },
      },
      {
        caption: "Delete",
        icon: RiDeleteBack2Line,
        onClick: () => {
          console.log(`Delete content for ${id}`);
        },
      },
    ];

    context("when multiple content", () => {
      it("renders tip menu aligned to the right of the action button", () => {
        cy.mount(
          <List
            searchable
            draggable
            selectable
            containerStyle={css`
              padding: 16px;
              min-width: 350px;
            `}
          >
            {LIST_GROUPS.map((group, index) => (
              <List.Group
                key={index}
                id={group.id}
                title={group.title}
                subtitle={group.subtitle}
                actions={group.actions}
                openerStyle="togglebox"
              >
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    groupId={group.id}
                    actions={ROW_ACTIONS}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    selectedOptions={{
                      checked: true,
                    }}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );

        cy.wait(100);

        cy.findAllByLabelText("list-item-wrapper").eq(0).realHover().click();
        cy.findAllByLabelText("action-button").eq(0).click();

        checkMenuAlignment();
      });

      it("renders all tip menu actions", () => {
        cy.mount(
          <List
            searchable
            draggable
            selectable
            containerStyle={css`
              padding: 16px;
              min-width: 350px;
            `}
          >
            {LIST_GROUPS.map((group, index) => (
              <List.Group
                key={index}
                id={group.id}
                title={group.title}
                subtitle={group.subtitle}
                actions={group.actions}
                openerStyle="togglebox"
              >
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    groupId={group.id}
                    actions={ROW_ACTIONS}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    selectedOptions={{
                      checked: true,
                    }}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );

        cy.wait(100);

        cy.findAllByLabelText("list-item-wrapper").eq(0).realHover().click();
        cy.findAllByLabelText("action-button").eq(0).click();
        cy.findAllByLabelText("tip-menu-item").should("have.length", 2);

        ROW_ACTIONS("").map((props) => {
          cy.findByText(props.caption).should("be.visible").and("exist");
        });
      });

      context("when hover another list after opened", () => {
        it("keeps the tip menu open", () => {
          cy.mount(
            <List
              searchable
              draggable
              selectable
              containerStyle={css`
                padding: 16px;
                min-width: 350px;
              `}
            >
              {LIST_GROUPS.map((group, index) => (
                <List.Group
                  key={index}
                  id={group.id}
                  title={group.title}
                  subtitle={group.subtitle}
                  actions={group.actions}
                  openerStyle="togglebox"
                >
                  {group.items.map((list, i) => (
                    <List.Item
                      key={i}
                      id={list.id}
                      groupId={group.id}
                      actions={ROW_ACTIONS}
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      selectedOptions={{
                        checked: true,
                      }}
                    />
                  ))}
                </List.Group>
              ))}
            </List>
          );
          cy.findAllByLabelText("list-item-wrapper").eq(0).realHover().click();
          cy.findAllByLabelText("action-button").eq(0).click();
          cy.findAllByLabelText("tip-menu-item").should("have.length", 2);

          ROW_ACTIONS("").map((props) => {
            cy.findByText(props.caption).should("be.visible").and("exist");
          });
          cy.findAllByLabelText("list-item-wrapper").eq(1).realHover();
          cy.findAllByLabelText("tip-menu-item").should("have.length", 2);
        });
      });
    });
  });

  context("when given in TreeList component", () => {
    const ITEM_ACTIONS: SubMenuTreeList[] = [
      {
        caption: "Edit",
        icon: RiEdit2Line,
        iconColor: "gray",
        onClick: (id: string) => {
          console.log(`${id} was edited`);
        },
      },
      {
        caption: "Delete",
        icon: RiDeleteBin2Line,
        iconColor: "gray",
        onClick: (id: string) => {
          console.log(`${id} was deleted`);
        },
      },
      {
        caption: "Copy",
        icon: RiFileCopyLine,
        iconColor: "gray",
        onClick: (id: string) => {
          console.log(`${id} was copied`);
        },
      },
      {
        caption: "Share",
        icon: RiShareForwardLine,
        iconColor: "gray",
        onClick: (id: string) => {
          console.log(`${id} was shared`);
        },
      },
    ];
    const TREE_LIST_DATA: TreeListContentProps[] = [
      {
        id: "member",
        caption: "Member of Technical Staff",
        items: [
          {
            id: "mts-1",
            caption: "Adam Noto Hakarsa",
            actions: ITEM_ACTIONS,
          },
          {
            id: "mts-2",
            caption: "Mohamad Naufal Alim",
            actions: ITEM_ACTIONS,
          },
        ],
      },
      {
        id: "project",
        caption: "Product Management Team",
        items: [
          {
            id: "pmt-1",
            caption: "Samantha Lee",
            actions: ITEM_ACTIONS,
          },
          {
            id: "pmt-2",
            caption: "Jason Kim",
            actions: ITEM_ACTIONS,
          },
          {
            id: "pmt-3",
            caption: "Rina Patel",
            actions: ITEM_ACTIONS,
          },
        ],
      },
    ];

    context("when multiple content", () => {
      it("renders tip menu aligned to the right of the action button", () => {
        cy.mount(
          <TreeList
            styles={{
              containerStyle: css`
                min-width: 300px;
              `,
            }}
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.wait(100);

        cy.contains("Adam Noto Hakarsa").realHover();
        cy.findAllByLabelText("action-button").eq(0).click();

        checkMenuAlignment();
      });

      it("renders all tip menu actions", () => {
        cy.mount(
          <TreeList
            styles={{
              containerStyle: css`
                min-width: 300px;
              `,
            }}
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.wait(100);

        cy.contains("Adam Noto Hakarsa").realHover();
        cy.findAllByLabelText("action-button").eq(0).click();
        cy.findAllByLabelText("tip-menu-item").should("have.length", 4);
        ITEM_ACTIONS.map((props) => {
          cy.findByText(props.caption).should("be.visible").and("exist");
        });

        cy.contains("Rina Patel").realHover();
        cy.findAllByLabelText("action-button").eq(1).click({ force: true });
        cy.findAllByLabelText("tip-menu-item").should("have.length", 4);
        ITEM_ACTIONS.map((props) => {
          cy.findByText(props.caption).should("be.visible").and("exist");
        });
      });

      context("when hover another list after opened", () => {
        it("keeps the tip menu open", () => {
          cy.mount(
            <TreeList
              styles={{
                containerStyle: css`
                  min-width: 300px;
                `,
              }}
              content={TREE_LIST_DATA}
              emptySlate={<p>Not found.</p>}
            />
          );

          cy.wait(100);

          cy.contains("Rina Patel").realHover();
          cy.findAllByLabelText("action-button").eq(1).click({ force: true });
          cy.findAllByLabelText("tip-menu-item").should("have.length", 4);
          ITEM_ACTIONS.map((props) => {
            cy.findByText(props.caption).should("be.visible").and("exist");
          });

          cy.contains("Adam Noto Hakarsa").realHover();
          cy.findAllByLabelText("tip-menu-item").should("have.length", 4);
        });
      });
    });
  });

  context("when given in Table component", () => {
    const TYPES_DATA = ["HTTP", "HTTPS", "TCP", "UDP", "QUIC"];

    const ROW_ACTION = (rowId: string): SubMenuListTableProps[] => {
      return [
        {
          caption: "Edit",
          icon: RiEdit2Line,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was edited`);
          },
        },
        {
          caption: "Delete",
          icon: RiDeleteBin2Line,
          iconColor: "gray",
          onClick: () => {
            console.log(`${rowId} was deleted`);
          },
        },
      ];
    };

    const sampleRows = Array.from({ length: 20 }, (_, i) => {
      const type = TYPES_DATA[i % TYPES_DATA.length];
      return (
        <Table.Row
          rowId={`${type}`}
          key={i}
          actions={ROW_ACTION}
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

    context("when multiple content", () => {
      it("renders tip menu aligned to the right of the action button", () => {
        cy.mount(
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

        cy.wait(100);
        cy.findAllByLabelText("table-row").eq(2).realHover();
        cy.findAllByLabelText("action-button").eq(0).click({ force: true });
        checkMenuAlignment();
      });

      it("renders all tip menu actions", () => {
        cy.mount(
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

        cy.wait(100);
        cy.findAllByLabelText("table-row").eq(2).realHover();
        cy.findAllByLabelText("action-button").eq(2).click({ force: true });
        ROW_ACTION("").map((props) => {
          cy.findAllByText(props.caption)
            .eq(0)
            .should("be.visible")
            .and("exist");
        });
      });

      context("when hover another row after opened", () => {
        it("keeps the tip menu open", () => {
          cy.mount(
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

          cy.wait(100);
          cy.findAllByLabelText("table-row").eq(2).realHover();
          cy.findAllByLabelText("action-button").eq(2).click({ force: true });
          ROW_ACTION("").map((props) => {
            cy.findAllByText(props.caption)
              .eq(0)
              .should("be.visible")
              .and("exist");

            cy.findAllByLabelText("table-row").eq(3).realHover();

            ROW_ACTION("").map((props) => {
              cy.findAllByText(props.caption)
                .eq(0)
                .should("be.visible")
                .and("exist");
            });
          });
        });
      });
    });
  });

  context("when given in Navtab component", () => {
    const SUB_MENU = [
      {
        caption: "Discover",
        onClick: () => {
          console.log("Discover clicked");
        },
        icon: RiSearchLine,
      },
      {
        caption: "Mention",
        onClick: () => {
          console.log("Mention clicked");
        },
        icon: RiAtLine,
      },
    ];

    const TAB_WITH_SUB_ITEM = [
      {
        id: "1",
        title: "Content",
        content: "This is review content",
        actions: SUB_MENU,
      },
      {
        id: "2",
        title: "Review",
        content: "This is review content",
        actions: SUB_MENU,
      },
    ];

    context("when multiple content", () => {
      it("renders all tip menu actions", () => {
        cy.mount(<NavTab tabs={TAB_WITH_SUB_ITEM} activeTab={"2"} />);

        cy.wait(100);
        cy.findByText("Review").realHover();
        cy.findAllByLabelText("action-button").eq(0).click();
        SUB_MENU.map((props) => {
          cy.findByText(props.caption).should("be.visible").and("exist");
        });
      });

      context("when hover another tab after opened", () => {
        it("keeps the tip menu open", () => {
          cy.mount(<NavTab tabs={TAB_WITH_SUB_ITEM} activeTab={"2"} />);

          cy.wait(100);
          cy.findByText("Review").realHover();
          cy.findAllByLabelText("action-button").eq(0).click();
          SUB_MENU.map((props) => {
            cy.findByText(props.caption).should("be.visible").and("exist");
          });
          cy.findByText("Content").realHover();
          SUB_MENU.map((props) => {
            cy.findByText(props.caption).should("be.visible").and("exist");
          });
        });
      });
    });
  });
});
