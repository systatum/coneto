import { getIdContent } from "test/support/commands";

describe("Button", () => {
  context("CustomSizing", () => {
    it("should click and have correct styles", () => {
      cy.visit(getIdContent("controls-button--custom-sizing"));

      cy.findAllByRole("button")
        .eq(0)
        .should("have.css", "height", "40px")
        .and("have.css", "padding-left", "24px")
        .and("have.css", "padding-right", "24px");

      cy.findAllByRole("button")
        .eq(1)
        .should("have.css", "height", "36px")
        .and("have.css", "padding-left", "16px")
        .and("have.css", "padding-right", "16px")
        .and("have.css", "background-color", "rgb(243, 243, 243)")
        .and("have.css", "color", "rgb(0, 0, 0)");

      cy.findAllByRole("button")
        .eq(2)
        .should("have.css", "height", "32px")
        .and("have.css", "padding-left", "12px")
        .and("have.css", "padding-right", "12px")
        .and("have.css", "background-color", "rgb(243, 243, 243)")
        .and("have.css", "color", "rgb(0, 0, 0)");

      cy.findAllByRole("button")
        .eq(3)
        .should("have.css", "height", "36px")
        .and("have.css", "width", "36px")
        .and("have.css", "padding-left", "0px")
        .and("have.css", "padding-right", "0px");
    });
  });

  context("All Button Variants", () => {
    it("should render each button with correct styles", () => {
      const VARIANT_STYLES: Record<
        string,
        { bg: string; color: string; border?: string; hoverBg?: string }
      > = {
        link: { bg: "rgba(0, 0, 0, 0)", color: "rgb(64, 142, 232)" },
        "outline-default": {
          bg: "rgb(255, 255, 255)",
          color: "rgb(155, 155, 155)",
          border: "rgb(155, 155, 155)",
          hoverBg: "rgb(240, 240, 240)",
        },

        "outline-primary": {
          bg: "rgb(255, 255, 255)",
          color: "rgb(86, 154, 236)",
          border: "rgb(86, 154, 236)",
          hoverBg: "rgb(86, 154, 236)",
        },
        "outline-danger": {
          bg: "rgb(255, 255, 255)",
          color: "rgb(206, 55, 93)",
          border: "rgb(206, 55, 93)",
          hoverBg: "rgb(206, 55, 93)",
        },
        "outline-success": {
          bg: "rgb(255, 255, 255)",
          color: "rgb(66, 163, 64)",
          border: "rgb(66, 163, 64)",
          hoverBg: "rgb(66, 163, 64)",
        },
        default: { bg: "rgb(243, 243, 243)", color: "rgb(0, 0, 0)" },
        primary: { bg: "rgb(86, 154, 236)", color: "rgb(255, 255, 255)" },
        danger: { bg: "rgb(206, 55, 93)", color: "rgb(255, 255, 255)" },
        secondary: { bg: "rgb(221, 221, 221)", color: "rgb(17, 17, 17)" },
        ghost: { bg: "rgba(0, 0, 0, 0)", color: "rgb(17, 17, 17)" },
        transparent: { bg: "rgba(0, 0, 0, 0)", color: "rgb(0, 0, 0)" },
        success: { bg: "rgb(66, 163, 64)", color: "rgb(255, 255, 255)" },
      };

      cy.visit(getIdContent("controls-button--all-variants"));

      Object.entries(VARIANT_STYLES).forEach(([variant, style]) => {
        const exactRegex = new RegExp(`^${variant}$`, "i");
        cy.findAllByRole("button", { name: exactRegex }).then((button) => {
          const $btn = button[0] as HTMLElement;
          const computedStyle = getComputedStyle($btn);

          expect(computedStyle.backgroundColor).to.eq(style.bg);

          expect(computedStyle.color).to.eq(style.color);

          if (style.border) {
            expect(computedStyle.borderColor).to.eq(style.border);
          }
        });
      });
    });
  });

  context("With Loading", () => {
    it("should be disabled and have correct styles", () => {
      cy.visit(getIdContent("controls-button--with-loading"));

      cy.findByRole("button", { name: /Button/i }).should(
        "have.attr",
        "disabled"
      );
      cy.findByRole("button", { name: /Button/i }).should(
        "have.css",
        "cursor",
        "not-allowed"
      );

      cy.findByRole("button", { name: /Button/i })
        .should("have.css", "background-color", "rgb(243, 243, 243)")
        .and("have.css", "opacity", "0.6")
        .and("have.css", "pointer-events", "none");
    });
  });
});
