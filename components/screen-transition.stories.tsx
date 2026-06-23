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
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ScreenTransition>;

export const Default: Story = {
  render: () => {
    const { currentTheme } = useTheme();
    const bodyTheme = currentTheme?.body;

    const [activeScreens, setActiveScreens] = useState([]);

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

    function PageC({ goBack, goToScreen }: ScreenProps) {
      return (
        <Wrapper>
          <PageTitle text="Page C" goBack={goBack} />
          <Button onClick={() => goToScreen("a")}>Go to Page A</Button>
        </Wrapper>
      );
    }

    function PageB({ goBack, goToScreen }: ScreenProps) {
      return (
        <Wrapper>
          <PageTitle text="Page B" goBack={goBack} />
          <Button onClick={() => goToScreen("c")}>Go to Page C</Button>
        </Wrapper>
      );
    }

    function PageA({ goBack, goToScreen }: ScreenProps) {
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
          screens={{
            a: PageA,
            b: PageB,
            c: PageC,
          }}
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

    const [activeScreens, setActiveScreens] = useState(["a", "b", "c"]);

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

    function PageC({ goBack, goToScreen }: ScreenProps) {
      return (
        <Wrapper>
          <PageTitle text="Page C" goBack={goBack} />
          <Button onClick={() => goToScreen("a")}>Go to Page A</Button>
        </Wrapper>
      );
    }

    function PageB({ goBack, goToScreen }: ScreenProps) {
      return (
        <Wrapper>
          <PageTitle text="Page B" goBack={goBack} />
          <Button onClick={() => goToScreen("c")}>Go to Page C</Button>
        </Wrapper>
      );
    }

    function PageA({ goBack, goToScreen }: ScreenProps) {
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
          screens={{
            a: PageA,
            b: PageB,
            c: PageC,
          }}
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
