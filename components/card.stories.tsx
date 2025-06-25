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
    titleClassName: {
      control: "text",
      description: "Additional custom title classes",
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
            className="min-w-[235px]"
            onClick={() => {
              console.log("test");
            }}
            caption="Toolbar Default Mode"
            icon={RiSpam2Line}
            iconColor="red"
            subMenuList={TIP_MENU_ITEMS}
          />
          <Toolbar.Menu
            className="min-w-[235px]"
            caption="Toolbar Primary Mode"
            icon={RiSpam2Line}
            iconColor="white"
            variant="primary"
            subMenuList={TIP_MENU_ITEMS}
          />
          <Toolbar.Menu
            className="min-w-[235px]"
            caption="Toolbar Danger Mode"
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
    titleClassName: "font-semibold text-sm",
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
  args: {
    shadow: "sm",
    padding: "sm",
    title: "Import dishes",
    containerClassName: "px-0",
    titleClassName: "font-semibold text-sm",
    closable: true,
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
      <Card
        {...args}
        leftSideActions={[
          <div className="flex flex-row items-center gap-2">
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) {
                  setValue((prev) => ({ ...prev, checked: filteredContent }));
                } else {
                  setValue((prev) => ({ ...prev, checked: [] }));
                }
              }}
              checked={value.checked.length === filteredContent.length}
              indeterminate={
                value.checked.length > 0 &&
                value.checked.length < filteredContent.length
              }
            />
            <span>Select all ({filteredContent.length})</span>
          </div>,
        ]}
        rightSideActions={[
          <Button>Cancel</Button>,
          <Button variant="primary">Import</Button>,
        ]}
      >
        <div className="px-6 py-6 min-w-[500px]">
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
