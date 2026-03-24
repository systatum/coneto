import { Meta, StoryObj } from "@storybook/react";
import {
  List,
  ListGroupActionsProps,
  ListGroupContentProps,
  ListItemActionProps,
  ListItemProps,
} from "./list";
import {
  RiHome2Fill,
  RiUser3Fill,
  RiSettings3Fill,
  RiMailFill,
  RiNotification3Fill,
  RiCalendar2Fill,
  RiErrorWarningLine,
  RiDeleteBack2Line,
  RiEdit2Line,
  RiDeleteBin2Fill,
  RiArrowRightSLine,
} from "@remixicon/react";
import { Card } from "./card";
import React, { ChangeEvent, useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { Textbox } from "./textbox";
import { DormantText } from "./dormant-text";
import { FormFieldGroup, StatefulForm } from "./stateful-form";
import { generateSentence } from "./../lib/text";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";

const meta: Meta<typeof List> = {
  title: "Content/List",
  component: List,
  tags: ["autodocs"],
  argTypes: {
    searchable: {
      control: "boolean",
      description: "Enables the search input at the top of the list.",
    },
    searchValue: {
      control: "text",
      description:
        "Controlled value for the search input. If provided, List becomes controlled.",
    },
    onSearchRequested: {
      control: false,
      description: "Callback fired when the user types in the search input.",
    },
    onSearchKeyDown: {
      control: false,
      description: "Keyboard event handler for the search input.",
    },
    inputRef: {
      control: false,
      description: "Ref forwarded to the internal Searchbox input element.",
    },
    children: {
      control: false,
      description:
        "List content. Use `List.Group` and/or `List.Item` as children.",
    },
    isLoading: {
      control: "boolean",
      description: "Shows a loading overlay above the list when true.",
    },
    draggable: {
      control: "boolean",
      description: "Enables drag-and-drop reordering of list items.",
    },
    selectable: {
      control: "boolean",
      description: "Enables checkbox selection for list items.",
    },
    alwaysShowDragIcon: {
      control: "boolean",
      description:
        "If true, the drag handle is always visible instead of only on hover.",
    },
    openerBehavior: {
      control: { type: "select" },
      options: ["any", "onlyOne"],
      description:
        "Controls how group open state behaves. `onlyOne` allows only one group open at a time.",
    },
    onOpen: {
      control: false,
      description:
        "Callback fired when a group or openable item is opened or closed.",
    },
    onDragged: {
      control: false,
      description: `
Callback fired when an item is dragged and dropped.

Receives:
- **id**: dragged item id
- **oldGroupId**
- **newGroupId**
- **oldPosition**
- **newPosition**
    `,
    },
    maxItems: {
      control: "number",
      description:
        "Limits the number of visible items and enables the 'Show more' behavior.",
    },
    maxItemsWithIcon: {
      control: "boolean",
      description:
        "Whether to show the expand/collapse arrow icon in the Show more button.",
    },
    labels: {
      control: false,
      description: `
Custom labels for the maxItems UI.

Supports:
- **moreItemsText**
- **lessItemsText**
    `,
    },
    styles: {
      control: false,
      description: `
Custom styles for the List component.

This object allows you to override styles for specific parts:

- **containerStyle** – Root wrapper of the list
- **maxItemsStyle** – Styles for the "Show more / Show less" button
- **searchboxStyles** – Forwarded styles for the Searchbox

Each field accepts a \`CSSProp\` (styled-components compatible).
    `,
    },
  },
};

export default meta;

type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: () => {
    const LIST_ITEMS: ListItemProps[] = [
      {
        id: "home",
        title: "Home",
        subtitle: "Go to homepage",
        icon: { image: RiHome2Fill },
      },
      {
        id: "profile",
        title: "Profile",
        subtitle: "View your profile",
        icon: { image: RiUser3Fill },
      },
      {
        id: "settings",
        title: "Settings",
        subtitle: "Adjust preferences",
        icon: { image: RiSettings3Fill },
      },
      {
        id: "messages",
        title: "Messages",
        subtitle: "Check your inbox",
        icon: { image: RiMailFill },
      },
      {
        id: "notifications",
        title: "Notifications",
        subtitle: "View Alerts",
        icon: { image: RiNotification3Fill },
      },
    ];

    return (
      <Card>
        <List
          styles={{
            containerStyle: css`
              padding: 16px;
              min-width: 280px;
              gap: 8px;
            `,
          }}
        >
          {LIST_ITEMS.map((item, index) => (
            <List.Item
              key={index}
              id={item.id}
              icon={item.icon}
              subtitle={item.subtitle}
              title={item.title}
            />
          ))}
        </List>
      </Card>
    );
  },
};

