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
  RiArrowRightSLine,
  RiDeleteBack2Line,
  RiEdit2Line,
  RiDeleteBin2Fill,
} from "@remixicon/react";
import { Card } from "./card";
import { ChangeEvent, useMemo, useState } from "react";
import { css } from "styled-components";
import { EmptySlate } from "./empty-slate";
import { Button } from "./button";
import { Textbox } from "./textbox";
import { DormantText } from "./dormant-text";
import { FormFieldGroup, StatefulForm } from "./stateful-form";

const meta: Meta<typeof List> = {
  title: "Content/List",
  component: List,
  tags: ["autodocs"],
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
    ];

    return (
      <Card>
        <List
          containerStyle={css`
            padding: 16px;
            gap: 8px;
          `}
        >
          {LIST_ITEMS.map((item, index) => (
            <List.Item
              key={index}
              id={item.id}
              leftIcon={item.leftIcon}
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
    const LIST_GROUPS: ListGroupContentProps[] = [
      {
        id: "recent-content",
        title: "Recent Content",
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
          containerStyle={css`
            padding: 16px;
            min-width: 300px;
          `}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group
                key={index}
                id={group.id}
                title={group.title}
                emptySlateStyle={css`
                  cursor: pointer;
                  transition: all 200ms ease;
                  &:hover {
                    background-color: aliceblue;
                  }
                `}
                emptySlate={"No content"}
              >
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    leftIcon={list.leftIcon}
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
          containerStyle={css`
            padding: 16px;
            min-width: 300px;
          `}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group key={index} id={group.id} title={group.title}>
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    leftIcon={list.leftIcon}
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
      checked: ListItemProps[];
      value: { id: string; value: string }[];
    }

    const [inputValue, setInputValue] = useState<InputValueProps>({
      search: "",
      checked: [] as ListItemProps[],
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
      const { name, value: inputValue, checked, type } = e.target;

      if (type === "checkbox") {
        const parsed = JSON.parse(inputValue);
        setInputValue((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], parsed]
            : prev[name].filter((val: ListItemProps) => val.id !== parsed.id),
        }));
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
          icon: RiDeleteBin2Fill,
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
          dormantedStyle={css`
            &:hover {
              background-color: transparent;
              border-color: transparent;
            }
            height: 24px;
          `}
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
          containerStyle={css`
            padding: 16px;
            min-width: 500px;
          `}
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
                      containerStyle={css`
                        width: 100%;
                      `}
                      titleStyle={css`
                        width: 100%;
                      `}
                      rightSideStyle={css`
                        width: 6%;
                      `}
                      groupId={group.id}
                      onSelected={onChangeValue}
                      selectedOptions={{
                        checked: inputValue.checked.some(
                          (check) => check.id === list.id
                        ),
                        value: JSON.stringify({
                          id: list.id,
                          title: list.title,
                          subtitle: list.subtitle,
                        }),
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

    const [groups, setGroups] = useState(LIST_GROUPS);

    interface InputValueProps {
      search: string;
      checked: ListItemProps[];
      value: { id: string; value: string }[];
      statefulValue: { id: string; value: string };
    }

    const [inputValue, setInputValue] = useState<InputValueProps>({
      search: "",
      checked: [] as ListItemProps[],
      value: [],
      statefulValue: {
        id: "",
        value: "",
      },
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
    }, [inputValue, groups]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue, checked, type } = e.target;

      if (type === "checkbox") {
        const parsed = JSON.parse(inputValue);
        setInputValue((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], parsed]
            : prev[name].filter((val: ListItemProps) => val.id !== parsed.id),
        }));
      } else {
        setInputValue((prev) => ({ ...prev, [name]: inputValue }));
      }
    };

    const FIELDS: FormFieldGroup[] = [
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
          setGroups((prev) =>
            prev.map((group) => ({
              ...group,
              items: group.items.map((list) =>
                list.id === inputValue.statefulValue.id
                  ? { ...list, title: inputValue.statefulValue.value }
                  : list
              ),
            }))
          );
        },
      },
    ];

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
          icon: RiDeleteBin2Fill,
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

    return (
      <Card>
        <List
          searchable
          selectable
          openableBehavior="onlyOne"
          onSearchRequested={onChangeValue}
          containerStyle={css`
            padding: 16px;
            min-width: 500px;
          `}
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
                  return (
                    <List.Item
                      key={i}
                      id={list.id}
                      subtitle={list.subtitle}
                      title={list.title}
                      actions={LIST_ITEM_ACTIONS}
                      onClick={() =>
                        setInputValue((prev) => ({
                          ...prev,
                          statefulValue:
                            prev.statefulValue.id === list.id
                              ? prev.statefulValue
                              : {
                                  id: list.id,
                                  value: list.title as string,
                                },
                        }))
                      }
                      rowStyle={css`
                        width: 100%;
                        min-height: 40px;
                      `}
                      titleStyle={css`
                        width: 100%;
                      `}
                      rightSideStyle={css`
                        width: 6%;
                      `}
                      openable
                      groupId={group.id}
                      onSelected={onChangeValue}
                      selectedOptions={{
                        checked: inputValue.checked.some(
                          (check) => check.id === list.id
                        ),
                        value: JSON.stringify({
                          id: list.id,
                          title: list.title,
                          subtitle: list.subtitle,
                        }),
                      }}
                    >
                      <StatefulForm
                        containerStyle={css`
                          padding-left: 33px;
                          padding-right: 33px;
                          padding-bottom: 20px;
                        `}
                        formValues={inputValue.statefulValue}
                        fields={FIELDS}
                        onChange={({ currentState }) =>
                          setInputValue((prev) => ({
                            ...prev,
                            statefulValue: {
                              ...prev.statefulValue,
                              ...currentState,
                            },
                          }))
                        }
                      />
                    </List.Item>
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

export const WithBadge: Story = {
  render: () => {
    const [content, setContent] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

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
          containerStyle={css`
            text-align: center;
            padding-top: 30px;
            padding-bottom: 30px;
          `}
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
          containerStyle={css`
            padding: 16px;
            min-width: 500px;
          `}
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
            leftIcon: RiMailFill,
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            leftIcon: RiNotification3Fill,
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            leftIcon: RiUser3Fill,
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
        rightSideContent: RIGHT_SIDE_CONTENT,
        items: [
          {
            id: "home",
            title: "Home",
            subtitle: "Go to homepage",
            leftIcon: RiHome2Fill,
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

    const [groups, setGroups] = useState<ListGroupContentProps[]>(LIST_GROUPS);
    const [value, setValue] = useState({
      search: "",
      checked: [] as ListItemProps[],
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
      const { name, value: inputValue, checked, type } = e.target;

      if (type === "checkbox") {
        const parsed = JSON.parse(inputValue);
        setValue((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], parsed]
            : prev[name].filter((val: ListItemProps) => val.id !== parsed.id),
        }));
      } else {
        setValue((prev) => ({ ...prev, [name]: inputValue }));
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
          containerStyle={css`
            padding: 16px;
            min-width: 500px;
          `}
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
                    leftIcon={list.leftIcon}
                    subtitle={list.subtitle}
                    rightSideContent={list.rightSideContent}
                    onSelected={onChangeValue}
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
                    selectedOptions={{
                      checked: value.checked.some(
                        (check) => check.id === list.id
                      ),
                      value: JSON.stringify({
                        id: list.id,
                        title: list.title,
                        subtitle: list.subtitle,
                      }),
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
