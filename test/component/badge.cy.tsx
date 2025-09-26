import { RiCheckLine, RiCloseLine } from "@remixicon/react";
import { Badge, BadgeActionProps } from "./../../components/badge";
import { strToColor } from "./../../lib/code-color";

describe("Badge", () => {
  context("with actions", () => {
    const contentAction: BadgeActionProps[] = [
      {
        icon: RiCloseLine,
        onClick: () => {
          console.log("Data was deleted");
        },
        size: 14,
      },
    ];

    const contentActions: BadgeActionProps[] = [
      {
        icon: RiCheckLine,
        onClick: () => {
          console.log("Data was deleted");
        },
        size: 14,
      },
      {
        icon: RiCloseLine,
        onClick: () => {
          console.log("Data was deleted");
        },
        size: 14,
      },
    ];

    context("when given", () => {
      it("renders action button", () => {
        cy.mount(
          <Badge withCircle actions={contentAction} caption="With Actions" />
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.contains("With Action", { timeout: 10000 })
          .should("be.visible")
          .click();

        cy.findByLabelText("badge-action")
          .should("have.css", "width", "14px")
          .and("have.css", "height", "14px");
      });

      context("when click", () => {
        it("should catch data", () => {
          cy.mount(
            <Badge withCircle actions={contentAction} caption="With Actions" />
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.contains("With Action", { timeout: 10000 })
            .should("be.visible")
            .click();

          cy.contains("With Action").should("be.visible");
          cy.findByLabelText("badge-action").should("be.visible").click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "Data was deleted"
          );
        });
      });

      context("when greater than one", () => {
        it("renders actions button", () => {
          cy.mount(
            <Badge withCircle actions={contentActions} caption="With Actions" />
          );

          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.contains("With Action", { timeout: 10000 })
            .should("be.visible")
            .click();

          cy.findAllByLabelText("badge-action")
            .eq(0)
            .should("have.css", "margin-right", "2px");

          cy.findAllByLabelText("badge-action")
            .eq(1)
            .should("not.have.css", "margin-right", "2px");

          cy.findAllByLabelText("badge-action")
            .eq(0)
            .should("have.css", "width", "14px")
            .and("have.css", "height", "14px");
          cy.findAllByLabelText("badge-action")
            .eq(1)
            .should("have.css", "width", "14px")
            .and("have.css", "height", "14px");
        });
      });
    });
  });

  context("with circle", () => {
    context("when given", () => {
      it("render with color caption", () => {
        const caption = "With Actions";
        const expectedColor = strToColor(caption, BADGE_BACKGROUND_COLORS);
        cy.mount(<Badge caption={caption} withCircle />);

        cy.findByLabelText("badge-circle")
          .should("have.css", "width", "8px")
          .and("have.css", "height", "8px");

        cy.findByLabelText("badge-circle")
          .should("have.css", "background-color")
          .then((bgColor) => {
            const hexToRgb = (hex: string) => {
              const bigint = parseInt(hex.slice(1), 16);
              const r = (bigint >> 16) & 255;
              const g = (bigint >> 8) & 255;
              const b = bigint & 255;
              return `rgb(${r}, ${g}, ${b})`;
            };
            expect(bgColor).to.eq(hexToRgb(expectedColor));
          });
      });
    });
  });
});

const BADGE_BACKGROUND_COLORS: string[] = [
  "#FF0000",
  "#00cd00",
  "#1d1dd0",
  "#ce4118",
  "#FF00FF",
  "#60b1ac",
  "#800000",
  "#008000",
  "#9a6969",
  "#808000",
  "#800080",
  "#008080",
  "#FF8000",
  "#FF0080",
  "#444444",
  "#713609",
  "#8000FF",
  "#0080FF",
  "#FF8080",
  "#8080FF",
  "#FF80FF",
  "#80FFFF",
  "#e4e473",
  "#73738c",
  "#FF4080",
  "#48a467",
];
