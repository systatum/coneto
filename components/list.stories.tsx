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
import Card from "./card";
import { ChangeEvent, useMemo, useState } from "react";

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
        icon: RiHome2Fill,
      },
      {
        id: 2,
        title: "Profile",
        subtitle: "View your profile",
        icon: RiUser3Fill,
      },
      {
        id: 3,
        title: "Settings",
        subtitle: "Adjust preferences",
        icon: RiSettings3Fill,
      },
      {
        id: 4,
        title: "Messages",
        subtitle: "Check your inbox",
        icon: RiMailFill,
      },
      {
        id: 5,
        title: "Notifications",
        subtitle: "View alerts",
        icon: RiNotification3Fill,
      },
    ];

    return (
      <Card>
        <List className="px-4 py-4 gap-2">
          {LIST_ITEMS.map((item, index) => (
            <List.Item
              key={index}
              id={index}
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

export const WithSearch: Story = {
  render: () => {
    const LIST_ITEMS: ListItemProps[] = [
      {
        id: 1,
        title: "Home",
        subtitle: "Go to homepage",
        icon: RiHome2Fill,
      },
      {
        id: 2,
        title: "Profile",
        subtitle: "View your profile",
        icon: RiUser3Fill,
      },
      {
        id: 3,
        title: "Settings",
        subtitle: "Adjust preferences",
        icon: RiSettings3Fill,
      },
      {
        id: 4,
        title: "Messages",
        subtitle: "Check your inbox",
        icon: RiMailFill,
      },
      {
        id: 5,
        title: "Notifications",
        subtitle: "View alerts",
        icon: RiNotification3Fill,
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
            icon: RiMailFill,
          },
          {
            id: 2,
            title: "Notifications",
            subtitle: "View alerts",
            icon: RiNotification3Fill,
          },
          {
            id: 3,
            title: "Calendar",
            subtitle: "Upcoming events",
            icon: RiCalendar2Fill,
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
            icon: RiHome2Fill,
          },
          {
            id: 2,
            title: "Profile",
            subtitle: "View your profile",
            icon: RiUser3Fill,
          },
          {
            id: 3,
            title: "Settings",
            subtitle: "Adjust preferences",
            icon: RiSettings3Fill,
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
                  icon={list.icon}
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

export const WithGroupAndDraggable: Story = {
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
            icon: RiMailFill,
          },
          {
            id: 2,
            title: "Notifications",
            subtitle: "View alerts",
            icon: RiNotification3Fill,
          },
          {
            id: 3,
            title: "Calendar",
            subtitle: "Upcoming events",
            icon: RiCalendar2Fill,
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
            icon: RiHome2Fill,
          },
          {
            id: 5,
            title: "Profile",
            subtitle: "View your profile",
            icon: RiUser3Fill,
          },
          {
            id: 6,
            title: "Settings",
            subtitle: "Adjust preferences",
            icon: RiSettings3Fill,
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
            icon: RiMailFill,
          },
          {
            id: 2,
            title: "Notifications",
            subtitle: "View alerts",
            icon: RiNotification3Fill,
          },
          {
            id: 3,
            title: "Calendar",
            subtitle: "Upcoming events",
            icon: RiCalendar2Fill,
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
            icon: RiHome2Fill,
          },
          {
            id: 5,
            title: "Profile",
            subtitle: "View your profile",
            icon: RiUser3Fill,
          },
          {
            id: 6,
            title: "Settings",
            subtitle: "Adjust preferences",
            icon: RiSettings3Fill,
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
