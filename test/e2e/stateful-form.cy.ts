import { getIdContent } from "test/support/commands";

describe("StatefulForm", () => {
  context("when default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-statefulform--default"));
    });
    context("when typing ", () => {
      it("should render value", () => {
        cy.findAllByRole("button").eq(1).should("be.disabled");

        cy.findByText("First Name").click().type("Alim");
        cy.findByText("Last Name").click().type("Naufal");
        cy.findByText("Email").click().type("alim@systatum.com");
        cy.findByPlaceholderText("Enter phone number").type("08123456789");

        cy.findAllByRole("button").eq(0).click();
        cy.findByPlaceholderText("Search your country...").type("Indonesia");
        cy.findByText("Indonesia").click();
        cy.findByText("Note").click().type("This is additional");
        cy.findByRole("checkbox").click();

        cy.findAllByRole("button").eq(1).should("not.be.disabled");

        cy.findByLabelText("First Name").should("have.value", "Alim");
        cy.findByLabelText("Last Name").should("have.value", "Naufal");
        cy.findByLabelText("Email").should("have.value", "alim@systatum.com");
        cy.findByPlaceholderText("Enter phone number").should(
          "have.value",
          "812-345-6789"
        );
        cy.findByText("+62").should("exist");
        cy.findByLabelText("Note").should("have.value", "This is additional");
        cy.findByRole("checkbox").should("be.checked");
      });
    });
  });

  context("when all input", () => {
    beforeEach(() => {
      cy.visit(getIdContent("input-elements-statefulform--all-case"));
    });

    it("should fill all fields and assert their values", () => {
      cy.findAllByRole("button").eq(3).should("be.disabled");
      cy.findByLabelText("Text").type("Hello World");
      cy.findByLabelText("Email").type("alim@systatum.com");
      cy.findByLabelText("Number").type("12345");
      cy.findByLabelText("Password").type("secret123");
      cy.findByLabelText("Textarea").type("This is a test textarea");

      cy.findByLabelText("Check").check().should("be.checked");

      cy.findByLabelText("Color").invoke("val", "#ff0000").trigger("change");

      cy.findByPlaceholderText("Select a fruit...").as("combobox").type("ap");

      cy.findByRole("option", { name: "Apple" }).should("be.visible");
      cy.findByRole("option", { name: "Grape" }).should("be.visible");

      cy.get("@combobox").type("{downarrow}{enter}");
      cy.get("@combobox").should("have.value", "Grape");

      cy.get('[data-type="selectbox"]').eq(1).click();
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("JAN").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2024").click();
      cy.findByText("3").click();
      const expectedContent = "01/03/2024";

      cy.findByPlaceholderText("mm/dd/yyyy").as("datebox");
      cy.get("@datebox").should("have.value", expectedContent);

      cy.findByLabelText("filedropbox").selectFile(
        ["test/fixtures/test-images/sample-1.jpg"],
        {
          action: "drag-drop",
          force: true,
        }
      );
      cy.findByLabelText("fileinputbox").selectFile(
        ["test/fixtures/test-images/sample-1.jpg"],
        {
          action: "drag-drop",
          force: true,
        }
      );

      cy.contains("sample-1.jpg").should("exist");

      cy.findByLabelText("imagebox").selectFile(
        ["test/fixtures/test-images/sample-1.jpg"],
        {
          action: "drag-drop",
          force: true,
        }
      );

      cy.get("img").eq(0).should("exist");

      cy.findAllByRole("button").eq(1).click();
      cy.findByPlaceholderText("Search your country...").type("Indonesia");
      cy.findByText("Indonesia").click();
      cy.findByPlaceholderText("Enter phone number").type("08123456789");
      cy.findByText("+62").should("exist");
      cy.findByPlaceholderText("Enter phone number").should(
        "have.value",
        "812-3456-789"
      );

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

      cy.findAllByRole("img", { hidden: true }).eq(3).click();

      cy.findByLabelText("thumb-up").click();
      cy.findByLabelText("thumb-down").click();
      cy.findByLabelText("input-thumbfield").should("not.be.checked");

      cy.findByLabelText("input-togglebox")
        .click({ force: true })
        .should("be.checked");

      cy.findAllByRole("button").eq(2).click();

      cy.findByLabelText("chip-input-box").type("Anime{enter}");
      cy.findAllByText("Anime").eq(0).should("be.visible");
    });
  });
});