export const Draggable: Story = {
  render: () => {
    "@remixicon/react";

    const LIST_GROUPS: ListGroupContentProps[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        items: [
          {
            id: "messages",
            title: "Messages",
            subtitle: "Check your inbox",
            icon: { image: RiMailFill },
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            icon: { image: RiNotification3Fill },
          },
          {
            id: "calendar",
            title: "Calendar",
            subtitle: "Upcoming events",
            icon: { image: RiCalendar2Fill },
          },
        ],
      },
      {
        id: "all-content",
        title: "All Content",
        items: [
          {
            id: "home",
            title: "Home",
            subtitle: "Go to homepage",
            icon: { image: RiHome2Fill },
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            icon: { image: RiUser3Fill },
          },
          {
            id: "settings",
            title: "Settings",
            subtitle: "Adjust preferences",
            icon: { image: RiSettings3Fill },
          },
        ],
      },
      {
        id: "deleted",
        title: "Deleted",
        items: [],
      },
    ];

    const [groups, setGroups] = useState(LIST_GROUPS);
    const [value, setValue] = useState({
      search: "",
    });

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();

      return groups
        .map((group) => {
          const matchedItems = group.items.filter((item) => {
            const titleMatch =
              typeof item.title === "string" &&
              item.title.toLowerCase().includes(searchContent);
            const subtitleMatch = item.subtitle
              ?.toLowerCase()
              .includes(searchContent);
            return titleMatch || subtitleMatch;
          });

          const groupMatches = group.title
            .toLowerCase()
            .includes(searchContent);

          if (groupMatches || matchedItems.length > 0) {
            return {
              ...group,
              items: groupMatches ? group.items : matchedItems,
            };
          }

          return null;
        })
        .filter(Boolean);
    }, [value.search, groups]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue } = e.target;

      setValue((prev) => ({ ...prev, [name]: inputValue }));
    };

    const reorderItems = (
      oldPosition: number,
      newPosition: number,
      oldGroupId: string,
      newGroupId: string
    ) => {
      if (oldGroupId === newGroupId) {
        return groups.map((group) => {
          if (group.id !== oldGroupId) return group;

          const newItems = [...group.items];
          const [movedItem] = newItems.splice(oldPosition, 1);
          newItems.splice(newPosition, 0, movedItem);

          return {
            ...group,
            items: newItems,
          };
        });
      }

      const itemToMove = groups.find((group) => group.id === oldGroupId)?.items[
        oldPosition
      ];
      if (!itemToMove) return groups;

      return groups.map((group) => {
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
    };

    const onDragged = ({
      oldPosition,
      newPosition,
      oldGroupId,
      newGroupId,
    }: {
      oldPosition: number;
      newPosition: number;
      oldGroupId: string;
      newGroupId: string;
    }) => {
      const updatedGroups = reorderItems(
        oldPosition,
        newPosition,
        oldGroupId,
        newGroupId
      );

      setGroups(updatedGroups);
    };

    return (
      <Card>
        <List
          searchable
          draggable
          onDragged={onDragged}
          onSearchRequested={onChangeValue}
          styles={{
            containerStyle: css`
              padding: 16px;
              min-width: 300px;
            `,
          }}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group
                key={index}
                id={group.id}
                title={group.title}
                styles={{
                  emptySlateStyle: css`
                    cursor: pointer;
                    transition: all 200ms ease;
                    &:hover {
                      background-color: aliceblue;
                    }
                  `,
                }}
                emptySlate={"No content"}
              >
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    icon={list.icon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                  />
                ))}
              </List.Group>
            );
          })}
        </List>
      </Card>
    );
  },
};

export const WithLoading: Story = {
  render: () => {
    const LIST_GROUPS: ListGroupContentProps[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        items: [
          {
            id: "messages",
            title: "Messages",
            subtitle: "Check your inbox",
            icon: { image: RiMailFill },
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            icon: { image: RiNotification3Fill },
          },
          {
            id: "calendar",
            title: "Calendar",
            subtitle: "Upcoming events",
            icon: { image: RiCalendar2Fill },
          },
        ],
      },
      {
        id: "all-content",
        title: "All Content",
        items: [
          {
            id: "home",
            title: "Home",
            subtitle: "Go to homepage",
            icon: { image: RiHome2Fill },
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            icon: { image: RiUser3Fill },
          },
          {
            id: "settings",
            title: "Settings",
            subtitle: "Adjust preferences",
            icon: { image: RiSettings3Fill },
          },
        ],
      },
    ];

    const [groups, setGroups] = useState(LIST_GROUPS);
    const [value, setValue] = useState({
      search: "",
    });

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();

      return groups
        .map((group) => {
          const matchedItems = group.items.filter((item) => {
            const titleMatch =
              typeof item.title === "string" &&
              item.title.toLowerCase().includes(searchContent);
            const subtitleMatch = item.subtitle
              ?.toLowerCase()
              .includes(searchContent);
            return titleMatch || subtitleMatch;
          });

          const groupMatches = group.title
            .toLowerCase()
            .includes(searchContent);

          if (groupMatches || matchedItems.length > 0) {
            return {
              ...group,
              items: groupMatches ? group.items : matchedItems,
            };
          }

          return null;
        })
        .filter(Boolean);
    }, [value.search, groups]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue } = e.target;

      setValue((prev) => ({ ...prev, [name]: inputValue }));
    };

    const reorderItems = (
      oldPosition: number,
      newPosition: number,
      oldGroupId: string,
      newGroupId: string
    ) => {
      if (oldGroupId === newGroupId) {
        return groups.map((group) => {
          if (group.id !== oldGroupId) return group;

          const newItems = [...group.items];
          const [movedItem] = newItems.splice(oldPosition, 1);
          newItems.splice(newPosition, 0, movedItem);

          return {
            ...group,
            items: newItems,
          };
        });
      }

      const itemToMove = groups.find((group) => group.id === oldGroupId)?.items[
        oldPosition
      ];
      if (!itemToMove) return groups;

      return groups.map((group) => {
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
    };

    const onDragged = ({
      oldPosition,
      newPosition,
      oldGroupId,
      newGroupId,
    }: {
      oldPosition: number;
      newPosition: number;
      oldGroupId: string;
      newGroupId: string;
    }) => {
      const updatedGroups = reorderItems(
        oldPosition,
        newPosition,
        oldGroupId,
        newGroupId
      );

      setGroups(updatedGroups);
    };

    return (
      <Card>
        <List
          searchable
          draggable
          isLoading
          onDragged={onDragged}
          onSearchRequested={onChangeValue}
          styles={{
            containerStyle: css`
              padding: 16px;
              min-width: 300px;
            `,
          }}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group key={index} id={group.id} title={group.title}>
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    icon={list.icon}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                  />
                ))}
              </List.Group>
            );
          })}
        </List>
      </Card>
    );
  },
};

