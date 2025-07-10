import Card from "./card";
import { Meta, StoryObj } from "@storybook/react";
import {
  RiSpam2Line,
  RiErrorWarningLine,
  RiShieldLine,
  RiCheckDoubleLine,
  RiInboxArchiveLine,
  RiDownload2Line,
  RiLinkM,
  RiSendPlane2Line,
  RiEdit2Line,
} from "@remixicon/react";
import { Toolbar } from "./toolbar";
import Searchbox from "./searchbox";
import { ChangeEvent, useMemo, useState } from "react";
import Checkbox from "./checkbox";
import { Button } from "./button";
import { List, ListItemProps } from "./list";

const meta: Meta<typeof Card> = {
  title: "Content/Card",
  component: Card,
  tags: ["autodocs"],
  argTypes: {
    shadow: {
      control: {
        type: "select",
        options: ["none", "sm", "md", "lg", "xl", "2xl"],
      },
      description: "Shadow size",
      defaultValue: "sm",
    },
    radius: {
      control: {
        type: "select",
        options: ["none", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "full"],
      },
      description: "Border radius",
      defaultValue: "xs",
    },
    padding: {
      control: {
        type: "select",
        options: [
          "none",
          "sm",
          "md",
          "lg",
          "xl",
          "2xl",
          "3xl",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
        ],
      },
      description: "Padding size",
      defaultValue: "sm",
    },
    containerClassName: {
      control: "text",
      description: "Additional custom container classes",
    },
    headerClassName: {
      control: "text",
      description: "Additional custom title classes",
    },
    footerClassName: {
      control: "text",
      description: "Additional custom footer classes",
    },
    title: {
      control: "text",
      description: "Additional for title content",
    },
    children: {
      control: "text",
      description: "Card content",
    },
  },
};

export default meta;

const TIP_MENU_ITEMS = [
  {
    caption: "Report Phishing",
    icon: RiSpam2Line,
    iconColor: "blue",
    onClick: () => console.log("Phishing reported"),
  },
  {
    caption: "Report Junk",
    icon: RiErrorWarningLine,
    iconColor: "red",
    onClick: () => console.log("Junk reported"),
  },
  {
    caption: "Block Sender",
    icon: RiShieldLine,
    iconColor: "orange",
    isDangerous: true,
    onClick: () => console.log("Sender blocked"),
  },
  {
    caption: "Mark as Read",
    icon: RiCheckDoubleLine,
    iconColor: "green",
    onClick: () => console.log("Marked as read"),
  },
  {
    caption: "Move to Spam",
    icon: RiInboxArchiveLine,
    iconColor: "purple",
    onClick: () => console.log("Moved to spam"),
  },
  {
    caption: "Download Attachment",
    icon: RiDownload2Line,
    iconColor: "teal",
    onClick: () => console.log("Downloading"),
  },
  {
    caption: "Copy Link",
    icon: RiLinkM,
    iconColor: "gray",
    onClick: () => console.log("Link copied"),
  },
  {
    caption: "Share",
    icon: RiSendPlane2Line,
    iconColor: "indigo",
    isDangerous: true,
    onClick: () => console.log("Shared"),
  },
  {
    caption: "Edit",
    icon: RiEdit2Line,
    iconColor: "yellow",
    onClick: () => console.log("Edit mode"),
  },
];

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    shadow: "sm",
    padding: "sm",
  },
  render: () => {
    return (
      <Card>
        <Toolbar>
          <Toolbar.Menu
            dropdownClassName="min-w-[235px]"
            onClick={() => {
              console.log("test");
            }}
            caption="Default"
            icon={RiSpam2Line}
            iconColor="red"
            subMenuList={TIP_MENU_ITEMS}
          />
          <Toolbar.Menu
            dropdownClassName="min-w-[235px]"
            caption="Primary"
            icon={RiSpam2Line}
            iconColor="white"
            variant="primary"
            subMenuList={TIP_MENU_ITEMS}
          />
          <Toolbar.Menu
            dropdownClassName="min-w-[235px]"
            caption="Danger"
            icon={RiSpam2Line}
            iconColor="white"
            variant="danger"
            subMenuList={TIP_MENU_ITEMS}
          />
        </Toolbar>
      </Card>
    );
  },
};

