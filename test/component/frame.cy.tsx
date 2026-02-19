import { Frame, FrameProps } from "./../../components/frame";

describe("Frame", () => {
  function FrameComponent() {
    return (
      <Frame
        onMouseEnter={() => console.log("now is hovering frame")}
        onMouseLeave={() => console.log("now is leaving frame")}
        onClick={() => console.log("now is clicking frame")}
      >
        Test
      </Frame>
    );
  }
  context("onMouseEnter", () => {
    context("when hovering", () => {
      it("should give callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<FrameComponent />);
        cy.findByLabelText("frame").trigger("mouseover");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is hovering frame"
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

        cy.mount(<FrameComponent />);
        cy.findByLabelText("frame").trigger("mouseover").trigger("mouseout");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is hovering frame"
        );
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is leaving frame"
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

        cy.mount(<FrameComponent />);
        cy.findByLabelText("frame").click();

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is clicking frame"
        );
      });
    });
  });
});
