import { css } from "styled-components";
import {
  PullRefresher,
  PullRefresherProps,
} from "./../../components/pull-refresher";

describe("PullRefresher", () => {
  function ProductPullRefresher(props: Partial<PullRefresherProps>) {
    return (
      <PullRefresher
        onLoading={({ stopLoading }) => {
          console.log("is loading");
          setTimeout(() => {
            stopLoading();
            console.log("is stopped");
          }, 400);
        }}
        {...props}
      >
        {props?.children ?? "Test"}
      </PullRefresher>
    );
  }

  function pull(distance: number) {
    cy.contains("Test").parent().trigger("mousedown", { clientY: 0 });

    cy.window().trigger("mousemove", { clientY: distance });
    cy.window().trigger("mouseup");
  }

  context("activatedAt", () => {
    context("with string", () => {
      context("when given 25dvh (187.5px)", () => {
        context("when scrolling pass the height", () => {
          it("should activate the loading", () => {
            cy.viewport(550, 750);
            cy.mount(
              <ProductPullRefresher
                activatedAt="25dvh"
                loadingSlot={<div>Loading...</div>}
              />
            );

            pull(188);

            cy.contains("Loading...").should("exist");
          });
        });

        context("when scrolling not pass the height", () => {
          it("should not activate the loading", () => {
            cy.mount(
              <ProductPullRefresher
                activatedAt="25dvh"
                loadingSlot={<div>Loading...</div>}
              />
            );

            pull(184);

            cy.contains("Loading...").should("not.exist");
          });
        });
      });
    });

    context("with number", () => {
      context("when given 200", () => {
        context("when scrolling pass the height", () => {
          it("should activate the loading", () => {
            cy.mount(
              <ProductPullRefresher
                activatedAt={200}
                loadingSlot={<div>Loading...</div>}
              />
            );

            pull(250);

            cy.contains("Loading...").should("exist");
          });
        });

        context("when scrolling not pass the height", () => {
          it("should not activate the loading", () => {
            cy.mount(
              <ProductPullRefresher
                activatedAt={200}
                loadingSlot={<div>Loading...</div>}
              />
            );

            pull(190);

            cy.contains("Loading...").should("not.exist");
          });
        });
      });
    });
  });

  context("preloadingSlot", () => {
    context("when given by function", () => {
      beforeEach(() => {
        cy.mount(
          <ProductPullRefresher
            activatedAt="200px"
            preloadingSlot={(activated) => (
              <div>{activated ? "Release to refresh" : "Pull to refresh"}</div>
            )}
          />
        );
      });

      context("when scrolling and not passing the height", () => {
        it("renders non-activated state", () => {
          cy.contains("Test").parent().trigger("mousedown", { clientY: 0 });

          cy.window().trigger("mousemove", { clientY: 190 });

          cy.contains("Pull to refresh").should("exist");
        });
      });

      context("when scrolling and passing the height", () => {
        it("renders activated state when threshold is reached", () => {
          cy.contains("Test").parent().trigger("mousedown", { clientY: 0 });

          cy.window().trigger("mousemove", { clientY: 210 });

          cy.contains("Release to refresh").should("exist");
        });
      });
    });

    context("when given by reactnode", () => {
      it("renders custom node", () => {
        cy.mount(
          <ProductPullRefresher preloadingSlot={<div>Custom preload</div>} />
        );

        cy.contains("Test").parent().trigger("mousedown", { clientY: 0 });

        cy.window().trigger("mousemove", { clientY: 50 });

        cy.contains("Custom preload").should("exist");
      });
    });
  });

  context("loadingSlot", () => {
    it("renders custom loading slot", () => {
      cy.mount(
        <ProductPullRefresher loadingSlot={<div>Custom loading</div>} />
      );

      pull(150);

      cy.contains("Custom loading").should("exist");
    });

    context("when given timeout with 400ms", () => {
      it("removes loading slot after stopLoading", () => {
        cy.mount(
          <ProductPullRefresher loadingSlot={<div>Custom loading</div>} />
        );

        pull(150);

        cy.contains("Custom loading").should("exist");

        cy.wait(500);

        cy.contains("Custom loading").should("not.exist");
      });
    });
  });

  context("onLoading", () => {
    it("calls loading callback", () => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });
      cy.mount(<ProductPullRefresher />);

      pull(150);

      cy.get("@consoleLog").should("have.been.calledWith", "is loading");
    });

    context("onLoading", () => {
      it("calls loading callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });
        cy.mount(<ProductPullRefresher />);

        pull(150);

        cy.get("@consoleLog").should("have.been.calledWith", "is loading");
      });

      context("when given stopLoading", () => {
        it("should stop the loading", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.mount(<ProductPullRefresher />);

          pull(150);

          cy.get("@consoleLog").should("have.been.calledWith", "is loading");
          cy.wait(500);
          cy.get("@consoleLog").should("have.been.calledWith", "is stopped");
        });
      });
    });
  });

  context("children", () => {
    it("renders children", () => {
      cy.mount(
        <ProductPullRefresher>
          <div>Hello World</div>
        </ProductPullRefresher>
      );

      cy.contains("Hello World").should("exist");
    });
  });

  context("styles", () => {
    context("containerStyle", () => {
      context("when given background-color red", () => {
        it("renders background color with rgb(255, 0, 0)", () => {
          cy.mount(
            <ProductPullRefresher
              styles={{
                containerStyle: css`
                  background-color: red;
                `,
              }}
            />
          );

          cy.findByLabelText("pull-refresher-container")

            .should("have.css", "background-color", "rgb(255, 0, 0)");
        });
      });
    });

    context("content", () => {
      context("when given padding 20px", () => {
        it("should render container with padding 20px", () => {
          cy.mount(
            <ProductPullRefresher
              styles={{
                contentStyle: css`
                  padding: 20px;
                `,
              }}
            />
          );

          cy.findByLabelText("pull-refresher-content").should(
            "have.css",
            "padding-top",
            "20px"
          );
        });
      });
    });
  });
});
