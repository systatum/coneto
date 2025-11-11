import { RiDeleteBinLine, RiSendPlaneFill } from "@remixicon/react";
import { Textbox } from "./../../components/textbox";

describe("Textbox", () => {
  context("with actions", () => {
    const ACTIONS_OPTION = [
      {
        icon: RiSendPlaneFill,
        onClick: () => console.log("send the message"),
      },
      {
        icon: RiDeleteBinLine,
        onClick: () => console.log("delete the message"),
      },
    ].filter(Boolean);
    it("should render the actions button", () => {
      cy.mount(<Textbox value="" actions={ACTIONS_OPTION} />);

      ACTIONS_OPTION.map((_, index) => {
        const offsetBase = 8;
        const offsetEach = 22;
        const reverseIndex = ACTIONS_OPTION.length - 1 - index;
        const offset = offsetBase + reverseIndex * offsetEach;

        cy.findAllByLabelText("action-icon")
          .eq(index)
          .should("have.css", "right", `${offset}px`);
      });
    });

    context("when clicking", () => {
      it("should render the console", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });
        cy.mount(<Textbox value="" actions={ACTIONS_OPTION} />);

        ACTIONS_OPTION.map((_, index) => {
          cy.findAllByLabelText("action-icon").eq(index).click();
        });

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "send the message"
        );
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "delete the message"
        );
      });
    });

    context("with type password", () => {
      const ACTIONS_OPTION = [
        {
          icon: RiSendPlaneFill,
          onClick: () => console.log("send the message"),
        },
        {
          icon: RiDeleteBinLine,
          onClick: () => console.log("delete the message"),
        },
      ].filter(Boolean);
      it("should render the actions & show password button", () => {
        cy.mount(<Textbox value="" type="password" actions={ACTIONS_OPTION} />);

        ACTIONS_OPTION.map((_, index) => {
          const offsetBase = 8;
          const offsetEach = 22;
          const password = offsetEach;
          const reverseIndex = ACTIONS_OPTION.length - 1 - index;
          const offset = offsetBase + reverseIndex * offsetEach + password;

          cy.findAllByLabelText("action-icon")
            .eq(index)
            .should("have.css", "right", `${offset}px`);
        });
      });

      context("when having error", () => {
        const ACTIONS_OPTION = [
          {
            icon: RiSendPlaneFill,
            onClick: () => console.log("send the message"),
          },
          {
            icon: RiDeleteBinLine,
            onClick: () => console.log("delete the message"),
          },
        ].filter(Boolean);

        it("should render the actions, error, and password button", () => {
          cy.mount(
            <Textbox
              value=""
              type="password"
              showError
              actions={ACTIONS_OPTION}
            />
          );

          ACTIONS_OPTION.map((_, index) => {
            const offsetBase = 8;
            const offsetEach = 22;
            const password = offsetEach;
            const showError = offsetEach;
            const reverseIndex = ACTIONS_OPTION.length - 1 - index;

            const offset =
              offsetBase + reverseIndex * offsetEach + password + showError;

            cy.findAllByLabelText("action-icon")
              .eq(index)
              .should("have.css", "right", `${offset}px`);
          });
        });
      });
    });
  });
});
