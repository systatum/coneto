import type { Meta, StoryObj } from "@storybook/react";
import { Button, ButtonProps, ButtonVariants } from "./button";
import {
  RiMovie2Fill,
  RiSpam2Line,
  RiForbid2Line,
  RiShieldLine,
  RiCheckLine,
  RiInboxArchiveLine,
} from "@remixicon/react";
import styled, { css, CSSProp } from "styled-components";
import { Calendar } from "./calendar";

const meta = {
  title: "Controls/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The **Button** component is a flexible, theme-aware button with full support for loading states, icons, and dropdown submenus.

It supports multiple visual variants and sizes, can include loading indicators, and can display nested actions using \`subMenu\` or \`TipMenu\`.

Use this component for all user-interactive button actions — from primary call-to-actions to lightweight menu triggers.
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      description:
        "Defines the visual style of the button. Commonly used to indicate semantic importance.",
      options: [
        "link",
        "default",
        "primary",
        "danger",
        "secondary",
        "ghost",
        "transparent",
        "success",
        "outline-default",
        "outline-success",
        "outline-primary",
        "outline-danger",
      ],
    },
    size: {
      control: "select",
      description:
        "Determines the button’s size and padding. Use `icon` for circular icon buttons.",
      options: ["xs", "sm", "md", "lg", "icon"],
    },
    isLoading: {
      control: "boolean",
      description: "Shows a loading spinner inside the button.",
    },
    children: {
      control: "text",
      description: "Button label or content.",
    },
    showSubMenuOn: {
      control: "radio",
      description:
        "Controls how submenus are triggered. Use `self` to open when clicking the main button, or `caret` for separate toggle area.",
      options: ["self", "caret"],
    },
    safeAreaAriaLabels: {
      control: "object",
      description:
        "Defines a list of aria-label string values (string[]) that are treated as 'safe zones' when detecting outside clicks. Useful for complex dropdowns or overlay components.",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomSizing: Story = {
  args: {
    variant: "default",
  },
  render: (args) => {
    const BUTTONS_ITEMS: ButtonProps[] = [
      { size: "xs", children: "Button Extra Small" },
      { size: "sm", children: "Button Small" },
      { size: "md", children: "Button Medium" },
      { size: "lg", children: "Button Large" },
      { size: "icon", children: <RiMovie2Fill aria-label="Movie" /> },
    ];

    return (
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {BUTTONS_ITEMS.map((item, index) => (
          <Button key={index} {...args} size={item.size}>
            {item.children}
          </Button>
        ))}
      </div>
    );
  },
};

export const AllVariants: Story = {
  args: {
    children: "Button",
  },
  render: (args) => {
    const VARIANTS: ButtonVariants["variant"][] = [
      "link",
      "outline-default",
      "outline-primary",
      "outline-danger",
      "outline-success",
      "default",
      "primary",
      "danger",
      "secondary",
      "ghost",
      "transparent",
      "success",
    ] as const;

    return (
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {VARIANTS.map((variant) => (
          <Button key={variant} {...args} variant={variant}>
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>
    );
  },
};

export const WithLoading: Story = {
  args: {
    variant: "default",
    isLoading: true,
    children: "Button",
    disabled: true,
  },
  render: (args) => {
    return <Button {...args} />;
  },
};

export const WithTipMenu: Story = {
  render: () => {
    const LIST_SUB_MENU: ButtonProps = {
      variant: "default",
      children: "List",
      styles: {
        dropdownStyle: css`
          min-width: 240px;
        `,
      },
      subMenu: ({ list }) =>
        list([
          {
            caption: "Report Phishing",
            icon: RiSpam2Line,
            iconColor: "blue",
            onClick: () => console.log("Phishing reported"),
          },
          {
            caption: "Report Junk",
            icon: RiForbid2Line,
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
            icon: RiCheckLine,
            iconColor: "green",
            onClick: () => console.log("Marked as read"),
          },
          {
            caption: "Move to Spam",
            icon: RiInboxArchiveLine,
            iconColor: "purple",
            onClick: () => console.log("Moved to spam"),
          },
        ]),
    };

    const LIST_SUB_WITH_FILTER: ButtonProps = {
      variant: "default",
      children: "With Filter",
      styles: {
        dropdownStyle: css`
          min-width: 240px;
        `,
      },
      subMenu: ({ list }) =>
        list(
          [
            {
              caption: "Report Phishing",
              icon: RiSpam2Line,
              iconColor: "blue",
              onClick: () => console.log("Phishing reported"),
            },
            {
              caption: "Report Junk",
              icon: RiForbid2Line,
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
              icon: RiCheckLine,
              iconColor: "green",
              onClick: () => console.log("Marked as read"),
            },
            {
              caption: "Move to Spam",
              icon: RiInboxArchiveLine,
              iconColor: "purple",
              onClick: () => console.log("Moved to spam"),
            },
          ],
          { withFilter: true }
        ),
    };
    const MONTH_NAMES = [
      { text: "JAN", value: "1" },
      { text: "FEB", value: "2" },
      { text: "MAR", value: "3" },
      { text: "APR", value: "4" },
      { text: "MAY", value: "5" },
      { text: "JUN", value: "6" },
      { text: "JUL", value: "7" },
      { text: "AUG", value: "8" },
      { text: "SEP", value: "9" },
      { text: "OCT", value: "10" },
      { text: "NOV", value: "11" },
      { text: "DEC", value: "12" },
    ];

    const SHOW_SUB_MENU: ButtonProps = {
      variant: "default",
      children: "Show",
      styles: {
        dropdownStyle: css`
          min-width: 240px;
        `,
      },
      subMenu: ({ show }) => show(<Calendar monthNames={MONTH_NAMES} />),
    };

    const RENDER_SUB_MENU: ButtonProps = {
      variant: "default",
      children: "Render",
      styles: {
        dropdownStyle: css`
          min-width: 240px;
        `,
      },
      subMenu: ({ render }) =>
        render(
          <Button.TipMenuContainer
            style={css`
              padding: 10px;
              display: flex;
              flex-direction: column;
              gap: 4px;
              cursor: default;
            `}
          >
            <MenuContainer>
              <MenuTitle>Information</MenuTitle>
              <MenuDescription>
                This button uses a render function to show custom content inside
                TipMenu.
              </MenuDescription>
            </MenuContainer>
            <Button variant="primary">Got it</Button>
          </Button.TipMenuContainer>
        ),
    };

    return (
      <Container>
        <Section>
          <SectionTitle>Using list() to list sub menu items</SectionTitle>
          <ButtonRow>
            <Button {...LIST_SUB_MENU} showSubMenuOn="caret" />
            <Button {...LIST_SUB_WITH_FILTER} showSubMenuOn="self" />
          </ButtonRow>
        </Section>

        <Section>
          <SectionTitle>
            Using show() to show with built-in container
          </SectionTitle>
          <ButtonRow>
            <Button {...SHOW_SUB_MENU} showSubMenuOn="caret" />
            <Button {...SHOW_SUB_MENU} showSubMenuOn="self" />
          </ButtonRow>
        </Section>

        <Section>
          <SectionTitle>
            Using render() to render a totally custom component
          </SectionTitle>
          <ButtonRow>
            <Button {...RENDER_SUB_MENU} showSubMenuOn="caret" />
            <Button {...RENDER_SUB_MENU} showSubMenuOn="self" />
          </ButtonRow>
        </Section>
      </Container>
    );
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 350px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
`;

const SectionTitle = styled.span``;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const MenuContainer = styled.div<{ $style?: CSSProp }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  user-select: auto;
  max-width: 300px;
  min-width: 300px;
  margin-bottom: 4px;
  ${({ $style }) => $style}
`;

const MenuTitle = styled.div<{ $style?: CSSProp }>`
  font-weight: 600;
  font-size: 15px;
  color: #111827;

  ${({ $style }) => $style}
`;

const MenuDescription = styled.div<{ $style?: CSSProp }>`
  font-size: 13px;
  color: #6b7280;
  ${({ $style }) => $style}
`;