export const ReactNodeTitle: Story = {
  render: () => {
    const LIST_GROUPS: ListGroupContentProps[] = [
      {
        id: "form-fields",
        title: "Form Fields",
        items: [
          { id: "name", title: "Name" },
          { id: "code", title: "Code" },
          {
            id: "lead",
            title: "Lead",
          },
        ],
      },
    ];

    const [groups, setGroups] = useState(LIST_GROUPS);

    interface InputValueProps {
      search: string;
      checked: string[];
      value: { id: string; value: string }[];
    }

    const [inputValue, setInputValue] = useState<InputValueProps>({
      search: "",
      checked: [],
      value: [],
    });

    const filteredContent = useMemo(() => {
      const searchContent = inputValue.search.toLowerCase().trim();

      return groups
        .map((group) => {
          const matchedItems = group.items.filter((item) => {
            const titleMatch =
              typeof item.title === "string" &&
              item.title.toLowerCase().includes(searchContent);
            const subtitleMatch = item.subtitle
              ?.toLowerCase()
              .includes(searchContent);
            return titleMatch || subtitleMatch;
          });

          const groupMatches = group.title
            .toLowerCase()
            .includes(searchContent);

          if (groupMatches || matchedItems.length > 0) {
            return {
              ...group,
              items: groupMatches ? group.items : matchedItems,
            };
          }

          return null;
        })
        .filter(Boolean);
    }, [inputValue.search, groups]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked, type } = e.target;

      if (type === "checkbox") {
        setInputValue((prev) => {
          const current: string[] = prev[name] ?? [];

          return {
            ...prev,
            [name]: checked
              ? [...current, value]
              : current.filter((val) => val !== value),
          };
        });
      } else {
        setInputValue((prev) => ({ ...prev, [name]: inputValue }));
      }
    };

    const LIST_GROUP_ACTIONS: ListGroupActionsProps[] = [
      {
        caption: "Add",
        onClick: () =>
          setGroups((prev) => {
            const count = prev.flatMap((g) => g.items).length + 1;

            const newItem = {
              id: `new-item-${count}`,
              title: `New Item ${count}`,
            };

            const updated = [...prev];
            updated[0] = {
              ...updated[0],
              items: [...updated[0].items, newItem],
            };

            return updated;
          }),
      },
    ];

    const LIST_ITEM_ACTIONS = (id: string): ListItemActionProps[] => {
      const selectedByFormFieldsGroup = id.split("form-fields-");
      return [
        {
          caption: "Delete",
          icon: { image: RiDeleteBin2Fill },
          onClick: () => {
            setGroups((prev) =>
              prev.map((group) => ({
                ...group,
                items: group.items.filter(
                  (item) => item.id !== selectedByFormFieldsGroup[1]
                ),
              }))
            );

            setInputValue((prev) => ({
              ...prev,
              value: prev.value.filter(
                (val) => val.id !== selectedByFormFieldsGroup[1]
              ),
            }));
          },
        },
      ];
    };

    const TitleContent = (id: string, value: string) => {
      const existing = inputValue.value.find((item) => item.id === id);
      const currentValue = existing ? existing.value : value;
      const similiarValue = inputValue.value.find((val) => val.id === id);

      const onCancelRequested = () => {
        const similiarValue = groups
          .flatMap((group) => group.items)
          .find((item) => item.id === id);

        setInputValue((prev) => ({
          ...prev,
          value: prev.value.map((val) =>
            val.id === id ? { id, value: similiarValue.title as string } : val
          ),
        }));
      };

      const onActionClick = () => {
        setGroups((groups) =>
          groups.map((group) => ({
            ...group,
            items: group.items.map((item) =>
              item.id === similiarValue?.id
                ? {
                    ...item,
                    id: similiarValue.id,
                    title: similiarValue.value,
                  }
                : item
            ),
          }))
        );
      };

      const onActive = () => {
        if (!existing)
          setInputValue((prev) => ({
            ...prev,
            value: [...prev.value, { id: id, value: value }],
          }));
      };

      return (
        <DormantText
          fullWidth
          cancelable
          styles={{
            dormantedStyle: css`
              &:hover {
                background-color: transparent;
                border-color: transparent;
              }
              height: 24px;
            `,
          }}
          acceptChangeOn="enter"
          onCancelRequested={onCancelRequested}
          dormantedFontSize={14}
          content={value}
          onActionClick={onActionClick}
          onActive={onActive}
        >
          <Textbox
            autoComplete="off"
            value={currentValue}
            onChange={(e) => {
              const val = e.target.value;
              setInputValue((prev) => ({
                ...prev,
                value: prev.value.some((item) => item.id === id)
                  ? prev.value.map((item) =>
                      item.id === id ? { ...item, value: val } : item
                    )
                  : [...prev.value, { id, value: val }],
              }));
            }}
          />
        </DormantText>
      );
    };

    return (
      <Card>
        <List
          searchable
          selectable
          onSearchRequested={onChangeValue}
          styles={{
            containerStyle: css`
              padding: 16px;
              min-width: 400px;
            `,
          }}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group
                key={index}
                id={group.id}
                subtitle={group.subtitle}
                title={group.title}
                actions={LIST_GROUP_ACTIONS}
              >
                {group.items.map((list, i) => {
                  const title = TitleContent(list.id, list.title as string);
                  return (
                    <List.Item
                      key={i}
                      id={list.id}
                      subtitle={list.subtitle}
                      title={title}
                      actions={LIST_ITEM_ACTIONS}
                      styles={{
                        containerStyle: css`
                          width: 100%;
                        `,
                        titleStyle: css`
                          width: 100%;
                        `,
                        rightSideStyle: css`
                          width: 6%;
                        `,
                      }}
                      groupId={group.id}
                      onSelected={onChangeValue}
                      selectedOptions={{
                        checked: inputValue.checked.some(
                          (check) => check === list.id
                        ),
                        value: list.id,
                      }}
                    />
                  );
                })}
              </List.Group>
            );
          })}
        </List>
      </Card>
    );
  },
};

