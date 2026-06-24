import { useTheme } from "./../../theme";
import {
  ScreenProps,
  ScreenTransition,
} from "./../../components/screen-transition";
import styled, { css } from "styled-components";
import { RiArrowLeftSLine } from "@remixicon/react";
import { Title } from "./../../components/title";
import { Button } from "./../../components/button";
import { useState } from "react";

describe("Screen Transition", () => {
  function ProductTransition({
    initializeScreen = [],
    onScreenChange,
  }: {
    initializeScreen?: ("a" | "b" | "c")[];
    onScreenChange?: (screens: ("a" | "b" | "c")[]) => void;
  }) {
    const { currentTheme } = useTheme();
    const screens = {
      a: PageA,
      b: PageB,
      c: PageC,
    };

    type ScreenKey = keyof typeof screens;
    const bodyTheme = currentTheme?.body;

    const [activeScreens, setActiveScreens] =
      useState<ScreenKey[]>(initializeScreen);

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
          onScreenChange={(screens) => {
            setActiveScreens(screens);
            onScreenChange?.(screens as ("a" | "b" | "c")[]);
          }}
        />
      </>
    );
  }

  context("screens", () => {
    context("when clicking next button", () => {
      it("should move to the page A", () => {
        cy.mount(<ProductTransition />);
        cy.findByLabelText("title-title").should("have.text", "Index Screen");

        cy.findByText("Go to Page A").should("be.visible").click();

        cy.wait(700);
        cy.findAllByLabelText("title-title")
          .eq(1)
          .should("have.text", "Page A");
      });

      context("when clicking next button", () => {
        it("should move to the page C", () => {
          cy.mount(<ProductTransition />);
          cy.findByLabelText("title-title").should("have.text", "Index Screen");

          cy.findByText("Go to Page A").should("be.visible").click();
          cy.wait(700);

          cy.findAllByLabelText("title-title")
            .eq(1)
            .should("have.text", "Page A");

          cy.findByText("Go to Page B").should("be.visible").click();
          cy.wait(700);

          cy.findAllByLabelText("title-title")
            .eq(2)
            .should("have.text", "Page B");
        });
      });

      context("when clicking chevron icon", () => {
        it("should move to the initial screen", () => {
          cy.mount(<ProductTransition />);
          cy.findByLabelText("title-title").should("have.text", "Index Screen");

          cy.findByText("Go to Page A").should("be.visible").click();

          cy.wait(700);
          cy.findAllByLabelText("title-title")
            .eq(1)
            .should("have.text", "Page A");

          cy.findAllByLabelText("action-button").eq(0).click();
        });
      });
    });
  });

  context("activeScreens", () => {
    context("when initialize 3 screen", () => {
      it("should render 3 screen", () => {
        cy.mount(<ProductTransition initializeScreen={["b", "c", "a"]} />);
        cy.findAllByLabelText("paper-dialog-wrapper").should("have.length", 3);
      });

      context("when move to back", () => {
        it("closes screens in reverse order", () => {
          cy.mount(<ProductTransition initializeScreen={["b", "c", "a"]} />);
          cy.findAllByLabelText("title-title")
            .eq(3)
            .should("have.text", "Page A");
          cy.findAllByLabelText("title-title")
            .eq(2)
            .should("have.text", "Page C");
          cy.findAllByLabelText("title-title")
            .eq(1)
            .should("have.text", "Page B");

          cy.findAllByLabelText("action-button").eq(2).click();

          cy.findAllByLabelText("title-title").eq(3).should("not.exist");

          cy.findAllByLabelText("action-button").eq(1).click();
          cy.findAllByLabelText("title-title").eq(2).should("not.exist");

          cy.findAllByLabelText("action-button").eq(0).click();
          cy.findAllByLabelText("title-title").eq(1).should("not.exist");
        });
      });
    });
  });

  context("onScreenChange", () => {
    context("when pressing goToScreen('b')", () => {
      it("should give callback when with last value ['a', 'b']", () => {
        const onScreenChangeSpy = cy.stub().as("onScreenChange");

        cy.mount(
          <ProductTransition
            initializeScreen={["a"]}
            onScreenChange={onScreenChangeSpy}
          />
        );

        cy.findByText("Go to Page B").should("be.visible").click();

        cy.get("@onScreenChange").should("have.been.calledWith", ["a", "b"]);
      });

      context("when pressing goBack", () => {
        it("give callback in onScreenPage with with last value ['a']", () => {
          const onScreenChangeSpy = cy.stub().as("onScreenChange");

          cy.mount(
            <ProductTransition
              initializeScreen={["a"]}
              onScreenChange={onScreenChangeSpy}
            />
          );

          cy.findByText("Go to Page B").should("be.visible").click();

          cy.get("@onScreenChange").should("have.been.calledWith", ["a", "b"]);

          cy.findAllByLabelText("action-button").eq(1).click();
          cy.wait(400);

          cy.get("@onScreenChange").should("have.been.calledWith", ["a"]);
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
