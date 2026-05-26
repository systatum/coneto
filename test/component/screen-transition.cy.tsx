import { useTheme } from "./../../theme";
import {
  ScreenProps,
  ScreenTransition,
} from "./../../components/screen-transition";
import styled, { css } from "styled-components";
import { RiArrowLeftSLine } from "@remixicon/react";
import { Title } from "./../../components/title";
import { Button } from "./../../components/button";

describe("Screen Transition", () => {
  //   with function children
  function ProductTransition() {
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
            <Wrapper aria-label="wrapper">
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
            <Wrapper aria-label="wrapper">
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
            <Wrapper aria-label="wrapper">
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
  }

  //   with separate children
  function ProductWithSeparateChildren() {
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

    function PageCScreen({ gotoPrevScreen }: Partial<ScreenProps>) {
      return (
        <Wrapper aria-label="wrapper">
          <PageTitle text="Page C" gotoPrevScreen={gotoPrevScreen} />
        </Wrapper>
      );
    }

    function PageC() {
      return (
        <ScreenTransition>
          <PageCScreen />
        </ScreenTransition>
      );
    }

    function PageBScreen({
      gotoPrevScreen,
      gotoNextScreen,
    }: Partial<ScreenProps>) {
      return (
        <Wrapper aria-label="wrapper">
          <PageTitle text="Page B" gotoPrevScreen={gotoPrevScreen} />

          <Button onClick={gotoNextScreen ?? undefined}>Go to Page C</Button>
        </Wrapper>
      );
    }

    function PageB() {
      return (
        <ScreenTransition nextScreen={PageC}>
          <PageBScreen />
        </ScreenTransition>
      );
    }

    function PageAScreen({ gotoNextScreen }: Partial<ScreenProps>) {
      return (
        <Wrapper aria-label="wrapper">
          <PageTitle text="Page A" gotoPrevScreen={null} />

          <Button onClick={gotoNextScreen ?? undefined}>Go to Page B</Button>
        </Wrapper>
      );
    }

    function PageA() {
      return (
        <ScreenTransition nextScreen={PageB}>
          <PageAScreen />
        </ScreenTransition>
      );
    }

    return <PageA />;
  }

  context("when clicking next button", () => {
    it("should move to the page B", () => {
      cy.mount(<ProductTransition />);
      cy.findByLabelText("title-title").should("not.have.text", "Page B");
      cy.findAllByLabelText("wrapper")
        .eq(0)
        .then(() => {
          cy.findByText("Go to Page B").should("be.visible").click();
        });

      cy.wait(700);
      cy.findAllByLabelText("title-title").eq(1).should("have.text", "Page B");
      cy.findAllByLabelText("wrapper")
        .eq(1)
        .then(() => {
          cy.findByText("Go to Page C").should("be.visible");
        });
    });

    context("when clicking next button", () => {
      it("should move to the page C", () => {
        cy.mount(<ProductTransition />);
        cy.findByLabelText("title-title").should("not.have.text", "Page B");
        cy.findAllByLabelText("wrapper")
          .eq(0)
          .then(() => {
            cy.findByText("Go to Page B").should("be.visible").click();
          });

        cy.wait(700);
        cy.findAllByLabelText("title-title")
          .eq(1)
          .should("have.text", "Page B");
        cy.findAllByLabelText("wrapper")
          .eq(1)
          .then(() => {
            cy.findByText("Go to Page C").should("be.visible").click();
          });

        cy.wait(700);
        cy.findAllByLabelText("title-title")
          .eq(2)
          .should("have.text", "Page C");
        cy.findAllByLabelText("wrapper").eq(2).should("exist");
      });
    });

    context("when clicking chevron icon", () => {
      it("should move to the page A", () => {
        cy.mount(<ProductTransition />);
        cy.findByLabelText("title-title").should("not.have.text", "Page B");
        cy.findAllByLabelText("wrapper")
          .eq(0)
          .then(() => {
            cy.findByText("Go to Page B").should("be.visible").click();
          });

        cy.wait(700);
        cy.findAllByLabelText("title-title")
          .eq(1)
          .should("have.text", "Page B");
        cy.findAllByLabelText("wrapper")
          .eq(1)
          .then(() => {
            cy.findByLabelText("action-button").click();
          });

        cy.wait(700);
        cy.findAllByLabelText("wrapper").eq(1).should("not.exist");
        cy.findAllByLabelText("title-title").eq(1).should("not.exist");
      });
    });
  });

  context("children", () => {
    context("when using function", () => {
      it("still can use next and previous function", () => {
        cy.mount(<ProductTransition />);
        cy.findByLabelText("title-title").should("not.have.text", "Page B");
        cy.findAllByLabelText("wrapper")
          .eq(0)
          .then(() => {
            cy.findByText("Go to Page B").should("be.visible").click();
          });

        cy.wait(700);
        cy.findAllByLabelText("title-title")
          .eq(1)
          .should("have.text", "Page B");
        cy.findAllByLabelText("wrapper")
          .eq(1)
          .then(() => {
            cy.findByText("Go to Page C").should("be.visible");
          });
      });
    });

    context("when using separate children", () => {
      it("still can use next and previous function", () => {
        cy.mount(<ProductWithSeparateChildren />);
        cy.findByLabelText("title-title").should("not.have.text", "Page B");
        cy.findAllByLabelText("wrapper")
          .eq(0)
          .then(() => {
            cy.findByText("Go to Page B").should("be.visible").click();
          });

        cy.wait(700);
        cy.findAllByLabelText("title-title")
          .eq(1)
          .should("have.text", "Page B");
        cy.findAllByLabelText("wrapper")
          .eq(1)
          .then(() => {
            cy.findByText("Go to Page C").should("be.visible");
          });
      });
    });
  });
});

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;