export const WithSubcontent: Story = {
  render: () => {
    const LIST_GROUPS: ListGroupContentProps[] = [
      {
        id: "form-fields",
        title: "Form Fields",
        items: [
          { id: "name", title: "Name" },
          { id: "code", title: "Code" },
          {
            id: "lead",
            title: "Lead",
          },
        ],
      },
    ];

    interface InputValueProps {
      search: string;
      checked: string[];
      value: { id: string; value: string }[];
      statefulValue: { id: string; value: string }[];
    }

    function useListController(initialGroups: ListGroupContentProps[]) {
      const [groups, setGroups] = useState(initialGroups);

      const [inputValue, setInputValue] = useState<InputValueProps>({
        search: "",
        checked: [],
        value: [],
        statefulValue: [],
      });

      const filteredContent = useMemo(() => {
        const searchContent = inputValue.search.toLowerCase().trim();

        return groups
          .map((group) => {
            const matchedItems = group.items.filter((item) => {
              const titleMatch =
                typeof item.title === "string" &&
                item.title.toLowerCase().includes(searchContent);
              const subtitleMatch = item.subtitle
                ?.toLowerCase()
                .includes(searchContent);
              return titleMatch || subtitleMatch;
            });

            const groupMatches = group.title
              .toLowerCase()
              .includes(searchContent);

            if (groupMatches || matchedItems.length > 0) {
              return {
                ...group,
                items: groupMatches ? group.items : matchedItems,
              };
            }

            return null;
          })
          .filter(Boolean);
      }, [groups, inputValue.search]);

      const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;

        if (type === "checkbox") {
          setInputValue((prev) => {
            const current: string[] = prev[name] ?? [];

            return {
              ...prev,
              [name]: checked
                ? [...current, value]
                : current.filter((val) => val !== value),
            };
          });
        } else {
          setInputValue((prev) => ({ ...prev, [name]: inputValue }));
        }
      };

      return {
        groups,
        setGroups,
        inputValue,
        setInputValue,
        filteredContent,
        onChangeValue,
      };
    }

    const FIELDS = (
      itemId: string,
      inputValue: InputValueProps,
      setGroups: React.Dispatch<React.SetStateAction<ListGroupContentProps[]>>
    ): FormFieldGroup[] => [
      {
        name: "value",
        title: "Name",
        type: "text",
        required: true,
        placeholder: "Enter your name",
      },
      {
        name: "button",
        title: "Save",
        type: "button",
        rowJustifyContent: "end",
        onClick: () => {
          const current = inputValue.statefulValue.find((v) => v.id === itemId);

          if (!current) return;

          setGroups((prev) =>
            prev.map((group) => ({
              ...group,
              items: group.items.map((item) =>
                item.id === itemId ? { ...item, title: current.value } : item
              ),
            }))
          );
        },
      },
    ];

    const LIST_ACTIONS_GROUP = (
      setGroups: React.Dispatch<React.SetStateAction<ListGroupContentProps[]>>
    ): ListGroupActionsProps[] => [
      {
        caption: "Add",
        onClick: () =>
          setGroups((prev) => {
            const count = prev.flatMap((g) => g.items).length + 1;
            const newItem = {
              id: `new-item-${count}`,
              title: `New Item ${count}`,
            };

            return [
              {
                ...prev[0],
                items: [...prev[0].items, newItem],
              },
            ];
          }),
      },
    ];

    const LIST_ITEM_ACTIONS = (
      itemId: string,
      setGroups: React.Dispatch<React.SetStateAction<ListGroupContentProps[]>>,
      setInputValue: React.Dispatch<React.SetStateAction<InputValueProps>>
    ): ListItemActionProps[] => {
      const selectedByFormFieldsGroup = itemId.split("form-fields-");

      return [
        {
          caption: "Delete",
          isDangerous: true,
          icon: { image: RiDeleteBin2Fill },
          onClick: () => {
            setGroups((prev) =>
              prev.map((group) => ({
                ...group,
                items: group.items.filter(
                  (item) => item.id !== selectedByFormFieldsGroup[1]
                ),
              }))
            );

            setInputValue((prev) => ({
              ...prev,
              value: prev.value.filter((v) => v.id !== itemId),
              statefulValue: prev.statefulValue.filter(
                (v) => v.id !== selectedByFormFieldsGroup[1]
              ),
              checked: prev.checked.filter((v) => v !== itemId),
            }));
          },
        },
      ];
    };

    const listAny = useListController(LIST_GROUPS);
    const listWithOnlyOne = useListController(LIST_GROUPS);

    return (
      <Wrapper>
        <div
          aria-label="nested-with-prevent-default"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
            }}
          >
            Allow any to open.
          </h2>
          <Card
            styles={{
              containerStyle: css`
                height: fit-content;
              `,
            }}
          >
            <List
              searchable
              selectable
              onSearchRequested={listAny.onChangeValue}
              styles={{
                containerStyle: css`
                  padding: 16px;
                  min-width: 350px;
                  max-width: 350px;
                `,
              }}
            >
              {listAny.filteredContent.map((group) => {
                return (
                  <List.Group
                    key={group.id}
                    id={group.id}
                    subtitle={group.subtitle}
                    title={group.title}
                    actions={LIST_ACTIONS_GROUP(listAny.setGroups)}
                    styles={{
                      containerStyle: css`
                        gap: 4px;
                      `,
                    }}
                  >
                    {group.items.map((list, i) => {
                      return (
                        <List.Item
                          key={i}
                          id={list.id}
                          title={list.title}
                          styles={{
                            rowStyle: css`
                              width: 100%;
                            `,
                            titleStyle: css`
                              width: 100%;
                            `,
                            rightSideStyle: css`
                              width: 6%;
                            `,
                          }}
                          openable
                          actions={(id?: string) =>
                            LIST_ITEM_ACTIONS(
                              id,
                              listAny.setGroups,
                              listAny.setInputValue
                            )
                          }
                          onClick={() => {
                            listAny.setInputValue((prev) => {
                              const exists = prev.statefulValue.some(
                                (item) => item.id === list.id
                              );

                              return {
                                ...prev,
                                statefulValue: exists
                                  ? prev.statefulValue
                                  : [
                                      ...prev.statefulValue,
                                      {
                                        id: list.id,
                                        value: list.title as string,
                                      },
                                    ],
                              };
                            });
                          }}
                          onSelected={listAny.onChangeValue}
                          selectedOptions={{
                            checked: listAny.inputValue.checked.some(
                              (check) => check === list.id
                            ),
                            value: list.id,
                          }}
                        >
                          {listAny.inputValue.statefulValue.map((item) => {
                            if (item.id === list.id)
                              return (
                                <StatefulForm
                                  key={i}
                                  styles={{
                                    containerStyle: css`
                                      padding-left: 30px;
                                      padding-right: 30px;
                                      padding-bottom: 8px;
                                    `,
                                  }}
                                  formValues={item}
                                  fields={FIELDS(
                                    list.id,
                                    listAny.inputValue,
                                    listAny.setGroups
                                  )}
                                  onChange={({ currentState }) =>
                                    listAny.setInputValue((prev) => ({
                                      ...prev,
                                      statefulValue: prev.statefulValue.map(
                                        (props) =>
                                          props.id === item.id
                                            ? { ...props, ...currentState }
                                            : props
                                      ),
                                    }))
                                  }
                                />
                              );
                          })}
                        </List.Item>
                      );
                    })}
                  </List.Group>
                );
              })}
            </List>
          </Card>
        </div>

        <div
          aria-label="nested-with-prevent-default"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
            }}
          >
            Allow at most one opened.
          </h2>
          <Card
            styles={{
              containerStyle: css`
                height: fit-content;
              `,
            }}
          >
            <List
              searchable
              selectable
              openerBehavior="onlyOne"
              onSearchRequested={listWithOnlyOne.onChangeValue}
              styles={{
                containerStyle: css`
                  padding: 16px;
                  min-width: 350px;
                  max-width: 350px;
                `,
              }}
            >
              {listWithOnlyOne.filteredContent.map((group) => {
                return (
                  <List.Group
                    key={group.id}
                    id={group.id}
                    subtitle={group.subtitle}
                    title={group.title}
                    actions={LIST_ACTIONS_GROUP(listWithOnlyOne.setGroups)}
                    styles={{
                      containerStyle: css`
                        gap: 4px;
                      `,
                    }}
                  >
                    {group.items.map((list, i) => {
                      return (
                        <List.Item
                          key={i}
                          id={list.id}
                          title={list.title}
                          openable
                          styles={{
                            rowStyle: css`
                              width: 100%;
                            `,
                            titleStyle: css`
                              width: 100%;
                            `,
                            rightSideStyle: css`
                              width: 6%;
                            `,
                          }}
                          actions={(id?: string) =>
                            LIST_ITEM_ACTIONS(
                              id,
                              listWithOnlyOne.setGroups,
                              listWithOnlyOne.setInputValue
                            )
                          }
                          onClick={() => {
                            listWithOnlyOne.setInputValue((prev) => {
                              const exists = prev.statefulValue.some(
                                (item) => item.id === list.id
                              );

                              return {
                                ...prev,
                                statefulValue: exists
                                  ? prev.statefulValue
                                  : [
                                      ...prev.statefulValue,
                                      {
                                        id: list.id,
                                        value: list.title as string,
                                      },
                                    ],
                              };
                            });
                          }}
                          onSelected={listWithOnlyOne.onChangeValue}
                          selectedOptions={{
                            checked: listWithOnlyOne.inputValue.checked.some(
                              (check) => check === list.id
                            ),
                            value: list.id,
                          }}
                        >
                          {listWithOnlyOne.inputValue.statefulValue.map(
                            (item) => {
                              if (item.id === list.id)
                                return (
                                  <StatefulForm
                                    key={i}
                                    styles={{
                                      containerStyle: css`
                                        padding-left: 30px;
                                        padding-right: 30px;
                                        padding-bottom: 8px;
                                      `,
                                    }}
                                    formValues={item}
                                    fields={FIELDS(
                                      list.id,
                                      listWithOnlyOne.inputValue,
                                      listWithOnlyOne.setGroups
                                    )}
                                    onChange={({ currentState }) =>
                                      listWithOnlyOne.setInputValue((prev) => ({
                                        ...prev,
                                        statefulValue: prev.statefulValue.map(
                                          (props) =>
                                            props.id === item.id
                                              ? { ...props, ...currentState }
                                              : props
                                        ),
                                      }))
                                    }
                                  />
                                );
                            }
                          )}
                        </List.Item>
                      );
                    })}
                  </List.Group>
                );
              })}
            </List>
          </Card>
        </div>
      </Wrapper>
    );
  },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

