import type { Meta, StoryObj } from "@storybook/react";
import { ScreenTransition, ScreenProps } from "./screen-transition";
import { Title } from "./title";
import { RiArrowLeftSLine } from "@remixicon/react";
import styled, { css } from "styled-components";
import { Button } from "./button";
import { useTheme } from "./../theme";
import { useState } from "react";

const meta: Meta<typeof ScreenTransition> = {
  title: "Mobile/ScreenTransition",
  component: ScreenTransition,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `The **ScreenTransition** component manages a stack of full-screen views using nested dialogs, providing a simple navigation API similar to a mobile application's screen navigation.

Each screen automatically receives \`goToScreen\` and \`goBack\` callbacks, allowing screens to navigate without directly managing the navigation stack.

---

### ✨ Features

- 📱 Mobile-style stacked screen navigation
- 🗂️ Declarative screen registry
- ➕ Push new screens onto the navigation stack
- ⬅️ Built-in back navigation
- 🎬 Smooth open and close dialog animations
- 🔄 Restores previously mounted screens without replaying opening animations
- 🧩 Fully controlled navigation state
- 🛡️ Warns when navigating to unregistered screens

---

### 🧱 Component Structure

\`\`\`tsx
const [activeScreens, setActiveScreens] = useState(["home"]);

<ScreenTransition
  screens={{
    home: HomeScreen,
    profile: ProfileScreen,
    settings: SettingsScreen,
  }}
  activeScreens={activeScreens}
  onScreenChange={setActiveScreens}
/>
\`\`\`

---

### ⚙️ Core Behaviors

#### Screen Registry

Every screen that can be displayed must be registered through the \`screens\` prop.

Each key acts as the unique identifier used during navigation.

\`\`\`tsx
const screens = {
  home: HomeScreen,
  profile: ProfileScreen,
  settings: SettingsScreen,
};
\`\`\`

---

#### Controlled Navigation

\`ScreenTransition\` is a controlled component.

The parent owns the navigation stack through \`activeScreens\`.

Whenever a screen is pushed or removed, \`onScreenChange\` is called with the updated stack.

\`\`\`tsx
const [activeScreens, setActiveScreens] = useState(["home"]);

<ScreenTransition
  screens={screens}
  activeScreens={activeScreens}
  onScreenChange={setActiveScreens}
/>
\`\`\`

---

#### Navigate Forward

Each screen receives a \`goToScreen\` callback.

Calling it pushes another screen onto the navigation stack.

\`\`\`tsx
function HomeScreen({ goToScreen }: ScreenProps<"home" | "profile">) {
  return (
    <Button onClick={() => goToScreen?.("profile")}>
      Open Profile
    </Button>
  );
}
\`\`\`

Navigation flow:

\`\`\`text
["home"]

↓

["home", "profile"]
\`\`\`

---

#### Navigate Back

Each screen also receives a \`goBack\` callback.

Calling it closes the current dialog with its closing animation before removing it from the navigation stack.

\`\`\`tsx
function ProfileScreen({ goBack }: ScreenProps) {
  return (
    <Button onClick={goBack}>
      Back
    </Button>
  );
}
\`\`\`

Navigation flow:

\`\`\`text
["home", "profile"]

↓

["home"]
\`\`\`

---

#### Nested Screen Stack

Every additional screen is rendered inside its own \`PaperDialog\`, creating a stacked hierarchy similar to native mobile applications.

\`\`\`text
Home
 └── Profile
      └── Settings
           └── Notification
\`\`\`

Each dialog maintains its own animation while remaining synchronized with the navigation stack.

---

---

#### Sheet Presentation

By default, every screen is presented as a full-screen \`PaperDialog\`. Alternatively, a screen can be configured to appear as a sheet by providing a configuration object instead of a component.

\`\`\`tsx
const screens = {
  home: HomeScreen,
  profile: ProfileScreen,
  filter: {
    component: FilterScreen,
    sheet: true,
  },
};
\`\`\`

The \`sheet\` option controls how the screen is presented.

\`\`\`ts
type ScreenConfig = {
  component: ComponentType<Partial<ScreenProps>>;
  sheet?: boolean | PaperDialogResizable;
};
\`\`\`

Setting \`sheet: true\` displays the screen using the default sheet appearance.

\`\`\`tsx
const screens = {
  filter: {
    component: FilterScreen,
    sheet: true,
  },
};
\`\`\`

A custom sheet configuration can also be provided by passing \`PaperDialogResizable\`.

\`\`\`tsx
const screens = {
  filter: {
    component: FilterScreen,
    sheet: {
      minHeight: "50dvh",
      maxHeight: "90dvh",
    },
  },
};
\`\`\`

This allows \`ScreenTransition\` to present a mixture of full-screen pages and sheets while using the same navigation API.

#### Initial Screen Restoration

If a screen already exists inside the initial \`activeScreens\` array, it opens immediately without replaying its opening animation.

This is useful when:

- Restoring navigation state
- Preserving the current screen after a refresh
- Keeping nested dialogs open after rerendering

Example:

\`\`\`tsx
const activeScreens = [
  "home",
  "profile",
  "settings",
];
\`\`\`

All three screens appear immediately in their restored state.

---

#### Animation Lifecycle

Opening a new screen:

1. The screen is added to \`activeScreens\`.
2. A new \`PaperDialog\` is mounted.
3. The dialog performs its opening animation.

Closing a screen:

1. \`goBack()\` triggers the dialog minimize animation.
2. The dialog closes.
3. The screen is removed from \`activeScreens\`.
4. Previously mounted screens remain unchanged.

This provides smooth forward and backward transitions similar to native mobile navigation.

---

#### Unregistered Screens

Attempting to navigate to an unknown screen does not crash the application.

Instead, a warning is logged to help identify incorrect screen keys.

\`\`\`text
ScreenTransition: screen "profile" is not registered
\`\`\`

---

### 🎯 Usage Guidelines

- Use for mobile-style navigation within a single page.
- Keep the navigation stack in parent state.
- Register every available screen inside the \`screens\` prop.
- Navigate using \`goToScreen\` instead of mutating \`activeScreens\` directly.
- Use \`goBack\` so closing animations always play correctly.
- Restore navigation state by initializing \`activeScreens\` with multiple screen keys.
- Keep individual screen components focused on UI and navigation only, leaving state management to the parent component.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScreenTransition>;

export const Default: Story = {
  render: () => {
    const { currentTheme } = useTheme();
    const bodyTheme = currentTheme?.body;

    const screens = {
      a: PageA,
      b: PageB,
      c: PageC,
    };

    type ScreenKey = keyof typeof screens;

    const [activeScreens, setActiveScreens] = useState<ScreenKey[]>([]);

    function PageTitle({
      text,
      goBack = null,
    }: {
      text?: string;
    } & Partial<ScreenProps>) {
      return (
        <Title
          size="md"
          leftSection={
            goBack
              ? [
                  {
                    styles: {
                      toggleActionStyle: css`
                        padding: 4px;
                        height: 30px;
                        width: 30px;
                        border-radius: 4px;
                      `,
                    },
                    type: "actions",
                    actions: [
                      {
                        caption: "back",
                        icon: { image: RiArrowLeftSLine },
                        onClick: () => {
                          goBack();
                        },
                      },
                    ],
                  },
                ]
              : []
          }
          text={text}
          styles={{
            containerStyle: css`
              border-bottom: 1px solid ${bodyTheme?.borderColor || "#ececec"};
              height: 53px;
              justify-content: center;
              align-items: center;
              padding: 0 6px;
            `,
            textContainerStyle: css`
              align-items: center;
            `,
            titleStyle: css`
              justify-content: center;
              font-size: 20px;

              ${goBack &&
              css`
                padding-right: 40px;
              `}
              align-items: center;
            `,
          }}
        />
      );
    }

    function PageC({ goBack, goToScreen }: ScreenProps<ScreenKey>) {
      return (
        <Wrapper>
          <PageTitle text="Page C" goBack={goBack} />
          <Button onClick={() => goToScreen("a")}>Go to Page A</Button>
        </Wrapper>
      );
    }

    function PageB({ goBack, goToScreen }: ScreenProps<ScreenKey>) {
      return (
        <Wrapper>
          <PageTitle text="Page B" goBack={goBack} />
          <Button onClick={() => goToScreen("c")}>Go to Page C</Button>
        </Wrapper>
      );
    }

    function PageA({ goBack, goToScreen }: ScreenProps<ScreenKey>) {
      return (
        <Wrapper>
          <PageTitle text="Page A" goBack={goBack} />
          <Button onClick={() => goToScreen("b")}>Go to Page B</Button>
        </Wrapper>
      );
    }

    return (
      <>
        {/* Imagine this generated in index.tsx */}
        <Wrapper>
          <PageTitle text="Index Screen" />
          <Button onClick={() => setActiveScreens(["a"])}>Go to Page A</Button>
        </Wrapper>

        {/* Imagine this generated in app.tsx */}
        <ScreenTransition
          screens={screens}
          activeScreens={activeScreens}
          onScreenChange={(screens) => setActiveScreens(screens)}
        />
      </>
    );
  },
};

export const WithInitializeScreens: Story = {
  render: () => {
    const { currentTheme } = useTheme();
    const bodyTheme = currentTheme?.body;

    const screens = {
      a: PageA,
      b: PageB,
      c: PageC,
    };

    type ScreenKey = keyof typeof screens;

    const [activeScreens, setActiveScreens] = useState<ScreenKey[]>([
      "a",
      "b",
      "c",
    ]);

    function PageTitle({
      text,
      goBack = null,
    }: {
      text?: string;
    } & Partial<ScreenProps>) {
      return (
        <Title
          size="md"
          leftSection={
            goBack
              ? [
                  {
                    styles: {
                      toggleActionStyle: css`
                        padding: 4px;
                        height: 30px;
                        width: 30px;
                        border-radius: 4px;
                      `,
                    },
                    type: "actions",
                    actions: [
                      {
                        caption: "back",
                        icon: { image: RiArrowLeftSLine },
                        onClick: () => {
                          goBack();
                        },
                      },
                    ],
                  },
                ]
              : []
          }
          text={text}
          styles={{
            containerStyle: css`
              border-bottom: 1px solid ${bodyTheme?.borderColor || "#ececec"};
              height: 53px;
              justify-content: center;
              align-items: center;
              padding: 0 6px;
            `,
            textContainerStyle: css`
              align-items: center;
            `,
            titleStyle: css`
              justify-content: center;
              font-size: 20px;

              ${goBack &&
              css`
                padding-right: 40px;
              `}
              align-items: center;
            `,
          }}
        />
      );
    }

    function PageC({ goBack, goToScreen }: ScreenProps<ScreenKey>) {
      return (
        <Wrapper>
          <PageTitle text="Page C" goBack={goBack} />
          <Button onClick={() => goToScreen("a")}>Go to Page A</Button>
        </Wrapper>
      );
    }

    function PageB({ goBack, goToScreen }: ScreenProps<ScreenKey>) {
      return (
        <Wrapper>
          <PageTitle text="Page B" goBack={goBack} />
          <Button onClick={() => goToScreen("c")}>Go to Page C</Button>
        </Wrapper>
      );
    }

    function PageA({ goBack, goToScreen }: ScreenProps<ScreenKey>) {
      return (
        <Wrapper>
          <PageTitle text="Page A" goBack={goBack} />
          <Button onClick={() => goToScreen("b")}>Go to Page B</Button>
        </Wrapper>
      );
    }

    return (
      <>
        {/* Imagine this generated in index.tsx */}
        <Wrapper>
          <PageTitle text="Index Screen" />
          <Button onClick={() => setActiveScreens(["a"])}>Go to Page A</Button>
        </Wrapper>

        {/* Imagine this generated in app.tsx */}
        <ScreenTransition
          screens={screens}
          activeScreens={activeScreens}
          onScreenChange={(screens) => setActiveScreens(screens)}
        />
      </>
    );
  },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
