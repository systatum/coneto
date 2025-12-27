import {
  RiArrowRightSLine,
  RiCalendar2Fill,
  RiDeleteBack2Line,
  RiEdit2Line,
  RiErrorWarningLine,
  RiHome2Fill,
  RiMailFill,
  RiNotification3Fill,
  RiSettings3Fill,
  RiUser3Fill,
} from "@remixicon/react";
import {
  List,
  ListGroupActionsProps,
  ListGroupContentProps,
  ListItemActionProps,
} from "./../../components/list";
import { css } from "styled-components";

describe("List", () => {
  context("group", () => {
    context("titleStyle", () => {
      const LIST_GROUPS_WITH_TITLE_STYLE: ListGroupContentProps[] = [
        {
          id: "recent-content",
          title: "Recent Content",
          subtitle: "Your latest activity",
          titleStyle: css`
            font-size: 30px;
          `,
          items: [
            {
              id: "messages",
              title: "Messages",
              subtitle: "Check your inbox",
              leftIcon: RiMailFill,
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

      context("when given font-size 30px", () => {
        it("renders title with style", () => {
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
              {LIST_GROUPS_WITH_TITLE_STYLE.map((group, index) => (
                <List.Group
                  titleStyle={group.titleStyle}
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
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      selectedOptions={{
                        checked: true,
                      }}
                      rightSideContent={list.rightSideContent}
                    />
                  ))}
                </List.Group>
              ))}
            </List>
          );
          cy.findAllByLabelText("list-group-title")
            .eq(0)
            .should("have.css", "font-size", "30px");
          cy.findAllByLabelText("list-group-title")
            .eq(1)
            .should("not.have.css", "font-size", "30px");
        });
      });
    });

    context("subtitleStyle", () => {
      const LIST_GROUPS_WITH_SUBTITLE_STYLE: ListGroupContentProps[] = [
        {
          id: "recent-content",
          title: "Recent Content",
          subtitle: "Your latest activity",
          subtitleStyle: css`
            font-size: 30px;
          `,
          items: [
            {
              id: "messages",
              title: "Messages",
              subtitle: "Check your inbox",
              leftIcon: RiMailFill,
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

      it("renders subtitle with style", () => {
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
            {LIST_GROUPS_WITH_SUBTITLE_STYLE.map((group, index) => (
              <List.Group
                titleStyle={group.titleStyle}
                subtitleStyle={group.subtitleStyle}
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
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    selectedOptions={{
                      checked: true,
                    }}
                    rightSideContent={list.rightSideContent}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findAllByLabelText("list-group-subtitle")
          .eq(0)
          .should("have.css", "font-size", "30px");
        cy.findAllByLabelText("list-group-subtitle")
          .eq(1)
          .should("not.have.css", "font-size", "30px");
      });
    });

    context("when items is empty", () => {
      const LIST_GROUPS_WITH_EMPTY: ListGroupContentProps[] = [
        {
          id: "recent-content",
          title: "Recent Content",
          subtitle: "Your latest activity",
          items: [],
        },
      ];

      context("when given emptySlate", () => {
        it("renders content with empty slate", () => {
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
              {LIST_GROUPS_WITH_EMPTY.map((group, index) => (
                <List.Group
                  key={index}
                  id={group.id}
                  title={group.title}
                  subtitle={group.subtitle}
                  actions={group.actions}
                  emptySlate={"This content is not available"}
                  openerStyle="togglebox"
                >
                  {group.items.map((list, i) => (
                    <List.Item
                      key={i}
                      id={list.id}
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      selectedOptions={{
                        checked: true,
                      }}
                      rightSideContent={list.rightSideContent}
                    />
                  ))}
                </List.Group>
              ))}
            </List>
          );
          cy.findAllByLabelText("list-group-empty-slate")
            .eq(0)
            .should("have.css", "border", "1px dashed rgb(209, 213, 219)");
          cy.findByText("This content is not available");
        });

        context("when given style", () => {
          it("renders content empty with style", () => {
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
                {LIST_GROUPS_WITH_EMPTY.map((group, index) => (
                  <List.Group
                    key={index}
                    id={group.id}
                    title={group.title}
                    subtitle={group.subtitle}
                    actions={group.actions}
                    emptySlate={"This content is not available"}
                    emptySlateStyle={css`
                      border: 1px solid red;
                      padding: 30px;
                    `}
                    openerStyle="togglebox"
                  >
                    {group.items.map((list, i) => (
                      <List.Item
                        key={i}
                        id={list.id}
                        leftIcon={list.leftIcon}
                        subtitle={list.subtitle}
                        title={list.title}
                        groupId={group.id}
                        selectedOptions={{
                          checked: true,
                        }}
                        rightSideContent={list.rightSideContent}
                      />
                    ))}
                  </List.Group>
                ))}
              </List>
            );

            cy.findByText("This content is not available");
            cy.findAllByLabelText("list-group-empty-slate")
              .eq(0)
              .should("have.css", "border", "1px solid rgb(255, 0, 0)")
              .and("have.css", "padding", "30px");
          });
        });
      });
    });
  });

  context("rightSideContent", () => {
    context("when given in the list", () => {
      const RIGHT_SIDE_CONTENT = (prop: string) => (
        <RiErrorWarningLine
          aria-label="right-side-icon"
          color="orange"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`error warning clicked ${prop}`);
          }}
        />
      );

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
              rightSideContent: RIGHT_SIDE_CONTENT,
            },
            {
              id: "profile",
              title: "Profile",
              subtitle: "View your profile",
              leftIcon: RiUser3Fill,
              rightSideContent: RIGHT_SIDE_CONTENT,
            },
            {
              id: "settings",
              title: "Settings",
              subtitle: "Adjust preferences",
              leftIcon: RiSettings3Fill,
              rightSideContent: RIGHT_SIDE_CONTENT,
            },
          ],
        },
      ];

      it("should render the content", () => {
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
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    selectedOptions={{
                      checked: true,
                    }}
                    rightSideContent={list.rightSideContent}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findAllByLabelText("right-side-icon").should("have.length", 3);
      });

      context("when clicking", () => {
        it("should render the console", () => {
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
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      selectedOptions={{
                        checked: true,
                      }}
                      rightSideContent={list.rightSideContent}
                    />
                  ))}
                </List.Group>
              ))}
            </List>
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.findAllByLabelText("right-side-icon").eq(0).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "error warning clicked all-content-home"
          );
        });
      });
    });

    context("when given in the group", () => {
      const RIGHT_SIDE_CONTENT = (prop: string) => (
        <RiErrorWarningLine
          aria-label="right-side-icon"
          onClick={() => {
            console.log(`error warning clicked ${prop}`);
          }}
        />
      );

      const ACTIONS_GROUPS: ListGroupActionsProps[] = [
        {
          caption: "Add",
          onClick: (id: string) => {
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

      it("should render in the group", () => {
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
                openerStyle="togglebox"
                actions={ACTIONS_GROUPS}
                rightSideContent={RIGHT_SIDE_CONTENT}
              >
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    selectedOptions={{
                      checked: true,
                    }}
                    rightSideContent={list.rightSideContent}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findAllByLabelText("right-side-icon").should("have.length", 2);
      });

      context("when clicking", () => {
        it("should render the console", () => {
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
                  openerStyle="togglebox"
                  actions={ACTIONS_GROUPS}
                  rightSideContent={RIGHT_SIDE_CONTENT}
                >
                  {group.items.map((list, i) => (
                    <List.Item
                      key={i}
                      id={list.id}
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      selectedOptions={{
                        checked: true,
                      }}
                      rightSideContent={list.rightSideContent}
                    />
                  ))}
                </List.Group>
              ))}
            </List>
          );
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.findAllByLabelText("right-side-icon").eq(0).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "error warning clicked recent-content"
          );
          cy.findAllByLabelText("right-side-icon").eq(1).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "error warning clicked all-content"
          );
        });
      });
    });
  });

  context("actions", () => {
    context("when given in the list", () => {
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

      it("should render the actions", () => {
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
                    actions={list.actions}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    selectedOptions={{
                      checked: true,
                    }}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findAllByLabelText("action-button").should("have.length", 0);
        cy.findAllByLabelText("list-item-wrapper")
          .eq(0)
          .realHover()
          .within(() => {
            cy.findAllByLabelText("action-button").should("have.length", 1);
          });
      });

      context("when clicking", () => {
        it("should render the console", () => {
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
                      actions={list.actions}
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

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.findAllByLabelText("list-item-wrapper")
            .eq(0)
            .realHover()
            .within(() => {
              cy.findAllByLabelText("action-button")
                .should("have.length", 1)
                .eq(0)
                .click();
            });
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "action was clicked recent-content-messages"
          );
        });
      });

      context("when given multiple actions", () => {
        it("should render the tip menu", () => {
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
                      actions={(id: string) => [
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
                      ]}
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

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.findAllByLabelText("list-item-wrapper").eq(0).realHover().click();
          cy.findAllByLabelText("action-button").eq(0).click();
          cy.findAllByLabelText("tip-menu-item")
            .should("have.length", 2)
            .eq(0)
            .click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "Edit content for recent-content-messages"
          );
        });
      });
    });
    context("when given in the group", () => {
      const ACTIONS_GROUPS: ListGroupActionsProps[] = [
        {
          caption: "Add",
          onClick: (id: string) => {
            console.log(`action was clicked ${id}`);
          },
        },
      ];

      const LIST_GROUPS: ListGroupContentProps[] = [
        {
          id: "recent-content",
          title: "Recent Content",
          subtitle: "Your latest activity",
          actions: ACTIONS_GROUPS,
          items: [
            {
              id: "messages",
              title: "Messages",
              subtitle: "Check your inbox",
              leftIcon: RiMailFill,
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
          actions: ACTIONS_GROUPS,
          items: [
            {
              id: "home",
              title: "Home",
              subtitle: "Go to homepage",
              leftIcon: RiHome2Fill,
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

      it("should render the actions", () => {
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
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    selectedOptions={{
                      checked: true,
                    }}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findAllByLabelText("action-button").should("have.length", 2);
        cy.findAllByText("Add").should("have.length", 2);
      });

      context("when clicking", () => {
        it("should render the console", () => {
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
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      selectedOptions={{
                        checked: true,
                      }}
                    />
                  ))}
                </List.Group>
              ))}
            </List>
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.findAllByLabelText("action-button").eq(0).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "action was clicked recent-content"
          );
        });
      });
    });
  });

  context("rightSideContent & actions", () => {
    context("when given", () => {
      const RIGHT_SIDE_CONTENT = (prop: string) => (
        <RiErrorWarningLine
          aria-label="right-side-icon"
          color="orange"
          onClick={(e) => {
            e.stopPropagation();
            console.log(`error warning clicked ${prop}`);
          }}
        />
      );

      const ACTIONS_GROUPS: ListGroupActionsProps[] = [
        {
          caption: "Add",
          onClick: (id: string) => {
            console.log(`action was clicked ${id}`);
          },
        },
      ];

      const LIST_GROUPS: ListGroupContentProps[] = [
        {
          id: "recent-content",
          title: "Recent Content",
          subtitle: "Your latest activity",
          actions: ACTIONS_GROUPS,
          items: [
            {
              id: "messages",
              title: "Messages",
              subtitle: "Check your inbox",
              leftIcon: RiMailFill,
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
          actions: ACTIONS_GROUPS,
          items: [
            {
              id: "home",
              title: "Home",
              subtitle: "Go to homepage",
              leftIcon: RiHome2Fill,
              rightSideContent: RIGHT_SIDE_CONTENT,
            },
            {
              id: "profile",
              title: "Profile",
              subtitle: "View your profile",
              leftIcon: RiUser3Fill,
              rightSideContent: RIGHT_SIDE_CONTENT,
            },
            {
              id: "settings",
              title: "Settings",
              subtitle: "Adjust preferences",
              leftIcon: RiSettings3Fill,
              rightSideContent: RIGHT_SIDE_CONTENT,
            },
          ],
        },
      ];

      it("should render the content", () => {
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
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    selectedOptions={{
                      checked: true,
                    }}
                    rightSideContent={list.rightSideContent}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findAllByLabelText("action-button").should("have.length", 2);
        cy.findAllByLabelText("right-side-icon").should("have.length", 3);
      });

      context("when clicking", () => {
        it("should render the console", () => {
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
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      selectedOptions={{
                        checked: true,
                      }}
                      rightSideContent={list.rightSideContent}
                    />
                  ))}
                </List.Group>
              ))}
            </List>
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.findAllByLabelText("action-button").eq(0).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "action was clicked recent-content"
          );
          cy.findAllByLabelText("action-button").eq(1).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "action was clicked all-content"
          );
          cy.findAllByLabelText("right-side-icon").eq(0).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "error warning clicked all-content-home"
          );
          cy.findAllByLabelText("right-side-icon").eq(1).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "error warning clicked all-content-profile"
          );
          cy.findAllByLabelText("right-side-icon").eq(2).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "error warning clicked all-content-settings"
          );
        });
      });
    });
  });

  context("leftSideContent", () => {
    context("when given in the list", () => {
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

      it("should render the actions", () => {
        cy.mount(
          <List
            searchable
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
                    actions={list.actions}
                    leftIcon={list.leftIcon}
                    leftSideContent={({ badge }) => badge(list.leftSideContent)}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                  />
                ))}
              </List.Group>
            ))}
          </List>
        );

        LIST_GROUPS.map((props) =>
          props.items.map((list, index) => {
            cy.findAllByLabelText("left-side-content")
              .eq(index)
              .should("contain", list.leftSideContent);
          })
        );
      });
    });
  });

  const LIST_GROUPS_OPENABLE: ListGroupContentProps[] = [
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
          children:
            "Stay connected with your contacts by checking and replying to your recent messages. Keep conversations organized and never miss important updates.",
        },
        {
          id: "notifications",
          title: "Notifications",
          subtitle: "View Alerts",
          leftIcon: RiNotification3Fill,
          children:
            "See what's new at a glance. Review recent alerts, mentions, and important reminders to stay on top of your activities.",
        },
        {
          id: "calendar",
          title: "Calendar",
          subtitle: "Upcoming events",
          leftIcon: RiCalendar2Fill,
          children:
            "View your scheduled events and upcoming meetings in one place. Manage your time effectively and plan your week with confidence.",
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
          children:
            "Return to your main dashboard where you can quickly access all your essential tools, updates, and recent highlights in one glance.",
        },
        {
          id: "profile",
          title: "Profile",
          subtitle: "View your profile",
          leftIcon: RiUser3Fill,
          children:
            "Customize your personal information, update your avatar, and manage your account preferences to reflect your identity and style.",
        },
        {
          id: "settings",
          title: "Settings",
          subtitle: "Adjust preferences",
          leftIcon: RiSettings3Fill,
          openable: true,
          children:
            "Modify your system preferences, manage privacy and notifications, and fine-tune your user experience to suit your workflow.",
        },
      ],
    },
  ];

  context("onOpen", () => {
    context("when clicking", () => {
      it("renders log id & isOpen condition", () => {
        cy.mount(
          <List
            searchable
            draggable
            selectable
            openerBehavior="onlyOne"
            onOpen={({ id, isOpen }) =>
              console.log(`for id ${id} isOpen is ${isOpen ? "true" : "false"}`)
            }
            containerStyle={css`
              padding: 16px;
              min-width: 350px;
            `}
          >
            {LIST_GROUPS_OPENABLE.map((group, index) => (
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
                    actions={list.actions}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    openable
                    selectedOptions={{
                      checked: true,
                    }}
                  >
                    {list.children}
                  </List.Item>
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });
        cy.findByText("Settings").click();
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "for id all-content-settings isOpen is true"
        );
      });
    });
  });

  context("openerBehavior", () => {
    context("when set to only one", () => {
      it("opens at most one list item at a time", () => {
        cy.mount(
          <List
            searchable
            draggable
            selectable
            openerBehavior="onlyOne"
            containerStyle={css`
              padding: 16px;
              min-width: 350px;
            `}
          >
            {LIST_GROUPS_OPENABLE.map((group, index) => (
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
                    actions={list.actions}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    openable
                    selectedOptions={{
                      checked: true,
                    }}
                  >
                    {list.children}
                  </List.Item>
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findByText(
          "Modify your system preferences, manage privacy and notifications, and fine-tune your user experience to suit your workflow."
        ).should("not.be.visible");
        cy.findByText("Settings").click();
        cy.findByText(
          "Modify your system preferences, manage privacy and notifications, and fine-tune your user experience to suit your workflow."
        ).should("be.visible");

        cy.findByText("Profile").click();
        cy.findByText(
          "Modify your system preferences, manage privacy and notifications, and fine-tune your user experience to suit your workflow."
        ).should("not.be.visible");
      });
    });

    context("when set to any", () => {
      it("allows opening any list item", () => {
        cy.mount(
          <List
            searchable
            draggable
            selectable
            openerBehavior="any"
            containerStyle={css`
              padding: 16px;
              min-width: 350px;
            `}
          >
            {LIST_GROUPS_OPENABLE.map((group, index) => (
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
                    actions={list.actions}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    openable
                    selectedOptions={{
                      checked: true,
                    }}
                  >
                    {list.children}
                  </List.Item>
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findByText(
          "Modify your system preferences, manage privacy and notifications, and fine-tune your user experience to suit your workflow."
        ).should("not.be.visible");
        cy.findByText("Settings").click();
        cy.findByText(
          "Modify your system preferences, manage privacy and notifications, and fine-tune your user experience to suit your workflow."
        ).should("be.visible");
      });
    });
  });

  context("openable", () => {
    context("with children", () => {
      it("should render children list item", () => {
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
            {LIST_GROUPS_OPENABLE.map((group, index) => (
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
                    actions={list.actions}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    openable={list.openable}
                    selectedOptions={{
                      checked: true,
                    }}
                  >
                    {list.children}
                  </List.Item>
                ))}
              </List.Group>
            ))}
          </List>
        );
        LIST_GROUPS_OPENABLE.map((groups) =>
          groups.items.map((list) => {
            if (list.title === "Settings") {
              cy.findByText(String(list.children)).should("exist");
            } else {
              cy.findByText(String(list.children)).should("not.exist");
            }
          })
        );
      });

      context("when clicking", () => {
        it("should show the children list item", () => {
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
              {LIST_GROUPS_OPENABLE.map((group, index) => (
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
                      actions={list.actions}
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      openable={list.openable}
                      selectedOptions={{
                        checked: true,
                      }}
                    >
                      {list.children}
                    </List.Item>
                  ))}
                </List.Group>
              ))}
            </List>
          );
          cy.findByText("Settings").click();

          LIST_GROUPS_OPENABLE.map((groups) =>
            groups.items.map((list, index) => {
              if (list.title === "Settings") {
                cy.findByText(String(list.children)).should("be.visible");
                cy.findAllByLabelText("list-item-wrapper")
                  .eq(5)
                  .should("have.css", "background-color", "rgb(219, 234, 254)")
                  .and("have.css", "border-radius", "3px");
              } else {
                cy.findByText(String(list.children)).should("not.exist");
                cy.findAllByLabelText("list-item-wrapper")
                  .eq(index)
                  .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
              }
            })
          );
        });

        it("should expand container before content fully fades in", () => {
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
              {LIST_GROUPS_OPENABLE.map((group, index) => (
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
                      actions={list.actions}
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      openable={list.openable}
                      selectedOptions={{
                        checked: true,
                      }}
                    >
                      {list.children}
                    </List.Item>
                  ))}
                </List.Group>
              ))}
            </List>
          );
          cy.findByText("Settings").click();

          cy.findAllByLabelText("list-item-children")
            .eq(0)
            .should("exist")
            .invoke("css", "opacity")
            .then(Number)
            .should("be.lessThan", 1);
        });
      });
    });

    context("without children", () => {
      const LIST_GROUPS_OPENABLE_WITHOUT_CHILDREN: ListGroupContentProps[] = [
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
              openable: true,
            },
            {
              id: "notifications",
              title: "Notifications",
              subtitle: "View Alerts",
              leftIcon: RiNotification3Fill,
              openable: true,
            },
            {
              id: "calendar",
              title: "Calendar",
              subtitle: "Upcoming events",
              leftIcon: RiCalendar2Fill,
              openable: true,
            },
          ],
        },
      ];

      it("should render only the list item", () => {
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
            {LIST_GROUPS_OPENABLE_WITHOUT_CHILDREN.map((group, index) => (
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
                    actions={list.actions}
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    openable={list.openable}
                    selectedOptions={{
                      checked: true,
                    }}
                  >
                    {list.children}
                  </List.Item>
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findByText("Messages").click();

        LIST_GROUPS_OPENABLE_WITHOUT_CHILDREN.map((groups) =>
          groups.items.map((list) => {
            cy.findByText(String(list.children)).should("not.exist");
          })
        );
      });

      context("when clicking", () => {
        it("should keep height consistent", () => {
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
              {LIST_GROUPS_OPENABLE_WITHOUT_CHILDREN.map((group, index) => (
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
                      actions={list.actions}
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      openable={list.openable}
                      selectedOptions={{
                        checked: true,
                      }}
                    >
                      {list.children}
                    </List.Item>
                  ))}
                </List.Group>
              ))}
            </List>
          );

          LIST_GROUPS_OPENABLE_WITHOUT_CHILDREN.map((groups, index) =>
            cy
              .findAllByLabelText("list-item-wrapper")
              .eq(index)
              .then(($el) => {
                const initialHeight = $el.height();

                cy.findByText(groups.items[index].title as string).click();

                cy.findAllByLabelText("list-item-wrapper")
                  .eq(index)
                  .then(($elAfter) => {
                    const afterHeight = $elAfter.height();
                    expect(afterHeight).to.equal(initialHeight);
                  });
              })
          );
        });
      });
    });

    context("when not given", () => {
      context("when clicking", () => {
        it("should not show the value", () => {
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
              {LIST_GROUPS_OPENABLE.map((group, index) => (
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
                      actions={list.actions}
                      leftIcon={list.leftIcon}
                      subtitle={list.subtitle}
                      title={list.title}
                      groupId={group.id}
                      openable={list.openable}
                      selectedOptions={{
                        checked: true,
                      }}
                    >
                      {list.children}
                    </List.Item>
                  ))}
                </List.Group>
              ))}
            </List>
          );
          cy.findByText("Messages").click();
          cy.findByText("Notifications").click();

          LIST_GROUPS_OPENABLE.map((groups) =>
            groups.items.map((list, index) => {
              if (list.title === "Settings") {
                cy.findByText(String(list.children)).should("not.be.visible");
              } else {
                cy.findByText(String(list.children)).should("not.exist");
              }
              cy.findAllByLabelText("list-item-wrapper")
                .eq(index)
                .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
            })
          );
        });
      });
    });
  });

  context("title on list", () => {
    const TitleContent = (id: string) => {
      return (
        <div
          aria-label="title-content-reactnode"
          style={{
            minHeight: "30px",
            backgroundColor: "wheat",
            color: "white",
          }}
        >
          This is {id} Content
        </div>
      );
    };
    const LIST_GROUPS_OPENABLE: ListGroupContentProps[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        subtitle: "Your latest activity",
        items: [
          {
            id: "messages",
            title: TitleContent("Messages"),
          },
          {
            id: "notifications",
            title: TitleContent("Notifications"),
          },
        ],
      },
    ];
    context("with reactnode", () => {
      it("renders content with element", () => {
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
            {LIST_GROUPS_OPENABLE.map((group, index) => (
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
                    title={list.title}
                    groupId={group.id}
                    selectedOptions={{
                      checked: true,
                    }}
                  >
                    {list.children}
                  </List.Item>
                ))}
              </List.Group>
            ))}
          </List>
        );
        cy.findAllByLabelText("title-content-reactnode")
          .eq(0)
          .should("have.css", "min-height", "30px")
          .and("have.css", "background-color", "rgb(245, 222, 179)");
      });
    });
  });
});
