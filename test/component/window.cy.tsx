import { css } from "styled-components";
import { Window } from "./../../components/window";
import { Textarea } from "./../../components/textarea";
import { useRef, useState } from "react";

describe("Window", () => {
  context("Window.Cell", () => {
    function WindowCellDefault() {
      return (
        <Window.Cell
          onMouseEnter={() => console.log("now is hovering window-cell")}
          onMouseLeave={() => console.log("now is leaving window-cell")}
          onClick={() => console.log("now is clicking window-cell")}
        >
          Test
        </Window.Cell>
      );
    }
    context("onMouseEnter", () => {
      context("when hovering", () => {
        it("should give callback", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<WindowCellDefault />);
          cy.findByLabelText("window-cell").trigger("mouseover");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is hovering window-cell"
          );
        });
      });
    });

    context("onMouseLeave", () => {
      context("when hover & leave", () => {
        it("should give callback", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<WindowCellDefault />);
          cy.findByLabelText("window-cell")
            .trigger("mouseover")
            .trigger("mouseout");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is hovering window-cell"
          );
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is leaving window-cell"
          );
        });
      });
    });

    context("onClick", () => {
      context("when clicking", () => {
        it("should give callback", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<WindowCellDefault />);
          cy.findByLabelText("window-cell").click();

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is clicking window-cell"
          );
        });
      });
    });
  });

  context("onResize", () => {
    it("should call onResize rapid while dragging", () => {
      const onResize = cy.stub().as("onResize");

      cy.mount(
        <Window
          orientation="horizontal"
          styles={{
            self: css`
              height: 500px;
            `,
          }}
          onResize={onResize}
        >
          <Window.Cell>Top</Window.Cell>
          <Window.Cell>Bottom</Window.Cell>
        </Window>
      );

      cy.findByLabelText("window-divider").trigger("mousedown", {
        clientY: 250,
      });

      for (let i = 0; i < 100; i++) {
        cy.get("body").trigger("mousemove", { clientY: 250 + i });
      }

      cy.get("body").trigger("mouseup");
      cy.get("@onResize").its("callCount").should("eq", 100);
    });
  });

  context("ref in window.cell level", () => {
    context("when resize", () => {
      it("renders similar height as a reference", () => {
        function WindowWithTextbox() {
          const [textareaHeight, setTextareaHeight] = useState<number | null>(
            null
          );
          const secondCellRef = useRef<HTMLDivElement | null>(null);

          return (
            <Window
              styles={{
                self: css`
                  height: 500px;
                `,
              }}
              orientation="horizontal"
              onResizeComplete={() => {
                if (secondCellRef.current) {
                  const height = secondCellRef.current.clientHeight;
                  setTextareaHeight(height);
                }
              }}
            >
              <Window.Cell>Test</Window.Cell>
              <Window.Cell
                ref={secondCellRef}
                styles={{
                  self: css`
                    z-index: 10;
                    background-color: white;
                  `,
                }}
              >
                <Textarea
                  aria-label="textarea-with-window"
                  styles={{
                    self: css`
                      height: ${textareaHeight
                        ? `${textareaHeight}px`
                        : "250px"};
                      border-color: white;
                    `,
                  }}
                  onChange={(e) => {
                    console.log(e);
                  }}
                />
              </Window.Cell>
            </Window>
          );
        }
        cy.mount(<WindowWithTextbox />);

        cy.findAllByLabelText("window-divider")
          .trigger("mousedown", {
            clientY: 250,
          })
          .trigger("mousemove", { clientY: 150 })
          .trigger("mouseup");

        cy.findAllByLabelText("window-cell")
          .eq(1)
          .invoke("height")
          .should("be.closeTo", 350, 4);

        cy.findAllByLabelText("textarea-with-window")
          .eq(0)
          .parent()
          .invoke("height")
          .should("be.closeTo", 350, 4);
      });
    });
  });

  context("initialSizeRatio", () => {
    it("renders with initial size", () => {
      cy.mount(
        <Window
          orientation="horizontal"
          styles={{
            self: css`
              height: 500px;
            `,
          }}
          initialSizeRatio={[90, 10]}
        >
          <Window.Cell
            styles={{
              self: css`
                background-color: #fee2e2;
              `,
            }}
          >
            Up
          </Window.Cell>
          <Window.Cell
            styles={{
              self: css`
                background-color: #dcfce7;
              `,
            }}
          >
            Down
          </Window.Cell>
        </Window>
      );
      cy.findByLabelText("window").should("have.css", "height", "500px");
      cy.findAllByLabelText("window-cell")
        .eq(0)
        .invoke("height")
        .should("be.closeTo", 450, 1);
      cy.findAllByLabelText("window-cell")
        .eq(1)
        .invoke("height")
        .should("be.closeTo", 50, 1);
    });

    context("when not given", () => {
      it("renders automatically reference from children", () => {
        cy.mount(
          <Window
            orientation="horizontal"
            styles={{
              self: css`
                height: 500px;
              `,
            }}
          >
            <Window.Cell
              styles={{
                self: css`
                  background-color: #fee2e2;
                `,
              }}
            >
              Up
            </Window.Cell>
            <Window.Cell
              styles={{
                self: css`
                  background-color: #dcfce7;
                `,
              }}
            >
              Down
            </Window.Cell>
          </Window>
        );
        cy.findByLabelText("window").should("have.css", "height", "500px");
        cy.findAllByLabelText("window-cell")
          .eq(0)
          .invoke("height")
          .should("be.closeTo", 250, 1);
        cy.findAllByLabelText("window-cell")
          .eq(1)
          .invoke("height")
          .should("be.closeTo", 250, 1);
      });
    });
  });
});
