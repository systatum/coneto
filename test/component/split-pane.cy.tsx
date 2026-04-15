import { css } from "styled-components";
import { SplitPane } from "../../components/split-pane";
import { Textarea } from "./../../components/textarea";
import { useRef, useState } from "react";
import { RiCloseFill, RiEdit2Fill } from "@remixicon/react";

describe("SplitPane", () => {
  context("style", () => {
    context("divider", () => {
      it("should have default 2.5px", () => {
        cy.mount(
          <SplitPane
            orientation="horizontal"
            styles={{
              self: css`
                height: 500px;
              `,
            }}
          >
            <SplitPane.Cell>Top</SplitPane.Cell>
            <SplitPane.Cell>Bottom</SplitPane.Cell>
          </SplitPane>
        );

        cy.findByLabelText("split-pane-divider").should(
          "have.css",
          "border-bottom-width",
          "2.5px"
        );
      });
    });
  });

  context("SplitPane.Cell", () => {
    function SplitPaneCellDefault() {
      return (
        <SplitPane.Cell
          onMouseEnter={() => console.log("now is hovering split-pane-cell")}
          onMouseLeave={() => console.log("now is leaving split-pane-cell")}
          onClick={() => console.log("now is clicking split-pane-cell")}
          actions={[
            {
              hidden: true,
              icon: {
                image: RiCloseFill,
              },
            },
            {
              icon: {
                image: RiEdit2Fill,
              },
            },
          ]}
        >
          Test
        </SplitPane.Cell>
      );
    }
    context("actions", () => {
      context("when given with hidden", () => {
        it("should ignore hidden actions", () => {
          cy.mount(<SplitPaneCellDefault />);
          cy.findAllByLabelText("split-pane-button").should("have.length", 1);
        });
      });
    });

    context("onMouseEnter", () => {
      context("when hovering", () => {
        it("should give callback", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<SplitPaneCellDefault />);
          cy.findByLabelText("split-pane-cell").trigger("mouseover");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is hovering split-pane-cell"
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

          cy.mount(<SplitPaneCellDefault />);
          cy.findByLabelText("split-pane-cell")
            .trigger("mouseover")
            .trigger("mouseout");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is hovering split-pane-cell"
          );
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is leaving split-pane-cell"
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

          cy.mount(<SplitPaneCellDefault />);
          cy.findByLabelText("split-pane-cell").click();

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is clicking split-pane-cell"
          );
        });
      });
    });
  });

  context("onResize", () => {
    it("should call onResize rapid while dragging", () => {
      const onResize = cy.stub().as("onResize");

      cy.mount(
        <SplitPane
          orientation="horizontal"
          styles={{
            self: css`
              height: 500px;
            `,
          }}
          onResize={onResize}
        >
          <SplitPane.Cell>Top</SplitPane.Cell>
          <SplitPane.Cell>Bottom</SplitPane.Cell>
        </SplitPane>
      );

      cy.findByLabelText("split-pane-divider").trigger("mousedown", {
        clientY: 250,
      });

      for (let i = 0; i < 100; i++) {
        cy.get("body").trigger("mousemove", { clientY: 250 + i });
      }

      cy.get("body").trigger("mouseup");
      cy.get("@onResize").its("callCount").should("eq", 100);
    });
  });

  context("ref in split-pane.cell level", () => {
    context("when resize", () => {
      it("renders similar height as a reference", () => {
        function SplitPaneWithTextbox() {
          const [textareaHeight, setTextareaHeight] = useState<number | null>(
            null
          );
          const secondCellRef = useRef<HTMLDivElement | null>(null);

          return (
            <SplitPane
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
              <SplitPane.Cell>Test</SplitPane.Cell>
              <SplitPane.Cell
                ref={secondCellRef}
                styles={{
                  self: css`
                    z-index: 10;
                    background-color: white;
                  `,
                }}
              >
                <Textarea
                  aria-label="textarea-with-split-pane"
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
              </SplitPane.Cell>
            </SplitPane>
          );
        }
        cy.mount(<SplitPaneWithTextbox />);

        cy.findAllByLabelText("split-pane-divider")
          .trigger("mousedown", {
            clientY: 250,
          })
          .trigger("mousemove", { clientY: 150 })
          .trigger("mouseup");

        cy.findAllByLabelText("split-pane-cell")
          .eq(1)
          .invoke("height")
          .should("be.closeTo", 350, 4);

        cy.findAllByLabelText("textarea-with-split-pane")
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
        <SplitPane
          orientation="horizontal"
          styles={{
            self: css`
              height: 500px;
            `,
          }}
          initialSizeRatio={[90, 10]}
        >
          <SplitPane.Cell
            styles={{
              self: css`
                background-color: #fee2e2;
              `,
            }}
          >
            Up
          </SplitPane.Cell>
          <SplitPane.Cell
            styles={{
              self: css`
                background-color: #dcfce7;
              `,
            }}
          >
            Down
          </SplitPane.Cell>
        </SplitPane>
      );
      cy.findByLabelText("split-pane").should("have.css", "height", "500px");
      cy.findAllByLabelText("split-pane-cell")
        .eq(0)
        .invoke("height")
        .should("be.closeTo", 450, 3);
      cy.findAllByLabelText("split-pane-cell")
        .eq(1)
        .invoke("height")
        .should("be.closeTo", 50, 3);
    });

    context("when not given", () => {
      it("renders automatically reference from children", () => {
        cy.mount(
          <SplitPane
            orientation="horizontal"
            styles={{
              self: css`
                height: 500px;
              `,
            }}
          >
            <SplitPane.Cell
              styles={{
                self: css`
                  background-color: #fee2e2;
                `,
              }}
            >
              Up
            </SplitPane.Cell>
            <SplitPane.Cell
              styles={{
                self: css`
                  background-color: #dcfce7;
                `,
              }}
            >
              Down
            </SplitPane.Cell>
          </SplitPane>
        );
        cy.findByLabelText("split-pane").should("have.css", "height", "500px");
        cy.findAllByLabelText("split-pane-cell")
          .eq(0)
          .invoke("height")
          .should("be.closeTo", 250, 3);
        cy.findAllByLabelText("split-pane-cell")
          .eq(1)
          .invoke("height")
          .should("be.closeTo", 250, 3);
      });
    });
  });
});
