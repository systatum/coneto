import { css } from "styled-components";
import { Button } from "./../../components/button";
import {
  PaperDialog,
  PaperDialogProps,
  PaperDialogRef,
} from "./../../components/paper-dialog";
import { ReactNode, useRef } from "react";
import { generateSentence } from "./../../lib/text";

describe("PaperDialog", () => {
  function ProductPaperDialog(
    props: PaperDialogProps & { children?: ReactNode }
  ) {
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

        <PaperDialog closable width="35vw" ref={dialogRef} {...props}>
          <PaperDialog.Content
            styles={{
              self: css`
                padding: 36px;
                gap: 16px;
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
              </div>
            )}
          </PaperDialog.Content>
        </PaperDialog>
      </div>
    );
  }

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
        cy.mount(<ProductPaperDialog closable={true} />);
        cy.findAllByRole("button").eq(0).should("exist").click();

        cy.findByLabelText("paper-dialog-content").should(
          "have.css",
          "height",
          "500px"
        );
      });

      context("when given a lot of text", () => {
        it("should render 500px and can scroll to the bottom", () => {
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
            .should("have.css", "height", "500px")
            .and("have.css", "overflow", "auto")
            .scrollTo("bottom")
            .then(($el) => {
              const el = $el[0];
              expect(el.scrollHeight).to.be.greaterThan(el.clientHeight);
            });
        });
      });
    });
  });
});
