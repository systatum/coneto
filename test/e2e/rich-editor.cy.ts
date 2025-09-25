import {
  expectTextIncludesOrderedLines,
  getIdContent,
} from "test/support/commands";

describe("RichEditor", () => {
  beforeEach(() => {
    cy.visit(getIdContent("input-elements-richeditor--default"));
  });

  context("toolbar position", () => {
    context("when given top", () => {
      it("renders toolbar on the top", () => {
        cy.findByLabelText("toolbar-content").should("have.css", "top", "0px");
        cy.findByRole("textbox")
          .should("have.css", "min-height", "200px")
          .and("have.css", "padding-top", "45px");
      });
    });

    context("when given bottom", () => {
      it("renders toolbar on the bottom", () => {
        cy.visit(
          getIdContent("input-elements-richeditor--toolbar-position-bottom")
        );
        cy.findByLabelText("toolbar-content").should(
          "have.css",
          "bottom",
          "0px"
        );
        cy.findByRole("textbox")
          .should("have.css", "min-height", "200px")
          .and("have.css", "padding-bottom", "45px");
      });
    });
  });

  context("ref", () => {
    context(".insertMarkdownContent", () => {
      it("renders content on editor", () => {
        cy.findByText("Markdown Example").click();
        const contentHTML = `<h3>Hello there!</h3>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit voluptate velit.</p>
<p><br>This is ordered list</p>
<ol>
<li><input type="checkbox" class="custom-checkbox-wrapper" contenteditable="false" data-checked="false" style="cursor: pointer;"> test</li>
<li><input type="checkbox" class="custom-checkbox-wrapper" contenteditable="false" data-checked="true" style="cursor: pointer;"> test</li>
</ol>
<p><br>This is unordered list</p>
<ul>
<li>test</li>
<li>test</li>
</ul>`;
        cy.findByRole("textbox").should("contain.html", contentHTML);
        cy.findAllByRole("button").eq(6).click();

        cy.get("pre")
          .invoke("text")
          .then((text) => {
            expectTextIncludesOrderedLines(text, [
              "### Hello there!",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit voluptate velit.",
              "",
              "This is ordered list",
              "1. [ ] test",
              "2. [x] test",
              "",
              "This is unordered list",
              "* test",
              "* test",
            ]);
          });
      });
    });

    context(".insertPlainText", () => {
      it("renders content on editor", () => {
        cy.findByText("Sender Name").dblclick();
        cy.findByText("Sender Email").dblclick();

        cy.findByRole("textbox")
          .invoke("text")
          .then((txt) => {
            expect(txt.replace(/\u00A0/g, " ")).to.contain(
              "Sender Name Sender Name Sender Email Sender Email"
            );
          });

        cy.findAllByRole("button").eq(6).click();

        cy.get("pre")
          .invoke("text")
          .then((text) => {
            expectTextIncludesOrderedLines(text, [
              "Sender Name Sender Name Sender Email Sender Email",
            ]);
          });
      });
    });

    context("when pressing character", () => {
      context("when clicking", () => {
        it("renders content on editor", () => {
          cy.findByRole("textbox").type("Hello, my name is ");
          cy.findByText("Sender Name").click();
          cy.findByRole("textbox").type(
            ", May I confirm if this is your email address?"
          );

          cy.findByRole("textbox")
            .invoke("text")
            .then((txt) => {
              expect(txt.replace(/\u00A0/g, " ")).to.contain(
                "Hello, my name is Sender Name, May I confirm if this is your email address?"
              );
            });
        });
      });
    });
  });

  context("mode", () => {
    context("when given default (text-editor)", () => {
      it("renders normal component", () => {
        cy.visit(getIdContent("input-elements-richeditor--default"));
        cy.findByLabelText("toolbar-content").should("have.css", "top", "0px");
        cy.findByRole("textbox")
          .should("have.css", "min-height", "200px")
          .and("have.css", "padding-top", "45px");
      });
    });

    context("when given page-editor", () => {
      it("renders toolbar on the top", () => {
        // ensure the viewport is consistent with the page editor mode
        cy.viewport(1280, 800);
        cy.visit(getIdContent("input-elements-richeditor--page-editor"));
        cy.findByLabelText("toolbar-content").should("have.css", "top", "0px");
        cy.findByLabelText("wrapper-editor")
          .should("not.have.css", "border", "1px solid #ececec")
          .and("not.have.css", "box-shadow", "0 1px 4px -3px #5b5b5b");
        cy.findByRole("textbox")
          .should("have.css", "min-height", "800px")
          .and("have.css", "padding-top", "45px");
        cy.findByRole("textbox")
          .should("have.css", "max-height", "800px")
          .and("have.css", "padding-top", "45px");
      });
    });

    context("when given view-only", () => {
      beforeEach(() => {
        cy.visit(getIdContent("input-elements-richeditor--view-only"));
      });

      it("should not render the toolbar", () => {
        cy.findByLabelText("toolbar-content").should("not.exist");
      });

      it("should render same value in the editor and <pre> element", () => {
        cy.findByRole("textbox")
          .should("have.css", "padding", "12px")
          .and("have.css", "user-select", "text");
        cy.findByRole("textbox").should(
          "have.css",
          "caret-color",
          "rgba(0, 0, 0, 0)"
        );

        // On this element same state value between text editor and element pre without print
        cy.get("pre")
          .invoke("text")
          .then((text) => {
            expectTextIncludesOrderedLines(text, [
              "### Hello there!",
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit voluptate velit.",
              "",
              "This is ordered list",
              "1. [ ] test",
              "2. [x] test",
              "",
              "This is unordered list",
              "* test",
              "* test",
            ]);
          });
      });

      context("when drag content", () => {
        context("when pressing any character", () => {
          it("renders without change value", () => {
            cy.findByRole("textbox").type("{selectall}{backspace}test 123");

            // On this element value same from editor without print
            cy.get("pre")
              .invoke("text")
              .then((text) => {
                expectTextIncludesOrderedLines(text, [
                  "### Hello there!",
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit voluptate velit.",
                  "",
                  "This is ordered list",
                  "1. [ ] test",
                  "2. [x] test",
                  "",
                  "This is unordered list",
                  "* test",
                  "* test",
                ]);
              });
          });
        });
      });

      context("when have checkboxes", () => {
        it("renders with correct state and can't be clicked", () => {
          cy.get("input[type='checkbox']")
            .eq(0)
            .should("have.css", "pointer-events", "none")
            .and("have.prop", "checked", false);
          cy.get("input[type='checkbox']")
            .eq(1)
            .should("have.css", "pointer-events", "none")
            .and("have.prop", "checked", true);
        });
      });
    });
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
        cy.findAllByRole("button").eq(6).click();

        cy.get("pre")
          .invoke("text")
          .then((text) => {
            expectTextIncludesOrderedLines(text, ["[ ] checkbox value"]);
          });
        cy.get("input[type='checkbox']").should("not.be.checked");
      });
    });

    context("when type [x]", () => {
      it("render checked value", () => {
        cy.findByRole("textbox").click().type("[x] checkbox value checked");
        cy.findAllByRole("button").eq(6).click();

        cy.get("pre")
          .invoke("text")
          .then((text) => {
            expectTextIncludesOrderedLines(text, [
              "[x] checkbox value checked",
            ]);
          });
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
    context("when type and print content", () => {
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
  });

  context("tip menu heading", () => {
    const headings = [
      { label: "Heading 1", text: "#" },
      { label: "Heading 2", text: "#" },
      { label: "Heading 3", text: "#" },
    ];
    headings.forEach((data) => {
      context(`when click tip ${data.label}`, () => {
        context(`when typing`, () => {
          it(`should focus and render text with ${data.label}`, () => {
            cy.findAllByRole("button").eq(5).click();
            cy.findByText(data.label).click();
            cy.focused().type(`${data.label} Text`);
            cy.findAllByRole("button").eq(6).click();
            cy.get("pre")
              .invoke("text")
              .then((text) => {
                expectTextIncludesOrderedLines(text, [
                  `${data.text} ${data.label} Text`,
                ]);
              });
          });
        });
      });

      context(`when typing`, () => {
        context(`when click tip`, () => {
          it(`should apply ${data.label}`, () => {
            cy.findByRole("textbox").type(`${data.label} Text{selectall}`);
            cy.findAllByRole("button").eq(5).click();
            cy.findByText(data.label).click();
            cy.findAllByRole("button").eq(6).click();

            cy.get("pre")
              .invoke("text")
              .then((text) => {
                expectTextIncludesOrderedLines(text, [
                  `${data.text} ${data.label} Text`,
                ]);
              });
          });

          context(`when typing paragraph`, () => {
            it(`should apply ${data.label} and on the bottom render paragraph`, () => {
              cy.findByRole("textbox")
                .click()
                .type(`${data.label} Text{selectall}`);
              cy.findAllByRole("button").eq(5).click();
              cy.findByText(data.label).click();
              cy.findByRole("textbox").click().type("{enter}Paragraph text");
              cy.findAllByRole("button").eq(6).click();

              cy.get("pre")
                .invoke("text")
                .then((text) => {
                  expectTextIncludesOrderedLines(text, [
                    `${data.text} ${data.label} Text`,
                    "Paragraph text",
                  ]);
                });
            });
          });
        });
      });
    });
  });
});
