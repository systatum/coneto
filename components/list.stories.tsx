import { Meta, StoryObj } from "@storybook/react";
import {
  List,
  ListActionsProps,
  ListGroupContent,
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
} from "@remixicon/react";
import { Card } from "./card";
import { ChangeEvent, useMemo, useState } from "react";
import { css } from "styled-components";
import { StatefulForm } from "./stateful-form";
import { OptionsProps } from "./selectbox";
import z from "zod";

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
        iconUrl: RiHome2Fill,
      },
      {
        id: "profile",
        title: "Profile",
        subtitle: "View your profile",
        iconUrl: RiUser3Fill,
      },
      {
        id: "settings",
        title: "Settings",
        subtitle: "Adjust preferences",
        iconUrl: RiSettings3Fill,
      },
      {
        id: "messages",
        title: "Messages",
        subtitle: "Check your inbox",
        iconUrl: RiMailFill,
      },
      {
        id: "notifications",
        title: "Notifications",
        subtitle: "View Alerts",
        iconUrl: RiNotification3Fill,
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
              iconUrl={item.iconUrl}
              subtitle={item.subtitle}
              title={item.title}
            />
          ))}
        </List>
      </Card>
    );
  },
};

export const WithSearch: Story = {
  render: () => {
    const LIST_ITEMS: ListItemProps[] = [
      {
        id: "home",
        title: "Home",
        subtitle: "Go to homepage",
        iconUrl: RiHome2Fill,
      },
      {
        id: "profile",
        title: "Profile",
        subtitle: "View your profile",
        iconUrl: RiUser3Fill,
      },
      {
        id: "settings",
        title: "Settings",
        subtitle: "Adjust preferences",
        iconUrl: RiSettings3Fill,
      },
      {
        id: "messages",
        title: "Messages",
        subtitle: "Check your inbox",
        iconUrl: RiMailFill,
      },
      {
        id: "notifications",
        title: "Notifications",
        subtitle: "View Alerts",
        iconUrl: RiNotification3Fill,
      },
    ];

    const [value, setValue] = useState({
      search: "",
    });

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();
      return LIST_ITEMS.filter(
        (list) =>
          list.title.toLowerCase().includes(searchContent) ||
          list.subtitle.toLowerCase().includes(searchContent)
      );
    }, [value.search]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue } = e.target;

      setValue((prev) => ({ ...prev, [name]: inputValue }));
    };

    return (
      <Card>
        <List
          searchable
          onSearchRequested={onChangeValue}
          containerStyle={css`
            padding: 16px;
          `}
        >
          {filteredContent.map((item, index) => (
            <List.Item
              containerStyle={css`
                gap: 4px;
              `}
              key={index}
              id={item.id}
              iconUrl={item.iconUrl}
              subtitle={item.subtitle}
              title={item.title}
            />
          ))}
        </List>
      </Card>
    );
  },
};

export const WithGroup: Story = {
  render: () => {
    const LIST_GROUPS: ListGroupContent[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        items: [
          {
            id: "messages",
            title: "Messages",
            subtitle: "Check your inbox",
            iconUrl: RiMailFill,
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            iconUrl: RiNotification3Fill,
          },
          {
            id: "calendar",
            title: "Calendar",
            subtitle: "Upcoming events",
            iconUrl: RiCalendar2Fill,
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
            iconUrl: RiHome2Fill,
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            iconUrl: RiUser3Fill,
          },
          {
            id: "settings",
            title: "Settings",
            subtitle: "Adjust preferences",
            iconUrl: RiSettings3Fill,
          },
        ],
      },
    ];

    const [value, setValue] = useState({
      search: "",
    });

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();

      return LIST_GROUPS.map((group) => {
        const matchedItems = group.items.filter(
          (item) =>
            item.title?.toLowerCase().includes(searchContent) ||
            item.subtitle?.toLowerCase().includes(searchContent)
        );

        const groupMatches = group.title.toLowerCase().includes(searchContent);

        if (groupMatches || matchedItems.length > 0) {
          return {
            ...group,
            items: groupMatches ? group.items : matchedItems,
          };
        }

        return null;
      }).filter(Boolean);
    }, [value.search]);

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue } = e.target;

      setValue((prev) => ({ ...prev, [name]: inputValue }));
    };

    return (
      <Card>
        <List
          searchable
          onSearchRequested={onChangeValue}
          containerStyle={css`
            padding: 16px;
          `}
        >
          {filteredContent.map((group, index) => (
            <List.Group
              contentStyle={css`
                padding-top: 4px;
              `}
              key={index}
              id={group.id}
              title={group.title}
            >
              {group.items.map((list, i) => (
                <List.Item
                  key={i}
                  containerStyle={css`
                    padding-right: 4px;
                    padding-left: 4px;
                  `}
                  id={list.id}
                  iconUrl={list.iconUrl}
                  subtitle={list.subtitle}
                  title={list.title}
                />
              ))}
            </List.Group>
          ))}
        </List>
      </Card>
    );
  },
};

