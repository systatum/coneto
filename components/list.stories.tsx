import { Meta, StoryObj } from "@storybook/react";
import { List, ListItemProps } from "./list";
import {
  RiHome2Fill,
  RiUser3Fill,
  RiSettings3Fill,
  RiMailFill,
  RiNotification3Fill,
  RiCalendar2Fill,
} from "@remixicon/react";
import { Card } from "./card";
import { ChangeEvent, useMemo, useState } from "react";
import { expect, userEvent, within } from "@storybook/test";

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
        id: 1,
        title: "Home",
        subtitle: "Go to homepage",
        iconUrl: RiHome2Fill,
      },
      {
        id: 2,
        title: "Profile",
        subtitle: "View your profile",
        iconUrl: RiUser3Fill,
      },
      {
        id: 3,
        title: "Settings",
        subtitle: "Adjust preferences",
        iconUrl: RiSettings3Fill,
      },
      {
        id: 4,
        title: "Messages",
        subtitle: "Check your inbox",
        iconUrl: RiMailFill,
      },
      {
        id: 5,
        title: "Notifications",
        subtitle: "View Alerts",
        iconUrl: RiNotification3Fill,
      },
    ];

    return (
      <Card>
        <List className="px-4 py-4 gap-2">
          {LIST_ITEMS.map((item, index) => (
            <List.Item
              key={index}
              id={index}
              iconUrl={item.iconUrl}
              subtitle={item.subtitle}
              title={item.title}
            />
          ))}
        </List>
      </Card>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Home")).toBeInTheDocument();
    expect(canvas.getByText("View your profile")).toBeInTheDocument();
  },
};

export const WithSearch: Story = {
  render: () => {
    const LIST_ITEMS: ListItemProps[] = [
      {
        id: 1,
        title: "Home",
        subtitle: "Go to homepage",
        iconUrl: RiHome2Fill,
      },
      {
        id: 2,
        title: "Profile",
        subtitle: "View your profile",
        iconUrl: RiUser3Fill,
      },
      {
        id: 3,
        title: "Settings",
        subtitle: "Adjust preferences",
        iconUrl: RiSettings3Fill,
      },
      {
        id: 4,
        title: "Messages",
        subtitle: "Check your inbox",
        iconUrl: RiMailFill,
      },
      {
        id: 5,
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
          className="px-4 py-4"
        >
          {filteredContent.map((item, index) => (
            <List.Item
              className="px-1"
              key={index}
              id={index}
              iconUrl={item.iconUrl}
              subtitle={item.subtitle}
              title={item.title}
            />
          ))}
        </List>
      </Card>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await userEvent.type(input, "settings");

    expect(canvas.getByText("Adjust preferences")).toBeInTheDocument();
  },
};

export const WithGroup: Story = {
  render: () => {
    const LIST_GROUPS: {
      id: string;
      title: string;
      items: ListItemProps[];
    }[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        items: [
          {
            id: 1,
            title: "Messages",
            subtitle: "Check your inbox",
            iconUrl: RiMailFill,
          },
          {
            id: 2,
            title: "Notifications",
            subtitle: "View Alerts",
            iconUrl: RiNotification3Fill,
          },
          {
            id: 3,
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
            id: 1,
            title: "Home",
            subtitle: "Go to homepage",
            iconUrl: RiHome2Fill,
          },
          {
            id: 2,
            title: "Profile",
            subtitle: "View your profile",
            iconUrl: RiUser3Fill,
          },
          {
            id: 3,
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
          className="px-3 py-4"
        >
          {filteredContent.map((group, index) => (
            <List.Group
              contentClassName="gap-2"
              key={index}
              id={group.id}
              title={group.title}
            >
              {group.items.map((list, i) => (
                <List.Item
                  key={i}
                  className="px-1"
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Recent Content")).toBeInTheDocument();
    expect(canvas.getByText("Messages")).toBeInTheDocument();
    expect(canvas.getByText("All Content")).toBeInTheDocument();
  },
};

export const Draggable: Story = {
  render: () => {
    const LIST_GROUPS: {
      id: string;
      title: string;
      items: ListItemProps[];
    }[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        items: [
          {
            id: 1,
            title: "Messages",
            subtitle: "Check your inbox",
            iconUrl: RiMailFill,
          },
          {
            id: 2,
            title: "Notifications",
            subtitle: "View Alerts",
            iconUrl: RiNotification3Fill,
          },
          {
            id: 3,
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
            id: 4,
            title: "Home",
            subtitle: "Go to homepage",
            iconUrl: RiHome2Fill,
          },
          {
            id: 5,
            title: "Profile",
            subtitle: "View your profile",
            iconUrl: RiUser3Fill,
          },
          {
            id: 6,
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
          className="px-3 py-4"
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const draggable = canvas.getAllByRole("button", { name: /draggable/i })[0];

    expect(draggable).toBeVisible();
  },
};

export const WithLoading: Story = {
  render: () => {
    const LIST_GROUPS: {
      id: string;
      title: string;
      items: ListItemProps[];
    }[] = [
      {
        id: "recent-content",
        title: "Recent Content",
        items: [
          {
            id: 1,
            title: "Messages",
            subtitle: "Check your inbox",
            iconUrl: RiMailFill,
          },
          {
            id: 2,
            title: "Notifications",
            subtitle: "View Alerts",
            iconUrl: RiNotification3Fill,
          },
          {
            id: 3,
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
            id: 4,
            title: "Home",
            subtitle: "Go to homepage",
            iconUrl: RiHome2Fill,
          },
          {
            id: 5,
            title: "Profile",
            subtitle: "View your profile",
            iconUrl: RiUser3Fill,
          },
          {
            id: 6,
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
          className="px-3 py-4"
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = await canvas.findByRole("list");
    const spinner = within(list).getByTestId("circle");
    expect(spinner).toBeInTheDocument();
  },
};

export const CusomOpener: Story = {
  render: () => {
    const LIST_GROUPS = [
      {
        id: "recent-content",
        title: "Recent Content",
        subtitle: "Your latest activity",
        items: [
          {
            id: 1,
            title: "Messages",
            subtitle: "Check your inbox",
            iconUrl: RiMailFill,
          },
          {
            id: 2,
            title: "Notifications",
            subtitle: "View Alerts",
            iconUrl: RiNotification3Fill,
          },
          {
            id: 3,
            title: "Calendar",
            subtitle: "Upcoming events",
            iconUrl: RiCalendar2Fill,
          },
        ],
      },
      {
        id: "all-content",
        title: "All Content",
        subtitle: "Browse everything",
        items: [
          {
            id: 4,
            title: "Home",
            subtitle: "Go to homepage",
            iconUrl: RiHome2Fill,
          },
          {
            id: 5,
            title: "Profile",
            subtitle: "View your profile",
            iconUrl: RiUser3Fill,
          },
          {
            id: 6,
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
          className="px-3 py-4 min-w-[300px]"
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group
                key={index}
                id={group.id}
                subtitle={group.subtitle}
                title={group.title}
                openerStyle="togglebox"
              >
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    id={list.id}
                    iconUrl={list.iconUrl}
                    subtitle={list.subtitle}
                    title={list.title}
                    groupId={group.id}
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkboxes = canvas.getAllByRole("checkbox");

    expect(checkboxes.length).toBeGreaterThan(0);

    await userEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
  },
};
