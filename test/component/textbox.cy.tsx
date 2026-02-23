import {
  RiDeleteBinLine,
  RiHome2Line,
  RiLogoutBoxLine,
  RiSendPlaneFill,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";
import { Textbox } from "./../../components/textbox";
import { Button } from "./../../components/button";

describe("Textbox", () => {
  context("with actions", () => {
    const ACTIONS_OPTION = [
      {
        icon: { image: RiSendPlaneFill },
        onClick: () => console.log("send the message"),
      },
      {
        icon: { image: RiDeleteBinLine },
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
          .parent()
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

      it("should focus on the textbox", () => {
        cy.mount(
          <Textbox value="" actions={ACTIONS_OPTION} placeholder="type here" />
        );
        cy.findByPlaceholderText("type here").should("not.be.focused");
        cy.findByPlaceholderText("type here").click().should("be.focused");
        ACTIONS_OPTION.map((_, index) => {
          cy.findAllByLabelText("action-icon").eq(index).click();
          cy.findByPlaceholderText("type here").should("be.focused");
        });
      });
    });

    context("with type password", () => {
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
            .parent()
            .should("have.css", "right", `${offset}px`);
        });
      });

      context("when having error", () => {
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
              .parent()
              .should("have.css", "right", `${offset}px`);
          });
        });
      });
    });
  });

  context("with dropdowns", () => {
    it("renders initialize drawer with min-width 200px", () => {
      cy.mount(
        <Textbox
          dropdowns={[
            {
              caption: "Button",
              options: [
                {
                  text: "On-site",
                  value: "1",
                  icon: { image: RiHome2Line },
                },
                {
                  text: "WFH",
                  value: "2",
                  icon: { image: RiUser2Line },
                },
                {
                  text: "Sick leave",
                  value: "3",
                  icon: { image: RiSettings2Line },
                },
                {
                  text: "Annual leave",
                  value: "4",
                  icon: { image: RiLogoutBoxLine },
                },
              ],
            },
          ]}
        />
      );

      cy.findByText("Button").click();

      cy.findByLabelText("button-tip-menu-container").should(
        "have.css",
        "width",
        "200px"
      );
    });

    context("width", () => {
      context("when given", () => {
        it("should render the width", () => {
          cy.mount(
            <Textbox
              dropdowns={[
                {
                  caption: "Width",
                  width: "100px",
                  render: ({ render }) =>
                    render(
                      <Button.TipMenuContainer>
                        Buttton with Width
                      </Button.TipMenuContainer>
                    ),
                },
              ]}
            />
          );

          cy.findByText("Width")
            .then(($el) => {
              const width = $el.css("width");

              expect(parseFloat(width)).to.be.closeTo(100, 1);
            })
            .should("have.css", "align-items", "center")
            .and("have.css", "justify-content", "center");
        });
      });
    });

    context("when given multiple", () => {
      it("renders more than one dropdown", () => {
        cy.mount(
          <Textbox
            dropdowns={[
              {
                caption: "Dropdown 1",
                width: "100px",
                render: ({ render }) =>
                  render(
                    <Button.TipMenuContainer>
                      Drawer on Dropdown 1
                    </Button.TipMenuContainer>
                  ),
              },
              {
                caption: "Dropdown 2",
                width: "100px",
                render: ({ render }) =>
                  render(
                    <Button.TipMenuContainer>
                      Drawer on Dropdown 2
                    </Button.TipMenuContainer>
                  ),
              },
            ]}
          />
        );

        cy.findByText("Drawer on Dropdown 1").should("not.exist");
        cy.findByText("Dropdown 1").click();
        cy.findByText("Drawer on Dropdown 1").should("exist");

        cy.findByText("Drawer on Dropdown 2").should("not.exist");
        cy.findByText("Dropdown 2").click();
        cy.findByText("Drawer on Dropdown 2").should("exist");
      });
    });
  });
});
