import { css } from "styled-components";
import { Button } from "./../../components/button";
import {
  OverlayBlocker,
  OverlayBlockerProps,
  OverlayBlockerRef,
} from "./../../components/overlay-blocker";
import { useRef, useState } from "react";
import { PaperDialog, PaperDialogRef } from "./../../components/paper-dialog";
import { Dialog, DialogProps } from "./../../components/dialog";
import { RiInboxArchiveFill } from "@remixicon/react";
import { generateSentence } from "./../../lib/text";
import { Combobox, ComboboxOption } from "./../../components/combobox";

describe("Overlay Blocker", () => {
  function ProductOverlayBlocker(props: OverlayBlockerProps) {
    const ref = useRef<OverlayBlockerRef>(null);

    return (
      <>
        <Button onClick={() => ref?.current?.open()}>Open Overlay</Button>
        <OverlayBlocker {...props} ref={ref} />
      </>
    );
  }

  context("scroll in overlay", () => {
    context("Custom Combobox", () => {
      function ProductCombobox(overlayProps?: OverlayBlockerProps) {
        const [isOpen, setIsOpen] = useState(false);

        const RANDOM_OPTIONS: ComboboxOption[] = Array.from({ length: 20 }).map(
          (_, index) => ({ text: String(index), value: index })
        );

        return (
          <>
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Test
            </Button>
            {isOpen && (
              <Combobox
                styles={{
                  containerStyle: css`
                    position: absolute;
                    top: 0px;
                    z-index: 99999999999;
                  `,
                }}
                options={RANDOM_OPTIONS}
                mobile
              />
            )}
            <OverlayBlocker show={isOpen} {...overlayProps} />
          </>
        );
      }

      it("should not scroll to the bottom", () => {
        cy.mount(<ProductCombobox />);

        cy.contains("Test").click();

        cy.wait(500);
        cy.findByPlaceholderText("Search your item...").click();

        cy.get("#combo-list").realMouseWheel({ deltaY: 1000 });

        cy.findByText(19).should("not.be.visible");
      });

      context("when given exemptRegions", () => {
        context("when given accurate id or className", () => {
          it("should scroll to the bottom", () => {
            cy.mount(<ProductCombobox exemptRegions={["#combo-list"]} />);

            cy.contains("Test").click();

            cy.wait(500);
            cy.findByPlaceholderText("Search your item...").click();

            cy.get("#combo-list").realMouseWheel({ deltaY: 1000 });

            cy.findByText(19).should("be.visible");
          });
        });

        context("when given not accurate id or className", () => {
          it("should not scroll to the bottom", () => {
            cy.mount(<ProductCombobox exemptRegions={[".combo-list"]} />);

            cy.contains("Test").click();

            cy.wait(500);
            cy.findByPlaceholderText("Search your item...").click();

            cy.get("#combo-list").realMouseWheel({ deltaY: 1000 });

            cy.findByText(19).should("not.be.visible");
          });
        });
      });
    });

    context("PaperDialog", () => {
      function ProductPaperDialog() {
        const paperRef = useRef<PaperDialogRef>(null);
        return (
          <div
            aria-label="test-aria"
            style={{
              minHeight: "700px",
              overflowY: "scroll",
            }}
          >
            <Button
              onClick={() => {
                paperRef?.current?.openDialog();
              }}
            >
              Test
            </Button>
            <PaperDialog width="50dvw" ref={paperRef}>
              {generateSentence({
                minLen: 500,
                maxLen: 600,
                seed: 123,
              })}
            </PaperDialog>
          </div>
        );
      }

      it("allows scroll to the bottom", () => {
        cy.mount(<ProductPaperDialog />);

        cy.wait(500);

        cy.window().then((win) => {
          win.scrollTo(0, 1000);
        });

        cy.findByLabelText("test-aria").scrollTo("bottom", {
          ensureScrollable: false,
        });

        cy.window().its("scrollY").should("not.eq", 0);
      });

      context("when scrolling in the overlay", () => {
        it("prevents overlay background scrolling", () => {
          cy.mount(<ProductPaperDialog />);

          cy.findByText("Test").should("exist").click();
          cy.contains(/Sed.*memoria/i).should("exist");

          cy.wait(500); // Wait for the dialog to open and render

          cy.window().then((win) => {
            win.scrollTo(0, 1000);
          });

          cy.findByLabelText("test-aria").scrollTo("bottom", {
            ensureScrollable: false,
          });

          cy.window().its("scrollY").should("eq", 0);
        });
      });

      context("when scrolling in the paper", () => {
        it("still allows user scroll the paper", () => {
          cy.mount(<ProductPaperDialog />);

          cy.findByText("Test").should("exist").click();
          cy.contains(/Sed.*memoria/i).should("exist");

          cy.wait(500); // Wait for the dialog to open and render

          cy.window().its("scrollY").should("eq", 0);

          cy.findByLabelText("paper-dialog-content").scrollTo("bottom", {
            ensureScrollable: false,
          });

          cy.findByLabelText("paper-dialog-content")
            .its("scrollY")
            .should("not.eq", 0);
        });
      });
    });

    context("Dialog", () => {
      function ProductDialog() {
        const [isOpen, setIsOpen] = useState(false);

        const args: DialogProps = {
          title: "Archive Project",
          subtitle:
            "The project will be moved to the archive section and will no longer appear in your active projects list.",
          children: generateSentence({
            minLen: 500,
            maxLen: 600,
            seed: 123,
          }),
          icon: { image: RiInboxArchiveFill, color: "#2563eb" },
          onClick: ({ closeDialog }) => closeDialog(),
          actions: [
            { id: "cancel", caption: "Cancel" },
            { id: "archive", caption: "Archive", variant: "primary" },
          ],
          styles: {
            containerStyle: css`
              max-height: 400px;
            `,
          },
        };

        return (
          <div
            aria-label="test-aria"
            style={{
              minHeight: "700px",
              overflowY: "scroll",
            }}
          >
            <Button
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Test
            </Button>
            <Dialog {...args} isOpen={isOpen} />
          </div>
        );
      }

      it("allows scroll to the bottom", () => {
        cy.mount(<ProductDialog />);

        cy.wait(500);

        cy.window().then((win) => {
          win.scrollTo(0, 1000);
        });

        cy.findByLabelText("test-aria").scrollTo("bottom", {
          ensureScrollable: false,
        });

        cy.window().its("scrollY").should("not.eq", 0);
      });

      context("when scrolling in the overlay", () => {
        it("prevents overlay background scrolling", () => {
          cy.mount(<ProductDialog />);

          cy.findByText("Test").should("exist").click();
          cy.findByText("Archive Project").should("exist");

          cy.wait(500); // Wait for the dialog to open and render

          cy.window().then((win) => {
            win.scrollTo(0, 1000);
          });

          cy.findByLabelText("test-aria").scrollTo("bottom", {
            ensureScrollable: false,
          });

          cy.window().its("scrollY").should("eq", 0);
        });
      });

      context("when scrolling in the dialog", () => {
        it("still allows user scroll the dialog", () => {
          cy.mount(<ProductDialog />);

          cy.findByText("Test").should("exist").click();
          cy.findByText("Archive Project").should("exist");

          cy.wait(500); // Wait for the dialog to open and render

          cy.window().its("scrollY").should("eq", 0);

          cy.findByLabelText("dialog-content").scrollTo("bottom", {
            ensureScrollable: false,
          });

          cy.findByLabelText("dialog-content")
            .its("scrollY")
            .should("not.eq", 0);
        });
      });
    });
  });

  context("onClick", () => {
    context("when not provide", () => {
      context("when clicking the overlay", () => {
        it("renders to auto close", () => {
          cy.mount(<ProductOverlayBlocker show />);

          cy.findByLabelText("overlay-blocker").should("exist").click();
          cy.findByLabelText("overlay-blocker").should("not.exist");
        });
      });
    });

    context("when provide close", () => {
      context("when clicking the overlay", () => {
        it("renders to auto close", () => {
          cy.mount(<ProductOverlayBlocker onClick={"close"} show />);

          cy.findByLabelText("overlay-blocker").should("exist").click();
          cy.findByLabelText("overlay-blocker").should("not.exist");
        });
      });
    });

    context("when provide close", () => {
      context("when clicking the overlay", () => {
        it("renders overlay as usual (stay opened)", () => {
          cy.mount(<ProductOverlayBlocker onClick={"preventDefault"} show />);

          cy.findByLabelText("overlay-blocker").should("exist").click();
          cy.findByLabelText("overlay-blocker").should("exist");
        });
      });
    });
  });

  function ProductOverlayBlockerWithClose(props: OverlayBlockerProps) {
    const ref = useRef<OverlayBlockerRef>(null);

    return (
      <>
        <Button onClick={() => ref?.current?.open()}>Open Overlay</Button>
        <OverlayBlocker {...props} ref={ref}>
          <Button variant="primary" onClick={() => ref?.current?.close()}>
            Close Overlay
          </Button>
        </OverlayBlocker>
      </>
    );
  }

  context("Ref", () => {
    context("open()", () => {
      context("when clicking button ref", () => {
        it("should renders the overlay", () => {
          cy.mount(<ProductOverlayBlocker />);
          cy.findByLabelText("overlay-blocker").should("not.exist");
          cy.findByText("Open Overlay").should("exist").click();
          cy.findByLabelText("overlay-blocker").should("exist");
        });
      });
    });

    context("close()", () => {
      context("when overlay preventDefault", () => {
        it("still renders with overlay", () => {
          cy.mount(
            <ProductOverlayBlockerWithClose
              show
              onClick={"preventDefault"}
              styles={{
                self: css`
                  display: flex;
                  justify-content: center;
                  align-items: center;
                `,
              }}
            />
          );

          cy.findByLabelText("overlay-blocker")
            .should("exist")
            .click("topLeft");
          cy.findByLabelText("overlay-blocker").should("exist");
        });

        context("when clicking button with ref close()", () => {
          it("should close the overlay", () => {
            cy.mount(
              <ProductOverlayBlockerWithClose
                show
                onClick={"preventDefault"}
                styles={{
                  self: css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  `,
                }}
              />
            );

            cy.findByLabelText("overlay-blocker")
              .should("exist")
              .click("topLeft");
            cy.findByLabelText("overlay-blocker").should("exist");

            cy.findByText("Close Overlay").should("exist").click();
            cy.findByLabelText("overlay-blocker").should("not.exist");
          });
        });
      });
    });
  });

  context("styles", () => {
    context("when not given (default)", () => {
      it("renders with default gray background and layout", () => {
        cy.mount(<ProductOverlayBlockerWithClose show />);

        cy.findByLabelText("overlay-blocker")
          .should("exist")
          .and("have.css", "display", "block")
          .and("have.css", "justify-content", "normal")
          .and("have.css", "align-items", "normal")
          .and("have.css", "background-color", "rgba(3, 3, 3, 0.2)");
      });
    });

    context("when custom styles are provided", () => {
      it("applies align, justify, and background color correctly", () => {
        cy.mount(
          <ProductOverlayBlockerWithClose
            show
            styles={{
              self: css`
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: aliceblue;
              `,
            }}
          />
        );

        cy.findByLabelText("overlay-blocker")
          .should("exist")
          .and("have.css", "display", "flex")
          .and("have.css", "justify-content", "center")
          .and("have.css", "align-items", "center")
          .and("have.css", "background-color", "rgb(240, 248, 255)");
      });
    });
  });
});
