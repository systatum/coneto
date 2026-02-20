import { Grid } from "../../components/grid";

describe("Grid", () => {
  function GridDefault() {
    return (
      <Grid
        onMouseEnter={() => console.log("now is hovering grid")}
        onMouseLeave={() => console.log("now is leaving grid")}
        onClick={() => console.log("now is clicking grid")}
      >
        Test`
      </Grid>
    );
  }

  context("onMouseEnter", () => {
    context("when hovering", () => {
      it("should give callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<GridDefault />);
        cy.findByLabelText("grid").trigger("mouseover");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is hovering grid"
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

        cy.mount(<GridDefault />);
        cy.findByLabelText("grid").trigger("mouseover").trigger("mouseout");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is hovering grid"
        );
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is leaving grid"
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

        cy.mount(<GridDefault />);
        cy.findByLabelText("grid").click();

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is clicking grid"
        );
      });
    });
  });

  context("Grid.Card", () => {
    function GridCardDefault() {
      return (
        <Grid.Card
          onMouseEnter={() => console.log("now is hovering grid-card")}
          onMouseLeave={() => console.log("now is leaving grid-card")}
          onClick={() => console.log("now is clicking grid-card")}
        >
          Test`
        </Grid.Card>
      );
    }

    context("onMouseEnter", () => {
      context("when hovering", () => {
        it("should give callback", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<GridCardDefault />);
          cy.findByLabelText("grid-card").trigger("mouseover");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is hovering grid-card"
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

          cy.mount(<GridCardDefault />);
          cy.findByLabelText("grid-card")
            .trigger("mouseover")
            .trigger("mouseout");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is hovering grid-card"
          );
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is leaving grid-card"
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

          cy.mount(<GridCardDefault />);
          cy.findByLabelText("grid-card").click();

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is clicking grid-card"
          );
        });
      });
    });
  });
});
