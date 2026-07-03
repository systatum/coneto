import {
  RiCalendar2Fill,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiFileList3Line,
  RiGitBranchLine,
  RiInboxArchiveLine,
  RiUserAddLine,
} from "@remixicon/react";
import {
  Separator,
  SeparatorAction,
  SeparatorActionSubMenuList,
  SeparatorProps,
} from "./../../components/separator";
import { Calendar } from "./../../components/calendar";
import { css } from "styled-components";

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

  context("subMenu", () => {
    beforeEach(() => {
      const onDuplicate = cy.stub().as("onDuplicate");
      const onArchive = cy.stub().as("onArchive");
      const onDelete = cy.stub().as("onDelete");

      const TIP_MENU_PROJECT: SeparatorActionSubMenuList[] = [
        {
          caption: "Duplicate Project",
          icon: {
            image: RiFileCopyLine,
          },
          onClick: () => onDuplicate(),
        },
        {
          caption: "Archive Project",
          icon: {
            image: RiInboxArchiveLine,
          },
          onClick: () => onArchive(),
        },
        {
          caption: "Delete Project",
          icon: {
            image: RiDeleteBinLine,
          },
          variant: "danger",
          onClick: () => onDelete(),
        },
      ];

      const ACTIONS: SeparatorAction[] = [
        {
          icon: { image: RiUserAddLine },
          subMenu: ({ list }) => list(TIP_MENU_PROJECT),
        },
        {
          icon: { image: RiGitBranchLine },
          subMenu: ({ show }) =>
            show(
              <>
                <span>
                  <strong>Branch:</strong>{" "}
                  mobile/introduces-the-antrikan-mobile-app-design
                </span>
                <span>Last updated 2 hours ago.</span>
              </>,
              {
                drawerStyle: css`
                  padding: 10px;
                  display: flex;
                  flex-direction: column;
                `,
              }
            ),
        },
        {
          icon: { image: RiCalendar2Fill },
          subMenu: ({ render }) => render(<Calendar />),
        },
      ];

      cy.mount(<ProductSeparator actions={ACTIONS} />);
    });

    context("when given list()", () => {
      it("shows the tip menu", () => {
        cy.findAllByLabelText("separator-action").eq(0).realHover();
        cy.findByLabelText("tip-menu").should("exist");
      });

      context("when clicking the tip menu item", () => {
        it("should render the console", () => {
          cy.findAllByLabelText("separator-action").eq(0).realHover();
          cy.findByLabelText("tip-menu").should("exist");
          cy.findByText("Duplicate Project").click();
          cy.get("@onDuplicate").should("have.been.calledOnce");
        });
      });
    });

    context("with given show()", () => {
      context("with clicking the button", () => {
        it("should renders the show with tooltip container", () => {
          cy.findAllByLabelText("separator-action").eq(1).realHover();
          cy.findByLabelText("tooltip-drawer").should("exist");
          cy.findByText("Branch:").should("exist");
          cy.findByText(
            "mobile/introduces-the-antrikan-mobile-app-design"
          ).should("exist");
        });
      });
    });

    context("with given render()", () => {
      context("with given Calendar component", () => {
        it("should the customize rendering", () => {
          cy.findAllByLabelText("separator-action").eq(2).realHover();
          cy.get(".coneto-calendar").should("exist");
        });
      });
    });
  });

  context("actions", () => {
    beforeEach(() => {
      cy.mount(<ProductSeparator />);
    });

    context("with alwaysShows", () => {
      context("with true", () => {
        it("should shows the actions", () => {
          cy.findAllByLabelText("separator-action")
            .should("exist")
            .and("have.length", 3);
        });
      });

      context("with false", () => {
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