export const WithBadge: Story = {
  render: () => {
    const [content, setContent] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    type ListItem = Omit<ListItemProps, "leftSideContent"> & {
      leftSideContent?: number;
    };

    type ListGroupContentWithNumber = Omit<ListGroupContentProps, "items"> & {
      items: ListItem[];
    };

    const LIST_GROUPS: ListGroupContentWithNumber[] = [
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

    const EMPLOYEES_BIRTHDAY: ListItemProps[] = [
      { id: "1", title: "Alim", subtitle: "Jan 1" },
      { id: "2", title: "Budi", subtitle: "Feb 3" },
    ];

    const EMPLOYEES_NEW_HIRES: ListItemProps[] = [
      { id: "1", title: "Citra", subtitle: "Joined 1 week ago" },
    ];

    const EMPLOYEES_TERMINATED: ListItemProps[] = [];

    const EMPLOYEES_ANNIVERSARIES: ListItemProps[] = [
      { id: "1", title: "Deni", subtitle: "5 years" },
      { id: "2", title: "Eka", subtitle: "3 years" },
      { id: "3", title: "Fajar", subtitle: "2 years" },
    ];

    const EMPLOYEES_PROMOTIONS: ListItemProps[] = [
      { id: "1", title: "Gita", subtitle: "Promoted to Senior" },
    ];

    const EMPLOYEES_TRAININGS: ListItemProps[] = [
      { id: "1", title: "Hadi", subtitle: "React Training" },
      { id: "2", title: "Ika", subtitle: "TypeScript Training" },
    ];

    const EMPLOYEES_ON_LEAVE: ListItemProps[] = [
      { id: "1", title: "Joko", subtitle: "Sick Leave" },
    ];

    const EMPLOYEE_CONTENT_MAP: Record<string, ListItemProps[]> = {
      birthday: EMPLOYEES_BIRTHDAY,
      "new-hires": EMPLOYEES_NEW_HIRES,
      "terminated-employees": EMPLOYEES_TERMINATED,
      anniversaries: EMPLOYEES_ANNIVERSARIES,
      promotions: EMPLOYEES_PROMOTIONS,
      trainings: EMPLOYEES_TRAININGS,
      "sick-leave": EMPLOYEES_ON_LEAVE,
    };

    const ShowContent = () => {
      return content.length > 0 ? (
        content.map((list, i) => (
          <List.Item
            key={i}
            openable={list.openable}
            id={list.id}
            subtitle={list.subtitle}
            title={list.title}
          >
            {list.children}
          </List.Item>
        ))
      ) : (
        <EmptySlate
          imageUrl="https://picsum.photos/200?random=2"
          title="No employees found"
          subtitle="It looks like there are no employees in this category yet."
          actions={
            <>
              <Button variant="default">Add Employee</Button>
              <Button variant="primary">Learn More</Button>
            </>
          }
          styles={{
            containerStyle: css`
              text-align: center;
              padding-top: 30px;
              padding-bottom: 30px;
            `,
          }}
        />
      );
    };

    const [groups] = useState(LIST_GROUPS);
    const [search, setSearch] = useState("");

    const filteredContent = useMemo(() => {
      const searchContent = search.toLowerCase().trim();

      return groups
        .map((group) => {
          const matchedItems = group.items.filter((item) => {
            const titleMatch =
              typeof item.title === "string" &&
              item.title.toLowerCase().includes(searchContent);
            const subtitleMatch = item.subtitle
              ?.toLowerCase()
              .includes(searchContent);
            return titleMatch || subtitleMatch;
          });

          const groupMatches = group.title
            .toLowerCase()
            .includes(searchContent);

          if (groupMatches || matchedItems.length > 0) {
            return {
              ...group,
              items: groupMatches ? group.items : matchedItems,
            };
          }

          return null;
        })
        .filter(Boolean);
    }, [search, groups]);

    return (
      <Card>
        <List
          searchable
          onSearchRequested={(e) => setSearch(e.target.value)}
          styles={{
            containerStyle: css`
              padding: 16px;
              min-width: 400px;
            `,
          }}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group
                key={index}
                id={group.id}
                subtitle={group.subtitle}
                title={group.title}
                actions={
                  isOpen &&
                  [
                    {
                      caption: "Back",
                      onClick: () => {
                        setIsOpen(false);
                      },
                    },
                  ].filter(Boolean)
                }
              >
                {isOpen ? (
                  <ShowContent />
                ) : (
                  group.items.map((list, i) => (
                    <List.Item
                      key={i}
                      onClick={async () => {
                        await setContent(EMPLOYEE_CONTENT_MAP[list.id]);
                        await setIsOpen(true);
                      }}
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
                      rightSideContent={<RiArrowRightSLine size={18} />}
                    >
                      {list.children}
                    </List.Item>
                  ))
                )}
              </List.Group>
            );
          })}
        </List>
      </Card>
    );
  },
};