export const WithTitle: Story = {
  args: {
    shadow: "sm",
    padding: "sm",
    title: "Import dishes",
    containerClassName: "px-0",
    headerClassName: "font-semibold text-sm",
  },
  render: (args) => {
    interface RestaurantDish {
      name: string;
      image: string;
      price: string;
      theme: string;
    }

    const RESTAURANT_DISHES: RestaurantDish[] = [
      {
        name: "French Toast",
        image: "https://picsum.photos/seed/frenchtoast/200",
        price: "13$",
        theme: "Breakfast",
      },
      {
        name: "Sushi Deluxe",
        image: "https://picsum.photos/seed/sushi/200",
        price: "22$",
        theme: "Japanese",
      },
      {
        name: "Pad Thai",
        image: "https://picsum.photos/seed/padthai/200",
        price: "15$",
        theme: "Thai",
      },
      {
        name: "Tacos Al Pastor",
        image: "https://picsum.photos/seed/tacos/200",
        price: "12$",
        theme: "Mexican",
      },
      {
        name: "Margherita Pizza",
        image: "https://picsum.photos/seed/pizza/200",
        price: "18$",
        theme: "Italian",
      },
      {
        name: "Butter Chicken",
        image: "https://picsum.photos/seed/butterchicken/200",
        price: "16$",
        theme: "Indian",
      },
      {
        name: "Pho Bo",
        image: "https://picsum.photos/seed/phobo/200",
        price: "14$",
        theme: "Vietnamese",
      },
      {
        name: "Croissant & Coffee",
        image: "https://picsum.photos/seed/croissant/200",
        price: "10$",
        theme: "French",
      },
      {
        name: "Cheeseburger",
        image: "https://picsum.photos/seed/cheeseburger/200",
        price: "11$",
        theme: "American",
      },
      {
        name: "Falafel Wrap",
        image: "https://picsum.photos/seed/falafel/200",
        price: "13$",
        theme: "Middle Eastern",
      },
    ];

    const [value, setValue] = useState({
      search: "",
      checked: [] as RestaurantDish[],
    });

    const onChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value: inputValue, checked, type } = e.target;

      if (type === "checkbox") {
        const parsed = JSON.parse(inputValue);
        setValue((prev) => ({
          ...prev,
          [name]: checked
            ? [...prev[name], parsed]
            : prev[name].filter(
                (val: RestaurantDish) => val.name !== parsed.name
              ),
        }));
      } else {
        setValue((prev) => ({ ...prev, [name]: inputValue }));
      }
    };

    const filteredContent = useMemo(() => {
      const searchContent = value.search.toLowerCase().trim();
      return RESTAURANT_DISHES.filter((dish) =>
        dish.name.toLowerCase().includes(searchContent)
      );
    }, [value.search]);

    return (
      <Card {...args}>
        <div className="px-8 py-4 min-w-[500px]">
          <Searchbox
            name="search"
            onChange={onChangeValue}
            value={value.search}
            placeholder="Search..."
          />
          <div className="flex flex-col gap-2 py-4">
            {filteredContent.map((dish, index) => (
              <div key={index} className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-3">
                  <Checkbox
                    onChange={onChangeValue}
                    value={JSON.stringify(dish)}
                    checked={value.checked.some(
                      (item) => item.name === dish.name
                    )}
                    name="checked"
                  />
                  <div className="items-center w-[30px] rounded-sm overflow-hidden">
                    <img src={dish.image} />
                  </div>
                  <h3>{dish.name}</h3>
                </div>
                <span>{dish.price}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  },
};

export const WithTitleAndActions: Story = {
  render: () => {
    const LIST_GROUPS: {
      id: string;
      title: string;
      items: ListItemProps[];
    }[] = [
      {
        id: "breakfast",
        title: "Breakfast",
        items: [
          {
            id: 1,
            title: "French Toast",
            subtitle: "Breakfast",
            imageUrl: "https://picsum.photos/seed/frenchtoast/200",
            rightSideContent: [<span>13$</span>],
          },
          {
            id: 2,
            title: "Croissant & Coffee",
            subtitle: "French",
            imageUrl: "https://picsum.photos/seed/croissant/200",
            rightSideContent: [<span>10$</span>],
          },
          {
            id: 3,
            title: "Sushi Deluxe",
            subtitle: "Japanese",
            imageUrl: "https://picsum.photos/seed/sushi/200",
            rightSideContent: [<span>22$</span>],
          },
          {
            id: 4,
            title: "Pad Thai",
            subtitle: "Thai",
            imageUrl: "https://picsum.photos/seed/padthai/200",
            rightSideContent: [<span>15$</span>],
          },
          {
            id: 5,
            title: "Tacos Al Pastor",
            subtitle: "Mexican",
            imageUrl: "https://picsum.photos/seed/tacos/200",
            rightSideContent: [<span>12$</span>],
          },
        ],
      },
      {
        id: "international-dishes",
        title: "International Dishes",
        items: [
          {
            id: 6,
            title: "Margherita Pizza",
            subtitle: "Italian",
            imageUrl: "https://picsum.photos/seed/pizza/200",
            rightSideContent: [<span>18$</span>],
          },
          {
            id: 7,
            title: "Butter Chicken",
            subtitle: "Indian",
            imageUrl: "https://picsum.photos/seed/butterchicken/200",
            rightSideContent: [<span>16$</span>],
          },
          {
            id: 8,
            title: "Pho Bo",
            subtitle: "Vietnamese",
            imageUrl: "https://picsum.photos/seed/phobo/200",
            rightSideContent: [<span>14$</span>],
          },
          {
            id: 9,
            title: "Cheeseburger",
            subtitle: "American",
            imageUrl: "https://picsum.photos/seed/cheeseburger/200",
            rightSideContent: [<span>11$</span>],
          },
          {
            id: 10,
            title: "Falafel Wrap",
            subtitle: "Middle Eastern",
            imageUrl: "https://picsum.photos/seed/falafel/200",
            rightSideContent: [<span>13$</span>],
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

    const DataItems = filteredContent.flatMap((data) => data.items);

    const ContentCard = {
      leftSideActions: [
        <div className="flex flex-row items-center gap-2">
          <Checkbox
            onChange={(e) => {
              if (e.target.checked) {
                setValue((prev) => ({ ...prev, checked: DataItems }));
              } else {
                setValue((prev) => ({ ...prev, checked: [] }));
              }
            }}
            checked={value.checked.length === DataItems.length}
            indeterminate={
              value.checked.length > 0 &&
              value.checked.length < DataItems.length
            }
          />
          <span>Select all ({value.checked.length})</span>
        </div>,
      ],
      rightSideActions: [
        <Button>Cancel</Button>,
        <Button variant="primary">Import</Button>,
      ],
    };

    return (
      <Card
        title="Systatum Corps Food."
        containerClassName="px-0"
        headerClassName="font-semibold px-3"
        footerClassName="px-5"
        leftSideActions={ContentCard.leftSideActions}
        rightSideActions={ContentCard.rightSideActions}
      >
        <List
          searchable
          selectable
          onDragged={onDragged}
          onSearchRequested={onChangeValue}
          className="px-3 py-4 min-w-[450px]"
        >
          {filteredContent.map((group, index) => {
            return (
              <List.Group key={index} id={group.id} title={group.title}>
                {group.items.map((list, i) => (
                  <List.Item
                    key={i}
                    groupId={group.id}
                    className="min-w-[300px]"
                    id={list.id}
                    subtitle={list.subtitle}
                    title={list.title}
                    imageUrl={list.imageUrl}
                    onClick={() => {
                      const isAlreadyChecked = value.checked.some(
                        (check) => check.id.toString() === list.id.toString()
                      );

                      onChangeValue({
                        target: {
                          name: "checked",
                          value: JSON.stringify({
                            id: list.id,
                            title: list.title,
                            subtitle: list.subtitle,
                          }),
                          type: "checkbox",
                          checked: !isAlreadyChecked,
                        },
                      } as ChangeEvent<HTMLInputElement>);
                    }}
                    rightSideContent={list.rightSideContent}
                    onSelected={onChangeValue}
                    selectedOptions={{
                      checked: value.checked.some(
                        (check) => check.id.toString() === list.id.toString()
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
