import { css } from "styled-components";
import { Window } from "./../../components/window";

describe("Window", () => {
  context("initialSizes", () => {
    it("renders with initial size", () => {
      cy.mount(
        <Window
          orientation="horizontal"
          style={css`
            height: 500px;
          `}
          initialSizes={[90, 10]}
        >
          <Window.Cell
            style={css`
              background-color: #fee2e2;
            `}
          >
            Up
          </Window.Cell>
          <Window.Cell
            style={css`
              background-color: #dcfce7;
            `}
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
  });
});
