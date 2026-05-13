import { Meta, StoryObj } from "@storybook/react";
import { Title, TitleSection, TitleSize } from "./title";
import {
  Ri24HoursFill,
  RiCloseLine,
  RiDeleteBin7Fill,
  RiHeart2Fill,
  RiPriceTag3Line,
  RiSearch2Line,
} from "@remixicon/react";
import styled, { css } from "styled-components";
import { Button } from "./button";
import { Tooltip } from "./tooltip";
import { useState } from "react";
import { useTheme } from "./../theme";

const meta: Meta<typeof Title> = {
  title: "Content/Title",
  component: Title,
  parameters: {
    layout: "centered",
    docs: {},
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Title>;

export const WithACustomAction: Story = {
  render: () => {
    const rightSection: TitleSection[] = [
      {
        styles: {
          toggleActionStyle: css`
            padding: 2px;
            width: 20px;
            height: 20px;
          `,
        },
        actions: [
          {
            icon: { image: RiCloseLine },
            onClick: () => {
              console.log("close was clicked");
            },
          },
        ],
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          minWidth: "350px",
        }}
      >
        {Object.values(TitleSize).map((size, index) => (
          <Title
            key={index}
            size={size}
            text="Default Modal"
            icon={{
              image: Ri24HoursFill,
            }}
            rightSection={rightSection}
          />
        ))}
      </div>
    );
  },
};

export const WithDescription: Story = {
  render: () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
        }}
      >
        {Object.values(TitleSize).map((size, index) => (
          <Title
            key={index}
            size={size}
            text="Yolo v8"
            pretitle="Compile"
            subtitle="Model: 2024-12-05"
          />
        ))}
      </div>
    );
  },
};

export const WithActions: Story = {
  render: () => {
    const rightSection: TitleSection[] = [
      {
        actions: [
          {
            icon: { image: RiHeart2Fill, color: "white" },
            onClick: () => {
              console.log("heart was clicked");
            },
            caption: "Heart",
          },
          {
            icon: { image: RiSearch2Line, color: "white" },
            onClick: () => {
              console.log("search was clicked");
            },
            caption: "Search",
          },
          {
            icon: { image: RiPriceTag3Line, color: "white" },
            onClick: () => {
              console.log("price tag was clicked");
            },
            caption: "Price Tag",
          },
          {
            icon: { image: RiDeleteBin7Fill, color: "white" },
            onClick: () => {
              console.log("delete bin was clicked");
            },
            caption: "Delete Bin",
          },
        ],
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          width: "100%",
          minWidth: "450px",
        }}
      >
        {Object.values(TitleSize).map((size, index) => (
          <Title
            key={index}
            size={size}
            text="Coneto - React UI"
            styles={{
              containerStyle: css`
                padding: 10px;
                background-color: #6200ee;
                align-items: center;
              `,
              textStyle: css`
                color: white;
              `,
            }}
            rightSection={rightSection}
          />
        ))}
      </div>
    );
  },
};

