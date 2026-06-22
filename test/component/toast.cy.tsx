import { PaperDialog, PaperDialogRef } from "./../../components/paper-dialog";
import { Button } from "./../../components/button";
import {
  Toast,
  ToastProps,
  ToastPosition,
  ToastIconPosition,
  ToastVariant,
} from "./../../components/toast";
import { useRef } from "react";

const THEME = {
  primary: {
    iconBackgroundColor: "rgb(108, 123, 255)",
    iconColor: "rgb(255, 255, 255)",
    progressColor: "rgb(91, 99, 246)",
  },
  success: {
    iconBackgroundColor: "rgb(34, 197, 94)",
    iconColor: "rgb(255, 255, 255)",
    progressColor: "rgb(34, 197, 94)",
  },
  danger: {
    iconBackgroundColor: "rgb(244, 63, 94)",
    iconColor: "rgb(255, 255, 255)",
    progressColor: "rgb(244, 63, 94)",
  },
  warning: {
    iconBackgroundColor: "rgb(245, 158, 11)",
    iconColor: "rgb(255, 255, 255)",
    progressColor: "rgb(245, 158, 11)",
  },
  neutral: {
    iconBackgroundColor: "rgb(100, 116, 139)",
    iconColor: "rgb(255, 255, 255)",
    progressColor: "rgb(100, 116, 139)",
  },
} as const;

function ProductToast(props: ToastProps) {
  return <Button onClick={() => Toast.alert(props)}>Open Toast</Button>;
}

function openToast(props: ToastProps) {
  cy.mount(<ProductToast {...props} />);
  cy.wait(400);
  cy.contains("Open Toast").click();
}

