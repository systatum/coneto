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
};

export default meta;

type Story = StoryObj<typeof Statusbar>;

export const Default: Story = {
  render: () => {
    const [pressedItems, setPressedItems] = useState<Set<string>>(new Set());

    return (
      <Statusbar
        paddingTop="10px"
        content={{
          left: [
            {
              button: {
                children: "Page 1 of 53",
                showSubMenuOn: "self",
                subMenu: ({ show }) => show(<Textbox value={"Coneto 🚀"} />),
              },
            },
            {
              width: "60px",
              text: "17455 words",
            },
            {
              width: "100px",
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
                  image: pressedItems.has("focus")
                    ? RiFullscreenLine
                    : RiFocus3Line,
                },
                subMenu: ({ list }) =>
                  list([
                    {
                      caption: "Full window",
                      icon: {
                        image: RiFullscreenLine,
                      },
                      onClick: () => {
                        setPressedItems((prev) => {
                          const next = new Set(prev);
                          next.add("focus");
                          return next;
                        });
                      },
                    },
                    {
                      caption: "Zen mode",
                      icon: {
                        image: RiFocus3Line,
                      },
                      onClick: () => {
                        setPressedItems((prev) => {
                          const next = new Set(prev);
                          next.delete("focus");
                          return next;
                        });
                      },
                    },
                  ]),
                children: "Focus",
              },
            },
            {
              button: {
                pressed: pressedItems.has("pages"),
                onClick: () =>
                  setPressedItems((prev) => {
                    const next = new Set(prev);
                    if (next.has("pages")) {
                      next.delete("pages");
                    } else {
                      next.add("pages");
                    }
                    return next;
                  }),
                icon: { image: RiPagesLine },
              },
            },
            {
              button: {
                pressed: pressedItems.has("window"),
                onClick: () =>
                  setPressedItems((prev) => {
                    const next = new Set(prev);
                    if (next.has("window")) {
                      next.delete("window");
                    } else {
                      next.add("window");
                    }
                    return next;
                  }),
                icon: { image: RiWindow2Fill },
                hoverBackgroundColor: "red",
              },
            },
            {
              button: {
                pressed: pressedItems.has("align-item-left"),
                onClick: () =>
                  setPressedItems((prev) => {
                    const next = new Set(prev);
                    if (next.has("align-item-left")) {
                      next.delete("align-item-left");
                    } else {
                      next.add("align-item-left");
                    }
                    return next;
                  }),
                icon: { image: RiAlignItemLeftLine },
              },
            },
            {
              button: {
                pressed: pressedItems.has("align-left"),
                onClick: () =>
                  setPressedItems((prev) => {
                    const next = new Set(prev);
                    if (next.has("align-left")) {
                      next.delete("align-left");
                    } else {
                      next.add("align-left");
                    }
                    return next;
                  }),
                icon: { image: RiAlignLeft },
              },
            },
          ],
        }}
      />
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

    return (
      <CapsuleTab tabs={TABS_ITEMS} activeTab={"2"}>
        <Statusbar
          paddingTop="10px"
          content={{
            left: [
              {
                button: {
                  children: "Page 1 of 53",
                  showSubMenuOn: "self",
                  subMenu: ({ show }) => show(<Textbox value={"Coneto 🚀"} />),
                },
              },
              {
                width: "60px",
                text: "17455 words",
              },
              {
                width: "100px",
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
                    image: pressedItems.has("focus")
                      ? RiFullscreenLine
                      : RiFocus3Line,
                  },
                  subMenu: ({ list }) =>
                    list([
                      {
                        caption: "Full window",
                        icon: {
                          image: RiFullscreenLine,
                        },
                        onClick: () => {
                          setPressedItems((prev) => {
                            const next = new Set(prev);
                            next.add("focus");
                            return next;
                          });
                        },
                      },
                      {
                        caption: "Zen mode",
                        icon: {
                          image: RiFocus3Line,
                        },
                        onClick: () => {
                          setPressedItems((prev) => {
                            const next = new Set(prev);
                            next.delete("focus");
                            return next;
                          });
                        },
                      },
                    ]),
                  children: "Focus",
                },
              },
              {
                button: {
                  pressed: pressedItems.has("pages"),
                  onClick: () =>
                    setPressedItems((prev) => {
                      const next = new Set(prev);
                      if (next.has("pages")) {
                        next.delete("pages");
                      } else {
                        next.add("pages");
                      }
                      return next;
                    }),
                  icon: { image: RiPagesLine },
                },
              },
              {
                button: {
                  pressed: pressedItems.has("window"),
                  onClick: () =>
                    setPressedItems((prev) => {
                      const next = new Set(prev);
                      if (next.has("window")) {
                        next.delete("window");
                      } else {
                        next.add("window");
                      }
                      return next;
                    }),
                  icon: { image: RiWindow2Fill },
                  hoverBackgroundColor: "red",
                },
              },
              {
                button: {
                  pressed: pressedItems.has("align-item-left"),
                  onClick: () =>
                    setPressedItems((prev) => {
                      const next = new Set(prev);
                      if (next.has("align-item-left")) {
                        next.delete("align-item-left");
                      } else {
                        next.add("align-item-left");
                      }
                      return next;
                    }),
                  icon: { image: RiAlignItemLeftLine },
                },
              },
              {
                button: {
                  pressed: pressedItems.has("align-left"),
                  onClick: () =>
                    setPressedItems((prev) => {
                      const next = new Set(prev);
                      if (next.has("align-left")) {
                        next.delete("align-left");
                      } else {
                        next.add("align-left");
                      }
                      return next;
                    }),
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

    return (
      <CapsuleTab tabs={TABS_ITEMS} activeTab={"2"}>
        <Statusbar
          transparent
          paddingTop="10px"
          content={{
            left: [
              {
                button: {
                  children: "Page 1 of 53",
                  showSubMenuOn: "self",
                  subMenu: ({ show }) => show(<Textbox value={"Coneto 🚀"} />),
                },
              },
              {
                width: "60px",
                text: "17455 words",
              },
              {
                width: "100px",
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
                    image: pressedItems.has("focus")
                      ? RiFullscreenLine
                      : RiFocus3Line,
                  },
                  subMenu: ({ list }) =>
                    list([
                      {
                        caption: "Full window",
                        icon: {
                          image: RiFullscreenLine,
                        },
                        onClick: () => {
                          setPressedItems((prev) => {
                            const next = new Set(prev);
                            next.add("focus");
                            return next;
                          });
                        },
                      },
                      {
                        caption: "Zen mode",
                        icon: {
                          image: RiFocus3Line,
                        },
                        onClick: () => {
                          setPressedItems((prev) => {
                            const next = new Set(prev);
                            next.delete("focus");
                            return next;
                          });
                        },
                      },
                    ]),
                  children: "Focus",
                },
              },
              {
                button: {
                  pressed: pressedItems.has("pages"),
                  onClick: () =>
                    setPressedItems((prev) => {
                      const next = new Set(prev);
                      if (next.has("pages")) {
                        next.delete("pages");
                      } else {
                        next.add("pages");
                      }
                      return next;
                    }),
                  icon: { image: RiPagesLine },
                },
              },
              {
                button: {
                  pressed: pressedItems.has("window"),
                  onClick: () =>
                    setPressedItems((prev) => {
                      const next = new Set(prev);
                      if (next.has("window")) {
                        next.delete("window");
                      } else {
                        next.add("window");
                      }
                      return next;
                    }),
                  icon: { image: RiWindow2Fill },
                  hoverBackgroundColor: "red",
                },
              },
              {
                button: {
                  pressed: pressedItems.has("align-item-left"),
                  onClick: () =>
                    setPressedItems((prev) => {
                      const next = new Set(prev);
                      if (next.has("align-item-left")) {
                        next.delete("align-item-left");
                      } else {
                        next.add("align-item-left");
                      }
                      return next;
                    }),
                  icon: { image: RiAlignItemLeftLine },
                },
              },
              {
                button: {
                  pressed: pressedItems.has("align-left"),
                  onClick: () =>
                    setPressedItems((prev) => {
                      const next = new Set(prev);
                      if (next.has("align-left")) {
                        next.delete("align-left");
                      } else {
                        next.add("align-left");
                      }
                      return next;
                    }),
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