export const CustomOpener: Story = {
  render: () => {
    const RIGHT_SIDE_CONTENT = (prop: string) => (
      <RiErrorWarningLine
        style={{
          minWidth: "22px",
          minHeight: "22px",
        }}
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
          console.log(`action was added ${id}`);
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
            icon: { image: RiMailFill },
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            icon: { image: RiNotification3Fill },
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            icon: { image: RiUser3Fill },
          },
          {
            id: "calendar",
            title: "Calendar",
            subtitle: "Upcoming events",
            icon: { image: RiCalendar2Fill },
          },
        ],
      },
      {
        id: "all-content",
        title: "All Content",
        subtitle: "With warning rightSideContent",
        rightSideContent: RIGHT_SIDE_CONTENT,
        items: [
          {
            id: "home",
            title: "Home",
            subtitle: "Go to homepage",
            icon: { image: RiHome2Fill },
            rightSideContent: RIGHT_SIDE_CONTENT,
          },
          {
            id: "settings",
            title: "Settings",
            subtitle: "Adjust preferences",
            icon: { image: RiSettings3Fill },
            rightSideContent: RIGHT_SIDE_CONTENT,
          },
        ],
      },
    ];

    const [groups, setGroups] = useState<ListGroupContentProps[]>(LIST_GROUPS);
    const [value, setValue] = useState({
      search: "",
      checked: [],
    });

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();

      return groups
        .map((group) => {
          const matchedItems = group.items.filter((item) => {
            const titleMatch =
              typeof item.title === "string" &&
              item.title.toLowerCase().includes(searchContent);
            const subtitleMatch = item.subtitle
              ?.toLowerCase()
              .includes(searchContent);
            return titleMatch || subtitleMatch;
          });

          const groupMatches = group.title
            .toLowerCase()
            .includes(searchContent);

          if (groupMatches || matchedItems.length > 0) {
            return {
              ...group,
              items: groupMatches ? group.items : matchedItems,
            };
          }

          return null;
        })
        .filter(Boolean);
    }, [value.search, groups]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked, type } = e.target;

      if (type === "checkbox") {
        setValue((prev) => {
          const current: string[] = prev[name] ?? [];

          return {
            ...prev,
            [name]: checked
              ? [...current, value]
              : current.filter((val) => val !== value),
          };
        });
      } else {
        setValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    const reorderItems = (
      oldPosition: number,
      newPosition: number,
      oldGroupId: string,
      newGroupId: string
    ) => {
      if (oldGroupId === newGroupId) {
        return groups.map((group) => {
          if (group.id !== oldGroupId) return group;

          const newItems = [...group.items];
          const [movedItem] = newItems.splice(oldPosition, 1);
          newItems.splice(newPosition, 0, movedItem);

          return {
            ...group,
            items: newItems,
          };
        });
      }

      const itemToMove = groups.find((group) => group.id === oldGroupId)?.items[
        oldPosition
      ];
      if (!itemToMove) return groups;

      return groups.map((group) => {
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
    };

    const onDragged = ({
      oldPosition,
      newPosition,
      oldGroupId,
      newGroupId,
    }: {
      oldPosition: number;
      newPosition: number;
      oldGroupId: string;
      newGroupId: string;
    }) => {
      const updatedGroups = reorderItems(
        oldPosition,
        newPosition,
        oldGroupId,
        newGroupId
      );

      setGroups(updatedGroups);
    };

    return (
      <Card>
        <List
          searchable
          draggable
          selectable
          onDragged={onDragged}
          onSearchRequested={onChangeValue}
          styles={{
            containerStyle: css`
              padding: 16px;
              min-width: 500px;
            `,
          }}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group
                key={index}
                id={group.id}
                subtitle={group.subtitle}
                title={group.title}
                actions={ACTIONS_GROUPS}
                rightSideContent={group.rightSideContent}
                openerStyle="togglebox"
              >
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    openable={list.openable}
                    id={list.id}
                    title={list.title}
                    groupId={group.id}
                    icon={list.icon}
                    subtitle={list.subtitle}
                    rightSideContent={list.rightSideContent}
                    onSelected={onChangeValue}
                    actions={(id: string) => [
                      {
                        caption: "Edit",
                        icon: {
                          image: RiEdit2Line,
                        },
                        onClick: () => {
                          console.log(`Edit content for ${id}`);
                        },
                      },
                      {
                        caption: "Delete",
                        isDangerous: true,
                        icon: {
                          image: RiDeleteBack2Line,
                        },
                        onClick: () => {
                          console.log(`Delete content for ${id}`);
                        },
                      },
                    ]}
                    selectedOptions={{
                      checked: value.checked.some((check) => check === list.id),
                      value: list.id,
                    }}
                  />
                ))}
              </List.Group>
            );
          })}
        </List>
      </Card>
    );
  },
};