describe("Toast", () => {
  afterEach(() => {
    Toast.closeAll();
  });

  // bug
  context("when open the paper dialog", () => {
    context("when clicking the toast", () => {
      it("still shows the Toast", () => {
        function ProductPaperDialogAndToast() {
          const dialogRef = useRef<PaperDialogRef>(null);
          return (
            <>
              <PaperDialog width="100dvw" ref={dialogRef}>
                <Button
                  onClick={() => {
                    Toast.success({
                      content: "This is Toast component",
                    });
                  }}
                >
                  Open Toast
                </Button>
              </PaperDialog>

              <Button onClick={() => dialogRef?.current?.openDialog()}>
                Open Paper
              </Button>
            </>
          );
        }
        cy.mount(<ProductPaperDialogAndToast />);

        cy.findByText("Open Toast").should("not.exist");

        cy.findByText("Open Paper").click();
        cy.wait(300);

        cy.findByText("This is Toast component").should("not.exist");

        cy.findByText("Open Toast").should("exist").click();

        cy.findByText("This is Toast component").should("exist");
      });
    });
  });

  context("zIndex", () => {
    context("when given 99999999", () => {
      it("renders zIndex with 99999999", () => {
        openToast({
          variant: "success",
          content: "Bar colour",
          disappearAfterMs: 3000,
          withLoadingBar: true,
          zIndex: 99999999,
        });

        cy.findByLabelText("toast-root-container").should(
          "have.css",
          "z-index",
          "99999999"
        );
      });
    });
  });
  context("variants", () => {
    const variants: ToastVariant[] = [
      "primary",
      "success",
      "danger",
      "warning",
      "neutral",
    ];

    variants.forEach((variant) => {
      context(variant, () => {
        beforeEach(() => {
          openToast({
            variant,
            content: `${variant} toast`,
          });
        });

        it("renders the alert", () => {
          cy.findByLabelText("toast").should("exist");
        });

        it("applies correct iconBackgroundColor", () => {
          cy.findAllByLabelText("toast-icon")
            .eq(0)
            .should(
              "have.css",
              "background-color",
              THEME[variant].iconBackgroundColor
            );
        });

        it("applies correct iconColor", () => {
          cy.get("svg").should("have.css", "color", THEME[variant].iconColor);
        });
      });
    });
  });

  context("withLoadingBar", () => {
    it("applies correct progressColor", () => {
      openToast({
        variant: "success",
        content: "Bar colour",
        disappearAfterMs: 3000,
        withLoadingBar: true,
      });
      cy.findByLabelText("progressbar-fill").should(
        "have.css",
        "background-color",
        THEME.success.progressColor
      );
    });

    context("when given true", () => {
      it("renders progress bar by default", () => {
        openToast({
          variant: "primary",
          content: "Bar",
          disappearAfterMs: 3000,
          withLoadingBar: true,
        });
        cy.findByLabelText("progressbar-fill")
          .should("have.css", "position", "absolute")
          .and("have.css", "bottom", "0px")
          .and("have.css", "height", "6px");
      });
    });

    context("when given false", () => {
      it("does not render progress bar", () => {
        openToast({
          variant: "primary",
          content: "No bar",
          disappearAfterMs: 3000,
          withLoadingBar: false,
        });
        cy.findByLabelText("toast-progress-bar").should("not.exist");
      });
    });
  });

  context("styles", () => {
    context("contentStyle", () => {
      context("when given color red", () => {
        it("renders the content with red color", () => {
          openToast({
            variant: "primary",
            content: "Red text",
            disappearAfterMs: 0,
            styles: { contentStyle: { color: "rgb(255, 0, 0)" } },
          });
          cy.findByLabelText("toast-content").should(
            "have.css",
            "color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("containerStyle", () => {
      context("when given backgroundColor rgb(30, 30, 30)", () => {
        it("renders background with rgb(30, 30, 30)", () => {
          openToast({
            variant: "neutral",
            content: "Dark bg",
            disappearAfterMs: 0,
            styles: { containerStyle: { backgroundColor: "rgb(30, 30, 30)" } },
          });
          cy.findByLabelText("toast-wrapper").should(
            "have.css",
            "background-color",
            "rgb(30, 30, 30)"
          );
        });
      });
    });

    context("titleStyle", () => {
      context("when given 20px", () => {
        it("renders text with 20px", () => {
          openToast({
            variant: "primary",
            title: "Big Title",
            content: "Body",
            disappearAfterMs: 0,
            styles: { titleStyle: { fontSize: "20px" } },
          });
          cy.findByLabelText("toast-title").should(
            "have.css",
            "font-size",
            "20px"
          );
        });
      });
    });

    context("iconStyle", () => {
      context("when given border radius 50%", () => {
        it("renders border radius 50%", () => {
          openToast({
            variant: "success",
            content: "Round icon",
            disappearAfterMs: 0,
            styles: { iconStyle: { borderRadius: "50%" } },
          });
          cy.findByLabelText("toast-icon").should(
            "have.css",
            "border-radius",
            "50%"
          );
        });
      });
    });

    context("actionWrapperStyle", () => {
      context("when given gap 20px", () => {
        it("should render gap with 20px", () => {
          openToast({
            variant: "primary",
            content: "With action",
            disappearAfterMs: 0,
            actions: [{ caption: "OK" }],
            styles: { actionWrapperStyle: { gap: "20px" } },
          });
          cy.findByLabelText("toast-actions-wrapper").should(
            "have.css",
            "gap",
            "20px"
          );
        });
      });
    });
  });

  context("iconPosition", () => {
    const cases: {
      position: ToastIconPosition;
      flexDirection: string;
      alignItems: string;
    }[] = [
      { position: "left-top", flexDirection: "row", alignItems: "flex-start" },
      { position: "left-center", flexDirection: "row", alignItems: "center" },
      {
        position: "right-top",
        flexDirection: "row-reverse",
        alignItems: "flex-start",
      },
      {
        position: "right-center",
        flexDirection: "row-reverse",
        alignItems: "center",
      },
      {
        position: "center-center",
        flexDirection: "column",
        alignItems: "center",
      },
    ];

    cases.forEach(({ position, flexDirection, alignItems }) => {
      context(`when given "${position}"`, () => {
        beforeEach(() => {
          openToast({
            variant: "primary",
            content: "Icon position test",
            disappearAfterMs: 0,
            icon: { position },
          });
        });

        it(`sets flex-direction to "${flexDirection}"`, () => {
          cy.findByLabelText("toast-inner").should(
            "have.css",
            "flex-direction",
            flexDirection
          );
        });

        it(`sets align-items to "${alignItems}"`, () => {
          cy.findByLabelText("toast-inner").should(
            "have.css",
            "align-items",
            alignItems
          );
        });

        if (position === "center-center") {
          it("sets text-align to center", () => {
            cy.findByLabelText("toast-inner").should(
              "have.css",
              "text-align",
              "center"
            );
          });
        }
      });
    });
  });

  context("position (screen placement)", () => {
    const positions: {
      position: ToastPosition;
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
      flexDirection?: string;
    }[] = [
      { position: "top-left", top: "16px", left: "16px" },
      { position: "top-center", top: "16px", left: "250px" },
      { position: "top-right", top: "16px", right: "16px" },
      {
        position: "bottom-left",
        bottom: "16px",
        left: "16px",
        flexDirection: "column-reverse",
      },
      {
        position: "bottom-center",
        bottom: "16px",
        left: "250px",
        flexDirection: "column-reverse",
      },
      {
        position: "bottom-right",
        bottom: "16px",
        right: "16px",
        flexDirection: "column-reverse",
      },
      { position: "center-center", top: "250px", left: "250px" },
    ];

    positions.forEach(
      ({ position, top, bottom, left, right, flexDirection }) => {
        it(`places the container correctly at "${position}"`, () => {
          openToast({
            variant: "neutral",
            content: position,
            disappearAfterMs: 0,
            position,
          });

          cy.document().then((doc) => {
            const portal = doc.querySelector(`[toast-portal="${position}"]`);
            expect(portal).to.exist;

            const container = portal!.querySelector<HTMLElement>("div");
            expect(container).to.exist;

            const style = window.getComputedStyle(container!);

            if (top) expect(style.top).to.equal(top);
            if (bottom) expect(style.bottom).to.equal(bottom);
            if (left) expect(style.left).to.equal(left);
            if (right) expect(style.right).to.equal(right);
            if (flexDirection)
              expect(style.flexDirection).to.equal(flexDirection);
          });
        });
      }
    );
  });

  context("title", () => {
    context("when given text", () => {
      it("renders the title text", () => {
        openToast({
          variant: "primary",
          title: "My Title",
          content: "Body text",
          disappearAfterMs: 0,
        });

        cy.findByLabelText("toast-title").should("have.text", "My Title");
      });
    });

    context("when omitted", () => {
      it("does not render a title element", () => {
        openToast({
          variant: "primary",
          content: "No title here",
          disappearAfterMs: 0,
        });

        cy.findByLabelText("toast-title").should("not.exist");
      });
    });
  });

  context("content", () => {
    context("when given a string", () => {
      it("renders the content text", () => {
        openToast({
          variant: "success",
          content: "Hello world",
          disappearAfterMs: 0,
        });

        cy.findByLabelText("toast-content").should("have.text", "Hello world");
      });
    });

    context("when given a ReactNode", () => {
      it("renders with customize element", () => {
        openToast({
          variant: "neutral",
          content: <span data-testid="rich-content">Rich</span>,
          disappearAfterMs: 0,
        });

        cy.get("[data-testid='rich-content']")
          .should("exist")
          .and("have.text", "Rich");
      });
    });
  });

  context("closable", () => {
    it("shows a close button on hover", () => {
      openToast({
        variant: "neutral",
        content: "Hover me",
        disappearAfterMs: 0,
      });

      cy.findByLabelText("toast").realHover();

      cy.findByLabelText("toast-close").should("exist");
    });

    context("when given false", () => {
      it("does not render a close button", () => {
        openToast({
          variant: "neutral",
          content: "No close",
          disappearAfterMs: 0,
          closable: false,
        });

        cy.findByLabelText("toast-close").should("not.exist");
      });
    });

    context("when clicking the close button", () => {
      it("removes the toast", () => {
        cy.wait(400);

        openToast({
          variant: "neutral",
          content: "Close me",
          disappearAfterMs: 0,
        });

        cy.wait(400);

        cy.findByLabelText("toast").realHover();

        cy.findByLabelText("toast-close").click();

        cy.findByLabelText("toast").should("not.exist");
      });
    });
  });

  context("disappearAfterMs", () => {
    it("auto-dismisses after the given duration", () => {
      openToast({
        variant: "success",
        content: "Bye soon",
        disappearAfterMs: 800,
      });
      cy.findByLabelText("toast").should("exist");
      cy.wait(1200);
      cy.findByLabelText("toast").should("not.exist");
    });

    context("when given 0", () => {
      it("stays visible", () => {
        openToast({
          variant: "success",
          content: "Persistent",
          disappearAfterMs: 0,
        });
        cy.wait(600);
        cy.findByLabelText("toast").should("exist");
      });
    });
  });

  context("actions", () => {
    it("renders action button labels", () => {
      openToast({
        variant: "primary",
        content: "Pick one",
        disappearAfterMs: 0,
        actions: [{ caption: "Confirm" }, { caption: "Cancel" }],
      });
      cy.findByLabelText("toast-actions-wrapper")
        .contains("Confirm")
        .should("exist");
      cy.findByLabelText("toast-actions-wrapper")
        .contains("Cancel")
        .should("exist");
    });

    context("when clicking", () => {
      it("calls onClick", () => {
        const stub = cy.stub().as("actionStub");
        openToast({
          variant: "primary",
          content: "Click",
          disappearAfterMs: 0,
          actions: [{ caption: "Go", onClick: stub }],
        });
        cy.findByLabelText("toast-actions-wrapper").contains("Go").click();
        cy.get("@actionStub").should("have.been.calledOnce");
      });
    });

    context("when given disabled", () => {
      it("renders disabled action button", () => {
        openToast({
          variant: "danger",
          content: "Disabled",
          disappearAfterMs: 0,
          actions: [{ caption: "Nope", disabled: true }],
        });

        cy.findByLabelText("toast-actions-wrapper")
          .contains("Nope")
          .should("be.disabled");
      });
    });

    context("when given multiple actions", () => {
      it("renders with multiple actions", () => {
        openToast({
          variant: "warning",
          content: "Multi",
          disappearAfterMs: 0,
          actions: [{ caption: "A" }, { caption: "B" }, { caption: "C" }],
        });
        cy.findByLabelText("toast-actions-wrapper")
          .find("button")
          .should("have.length", 3);
      });
    });
  });

  context("icon", () => {
    context("when given react node in render", () => {
      it("renders a custom element", () => {
        openToast({
          variant: "primary",
          content: "Custom icon",
          disappearAfterMs: 0,
          icon: { render: <span data-testid="custom-icon">★</span> },
        });
        cy.get("[data-testid='custom-icon']")
          .should("exist")
          .and("have.text", "★");
        cy.findByLabelText("toast-icon").find("svg").should("not.exist");
      });
    });

    context("when not given", () => {
      it("renders default SVG", () => {
        openToast({
          variant: "warning",
          content: "Default icon",
          disappearAfterMs: 0,
        });
        cy.findByLabelText("toast-icon").find("svg").should("exist");
      });
    });
  });

  context("detailSlot", () => {
    context("when given", () => {
      it("renders a Show more button", () => {
        openToast({
          variant: "neutral",
          content: "Has details",
          disappearAfterMs: 0,
          detailSlot: <p>Extra info</p>,
        });

        cy.findByLabelText("toast-show-more-button")
          .should("exist")
          .and("contain.text", "Show more");
      });
    });

    context("when not given", () => {
      it("does not render a Show more button", () => {
        openToast({
          variant: "neutral",
          content: "No details",
          disappearAfterMs: 0,
        });

        cy.findByLabelText("toast-show-more-button").should("not.exist");
      });
    });

    context("when clicking Show more", () => {
      beforeEach(() => {
        openToast({
          variant: "neutral",
          content: "Has details",
          disappearAfterMs: 0,
          detailSlot: <p data-testid="detail-content">Extra info</p>,
        });

        cy.findByLabelText("toast-show-more-button").click();
      });

      it("expands the detail slot", () => {
        cy.get("[data-testid='detail-content']").should("be.visible");
      });

      it("changes the button label to Show less", () => {
        cy.findByLabelText("toast-show-more-button").should(
          "contain.text",
          "Show less"
        );
      });

      it("rotates the arrow icon", () => {
        cy.findByLabelText("toast-show-more-arrow")
          .should("have.css", "transform")
          .and("not.equal", "none");
      });
    });

    context("when clicking Show less", () => {
      beforeEach(() => {
        openToast({
          variant: "neutral",
          content: "Has details",
          disappearAfterMs: 0,
          detailSlot: <p data-testid="detail-content">Extra info</p>,
        });

        cy.findByLabelText("toast-show-more-button").click();
        cy.findByLabelText("toast-show-more-button").click();
      });

      it("changes the button label back to Show more", () => {
        cy.findByLabelText("toast-show-more-button").should(
          "contain.text",
          "Show more"
        );
      });
    });
  });

  context("width", () => {
    it("defaults to 360px", () => {
      openToast({
        variant: "primary",
        content: "Default width",
        disappearAfterMs: 0,
      });

      cy.findByLabelText("toast").should("have.css", "width", "360px");
    });

    context("when given a number", () => {
      it("applies the provided width", () => {
        cy.viewport(500, 500);

        openToast({
          variant: "primary",
          content: "Custom width",
          disappearAfterMs: 0,
          width: 400,
        });

        cy.findByLabelText("toast").should("have.css", "width", "400px");
      });
    });

    context("when given a string", () => {
      it("applies the provided width value", () => {
        openToast({
          variant: "primary",
          content: "String width",
          disappearAfterMs: 0,
          width: "100%",
        });

        cy.findByLabelText("toast")
          .invoke("css", "width")
          .should("not.equal", "360px");
      });
    });
  });

  context("maxWidth", () => {
    context("when given a number", () => {
      it("applies the provided maxWidth", () => {
        openToast({
          variant: "primary",
          content: "MaxWidth",
          disappearAfterMs: 0,
          maxWidth: 200,
        });

        cy.findByLabelText("toast").should("have.css", "max-width", "200px");
      });
    });
  });

  context("multiple toasts and imperative API", () => {
    context("when open by one button", () => {
      it("stacks multiple toasts", () => {
        cy.mount(
          <Button
            onClick={() => {
              Toast.success({ content: "Second", disappearAfterMs: 0 });
              Toast.danger({ content: "Third", disappearAfterMs: 0 });
            }}
          >
            Double
          </Button>
        );
        cy.wait(400);
        cy.contains("Double").click();

        cy.findAllByLabelText("toast").should("have.length", 2);
      });
    });

    context("Toast.closeAll()", () => {
      context("when clicking the button", () => {
        it("removes every visible toast", () => {
          cy.mount(
            <>
              <Button
                onClick={() => {
                  Toast.primary({ content: "One", disappearAfterMs: 0 });
                  Toast.success({ content: "Two", disappearAfterMs: 0 });
                  Toast.danger({ content: "Three", disappearAfterMs: 0 });
                }}
              >
                Open All
              </Button>
              <Button
                onClick={() => {
                  Toast.closeAll();
                }}
              >
                Close All
              </Button>
            </>
          );
          cy.wait(400);
          cy.contains("Open All").click();
          cy.findAllByLabelText("toast").should("have.length", 3);
          cy.contains("Close All").click();
          cy.findByLabelText("toast").should("not.exist");
        });
      });
    });

    context("Toast.close(id)", () => {
      context("when clicking the button", () => {
        it("removes only the targeted toast", () => {
          cy.mount(
            <>
              <Button
                onClick={() => {
                  Toast.primary({
                    id: "Test",
                    content: "Target",
                    disappearAfterMs: 0,
                  });
                  Toast.success({ content: "Keep me", disappearAfterMs: 0 });
                }}
              >
                Open
              </Button>
              <Button
                onClick={() => {
                  Toast.close("Test");
                }}
              >
                Close
              </Button>
            </>
          );
          cy.wait(400);

          cy.contains("Open").click();
          cy.findAllByLabelText("toast").should("have.length", 2);

          cy.contains("Close").click();
          cy.findAllByLabelText("toast").should("have.length", 1);
          cy.findByLabelText("toast-content").should("have.text", "Keep me");
        });
      });
    });
  });
});
