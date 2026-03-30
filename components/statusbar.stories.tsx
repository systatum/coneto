import { Meta, StoryObj } from "@storybook/react/*";
import { Statusbar } from "./statusbar";
import { CapsuleTab, CapsuleTabContentProps } from "./capsule-tab";
import { Textbox } from "./textbox";
import { ChangeEvent, useState } from "react";
import {
  RiAlignItemLeftLine,
  RiAlignLeft,
  RiFocus3Line,
  RiFullscreenLine,
  RiPagesLine,
  RiUserFollowLine,
  RiWindow2Fill,
} from "@remixicon/react";

const meta: Meta<typeof Statusbar> = {
  title: "Stage/Statusbar",
  component: Statusbar,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**Statusbar** is a flexible bottom bar component to display actions, icons, buttons, or status information.  
It supports left and right sections, customizable styling, spacing, transparency, and dynamic content.

---

### ✨ Features
- 🔹 **Left & Right sections** – Display items independently on both sides
- 🖼 **Icons & Text** – Supports icons, labels, or custom render functions
- 🔘 **Buttons** – Integrates seamlessly with Button components
- 🎨 **Custom styles** – Configure styles for container, items, left/right wrappers
- 🟢 **Active & Hover states** – Custom background colors for active and hover states
- ⚖ **Flexible sizing** – Adjustable font/icon sizes
- 🌐 **Transparent mode** – Optionally render a transparent statusbar
- 🛠 **Spacers** – Add responsive spacing with \`Statusbar.Spacer\`

---

### 🛠 Usage

\`\`\`tsx
<Statusbar
  size={12}
  activeBackgroundColor="#e0e0e0"
  hoverBackgroundColor="#f5f5f5"
  transparent={false}
  content={{
    left: [
      { text: "Home", icon: { name: "home" } },
      { button: { children: "Save", onClick: () => alert("Saved!") } },
    ],
    right: [
      { text: "Profile", icon: { name: "user" } },
      { render: <CustomComponent /> },
    ],
  }}
  styles={{
    self: css\`padding: 4px 12px;\`,
    itemStyle: css\`color: #333;\`,
    leftWrapperStyle: css\`gap: 8px;\`,
    rightWrapperStyle: css\`gap: 8px;\`,
  }}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    content: {
      description:
        "Content object for the statusbar. Use \`left\` and \`right\` arrays of StatusbarItemProps to configure items.",
      control: false,
    },
    styles: {
      description:
        "Custom styles applied to the statusbar container, items, and wrappers.",
      control: false,
    },
    activeBackgroundColor: {
      description:
        "Background color applied when items are active or selected.",
      control: "color",
    },
    hoverBackgroundColor: {
      description: "Background color applied when items are hovered.",
      control: "color",
    },
    transparent: {
      description:
        "If true, the statusbar will render transparent without a background.",
      control: "boolean",
    },
    size: {
      description: "Font size (and default icon size) of items in pixels.",
      control: "number",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Statusbar>;

export const Default: Story = {
  render: () => {
    const [pressedItems, setPressedItems] = useState<Set<string>>(new Set());

    const PRESSED_KEYS = {
      FOCUS: "focus",
      PAGES: "pages",
      WINDOW: "window",
      ALIGN_ITEM_LEFT: "align-item-left",
      ALIGN_LEFT: "align-left",
    } as const;

    const isPressed = (key: string) => pressedItems.has(key);

    const togglePressed = (key: string) => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
    };

    const setPressed = (key: string, value: boolean) => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        value ? next.add(key) : next.delete(key);
        return next;
      });
    };

    const focusIcon = isPressed(PRESSED_KEYS.FOCUS)
      ? RiFullscreenLine
      : RiFocus3Line;

    return (
      <Statusbar
        content={{
          left: [
            {
              button: {
                children: "Page 1 of 53",
                showSubMenuOn: "self",
                subMenu: ({ show }) =>
                  show(<Textbox value={"@systatum/coneto 🚀"} readOnly />),
              },
            },
            {
              text: "17455 words",
            },
            {
              text: "English (United States)",
            },
            {
              icon: {
                image: RiUserFollowLine,
              },
              text: "Accessibility: Good to go",
            },
          ],
          right: [
            {
              button: {
                showSubMenuOn: "self",
                icon: {
                  image: focusIcon,
                },
                subMenu: ({ list }) =>
                  list([
                    {
                      caption: "Full window",
                      icon: { image: RiFullscreenLine },
                      onClick: () => setPressed(PRESSED_KEYS.FOCUS, true),
                    },
                    {
                      caption: "Zen mode",
                      icon: { image: RiFocus3Line },
                      onClick: () => setPressed(PRESSED_KEYS.FOCUS, false),
                    },
                  ]),
                children: "Focus",
              },
            },
            {
              button: {
                pressed: isPressed(PRESSED_KEYS.PAGES),
                onClick: () => togglePressed(PRESSED_KEYS.PAGES),
                icon: { image: RiPagesLine },
              },
            },
            {
              button: {
                pressed: isPressed(PRESSED_KEYS.WINDOW),
                onClick: () => togglePressed(PRESSED_KEYS.WINDOW),
                icon: { image: RiWindow2Fill },
              },
            },
            {
              button: {
                pressed: isPressed(PRESSED_KEYS.ALIGN_ITEM_LEFT),
                onClick: () => togglePressed(PRESSED_KEYS.ALIGN_ITEM_LEFT),
                icon: { image: RiAlignItemLeftLine },
              },
            },
            {
              button: {
                pressed: isPressed(PRESSED_KEYS.ALIGN_LEFT),
                onClick: () => togglePressed(PRESSED_KEYS.ALIGN_LEFT),
                icon: { image: RiAlignLeft },
              },
            },
          ],
        }}
      />
    );
  },
};

export const ContainerizedClassicTheme: Story = {
  render: () => {
    const [pressedItems, setPressedItems] = useState<Set<string>>(new Set());

    const WriteTabContent = () => {
      const [value, setValue] = useState({
        write: "",
      });

      const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      };

      return (
        <div
          style={{
            padding: "0.8rem",
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            minHeight: "150px",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Write</h3>

          <p>
            Share your thoughts or notes here. This content will be used in the
            next step for review, so feel free to write anything meaningful.
          </p>

          <Textbox
            name="write"
            value={value.write}
            onChange={onChangeValue}
            placeholder="Start typing your content..."
          />
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div
          style={{
            padding: "0.8rem",
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            minHeight: "150px",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Review</h3>

          <p>
            Review the content you have written before submitting. Make sure
            everything looks correct and complete.
          </p>

          <p>
            If you need to make any adjustments or refine your content, you can
            always return to the Write tab to review and update it as needed.
            Take your time to ensure everything is accurate, clear, and meets
            your expectations.
          </p>
        </div>
      );
    };

    const TABS_ITEMS: CapsuleTabContentProps[] = [
      {
        id: "1",
        title: "Write",
        content: <WriteTabContent key={"write-tab"} />,
      },
      {
        id: "2",
        title: "Review",
        content: <ReviewTabContent key={"review-tab"} />,
      },
    ];

    const PRESSED_KEYS = {
      FOCUS: "focus",
      PAGES: "pages",
      WINDOW: "window",
      ALIGN_ITEM_LEFT: "align-item-left",
      ALIGN_LEFT: "align-left",
    } as const;

    const isPressed = (key: string) => pressedItems.has(key);

    const togglePressed = (key: string) => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
    };

    const setPressed = (key: string, value: boolean) => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        value ? next.add(key) : next.delete(key);
        return next;
      });
    };

    const focusIcon = isPressed(PRESSED_KEYS.FOCUS)
      ? RiFullscreenLine
      : RiFocus3Line;

    return (
      <CapsuleTab tabs={TABS_ITEMS} activeTab={"2"}>
        <Statusbar
          content={{
            left: [
              {
                button: {
                  children: "Page 1 of 53",
                  showSubMenuOn: "self",
                  subMenu: ({ show }) =>
                    show(<Textbox value={"@systatum/coneto 🚀"} readOnly />),
                },
              },
              {
                text: "17455 words",
              },
              {
                text: "English (United States)",
              },
              {
                icon: {
                  image: RiUserFollowLine,
                },
                text: "Accessibility: Good to go",
              },
            ],
            right: [
              {
                button: {
                  showSubMenuOn: "self",
                  icon: {
                    image: focusIcon,
                  },
                  subMenu: ({ list }) =>
                    list([
                      {
                        caption: "Full window",
                        icon: { image: RiFullscreenLine },
                        onClick: () => setPressed(PRESSED_KEYS.FOCUS, true),
                      },
                      {
                        caption: "Zen mode",
                        icon: { image: RiFocus3Line },
                        onClick: () => setPressed(PRESSED_KEYS.FOCUS, false),
                      },
                    ]),
                  children: "Focus",
                },
              },
              {
                button: {
                  pressed: isPressed(PRESSED_KEYS.PAGES),
                  onClick: () => togglePressed(PRESSED_KEYS.PAGES),
                  icon: { image: RiPagesLine },
                },
              },
              {
                button: {
                  pressed: isPressed(PRESSED_KEYS.WINDOW),
                  onClick: () => togglePressed(PRESSED_KEYS.WINDOW),
                  icon: { image: RiWindow2Fill },
                },
              },
              {
                button: {
                  pressed: isPressed(PRESSED_KEYS.ALIGN_ITEM_LEFT),
                  onClick: () => togglePressed(PRESSED_KEYS.ALIGN_ITEM_LEFT),
                  icon: { image: RiAlignItemLeftLine },
                },
              },
              {
                button: {
                  pressed: isPressed(PRESSED_KEYS.ALIGN_LEFT),
                  onClick: () => togglePressed(PRESSED_KEYS.ALIGN_LEFT),
                  icon: { image: RiAlignLeft },
                },
              },
            ],
          }}
        />
        <Statusbar.Spacer />
      </CapsuleTab>
    );
  },
};

export const ContainerizedModernTheme: Story = {
  render: () => {
    const [pressedItems, setPressedItems] = useState<Set<string>>(new Set());

    const WriteTabContent = () => {
      const [value, setValue] = useState({
        write: "",
      });

      const onChangeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValue((prev) => ({ ...prev, [name]: value }));
      };

      return (
        <div
          style={{
            padding: "0.8rem",
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            minHeight: "150px",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Write</h3>

          <p>
            Share your thoughts or notes here. This content will be used in the
            next step for review, so feel free to write anything meaningful.
          </p>

          <Textbox
            name="write"
            value={value.write}
            onChange={onChangeValue}
            placeholder="Start typing your content..."
          />
        </div>
      );
    };

    const ReviewTabContent = () => {
      return (
        <div
          style={{
            padding: "0.8rem",
            fontSize: "0.875rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            minHeight: "150px",
          }}
        >
          <h3 style={{ fontWeight: 500 }}>Review</h3>

          <p>
            Review the content you have written before submitting. Make sure
            everything looks correct and complete.
          </p>

          <p>
            If you need to make any adjustments or refine your content, you can
            always return to the Write tab to review and update it as needed.
            Take your time to ensure everything is accurate, clear, and meets
            your expectations.
          </p>
        </div>
      );
    };

    const TABS_ITEMS: CapsuleTabContentProps[] = [
      {
        id: "1",
        title: "Write",
        content: <WriteTabContent key={"write-tab"} />,
      },
      {
        id: "2",
        title: "Review",
        content: <ReviewTabContent key={"review-tab"} />,
      },
    ];

    const PRESSED_KEYS = {
      FOCUS: "focus",
      PAGES: "pages",
      WINDOW: "window",
      ALIGN_ITEM_LEFT: "align-item-left",
      ALIGN_LEFT: "align-left",
    } as const;

    const isPressed = (key: string) => pressedItems.has(key);

    const togglePressed = (key: string) => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      });
    };

    const setPressed = (key: string, value: boolean) => {
      setPressedItems((prev) => {
        const next = new Set(prev);
        value ? next.add(key) : next.delete(key);
        return next;
      });
    };

    const focusIcon = isPressed(PRESSED_KEYS.FOCUS)
      ? RiFullscreenLine
      : RiFocus3Line;

    return (
      <CapsuleTab tabs={TABS_ITEMS} activeTab={"2"}>
        <Statusbar
          transparent
          content={{
            left: [
              {
                button: {
                  children: "Page 1 of 53",
                  showSubMenuOn: "self",
                  subMenu: ({ show }) =>
                    show(<Textbox value={"@systatum/coneto 🚀"} readOnly />),
                },
              },
              {
                text: "17455 words",
              },
              {
                text: "English (United States)",
              },
              {
                icon: {
                  image: RiUserFollowLine,
                },
                text: "Accessibility: Good to go",
              },
            ],
            right: [
              {
                button: {
                  showSubMenuOn: "self",
                  icon: {
                    image: focusIcon,
                  },
                  subMenu: ({ list }) =>
                    list([
                      {
                        caption: "Full window",
                        icon: { image: RiFullscreenLine },
                        onClick: () => setPressed(PRESSED_KEYS.FOCUS, true),
                      },
                      {
                        caption: "Zen mode",
                        icon: { image: RiFocus3Line },
                        onClick: () => setPressed(PRESSED_KEYS.FOCUS, false),
                      },
                    ]),
                  children: "Focus",
                },
              },
              {
                button: {
                  pressed: isPressed(PRESSED_KEYS.PAGES),
                  onClick: () => togglePressed(PRESSED_KEYS.PAGES),
                  icon: { image: RiPagesLine },
                },
              },
              {
                button: {
                  pressed: isPressed(PRESSED_KEYS.WINDOW),
                  onClick: () => togglePressed(PRESSED_KEYS.WINDOW),
                  icon: { image: RiWindow2Fill },
                },
              },
              {
                button: {
                  pressed: isPressed(PRESSED_KEYS.ALIGN_ITEM_LEFT),
                  onClick: () => togglePressed(PRESSED_KEYS.ALIGN_ITEM_LEFT),
                  icon: { image: RiAlignItemLeftLine },
                },
              },
              {
                button: {
                  pressed: isPressed(PRESSED_KEYS.ALIGN_LEFT),
                  onClick: () => togglePressed(PRESSED_KEYS.ALIGN_LEFT),
                  icon: { image: RiAlignLeft },
                },
              },
            ],
          }}
        />
        <Statusbar.Spacer />
      </CapsuleTab>
    );
  },
};
