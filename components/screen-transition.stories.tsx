import type { Meta, StoryObj } from "@storybook/react";
import { ScreenTransition, ScreenProps } from "./screen-transition";
import { Title } from "./title";
import { RiArrowLeftSLine } from "@remixicon/react";
import styled, { css } from "styled-components";
import { Button } from "./button";
import { useTheme } from "./../theme";

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

    function PageTitle({
      text,
      gotoPrevScreen = null,
    }: {
      text?: string;
    } & Partial<ScreenProps>) {
      return (
        <Title
          size="md"
          leftSection={
            gotoPrevScreen
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
                          gotoPrevScreen();
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

              ${gotoPrevScreen &&
              css`
                padding-right: 40px;
              `}
              align-items: center;
            `,
          }}
        />
      );
    }

    function PageC() {
      return (
        <ScreenTransition>
          {({ gotoPrevScreen }) => (
            <Wrapper>
              <PageTitle text="Page C" gotoPrevScreen={gotoPrevScreen} />
            </Wrapper>
          )}
        </ScreenTransition>
      );
    }

    function PageB() {
      return (
        <ScreenTransition nextScreen={PageC}>
          {({ gotoPrevScreen, gotoNextScreen }) => (
            <Wrapper>
              <PageTitle text="Page B" gotoPrevScreen={gotoPrevScreen} />
              <Button onClick={gotoNextScreen ?? undefined}>
                Go to Page C
              </Button>
            </Wrapper>
          )}
        </ScreenTransition>
      );
    }

    function PageA() {
      return (
        <ScreenTransition nextScreen={PageB}>
          {({ gotoNextScreen }) => (
            <Wrapper>
              <PageTitle text="Page A" gotoPrevScreen={null} />
              <Button onClick={gotoNextScreen ?? undefined}>
                Go to Page B
              </Button>
            </Wrapper>
          )}
        </ScreenTransition>
      );
    }

    return <PageA />;
  },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
