import {
  expectTextIncludesOrderedLines,
  getIdContent,
} from "test/support/commands";

describe("RichEditor", () => {
  beforeEach(() => {
    cy.visit(getIdContent("input-elements-richeditor--default"));
  });

  context("bold", () => {
    context("when type and given", () => {
      it("renders text with bold style", () => {
        cy.findByRole("textbox").should("exist").click().type("Hello World");
        cy.findByRole("textbox").should("contain.text", "Hello World");

        cy.findByRole("textbox").type("{selectall}");

        cy.findAllByRole("button").eq(0).click();
      });
    });
  });

  context("italic", () => {
    context("when type and given", () => {
      it("renders text with italic style", () => {
        cy.findByRole("textbox").should("exist").click().type("Hello World");
        cy.findByRole("textbox").should("contain.text", "Hello World");

        cy.findByRole("textbox").type("{selectall}");

        cy.findAllByRole("button").eq(1).click();
      });
    });
  });

  context("ordered list", () => {
    context("when type and given", () => {
      it("render text with ordered list", () => {
        cy.findByRole("textbox").click().type("Item 1");
        cy.findByRole("textbox").type("{selectall}");

        cy.findAllByRole("button").eq(2).click();
        cy.findByRole("textbox").find("ol").should("exist");
      });
    });

    context("when type and delete on centered text", () => {
      it("render merge ordered list", () => {
        cy.findByRole("textbox")
          .click()
          .type("1. Test 1{enter}")
          .type("Test 2{enter}")
          .type("Test 3");

        cy.findByText("Test 2").type(
          "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}"
        );

        cy.findByText("Test 2").should("not.exist");
        cy.findAllByRole("button").eq(6).click();

        cy.get("pre")
          .invoke("text")
          .then((text) => {
            expectTextIncludesOrderedLines(text, ["1. Test 1", "2. Test 3"]);
          });
      });
    });
  });

  context("unordered list", () => {
    context("when type and given", () => {
      it("render text with unordered list", () => {
        cy.findByRole("textbox").click().type("Bullet Point");
        cy.findByRole("textbox").type("{selectall}");

        cy.findAllByRole("button").eq(3).click();
        cy.findByRole("textbox").find("ul").should("exist");
      });
    });

    context(
      "when type, press enter (not using unordered) and ensure the structure",
      () => {
        it("render text with unordered list and normal text", () => {
          cy.findByRole("textbox").click().type("- Bullet Point{enter}{enter}");
          cy.findByRole("textbox").click().type("Normal Point");
          cy.findAllByRole("button").eq(6).click();

          cy.get("pre")
            .invoke("text")
            .then((text) => {
              expectTextIncludesOrderedLines(text, [
                "* Bullet Point",
                "Normal Point",
              ]);
            });
        });
      }
    );

    context("when type and delete on centered text", () => {
      it("render merge unordered list", () => {
        cy.findByRole("textbox")
          .click()
          .type("- Test 1{enter}")
          .type("Test 2{enter}")
          .type("Test 3");

        cy.findByText("Test 2").type(
          "{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}"
        );

        cy.findByText("Test 2").should("not.exist");
      });
    });
  });

  context("checkbox", () => {
    context("when given and click with toolbar", () => {
      it("render checked value", () => {
        cy.findAllByRole("button").eq(4).click();
        cy.findByRole("textbox").click().type("Task 1 ");
        cy.get("input[type='checkbox']").check().should("be.checked");
      });

      it("render unchecked value", () => {
        cy.findAllByRole("button").eq(4).click();
        cy.findByRole("textbox").click().type("Task 2 ");
        cy.get("input[type='checkbox']").uncheck().should("not.be.checked");
      });
    });

    context("when type [ ]", () => {
      it("render unchecked value", () => {
        cy.findByRole("textbox").click().type("[ ] checkbox value");
        cy.get("input[type='checkbox']").should("not.be.checked");
      });
    });

    context("when type [x]", () => {
      it("render checked value", () => {
        cy.findByRole("textbox").click().type("[x] checkbox value checked");
        cy.get("input[type='checkbox']").should("be.checked");
      });
    });

    context("when type with strip, space, [x], and text", () => {
      it("render text with unordered with checked checkbox and text", () => {
        cy.findByRole("textbox")
          .click()
          .type("- [x] checkbox value checked{enter}");
        cy.get("input[type='checkbox']").should("be.checked");
      });
    });

    context("when type [x ]", () => {
      it("not rendered", () => {
        cy.findByRole("textbox").click().type("[x ] checkbox value checked");
        cy.get("input[type='checkbox']").should("not.exist");
      });
    });
  });

  context("print markdown", () => {
    it("should show content on screen", () => {
      cy.findByRole("textbox").click().type("Print content Test");

      cy.findByRole("textbox").type("{selectall}");
      cy.findAllByRole("button").eq(0).click();
      cy.findByRole("textbox").type("{moveToEnd}{enter}");
      cy.findAllByRole("button").eq(0).click();

      cy.findByRole("textbox").type(
        "The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.{enter}"
      );

      cy.findByRole("textbox")
        .click()
        .type("- The quick brown fox jumps over the lazy dog.{enter}")
        .type("Pack my box with five dozen liquor jugs.{enter}")
        .type("Typing skills improve with daily practice.{enter}")
        .type("Accuracy is more important than speed.{enter}")
        .type("Stay consistent and avoid looking at the keyboard.");

      cy.findAllByRole("button").eq(6).click();

      cy.get("pre")
        .invoke("text")
        .then((text) => {
          expectTextIncludesOrderedLines(text, [
            "**Print content Test**",
            "The quick brown fox jumps over the lazy dog.",
            "* Pack my box with five dozen liquor jugs.",
            "* Typing skills improve with daily practice.",
            "* Accuracy is more important than speed.",
            "* Stay consistent and avoid looking at the keyboard.",
          ]);
        });
    });
  });

  context("tip menu heading", () => {
    const headings = ["Heading 1", "Heading 2", "Heading 3"];

    headings.forEach((label) => {
      it(`should apply ${label} heading from dropdown`, () => {
        cy.findByRole("textbox").click().type("Heading Text");
        cy.findByRole("textbox").type("{selectall}");
        cy.findAllByRole("button").eq(5).click();
        cy.findByText(label).click();
      });
    });
  });
});
