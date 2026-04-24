import {
  RiFileList3Line,
  RiGitBranchLine,
  RiUserAddLine,
} from "@remixicon/react";
import {
  Separator,
  SeparatorAction,
  SeparatorProps,
} from "./../../components/separator";

describe("Separator", () => {
  const ACTIONS: SeparatorAction[] = [
    {
      icon: { image: RiUserAddLine },
      caption: "Invite",
      onClick: () => console.log("this is invite"),
    },
    {
      icon: { image: RiGitBranchLine },
      caption: "Branch",
      onClick: () => console.log("this is branch"),
    },
    {
      icon: { image: RiFileList3Line },
      caption: "Specs",
      onClick: () => console.log("this is specs"),
    },
  ];
  function ProductSeparator(props: SeparatorProps) {
    return (
      <Separator actions={ACTIONS} title="Antrikan App Redesign" {...props} />
    );
  }
  context("actions", () => {
    beforeEach(() => {
      cy.mount(<ProductSeparator />);
    });

    context("with alwaysShows", () => {
      context("when given true", () => {
        it("should shows the actions", () => {
          cy.findAllByLabelText("separator-action")
            .should("exist")
            .and("have.length", 3);
        });
      });

      context("when given false", () => {
        beforeEach(() => {
          cy.mount(
            <ProductSeparator
              actions={[
                {
                  icon: { image: RiUserAddLine },
                  caption: "Invite",
                  onClick: () => console.log("this is invite"),
                  alwaysShow: false,
                },
              ]}
            />
          );
        });
        it("should not shows the actions", () => {
          cy.findAllByLabelText("separator-action")
            .should("not.be.visible")
            .and("have.length", 1);
        });

        context("when hovering the separator", () => {
          it("should shows the actions", () => {
            cy.findAllByLabelText("separator-action")
              .should("not.be.visible")
              .and("have.length", 1);

            cy.findByLabelText("separator-container").realHover().wait(100);
            cy.findAllByLabelText("separator-action")
              .should("be.visible")
              .and("have.length", 1);
          });
        });
      });
    });

    context("when given", () => {
      it("should shows the actions", () => {
        cy.findAllByLabelText("separator-action")
          .should("exist")
          .and("have.length", 3);
      });
    });

    context("when clicking", () => {
      it("should shows the console log", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<ProductSeparator />);

        cy.findAllByLabelText("separator-action").should("exist").eq(0).click();

        cy.get("@consoleLog").should("have.been.calledWith", "this is invite");
      });
    });

    context("when hovering", () => {
      it("should shows the caption", () => {
        cy.findByText(ACTIONS[0].caption).should("not.exist");
        cy.findAllByLabelText("separator-action")
          .should("exist")
          .eq(0)
          .realHover()
          .wait(100);
        cy.findByText("Invite").should("exist");
      });
    });
  });
});
