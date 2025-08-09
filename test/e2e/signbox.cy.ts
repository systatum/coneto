import { getIdContent } from "test/support/commands";

context("Signbox Component", () => {
  describe("Default", () => {
    it("Renders the signbox and allows drawing a C letter", () => {
      cy.visit(getIdContent("input-elements-signbox--default"));

      cy.get("canvas").should("exist").and("be.visible");

      cy.get("canvas").then(($canvas) => {
        const canvas = $canvas[0] as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();

        cy.wrap($canvas)
          .trigger("mousedown", {
            clientX: rect.left + 150,
            clientY: rect.top + 50,
          })
          .trigger("mousemove", {
            clientX: rect.left + 100,
            clientY: rect.top + 50,
          })
          .trigger("mousemove", {
            clientX: rect.left + 75,
            clientY: rect.top + 60,
          })
          .trigger("mousemove", {
            clientX: rect.left + 60,
            clientY: rect.top + 80,
          })
          .trigger("mousemove", {
            clientX: rect.left + 50,
            clientY: rect.top + 120,
          })
          .trigger("mousemove", {
            clientX: rect.left + 60,
            clientY: rect.top + 160,
          })
          .trigger("mousemove", {
            clientX: rect.left + 75,
            clientY: rect.top + 180,
          })
          .trigger("mousemove", {
            clientX: rect.left + 100,
            clientY: rect.top + 190,
          })
          .trigger("mousemove", {
            clientX: rect.left + 150,
            clientY: rect.top + 190,
          })
          .trigger("mouseup");
      });

      cy.get("canvas").then(($canvas) => {
        const canvasEl = $canvas[0] as HTMLCanvasElement;
        const base64 = canvasEl.toDataURL("image/png");

        expect(base64).to.match(/^data:image\/png;base64,/);
      });
    });

    it("Cleared canvas using with clearable and expect canvas blank", () => {
      cy.visit(getIdContent("input-elements-signbox--default"));

      cy.get("canvas").should("exist").and("be.visible");

      cy.get("canvas").then(($canvas) => {
        const canvas = $canvas[0] as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();

        cy.wrap($canvas)
          .trigger("mousedown", {
            clientX: rect.left + 150,
            clientY: rect.top + 50,
          })
          .trigger("mousemove", {
            clientX: rect.left + 100,
            clientY: rect.top + 50,
          })
          .trigger("mousemove", {
            clientX: rect.left + 75,
            clientY: rect.top + 60,
          })
          .trigger("mousemove", {
            clientX: rect.left + 60,
            clientY: rect.top + 80,
          })
          .trigger("mousemove", {
            clientX: rect.left + 50,
            clientY: rect.top + 120,
          })
          .trigger("mousemove", {
            clientX: rect.left + 60,
            clientY: rect.top + 160,
          })
          .trigger("mousemove", {
            clientX: rect.left + 75,
            clientY: rect.top + 180,
          })
          .trigger("mousemove", {
            clientX: rect.left + 100,
            clientY: rect.top + 190,
          })
          .trigger("mousemove", {
            clientX: rect.left + 150,
            clientY: rect.top + 190,
          })
          .trigger("mouseup");
      });

      cy.get("canvas").then(($canvas) => {
        const canvasEl = $canvas[0] as HTMLCanvasElement;
        const base64 = canvasEl.toDataURL("image/png");

        expect(base64).to.match(/^data:image\/png;base64,/);
      });

      cy.findByLabelText("signbox-clearable").click();

      cy.get("canvas").then(($canvas) => {
        const canvasEl = $canvas[0] as HTMLCanvasElement;

        const blankCanvas = document.createElement("canvas");
        blankCanvas.width = canvasEl.width;
        blankCanvas.height = canvasEl.height;
        const expectedBlankBase64 = blankCanvas.toDataURL("image/png");

        const base64AfterClear = canvasEl.toDataURL("image/png");
        expect(base64AfterClear).to.eq(expectedBlankBase64);
      });
    });
  });

  describe("WithError", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-signbox--with-error"));
    });

    it("Shows error message when input is empty and remove it", () => {
      cy.findByText(/Signature is required/i).should("be.visible");

      cy.get("canvas").then(($canvas) => {
        const canvas = $canvas[0] as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();

        cy.wrap($canvas)
          .trigger("mousedown", {
            clientX: rect.left + 100,
            clientY: rect.top + 50,
          })
          .trigger("mousemove", {
            clientX: rect.left + 120,
            clientY: rect.top + 70,
          })
          .trigger("mouseup");
      });

      cy.findByText(/Signature is required/i).should("not.exist");
    });
  });
});