export const WithMaxItems: Story = {
  render: () => {
    const LIST_ITEMS: ListItemProps[] = [
      {
        id: "1",
        title: "French Toast",
        icon: { image: "https://picsum.photos/seed/frenchtoast/200" },
        rightSideContent: "13$",
      },
      {
        id: "2",
        title: "Sushi Deluxe",
        icon: { image: "https://picsum.photos/seed/sushi/200" },
        rightSideContent: "22$",
      },
      {
        id: "3",
        title: "Pad Thai",
        icon: { image: "https://picsum.photos/seed/padthai/200" },
        rightSideContent: "15$",
      },
      {
        id: "4",
        title: "Tacos Al Pastor",
        icon: { image: "https://picsum.photos/seed/tacos/200" },
        rightSideContent: "12$",
      },
      {
        id: "5",
        title: "Margherita Pizza",
        icon: { image: "https://picsum.photos/seed/pizza/200" },
        rightSideContent: "18$",
      },
      {
        id: "6",
        title: "Butter Chicken",
        icon: { image: "https://picsum.photos/seed/butterchicken/200" },
        rightSideContent: "16$",
      },
      {
        id: "7",
        title: "Pho Bo",
        icon: { image: "https://picsum.photos/seed/phobo/200" },
        rightSideContent: "14$",
      },
      {
        id: "8",
        title: "Croissant & Coffee",
        icon: { image: "https://picsum.photos/seed/croissant/200" },
        rightSideContent: "10$",
      },
      {
        id: "9",
        title: "Cheeseburger",
        icon: { image: "https://picsum.photos/seed/cheeseburger/200" },
        rightSideContent: "11$",
      },
      {
        id: "10",
        title: "Falafel Wrap",
        icon: { image: "https://picsum.photos/seed/falafel/200" },
        rightSideContent: "13$",
      },
    ];

    const [value, setValue] = useState({
      search: "",
      checked: [],
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked, type } = e.target;

      if (type === "checkbox") {
        setValue((prev) => {
          const current: string[] = prev[name] ?? [];

          return {
            ...prev,
            [name]: checked
              ? [...current, value]
              : current.filter((val) => val !== value),
          };
        });
      } else {
        setValue((prev) => ({ ...prev, [name]: value }));
      }
    };

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();
      return LIST_ITEMS.filter((list) =>
        String(list.title).toLowerCase().includes(searchContent)
      );
    }, [value.search]);

    return (
      <Card
        title="Systatum Food Services"
        subtitle="Fueling innovation with every bite."
        headerActions={[
          {
            caption: "Edit fields",
            disabled: value.checked.length === 0,
            icon: {
              image: RiEdit2Line,
            },
            onClick: () => {
              console.log(`Edit ${value.checked.length} clicked`);
            },
          },
        ]}
        styles={{
          containerStyle: css`
            padding-left: 0px;
            padding-right: 0px;
          `,
          headerStyle: css`
            padding-left: 15px;
            padding-right: 15px;
            border-bottom: 1px solid #d1d5db;
          `,
          footerStyle: css`
            padding-left: 20px;
            padding-right: 20px;
            border-top: 1px solid #d1d5db;
          `,
        }}
      >
        <List
          searchable
          selectable
          onSearchRequested={onChangeValue}
          styles={{
            containerStyle: css`
              padding: 16px;
              min-width: 400px;
            `,
          }}
          maxItems={5}
        >
          {filteredContent.map((list, i) => (
            <List.Item
              key={i}
              styles={{
                containerStyle: css`
                  min-width: 300px;
                `,
              }}
              id={list.id}
              subtitle={list.subtitle}
              title={list.title}
              icon={list.icon}
              onClick={() => {
                const isAlreadyChecked = value.checked.some(
                  (check) => check === list.id
                );

                onChangeValue({
                  target: {
                    name: "checked",
                    value: list.id,
                    type: "checkbox",
                    checked: !isAlreadyChecked,
                  },
                } as ChangeEvent<HTMLInputElement>);
              }}
              rightSideContent={list.rightSideContent}
              onSelected={onChangeValue}
              selectedOptions={{
                checked: value.checked.some((check) => check === list.id),
                value: list.id,
              }}
            />
          ))}
        </List>
      </Card>
    );
  },
};

