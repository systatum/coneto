import {
  RiArrowRightSLine,
  RiCalendar2Fill,
  RiDeleteBack2Line,
  RiEdit2Line,
  RiHome2Fill,
  RiMailFill,
  RiNotification3Fill,
  RiSettings3Fill,
  RiUser3Fill,
} from "@remixicon/react";
import {
  List,
  ListActionItemProps,
  ListGroupContentProps,
} from "./../../components/list";
import { css } from "styled-components";

describe("context-menu", () => {
  context("when given in the list", () => {
    const LIST_ACTION_ITEMS_PROPS = (id: string): ListActionItemProps[] => [
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

        cy.wait(100);

        cy.findAllByLabelText("list-item-wrapper").eq(0).realHover().click();
        cy.findAllByLabelText("action-button").eq(0).click();
        cy.findAllByLabelText("tip-menu-item").should("have.length", 2);

        cy.findAllByLabelText("action-button")
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

              expect(itemDistanceFromRight).to.be.closeTo(
                btnDistanceFromRight,
                6
              );
            });
          });
      });
    });
  });
});
