import { getIdContent } from "test/support/commands";

describe("Button", () => {
  context("CustomSizing", () => {
    it("should render all button sizes with correct styles", () => {
      cy.visit(getIdContent("controls-button--custom-sizing"));

      const sizes = [
        { height: "28px", paddingLeft: "6px", paddingRight: "6px" },
        { height: "32px", paddingLeft: "12px", paddingRight: "12px" },
        { height: "36px", paddingLeft: "16px", paddingRight: "16px" },
        { height: "40px", paddingLeft: "24px", paddingRight: "24px" },
        {
          width: "36px",
          height: "36px",
          paddingLeft: "0px",
          paddingRight: "0px",
        },
      ];

      cy.findAllByRole("button").each(($btn, index) => {
        const size = sizes[index];

        if (size.width) {
          cy.wrap($btn).should("have.css", "width", size.width);
        }

        cy.wrap($btn)
          .should("have.css", "height", size.height)
          .and("have.css", "padding-left", size.paddingLeft)
          .and("have.css", "padding-right", size.paddingRight);
      });
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
        default: { bg: "rgb(236, 236, 236)", color: "rgb(0, 0, 0)" },
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
        .should("have.css", "background-color", "rgb(236, 236, 236)")
        .and("have.css", "opacity", "0.6")
        .and("have.css", "pointer-events", "none");
    });
  });
});
