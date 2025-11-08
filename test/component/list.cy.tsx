import {
  RiCalendar2Fill,
  RiErrorWarningLine,
  RiHome2Fill,
  RiMailFill,
  RiNotification3Fill,
  RiSettings3Fill,
  RiUser3Fill,
} from "@remixicon/react";
import {
  List,
  ListActionsProps,
  ListGroupContentProps,
} from "./../../components/list";
import { css } from "styled-components";

describe("List", () => {
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
        cy.wait(100);

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
          cy.wait(100);

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

      const ACTIONS_GROUPS: ListActionsProps[] = [
        {
          title: "Add",
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
        cy.wait(100);

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
          cy.wait(100);

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
      const ACTIONS_GROUPS: ListActionsProps[] = [
        {
          title: "Add",
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
              actions: ACTIONS_GROUPS,
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
              actions: ACTIONS_GROUPS,
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
        cy.wait(100);

        cy.findAllByLabelText("list-action-button").should("have.length", 2);
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
          cy.wait(100);

          cy.findAllByLabelText("list-action-button").eq(0).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "action was clicked recent-content-messages"
          );
        });
      });
    });
    context("when given in the group", () => {
      const ACTIONS_GROUPS: ListActionsProps[] = [
        {
          title: "Add",
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
        cy.wait(100);

        cy.findAllByLabelText("list-action-button").should("have.length", 2);
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
          cy.wait(100);

          cy.findAllByLabelText("list-action-button").eq(0).click();
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

      const ACTIONS_GROUPS: ListActionsProps[] = [
        {
          title: "Add",
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
        cy.wait(100);

        cy.findAllByLabelText("list-action-button").should("have.length", 2);
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
          cy.wait(100);

          cy.findAllByLabelText("list-action-button").eq(0).click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "action was clicked recent-content"
          );
          cy.findAllByLabelText("list-action-button").eq(1).click();
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

  context("openable ", () => {
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
        cy.wait(100);

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
          cy.wait(100);
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
        cy.wait(100);
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

                cy.findByText(groups.items[index].title).click();

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
          cy.wait(100);
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
});