export const Draggable: Story = {
  render: () => {
    const LIST_GROUPS: ListGroupContent[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        items: [
          {
            id: "messages",
            title: "Messages",
            subtitle: "Check your inbox",
            iconUrl: RiMailFill,
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            iconUrl: RiNotification3Fill,
          },
          {
            id: "calendar",
            title: "Calendar",
            subtitle: "Upcoming events",
            iconUrl: RiCalendar2Fill,
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
            iconUrl: RiHome2Fill,
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            iconUrl: RiUser3Fill,
          },
          {
            id: "settings",
            title: "Settings",
            subtitle: "Adjust preferences",
            iconUrl: RiSettings3Fill,
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
          const matchedItems = group.items.filter(
            (item) =>
              item.title?.toLowerCase().includes(searchContent) ||
              item.subtitle?.toLowerCase().includes(searchContent)
          );

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
          `}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group key={index} id={group.id} title={group.title}>
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    iconUrl={list.iconUrl}
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
    const LIST_GROUPS: ListGroupContent[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        items: [
          {
            id: "messages",
            title: "Messages",
            subtitle: "Check your inbox",
            iconUrl: RiMailFill,
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            iconUrl: RiNotification3Fill,
          },
          {
            id: "calendar",
            title: "Calendar",
            subtitle: "Upcoming events",
            iconUrl: RiCalendar2Fill,
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
            iconUrl: RiHome2Fill,
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            iconUrl: RiUser3Fill,
          },
          {
            id: "settings",
            title: "Settings",
            subtitle: "Adjust preferences",
            iconUrl: RiSettings3Fill,
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
          const matchedItems = group.items.filter(
            (item) =>
              item.title?.toLowerCase().includes(searchContent) ||
              item.subtitle?.toLowerCase().includes(searchContent)
          );

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
          `}
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group key={index} id={group.id} title={group.title}>
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    iconUrl={list.iconUrl}
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

export const WithCheckbox: Story = {
  render: () => {
    const [formValues, setFormValues] = useState({
      field_name: "",
      type: ["1"],
    });

    const FIELD_NAME_OPTIONS: OptionsProps[] = [
      { text: "code", value: "1" },
      { text: "function", value: "2" },
      { text: "variable", value: "3" },
      { text: "loop", value: "4" },
      { text: "array", value: "5" },
    ];

    const LIST_GROUPS: ListGroupContent[] = [
      {
        id: "form-fields",
        title: "Form Fields",
        items: [
          { id: "name", title: "Name" },
          { id: "code", title: "Code" },
          {
            id: "lead",
            title: "Lead",
            openable: true,
          },
        ],
      },
    ];

    const [groups] = useState(LIST_GROUPS);
    const [value, setValue] = useState({
      search: "",
      checked: [] as ListItemProps[],
    });

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();

      return groups
        .map((group) => {
          const matchedItems = group.items.filter(
            (item) =>
              item.title?.toLowerCase().includes(searchContent) ||
              item.subtitle?.toLowerCase().includes(searchContent)
          );

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
    }, [value.search, groups, formValues]);

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
              >
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    openable={list.openable}
                    id={list.id}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    onSelected={onChangeValue}
                    selectedOptions={{
                      checked:
                        value.checked.some((check) => check.id === list.id) ||
                        [
                          { id: "name", title: "Name" },
                          { id: "code", title: "Code" },
                        ].some((check) => check.id === list.id),
                      value: JSON.stringify({
                        id: list.id,
                        title: list.title,
                        subtitle: list.subtitle,
                      }),
                    }}
                  >
                    {list.children}
                    {list.id === "lead" && (
                      <StatefulForm
                        containerStyle={css`
                          padding-left: 8px;
                          padding-right: 8px;
                          padding-bottom: 8px;
                        `}
                        formValues={formValues}
                        onChange={({ currentState }) => {
                          setFormValues((prev) => ({
                            ...prev,
                            ...currentState,
                          }));
                        }}
                        mode="onChange"
                        validationSchema={z.object({
                          field_name: z
                            .string()
                            .min(
                              3,
                              "First name must be at least 3 characters long"
                            ),
                          type: z
                            .array(z.string().min(1, "Choose one"))
                            .min(1, "Combo must have at least one item")
                            .optional(),
                        })}
                        fields={[
                          {
                            name: "field_name",
                            title: "Field Name",
                            type: "text",
                            required: false,
                            placeholder: "Enter the field name",
                          },
                          {
                            name: "type",
                            title: "Type",
                            type: "combo",
                            required: false,
                            placeholder: "Select the type data",
                            comboboxProps: {
                              options: FIELD_NAME_OPTIONS,
                              selectboxStyle: css`
                                border: 1px solid #d1d5db;
                                &:focus {
                                  border-color: #61a9f9;
                                  box-shadow: 0 0 0 1px #61a9f9;
                                }
                              `,
                            },
                          },
                        ]}
                      />
                    )}
                  </List.Item>
                ))}
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
          console.log(`action was added ${id}`);
        },
      },
    ];

    const LIST_GROUPS: ListGroupContent[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        subtitle: "Your latest activity",
        items: [
          {
            id: "messages",
            title: "Messages",
            subtitle: "Check your inbox",
            iconUrl: RiMailFill,
          },
          {
            id: "notifications",
            title: "Notifications",
            subtitle: "View Alerts",
            iconUrl: RiNotification3Fill,
          },
          {
            id: "profile",
            title: "Profile",
            subtitle: "View your profile",
            iconUrl: RiUser3Fill,
          },
          {
            id: "calendar",
            title: "Calendar",
            subtitle: "Upcoming events",
            iconUrl: RiCalendar2Fill,
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
            iconUrl: RiHome2Fill,
            rightSideContent: RIGHT_SIDE_CONTENT,
          },

          {
            id: "settings",
            title: "Settings",
            subtitle: "Adjust preferences",
            iconUrl: RiSettings3Fill,
            rightSideContent: RIGHT_SIDE_CONTENT,
          },
        ],
      },
    ];

    const [groups, setGroups] = useState(LIST_GROUPS);
    const [value, setValue] = useState({
      search: "",
      checked: [] as ListItemProps[],
    });

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();

      return groups
        .map((group) => {
          const matchedItems = group.items.filter(
            (item) =>
              item.title?.toLowerCase().includes(searchContent) ||
              item.subtitle?.toLowerCase().includes(searchContent)
          );

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
                    iconUrl={list.iconUrl}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
                    rightSideContent={list.rightSideContent}
                    onSelected={onChangeValue}
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
