import { useTheme } from "./../../theme";
import {
  ScreenProps,
  ScreensMap,
  ScreenTransition,
  ScreenTransitionProps,
} from "./../../components/screen-transition";
import styled, { css } from "styled-components";
import { RiArrowLeftSLine } from "@remixicon/react";
import { Title } from "./../../components/title";
import { Button } from "./../../components/button";
import { useState } from "react";

describe("Screen Transition", () => {
  const productScreen = {
    a: PageA,
    b: PageB,
    c: PageC,
  };

  type ScreenKey = keyof typeof productScreen;

  function PageTitle({
    text,
    goBack = null,
  }: {
    text?: string;
  } & Partial<ScreenProps>) {
    const { currentTheme } = useTheme();

    const bodyTheme = currentTheme?.body;

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

  type ProductTransitionProps<TScreens extends ScreensMap> = {
    screens: TScreens;
    initializeScreen?: (keyof TScreens)[];
    onScreenChange?: (screens: (keyof TScreens)[]) => void;
  } & Partial<ScreenTransitionProps<TScreens>>;

  function ProductTransition<TScreens extends ScreensMap>({
    initializeScreen = [],
    onScreenChange,
    screens,
  }: Partial<ProductTransitionProps<TScreens>>) {
    const [activeScreens, setActiveScreens] =
      useState<(keyof TScreens)[]>(initializeScreen);

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
    context("when given sheet", () => {
      const productWithSheetScreens: ScreensMap = {
        a: PageA,
        b: PageB,
        c: { component: PageC, sheet: true },
      };

      context("when initialize with C in screen", () => {
        it("renders the PaperDialog mobile", () => {
          cy.viewport(500, 700);

          cy.mount(
            <ProductTransition
              screens={productWithSheetScreens}
              initializeScreen={["c"]}
            />
          );

          cy.findByLabelText("paper-dialog-drag-indicator").should("exist");

          cy.wait(500);
        });

        context("when drag to the bottom with indicator", () => {
          it("should close the PaperDialog", () => {
            cy.viewport(500, 700);

            cy.mount(
              <ProductTransition
                screens={productWithSheetScreens}
                initializeScreen={["c"]}
              />
            );
            cy.findByLabelText("paper-dialog-drag-indicator")
              .realMouseDown({ position: "center" })
              .realMouseMove(0, 30)
              .wait(100)
              .realMouseMove(0, 60)
              .wait(100)
              .realMouseMove(0, 100)
              .realMouseUp();

            cy.findByLabelText("paper-dialog-drag-indicator").should(
              "not.exist"
            );
          });

          it("should given onScreenChange callback as usual", () => {
            cy.viewport(500, 700);
            const onScreenChangeSpy = cy.stub().as("onScreenChange");

            cy.mount(
              <ProductTransition
                screens={productWithSheetScreens}
                initializeScreen={["c"]}
                onScreenChange={onScreenChangeSpy}
              />
            );
            cy.findByLabelText("paper-dialog-drag-indicator")
              .realMouseDown({ position: "center" })
              .realMouseMove(0, 30)
              .wait(100)
              .realMouseMove(0, 60)
              .wait(100)
              .realMouseMove(0, 100)
              .realMouseUp();

            cy.get("@onScreenChange").should("have.been.calledWith", []);
          });
        });
      });
    });

    context("when clicking next button", () => {
      it("should move to the page A", () => {
        cy.mount(<ProductTransition screens={productScreen} />);
        cy.findByLabelText("title-title").should("have.text", "Index Screen");

        cy.findByText("Go to Page A").should("be.visible").click();

        cy.wait(700);
        cy.findAllByLabelText("title-title")
          .eq(1)
          .should("have.text", "Page A");
      });

      context("when clicking next button", () => {
        it("should move to the page C", () => {
          cy.mount(<ProductTransition screens={productScreen} />);
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
          cy.mount(<ProductTransition screens={productScreen} />);
          cy.findByLabelText("title-title").should("have.text", "Index Screen");

          cy.findByText("Go to Page A").should("be.visible").click();

          cy.wait(700);
          cy.findAllByLabelText("title-title")
            .eq(1)
            .should("have.text", "Page A");

          cy.findAllByLabelText("title-action").eq(0).click();
        });
      });
    });
  });

  context("activeScreens", () => {
    context("when initialize 3 screen", () => {
      it("should render 3 screen", () => {
        cy.mount(
          <ProductTransition
            screens={productScreen}
            initializeScreen={["b", "c", "a"]}
          />
        );
        cy.findAllByLabelText("paper-dialog-wrapper").should("have.length", 3);
      });

      context("when move to back", () => {
        it("closes screens in reverse order", () => {
          cy.mount(
            <ProductTransition
              screens={productScreen}
              initializeScreen={["b", "c", "a"]}
            />
          );
          cy.findAllByLabelText("title-title")
            .eq(3)
            .should("have.text", "Page A");
          cy.findAllByLabelText("title-title")
            .eq(2)
            .should("have.text", "Page C");
          cy.findAllByLabelText("title-title")
            .eq(1)
            .should("have.text", "Page B");

          cy.findAllByLabelText("title-action").eq(2).click();

          cy.findAllByLabelText("title-title").eq(3).should("not.exist");

          cy.findAllByLabelText("title-action").eq(1).click();
          cy.findAllByLabelText("title-title").eq(2).should("not.exist");

          cy.findAllByLabelText("title-action").eq(0).click();
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
            screens={productScreen}
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
              screens={productScreen}
              initializeScreen={["a"]}
              onScreenChange={onScreenChangeSpy}
            />
          );

          cy.findByText("Go to Page B").should("be.visible").click();

          cy.get("@onScreenChange").should("have.been.calledWith", ["a", "b"]);

          cy.findAllByLabelText("title-action").eq(1).click();
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
