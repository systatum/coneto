import { Meta, StoryObj } from "@storybook/react";
import { Title, TitleSection, TitleSize } from "./title";
import {
  Ri24HoursFill,
  RiArrowLeftLine,
  RiCloseLine,
  RiDeleteBin7Fill,
  RiHeart2Fill,
  RiLogoutBoxRLine,
  RiPriceTag3Line,
  RiSearch2Line,
  RiSettings2Fill,
  RiUserLine,
} from "@remixicon/react";
import styled, { css } from "styled-components";
import { Button } from "./button";
import { Tooltip } from "./tooltip";
import { useMemo } from "react";
import { useTheme } from "./../theme";
import { Searchbox } from "./searchbox";
import { Avatar } from "./avatar";
import { Launchpad } from "./launchpad";

const meta: Meta<typeof Title> = {
  title: "Content/Title",
  component: Title,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Title** is a flexible layout component for displaying structured headings with optional pretitle, subtitle, icon, and action sections.  

It is designed for design systems where a title block may include:
- main text hierarchy
- contextual metadata (pretitle/subtitle)
- icons
- grouped actions (capsule, buttons, context menu, custom render)
- flexible left/center/right section composition

---

### ✨ Features
- 🧱 **Structured layout system** (left / center / right sections)
- 🧩 **Flexible content support**: pretitle, title, subtitle
- 🎯 **Icon support** with automatic sizing per variant
- 🎛️ **Action system** with ContextMenu integration
- 🎨 **Highly customizable styles** via \`styles\` prop
- 📐 **Three size variants**: small (sm), medium (md), large (lg)
- 🧪 **Composable sections**: actions, capsule, or custom render nodes
- ♿ **Accessible structure** with semantic headings and aria labels

---

### 📌 Usage

\`\`\`tsx
<Title
  size="lg"
  pretitle="Dashboard"
  text="Analytics Overview"
  subtitle="Last updated 2 minutes ago"
  icon={{
    image: RiBarChartLine,
    color: "#4f46e5",
  }}
  leftSection={[
    {
      type: "capsule",
      capsule: {
        tabs: [
          {
            id: "new",
            title: "New",
          },
          {
            id: "list",
            title: "List",
          },
        ],
        activeTab: "new",
      },
    },
  ]}
  rightSection={[
    {
      type: "actions",
      actions: [
        {
          label: "Edit",
          icon: { image: RiEditLine },
          onClick: () => console.log("edit"),
        },
      ],
    },
  ]}
  styles={{
    containerStyle: css\`padding: 12px;\`,
    titleStyle: css\`font-weight: 700;\`,
    subtitleStyle: css\`opacity: 0.7;\`,
  }}
/>
\`\`\`

---

### 🧠 Layout Behavior

- **lg (Large)** → stacked layout  
  - Sections rendered above text block
- **sm / md** → inline layout  
  - sections + text arranged horizontally when possible

---

### 🎯 Sections Types

- **actions** → renders contextual menu (ContextMenu)
- **capsule** → renders badge-like UI (Capsule)
- **custom** → renders custom ReactNode

---

### ⚙️ Notes

- Action icons auto-scale based on title size
- Sections support maxShown + overflow collapsing
- Theme-aware (supports light/dark via useTheme)
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Title>;

export const WithACustomAction: Story = {
  render: () => {
    const rightSection: TitleSection[] = [
      {
        type: "actions",
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
    const leftSection: TitleSection[] = [
      {
        type: "actions",
        actions: [
          {
            icon: { image: RiArrowLeftLine, color: "white" },
            onClick: () => {
              console.log("left was clicked");
            },
            caption: "Left",
          },
        ],
      },
    ];

    const rightSection: TitleSection[] = [
      {
        type: "actions",
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
          minWidth: "500px",
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
              titleStyle: css`
                color: white;
              `,
            }}
            leftSection={leftSection}
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

    interface NavbarItem {
      type: "hiring" | "work" | "office" | "integrations";
      title: string;
      image: string;
      link: string;
    }

    const NAVBAR: NavbarItem[] = [
      {
        type: "hiring",
        title: "Job Post",
        image: "https://picsum.photos/seed/jobpost/200",
        link: "/jobpost",
      },
      {
        type: "hiring",
        title: "Candidates",
        image: "https://picsum.photos/seed/candidates/200",
        link: "/candidates",
      },
      {
        type: "hiring",
        title: "Email Templates",
        image: "https://picsum.photos/seed/email-templates/200",
        link: "/email-template",
      },
      {
        type: "work",
        title: "Employees",
        image: "https://picsum.photos/seed/employees/200",
        link: "/employees",
      },
      {
        type: "work",
        title: "Timesheet",
        image: "https://picsum.photos/seed/timesheet/200",
        link: "/timesheet",
      },
      {
        type: "work",
        title: "Payroll",
        image: "https://picsum.photos/seed/payroll/200",
        link: "/payroll",
      },
      {
        type: "work",
        title: "Requests",
        image: "https://picsum.photos/seed/requests/200",
        link: "/requests",
      },
      {
        type: "office",
        title: "Announcements",
        image: "https://picsum.photos/seed/announcements/200",
        link: "/announcements",
      },
      {
        type: "office",
        title: "Assets",
        image: "https://picsum.photos/seed/assets/200",
        link: "/assets",
      },
      {
        type: "office",
        title: "Training Resources",
        image: "https://picsum.photos/seed/training-resources/200",
        link: "/resources",
      },
      {
        type: "integrations",
        title: "Slack",
        image: "https://picsum.photos/seed/slack/200",
        link: "/slack",
      },
      {
        type: "integrations",
        title: "Microsoft Teams",
        image: "https://picsum.photos/seed/microsoft-teams/200",
        link: "/microsoftteams",
      },
    ];

    type NavbarGroup = {
      type: string;
      items: NavbarItem[];
    };

    const navbarGroups = useMemo<NavbarGroup[]>(() => {
      return NAVBAR.reduce((acc: NavbarGroup[], item) => {
        const existingGroup = acc.find((g) => g.type === item.type);
        if (existingGroup) {
          existingGroup.items.push(item);
        } else {
          acc.push({
            type: item.type,
            items: [item],
          });
        }
        return acc;
      }, []);
    }, []);

    return (
      <Title
        size={"lg"}
        leftSection={[
          {
            type: "custom",
            render: (
              <Tooltip
                safeAreaAriaLabels={["launchpad"]}
                styles={{
                  arrowStyle: css`
                    display: none;
                  `,
                  drawerStyle: css`
                    margin-top: 8px;
                    left: -11px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 600px;
                    background-color: ${mode === "dark"
                      ? "rgb(35, 35, 35)"
                      : "white"};

                    @media (max-width: 768px) {
                      width: 400px;
                    }
                  `,
                }}
                dialog={
                  <Launchpad
                    styles={{
                      self: css`
                        border: none;
                      `,
                    }}
                  >
                    {navbarGroups.map((navGroup, index) => {
                      return (
                        <Launchpad.Section
                          gridPreset="2-to-4"
                          key={index}
                          title={
                            navGroup.type.charAt(0).toUpperCase() +
                            navGroup.type.slice(1)
                          }
                          styles={{
                            titleSeparatorStyle: css`
                              background-color: ${mode === "dark"
                                ? "rgb(35, 35, 35)"
                                : "white"};
                            `,
                          }}
                        >
                          {navGroup.items.map((navigation, i) => (
                            <Launchpad.Section.Item
                              key={i}
                              iconUrl={navigation.image}
                              label={navigation.title}
                              href="#"
                              onClick={(e) => e.preventDefault()}
                            />
                          ))}
                        </Launchpad.Section>
                      );
                    })}
                  </Launchpad>
                }
              >
                <img src="/workaty.png" width={36} height={36} />
              </Tooltip>
            ),
          },
        ]}
        centerSection={[
          {
            type: "custom",
            render: <Searchbox />,
          },
        ]}
        rightSection={[
          {
            type: "custom",
            render: (
              <Button
                styles={{
                  self: css`
                    border-radius: 9999px;
                    padding: px;
                    height: 40px;
                    width: 40px;
                  `,
                  dropdownStyle: css`
                    margin-top: 6px;
                    margin-left: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    background-color: ${mode === "dark"
                      ? "rgb(35, 35, 35)"
                      : "white"};
                  `,
                }}
                showSubMenuOn="self"
                subMenu={({ render }) =>
                  render(
                    <>
                      <Header>
                        <BrandTitle>Systatum</BrandTitle>

                        <Row>
                          <Avatar
                            firstName="Adam"
                            lastName="Hakarsa"
                            changeable={true}
                            fontSize={16}
                            frameSize={70}
                          />

                          <UserInfo>
                            <UserBox>
                              <h3>Adam Hakarsa</h3>
                              <span>adam@systatum.com</span>
                            </UserBox>

                            <RoleText>CEO of Systatum</RoleText>

                            <SettingLink>
                              Settings
                              <RiSettings2Fill size={14} />
                            </SettingLink>
                          </UserInfo>
                        </Row>
                      </Header>

                      <Button
                        variant="secondary"
                        icon={{
                          image: RiLogoutBoxRLine,
                          size: 16,
                        }}
                        styles={{
                          containerStyle: css`
                            width: 100%;
                          `,
                          self: css`
                            width: 100%;
                            text-align: start;
                            gap: 12px;
                            height: 40px;
                            align-items: center;
                          `,
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  )
                }
                icon={{
                  image: RiUserLine,
                  size: 20,
                }}
              />
            ),
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

const Header = styled.h2`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BrandTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 14px;
`;

const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 220px;
  border-radius: 4px;
  padding: 0 8px;
  transition: all 0.3s ease;

  h3 {
    font-size: 14px;
    font-weight: 600;
  }

  span {
    font-size: 12px;
  }
`;

const RoleText = styled.span`
  padding: 0 8px;
  font-size: 12px;
  font-weight: 600;
`;

const SettingLink = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 0 8px;
  font-size: 12px;

  cursor: pointer;
  transition: all 0.3s ease;

  text-decoration: none;
  color: inherit;

  &:hover {
    color: #3b82f6;
  }
`;