export const Accordion: Story = {
  render: () => {
    const ACTIONS_GROUPS: ListGroupActionsProps[] = [
      {
        caption: "Refresh",
        onClick: (id: string) => {
          console.log(`action was added ${id}`);
        },
      },
    ];

    const LIST_WIDTH = "380px";

    const ITEM_TITLE = "Container has not been started yet";
    const ITEM_STYLE = css`
      font-size: 12px;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 10px;
    `;

    const HOVER_TEXT_COLOR = "white";
    const HOVER_BG_COLOR = "#1F2937";

    const sentence = useMemo(
      () => generateSentence({ minLen: 40, maxLen: 50 }),
      []
    );

    return (
      <Wrapper>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <h3>Non-exclusive</h3>
          <List
            styles={{
              containerStyle: css`
                width: ${LIST_WIDTH};
              `,
            }}
          >
            {["Inference log", "Compiler log"].map((title) => {
              const id = title.toLowerCase().split(" ").join("-");
              return (
                <List.Group
                  key={id}
                  id={id}
                  title={title}
                  actions={ACTIONS_GROUPS}
                >
                  <List.Item
                    openable
                    selected
                    id={id}
                    title={ITEM_TITLE}
                    hoverTextColor={HOVER_TEXT_COLOR}
                    hoverBackgroundColor={HOVER_BG_COLOR}
                    styles={{ openableStyle: ITEM_STYLE }}
                  >
                    {sentence}
                  </List.Item>
                </List.Group>
              );
            })}
          </List>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <h3>Exclusive</h3>
          <List
            styles={{
              containerStyle: css`
                width: ${LIST_WIDTH};
              `,
            }}
            openerBehavior="onlyOne"
            groupOpenerBehavior="onlyOne"
          >
            {["First item", "Second item", "Third item"].map((title, idx) => {
              const id = `exclusive-${idx}`;
              return (
                <List.Group
                  key={id}
                  id={id}
                  title={title}
                  actions={ACTIONS_GROUPS}
                  initialState={`exclusive-0` === id ? "opened" : "closed"}
                >
                  <List.Item
                    openable
                    selected
                    id={id}
                    title={ITEM_TITLE}
                    hoverTextColor={HOVER_TEXT_COLOR}
                    hoverBackgroundColor={HOVER_BG_COLOR}
                    styles={{ openableStyle: ITEM_STYLE }}
                  >
                    {sentence}
                  </List.Item>
                </List.Group>
              );
            })}
          </List>
        </div>
      </Wrapper>
    );
  },
};
