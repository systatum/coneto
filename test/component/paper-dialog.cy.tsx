import { css } from "styled-components";
import { Button } from "./../../components/button";
import {
  PaperDialog,
  PaperDialogProps,
  PaperDialogRef,
  PaperDialogStyles,
} from "./../../components/paper-dialog";
import { ReactNode, useRef, useState } from "react";
import { generateSentence } from "./../../lib/text";
import { Ri4kLine } from "@remixicon/react";
import { Checkbox } from "./../../components/checkbox";

describe("PaperDialog", () => {
  function ProductPaperDialog(
    props: PaperDialogProps & { children?: ReactNode }
  ) {
    const [value, setValue] = useState(false);
    const dialogRef = useRef<PaperDialogRef>(null);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Button onClick={() => dialogRef.current?.openDialog()}>Open</Button>
        <Button onClick={() => dialogRef.current?.closeDialog()}>Close</Button>

        <PaperDialog
          closable
          width="35vw"
          ref={dialogRef}
          {...props}
          styles={{
            ...props?.styles,
            contentStyle: css`
              padding: 36px;
              gap: 16px;
              ${props?.styles?.contentStyle}
            `,
          }}
        >
          {props?.children ? (
            props?.children
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                Escapable Feature
              </h2>
              <p style={{ fontSize: "14px", color: "#4B5563" }}>
                {generateSentence()}
              </p>
              <p style={{ fontSize: "14px", color: "#4B5563" }}>
                {generateSentence()}
              </p>

              <Checkbox
                checked={value}
                onChange={(e) => setValue(e.target.checked)}
                label="check this checkbox"
              />
            </div>
          )}
        </PaperDialog>
      </div>
    );
  }

  context("text", () => {
    context("title", () => {
      it("renders the title text", () => {
        cy.viewport(500, 700);
        cy.mount(<ProductPaperDialog title="Test title" />);

        cy.findAllByRole("button").eq(0).should("exist").click();
        cy.wait(300);

        cy.findByLabelText("title-title")
          .should("exist")
          .and("have.text", "Test title");
      });
    });

    context("subtitle", () => {
      it("renders the subtitle text", () => {
        cy.viewport(500, 700);
        cy.mount(<ProductPaperDialog subtitle="Test subtitle" />);

        cy.findAllByRole("button").eq(0).should("exist").click();
        cy.wait(300);

        cy.findByLabelText("title-subtitle")
          .should("exist")
          .and("have.text", "Test subtitle");
      });
    });
  });

  context("mobile", () => {
    it("renders with radius 0.75rem, width 100dvw and height 72dvh", () => {
      cy.viewport(500, 700);
      cy.mount(<ProductPaperDialog width="100dvw" mobile />);

      cy.findAllByRole("button").eq(0).should("exist").click();
      cy.wait(300);

      cy.findByLabelText("paper-dialog-wrapper")
        .should("have.css", "border-top-left-radius", "20px")
        .and("have.css", "border-top-right-radius", "20px")
        .and("have.css", "width", "500px")
        .and("have.css", "height", "616px");
    });

    context("user selection", () => {
      it("renders action buttons without text selection", () => {
        cy.viewport(500, 700);
        cy.mount(<ProductPaperDialog width="100dvw" mobile />);

        cy.findAllByRole("button").eq(0).should("exist").click();
        cy.wait(300);

        cy.findByLabelText("paper-dialog-toggle-close")
          .parent()
          .should("have.css", "user-select", "none");
        cy.findByLabelText("paper-dialog-toggle-restore")
          .parent()
          .should("have.css", "user-select", "none");
      });

      it("disables text selection on dialog title wrapper", () => {
        cy.viewport(500, 700);
        cy.mount(<ProductPaperDialog width="100dvw" mobile />);

        cy.findAllByRole("button").eq(0).should("exist").click();
        cy.wait(300);

        cy.findByLabelText("paper-dialog-wrapper").should(
          "have.css",
          "user-select",
          "none"
        );
      });

      context("when clicking the Checkbox", () => {
        it("should still allow interaction", () => {
          cy.mount(<ProductPaperDialog width="100dvw" mobile />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.wait(300);

          cy.findByRole("checkbox").should("not.be.checked");

          cy.findByText("check this checkbox").click();

          cy.findByRole("checkbox").should("be.checked");
        });
      });
    });

    context("drag behavior", () => {
      context("when dragging icon drag indicator", () => {
        it("should close the dialog", () => {
          cy.viewport(500, 500);
          cy.mount(<ProductPaperDialog width="100dvw" mobile />);

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.wait(500);

          cy.findByLabelText("paper-dialog-drag-indicator")
            .should("exist")
            .realMouseDown({ position: "center" })
            .realMouseMove(0, 350)
            .realMouseUp();

          cy.wait(300);
          cy.findByLabelText("paper-dialog-content").should("not.be.visible");
        });
      });

      context("when dragging in area empty icon drag indicator", () => {
        it("should close the dialog", () => {
          cy.viewport(500, 500);
          cy.mount(<ProductPaperDialog width="100dvw" mobile />);

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.wait(500);

          cy.findByLabelText("paper-dialog-content")
            .should("exist")
            .realMouseDown({ position: "topRight" })
            .realMouseMove(0, 350)
            .realMouseUp();

          cy.wait(300);
          cy.findByLabelText("paper-dialog-content").should("not.be.visible");
        });
      });

      context("when dragging at dialog content", () => {
        it("should keep the dialog open", () => {
          cy.viewport(500, 700);
          cy.mount(<ProductPaperDialog width="100dvw" mobile />);

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.wait(300);

          cy.findByLabelText("paper-dialog-content")
            .should("exist")
            .realMouseDown({ position: "center" })
            .realMouseMove(0, 350)
            .realMouseUp();

          cy.wait(300);
          cy.findByLabelText("paper-dialog-content").should("exist");
        });
      });
    });

    context("closable", () => {
      context("when given true", () => {
        it("should render the closable icon", () => {
          cy.viewport(500, 700);
          cy.mount(
            <ProductPaperDialog width="100dvw" mobile closable={true} />
          );

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.wait(300);

          cy.findByLabelText("paper-dialog-close-icon").should("exist");
          cy.findByLabelText("paper-dialog-drag-indicator").should("exist");
        });

        context("when clicking close icon", () => {
          it("should close the modal", () => {
            cy.viewport(500, 700);
            cy.mount(
              <ProductPaperDialog width="100dvw" mobile closable={true} />
            );

            cy.findAllByRole("button").eq(0).should("exist").click();
            cy.wait(300);
            cy.findByLabelText("paper-dialog-wrapper").should("exist");

            cy.findByLabelText("paper-dialog-close-icon")
              .should("exist")
              .click();

            cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
          });
        });

        context("when clicking overlay-background", () => {
          it("should close the modal", () => {
            cy.mount(
              <ProductPaperDialog width="100dvw" mobile closable={true} />
            );

            cy.findAllByRole("button").eq(0).should("exist").click();
            cy.findByLabelText("paper-dialog-wrapper").should("exist");
            cy.findByLabelText("overlay-blocker")
              .should("exist")
              .click("topLeft");
            cy.wait(400);

            cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
          });
        });

        context("when given empty controls", () => {
          it("should not render the closable icon", () => {
            cy.viewport(500, 700);
            cy.mount(
              <ProductPaperDialog
                width="100dvw"
                mobile
                controls={[]}
                closable={true}
              />
            );

            cy.findAllByRole("button").eq(0).should("exist").click();
            cy.wait(300);

            cy.findByLabelText("paper-dialog-close-icon").should("not.exist");
          });
        });
      });

      context("when given false", () => {
        it("should not render the closable icon and drag icon", () => {
          cy.viewport(500, 700);
          cy.mount(
            <ProductPaperDialog width="100dvw" mobile closable={false} />
          );

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.wait(300);

          cy.findByLabelText("paper-dialog-close-icon").should("not.exist");
          cy.findByLabelText("paper-dialog-drag-indicator").should("not.exist");
        });

        context("when clicking overlay-background", () => {
          it("should not close the modal", () => {
            cy.mount(
              <ProductPaperDialog width="100dvw" mobile closable={false} />
            );

            cy.findAllByRole("button").eq(0).should("exist").click();
            cy.findByLabelText("paper-dialog-wrapper").should("exist");
            cy.findByLabelText("overlay-blocker")
              .should("exist")
              .click("topLeft");
            cy.wait(400);

            cy.findByLabelText("paper-dialog-wrapper").should("exist");
          });
        });
      });
    });
  });

  context("icons", () => {
    context("restore icon", () => {
      context("when not given", () => {
        it("should renders with arrow icon (default)", () => {
          cy.mount(
            <ProductPaperDialog
              onClosed={() => {
                console.log("the modal is closed");
              }}
            />
          );

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.findByLabelText("paper-dialog-restore-icon")
            .find("path")
            .invoke("attr", "d")
            .should("include", "M10.8284");
          // The default restore icon is has #M10.8284
        });
      });

      context("when given another icon", () => {
        it("should changes with customize icon", () => {
          cy.mount(
            <ProductPaperDialog
              onClosed={() => {
                console.log("the modal is closed");
              }}
              icons={{
                restoreIcon: {
                  image: Ri4kLine,
                },
              }}
            />
          );

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.findByLabelText("paper-dialog-restore-icon")
            .find("path")
            .invoke("attr", "d")
            .should("not.include", "M10.8284");
          // The default restore icon is has #M10.8284
        });
      });
    });

    context("close icon", () => {
      context("when not given", () => {
        it("should renders with close icon (default)", () => {
          cy.mount(
            <ProductPaperDialog
              onClosed={() => {
                console.log("the modal is closed");
              }}
            />
          );

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.findByLabelText("paper-dialog-close-icon")
            .find("path")
            .invoke("attr", "d")
            .should("include", "M11.9997");
        });
      });

      context("when given another icon", () => {
        it("should changes with customize icon", () => {
          cy.mount(
            <ProductPaperDialog
              onClosed={() => {
                console.log("the modal is closed");
              }}
              icons={{
                closeIcon: {
                  image: Ri4kLine,
                },
              }}
            />
          );

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.findByLabelText("paper-dialog-close-icon")
            .find("path")
            .invoke("attr", "d")
            .should("not.include", "M11.9997");
          // The default close icon is has #M11.9997
        });
      });
    });
  });

  context("onClosed", () => {
    context("when pressing escape", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductPaperDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByRole("button").eq(0).should("exist").click();

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("paper-dialog-wrapper").should("exist");
        cy.get("body").type("{esc}");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
      });
    });

    context("when clicking overlay-blocker", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductPaperDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByRole("button").eq(0).should("exist").click();

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("paper-dialog-wrapper").should("exist");
        cy.findByLabelText("overlay-blocker").should("exist").click("topLeft");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
      });
    });

    context("when clicking close button", () => {
      it("should give the callback", () => {
        cy.mount(
          <ProductPaperDialog
            onClosed={() => {
              console.log("the modal is closed");
            }}
          />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.findAllByRole("button").eq(0).should("exist").click();

        cy.get("@consoleLog").should(
          "not.have.been.calledWith",
          "the modal is closed"
        );

        cy.findByLabelText("paper-dialog-wrapper").should("exist");
        cy.findByLabelText("overlay-blocker").should("exist").click("topLeft");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the modal is closed"
        );
        cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
      });
    });

    context("when given closable false", () => {
      context("when pressing escape", () => {
        it("should not give the callback", () => {
          cy.mount(
            <ProductPaperDialog
              closable={false}
              onClosed={() => {
                console.log("the modal is closed");
              }}
            />
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "the modal is closed"
          );

          cy.findByLabelText("paper-dialog-wrapper").should("exist");
          cy.get("body").type("{esc}");

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "the modal is closed"
          );
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
        });
      });

      context("when clicking overlay-blocker", () => {
        it("should not give the callback", () => {
          cy.mount(
            <ProductPaperDialog
              closable={false}
              onClosed={() => {
                console.log("the modal is closed");
              }}
            />
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "the modal is closed"
          );

          cy.findByLabelText("paper-dialog-wrapper").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");

          cy.get("@consoleLog").should(
            "not.have.been.calledWith",
            "the modal is closed"
          );
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
        });
      });
    });
  });

  context("closable", () => {
    context("when given true", () => {
      context("when pressing escape", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog closable={true} />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog closable={true} />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
        });
      });
    });

    context("when given false", () => {
      context("when pressing escape", () => {
        it("should not close the modal", () => {
          cy.mount(<ProductPaperDialog closable={false} />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog closable={false} />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
        });
      });
    });

    context("when not given (default)", () => {
      context("when pressing escape", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
          cy.get("body").type("{esc}");
          cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
        });
      });

      context("when clicking overlay-background", () => {
        it("should close the modal", () => {
          cy.mount(<ProductPaperDialog />);

          cy.findAllByRole("button").eq(0).should("exist").click();
          cy.findByLabelText("paper-dialog-wrapper").should("exist");
          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("paper-dialog-wrapper").should("not.exist");
        });
      });
    });
  });

  context("style", () => {
    context("height", () => {
      it("should be 100% from the screen", () => {
        cy.viewport(500, 500);
        cy.mount(<ProductPaperDialog closable={true} />);
        cy.findAllByRole("button").eq(0).should("exist").click();

        cy.findByLabelText("paper-dialog-content").should(
          "have.css",
          "height",
          "498px"
        );
      });

      context("when given a lot of text", () => {
        it("should render 498px and can scroll to the bottom", () => {
          cy.mount(
            <ProductPaperDialog closable={true}>
              {generateSentence({
                minLen: 150,
                maxLen: 200,
                seed: 1234,
              })}
            </ProductPaperDialog>
          );
          cy.findAllByRole("button").eq(0).should("exist").click();

          cy.findByLabelText("paper-dialog-content")
            .should("have.css", "height", "498px")
            .and("have.css", "overflow", "auto")
            .scrollTo("bottom")
            .then(($el) => {
              const el = $el[0];
              expect(el.scrollHeight).to.be.greaterThan(el.clientHeight);
            });
        });
      });
    });

    const setup = (styles?: PaperDialogStyles) => {
      cy.mount(<ProductPaperDialog closable={true} styles={styles} />);
      cy.findAllByRole("button").eq(0).should("exist").click();
    };

    context("contentStyle", () => {
      it("applies custom content style", () => {
        setup({
          contentStyle: { backgroundColor: "rgb(255, 0, 0)" },
        });

        cy.findByLabelText("paper-dialog-content")
          .should("be.visible")
          .and("have.css", "background-color", "rgb(255, 0, 0)");
      });
    });

    context("overlayStyle", () => {
      it("applies custom overlay style", () => {
        setup({
          overlayStyle: { backgroundColor: "rgba(0, 0, 255, 0.5)" },
        });

        cy.findByLabelText("overlay-blocker").should(
          "have.css",
          "background-color",
          "rgba(0, 0, 255, 0.5)"
        );
      });
    });

    context("closeButtonStyle", () => {
      it("applies custom close button style", () => {
        setup({
          closeButtonStyle: { backgroundColor: "rgb(255, 255, 0)" },
        });

        cy.findByLabelText("paper-dialog-toggle-close").should(
          "have.css",
          "background-color",
          "rgb(255, 255, 0)"
        );
      });
    });

    context("minimizeButtonStyle", () => {
      it("applies custom minimize button style", () => {
        setup({
          minimizeButtonStyle: { backgroundColor: "rgb(0, 255, 255)" },
        });

        cy.findByLabelText("paper-dialog-toggle-restore").should(
          "have.css",
          "background-color",
          "rgb(0, 255, 255)"
        );
      });
    });
  });
});