export const Navbar: Story = {
  parameters: {
    layout: "fullscreen",
  },
  render: () => {
    const { mode } = useTheme();

    interface ActiveItem {
      title?: string;
      timestamp?: number;
    }
    const [activeItem, setActiveItem] = useState<ActiveItem>({
      title: "",
      timestamp: 0,
    });

    interface NavbarItemMenu {
      title: string;
      onClick: () => void;
    }

    interface NavbarItem {
      title: string;
      items: NavbarItemMenu[];
    }

    const NAVBAR_ITEMS: NavbarItem[] = [
      {
        title: "Usage",
        items: [
          {
            title: "Hiring Candidates",
            onClick: () => {
              console.log("Hiring Candidates was clicked");
            },
          },
          {
            title: "Recording",
            onClick: () => {
              console.log("Recording was clicked");
            },
          },
          {
            title: "Knowledge",
            onClick: () => {
              console.log("Knowledge was clicked");
            },
          },
        ],
      },
      {
        title: "Learn",
        items: [
          {
            title: "Help Center",
            onClick: () => {
              console.log("Help Center was clicked");
            },
          },
          {
            title: "Customer Stories",
            onClick: () => {
              console.log("Customer Stories was clicked");
            },
          },
          {
            title: "About Us",
            onClick: () => {
              console.log("About Us was clicked");
            },
          },
        ],
      },
    ];

    const TooltipMenu = ({
      menu,
      activeItem,
      setActiveItem,
      mode,
    }: {
      menu: NavbarItem;
      activeItem: ActiveItem;
      setActiveItem: (activeItem: ActiveItem) => void;
      mode: "light" | "dark";
    }) => (
      <Tooltip
        key={`${activeItem.title}-${activeItem.timestamp}`}
        dialog={
          <>
            {menu.items.map((item) => (
              <NavItems
                $mode={mode}
                key={item.title}
                $active={activeItem.title === item.title}
                onClick={() => {
                  item.onClick();
                  setActiveItem({ title: item.title, timestamp: Date.now() });
                }}
              >
                <FirstCharacter
                  $mode={mode}
                  $active={activeItem.title === item.title}
                >
                  {item.title.charAt(0)}
                </FirstCharacter>
                {item.title}
              </NavItems>
            ))}
          </>
        }
        dialogPlacement="bottom-left"
        styles={{
          arrowStyle: css`
            display: none;
          `,
          drawerStyle: css`
            top: 14px;
            border-radius: 2px;
            padding: 0px;
            background-color: ${mode === "dark" ? "rgb(35, 35, 35)" : "white"};
          `,
          triggerStyle: css`
            font-size: 14px;
          `,
        }}
      >
        {menu.title}
      </Tooltip>
    );

    return (
      <Title
        size={"lg"}
        leftSection={[
          {
            type: "custom",
            render: <img src="/workaty.png" width={36} height={36} />,
          },
          ...NAVBAR_ITEMS.map((menu) => ({
            type: "custom" as const,
            render: (
              <TooltipMenu
                mode={mode}
                key={menu.title}
                menu={menu}
                activeItem={activeItem}
                setActiveItem={setActiveItem}
              />
            ),
          })),
        ]}
        rightSection={[
          {
            type: "custom",
            render: <Button>Go to Dashboard</Button>,
          },
        ]}
        styles={{
          containerStyle: css`
            padding: 10px 16px;

            background-color: ${mode === "dark" ? "rgb(35, 35, 35)" : "white"};
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          `,
          leftSectionStyle: css`
            display: flex;
            align-items: center;
            gap: 20px;
          `,
        }}
      />
    );
  },
};

const FirstCharacter = styled.div<{
  $mode: "light" | "dark";
  $active: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  align-items: center;
  height: 42px;
  width: 42px;
  border-radius: 9999px;
  border: 1px solid
    ${({ $mode, $active }) =>
      $active
        ? $mode === "dark"
          ? "#8b5cf6"
          : "#61a9f9"
        : $mode === "dark"
          ? "#2b2b31"
          : "#e7e7e7"};

  background: ${({ $mode, $active }) =>
    $active
      ? $mode === "dark"
        ? "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
        : "linear-gradient(135deg, #61a9f9 0%, #61a9f9 100%)"
      : $mode === "dark"
        ? "#18181b"
        : "#fafafa"};

  color: ${({ $active, $mode }) =>
    $active ? "white" : $mode === "dark" ? "#d4d4d8" : "#27272a"};
`;

const NavItems = styled.div<{
  $mode: "light" | "dark";
  $active: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  font-size: 14px;
  padding: 16px;
  min-width: 300px;

  color: ${({ $mode }) => ($mode === "dark" ? "#f4f4f5" : "#18181b")};

  transition: all 0.2s ease;

  background-color: ${({ $mode, $active }) =>
    $active
      ? $mode === "dark"
        ? "rgba(139, 92, 246, 0.14)"
        : "#dae9fa"
      : "transparent"};

  border: 1px solid
    ${({ $mode, $active }) =>
      $active
        ? $mode === "dark"
          ? "rgba(139, 92, 246, 0.3)"
          : "#92c4fc"
        : "transparent"};

  &:hover {
    background-color: ${({ $mode }) =>
      $mode === "dark" ? "rgba(139, 92, 246, 0.14)" : "#dbeafe"};

    box-shadow: ${({ $mode }) =>
      $mode === "dark"
        ? "0 10px 24px rgba(0,0,0,0.35)"
        : "0 10px 24px rgba(124, 58, 237, 0.08)"};

    ${FirstCharacter} {
      border-color: ${({ $mode }) =>
        $mode === "dark" ? "#8b5cf6" : "#61a9f9"};
    }
  }
`;
