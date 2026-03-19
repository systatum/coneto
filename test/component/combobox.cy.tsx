import {
  Combobox,
  ComboboxActionProps,
  ComboboxProps,
} from "./../../components/combobox";
import { Button } from "./../../components/button";
import {
  RiAddLine,
  RiHome2Line,
  RiLogoutBoxLine,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";
import { OptionsProps } from "@/components/selectbox";
import { useState } from "react";

describe("Combobox", () => {
  function ProductCombobox(props: Partial<ComboboxProps>) {
    const [value, setValue] = useState<string>("");

    return (
      <Combobox
        options={[
          { text: "Apple", value: "1" },
          { text: "Banana", value: "2" },
        ]}
        selectedOptions={value}
        onChange={(selectedOptions: string) => setValue(selectedOptions)}
        placeholder="Select a fruit..."
        {...props}
      />
    );
  }

  context("common behavior", () => {
    const selectApple = (props = {}) => {
      cy.mount(<ProductCombobox {...props} />);
      cy.findByPlaceholderText("Select a fruit...").click();
      cy.findByRole("option", { name: "Apple" }).click();
      cy.findByPlaceholderText("Select a fruit...").should(
        "have.value",
        "Apple"
      );
      cy.findByDisplayValue("Apple").should("be.visible");
    };

    context("default", () => {
      beforeEach(() => selectApple());

      context("pressing enter", () => {
        it("should update the content", () => {
          // Already selected Apple in beforeEach
        });

        context("when typing and pressing escape", () => {
          it("should show changes value", () => {
            cy.findByPlaceholderText("Select a fruit...")
              .click()
              .type("{backspace}{backspace}{esc}{esc}")
              .should("have.value", "App");
          });
        });

        context("when typing and pressing enter for empty options", () => {
          it("should show changes value", () => {
            cy.findByPlaceholderText("Select a fruit...")
              .click()
              .type("Alim{enter}")
              .should("have.value", "Apple");
          });
        });
      });
    });

    context("strict mode", () => {
      beforeEach(() => selectApple({ strict: true }));

      context("pressing enter", () => {
        it("should update the content", () => {
          // Already selected Apple in beforeEach
        });

        context("when typing and pressing escape", () => {
          it("should still keep previous value", () => {
            cy.findByPlaceholderText("Select a fruit...")
              .click()
              .type("{backspace}{backspace}{esc}{esc}")
              .should("have.value", "Apple");
          });
        });

        context("when typing and pressing enter for empty options", () => {
          it("should still keep previous value", () => {
            cy.findByPlaceholderText("Select a fruit...")
              .click()
              .type("Alim{enter}")
              .should("have.value", "Apple");
          });
        });
      });
    });
  });

  context("labels", () => {
    context("loadingText", () => {
      context("when not given text within isLoading true", () => {
        it("shows the `Loading...` text (by default)", () => {
          cy.mount(
            <ProductCombobox
              options={null}
              isLoading
              id="combo-with-loading"
              placeholder="Select a fruit..."
            />
          );
          cy.findByText("Loading...").should("exist");
          cy.findByText("This is loading").should("not.exist");
        });
      });

      context("when given text within isLoading true", () => {
        it("shows the customize loading text", () => {
          cy.mount(
            <ProductCombobox
              options={null}
              isLoading
              id="combo-with-loading"
              labels={{
                loadingText: "This is loading",
              }}
              placeholder="Select a fruit..."
            />
          );
          cy.findByText("Loading...").should("not.exist");
          cy.findByText("This is loading").should("exist");
        });
      });
    });
  });

  context("isLoading", () => {
    context("when given true", () => {
      it("should render with blue color, gray background and gap 6px", () => {
        cy.mount(
          <ProductCombobox
            options={null}
            isLoading
            id="combo-with-loading"
            placeholder="Select a fruit..."
          />
        );
        cy.findByLabelText("circle").parent().should("have.css", "gap", "6px");

        cy.findByLabelText("circle").should(
          "have.css",
          "color",
          "rgb(59, 130, 246)"
        );

        cy.findByLabelText("circle")
          .parent()
          .should("have.css", "background-color", "rgba(255, 255, 255, 0.6)");
      });

      it("should disabled the input component", () => {
        cy.mount(
          <ProductCombobox
            options={null}
            isLoading
            id="combo-with-loading"
            placeholder="Select a fruit..."
          />
        );

        cy.get("#combo-with-loading")
          .should("have.css", "user-select", "none")
          .and("have.css", "pointer-events", "none")
          .and("be.disabled");
      });
    });

    context("when given false", () => {
      it("should not render the spinner", () => {
        cy.mount(
          <ProductCombobox
            options={null}
            isLoading={false}
            id="combo-with-loading"
            placeholder="Select a fruit..."
          />
        );

        cy.findByLabelText("circle").should("not.exist");
      });
    });
  });

  context("style", () => {
    it("should render the height with 34px", () => {
      cy.mount(
        <ProductCombobox options={null} placeholder="Select a fruit..." />
      );

      cy.findByPlaceholderText("Select a fruit...").should(
        "have.css",
        "height",
        "34px"
      );
    });
  });

  context("actions", () => {
    const FRUIT_ACTIONS: ComboboxActionProps[] = [
      {
        title: "Add Fruit",
        onClick: () => {},
        icon: {
          image: RiAddLine,
        },
      },
      false && {
        title: "Delete Fruit",
        onClick: () => {},
        icon: {
          image: RiAddLine,
        },
      },
    ];

    it("should render the action", () => {
      cy.mount(
        <ProductCombobox
          options={null}
          actions={FRUIT_ACTIONS}
          placeholder="Select a fruit..."
        />
      );

      cy.findByPlaceholderText("Select a fruit...")
        .should("have.value", "")
        .click();
      cy.findByText("Add Fruit").should("exist");
    });

    context("when given with falsy field", () => {
      it("renders without falsy action", () => {
        cy.mount(
          <ProductCombobox
            options={null}
            actions={FRUIT_ACTIONS}
            placeholder="Select a fruit..."
          />
        );

        cy.findByPlaceholderText("Select a fruit...")
          .should("have.value", "")
          .click();
        cy.findByText("Add Fruit").should("exist");
        cy.findByText("Delete Fruit").should("not.exist");
      });
    });
  });

  context("options", () => {
    context("when given null", () => {
      it("should not have option", () => {
        cy.mount(
          <ProductCombobox options={null} placeholder="Select a fruit..." />
        );

        cy.findByPlaceholderText("Select a fruit...")
          .should("have.value", "")
          .click();
        cy.findByText("Not available.").should("be.visible");
      });

      context("when given selectedOptions null", () => {
        it("should render normally and not available", () => {
          cy.mount(
            <ProductCombobox
              options={null}
              placeholder="Select a fruit..."
              selectedOptions={null}
            />
          );

          cy.findByPlaceholderText("Select a fruit...")
            .should("have.value", "")
            .click();
          cy.findByText("Not available.").should("be.visible");
        });
      });

      context("when given selectedOptions any value", () => {
        it("should not match render value and option still not available", () => {
          cy.mount(
            <ProductCombobox
              options={[]}
              placeholder="Select a fruit..."
              selectedOptions={"blabla"}
            />
          );

          cy.findByPlaceholderText("Select a fruit...")
            .should("have.value", "")
            .click();
          cy.findByText("Not available.").should("be.visible");
        });
      });
    });

    context("when given empty array ([])", () => {
      it("should not have option", () => {
        cy.mount(
          <ProductCombobox options={[]} placeholder="Select a fruit..." />
        );

        cy.findByPlaceholderText("Select a fruit...")
          .should("have.value", "")
          .click();
        cy.findByText("Not available.").should("be.visible");
      });

      context("when given selectedOptions null", () => {
        it("should render normally and not available", () => {
          cy.mount(
            <ProductCombobox
              options={[]}
              placeholder="Select a fruit..."
              selectedOptions={null}
            />
          );

          cy.findByPlaceholderText("Select a fruit...")
            .should("have.value", "")
            .click();
          cy.findByText("Not available.").should("be.visible");
        });
      });

      context("when given selectedOptions any value", () => {
        it("should not match render value and option still not available", () => {
          cy.mount(
            <ProductCombobox
              options={[]}
              placeholder="Select a fruit..."
              selectedOptions={null}
            />
          );

          cy.findByPlaceholderText("Select a fruit...")
            .should("have.value", "")
            .click();
          cy.findByText("Not available.").should("be.visible");
        });
      });
    });

    context("when using option.value number", () => {
      context("when initialize with selectedOptions string", () => {
        it("should select the option when values match", () => {
          cy.mount(
            <ProductCombobox
              options={[
                { text: "Apple", value: 1 },
                { text: "Banana", value: 2 },
              ]}
              placeholder="Select a fruit..."
              selectedOptions={"1"}
            />
          );

          cy.findByDisplayValue("Apple").should("be.visible");
        });
      });

      context("when initialize with selectedOptions number", () => {
        it("should select the option when values match", () => {
          cy.mount(
            <ProductCombobox
              options={[
                { text: "Apple", value: 1 },
                { text: "Banana", value: 2 },
              ]}
              placeholder="Select a fruit..."
              selectedOptions={1}
            />
          );

          cy.findByDisplayValue("Apple").should("be.visible");
        });
      });

      context("when initialize with selectedOptions string[]", () => {
        it("should select the option when values match", () => {
          cy.mount(
            <ProductCombobox
              options={[
                { text: "Apple", value: 1 },
                { text: "Banana", value: 2 },
              ]}
              placeholder="Select a fruit..."
              selectedOptions={["2"]}
            />
          );

          cy.findByDisplayValue("Banana").should("be.visible");
        });
      });

      context("when initialize with selectedOptions number[]", () => {
        it("should select the option when values match", () => {
          cy.mount(
            <ProductCombobox
              options={[
                { text: "Apple", value: 1 },
                { text: "Banana", value: 2 },
              ]}
              placeholder="Select a fruit..."
              selectedOptions={[2]}
            />
          );

          cy.findByDisplayValue("Banana").should("be.visible");
        });
      });
    });

    context("when using option.value string", () => {
      context("when initialize with selectedOptions string", () => {
        it("should select the option when values match", () => {
          cy.mount(
            <ProductCombobox
              options={[
                { text: "Apple", value: "1" },
                { text: "Banana", value: "2" },
              ]}
              placeholder="Select a fruit..."
              selectedOptions={"1"}
            />
          );

          cy.findByDisplayValue("Apple").should("be.visible");
        });
      });

      context("when initialize with selectedOptions number", () => {
        it("should select the option when values match", () => {
          cy.mount(
            <ProductCombobox
              options={[
                { text: "Apple", value: "1" },
                { text: "Banana", value: "2" },
              ]}
              placeholder="Select a fruit..."
              selectedOptions={1}
            />
          );

          cy.findByDisplayValue("Apple").should("be.visible");
        });
      });

      context("when initialize with selectedOptions string[]", () => {
        it("should select the option when values match", () => {
          cy.mount(
            <ProductCombobox
              options={[
                { text: "Apple", value: "1" },
                { text: "Banana", value: "2" },
              ]}
              placeholder="Select a fruit..."
              selectedOptions={["2"]}
            />
          );

          cy.findByDisplayValue("Banana").should("be.visible");
        });
      });

      context("when initialize with selectedOptions number[]", () => {
        it("should select the option when values match", () => {
          cy.mount(
            <ProductCombobox
              options={[
                { text: "Apple", value: "1" },
                { text: "Banana", value: "2" },
              ]}
              placeholder="Select a fruit..."
              selectedOptions={[2]}
            />
          );

          cy.findByDisplayValue("Banana").should("be.visible");
        });
      });
    });
  });

  context("selectedOptions", () => {
    context("when using string value", () => {
      it("should update and return string value", () => {
        const onChange = cy.stub().as("onChange");

        function ComboWithString() {
          const [value, setValue] = useState<string>("");

          return (
            <Combobox
              options={[
                { text: "Apple", value: "1" },
                { text: "Banana", value: "2" },
              ]}
              selectedOptions={value}
              onChange={(selectedOptions: string) => {
                setValue(selectedOptions);
                onChange(selectedOptions);
              }}
              placeholder="Select a fruit..."
            />
          );
        }
        cy.mount(<ComboWithString />);

        cy.findByPlaceholderText("Select a fruit...").click();
        cy.findByRole("option", { name: "Apple" }).click();

        cy.findByPlaceholderText("Select a fruit...").should(
          "have.value",
          "Apple"
        );

        cy.findByDisplayValue("Apple").should("be.visible");
        cy.get("@onChange").should("have.been.calledWith", "1");
      });
    });

    context("when using number value", () => {
      it("should give callback number value", () => {
        const onChange = cy.stub().as("onChange");

        function ComboWithNumber() {
          const [value, setValue] = useState<number>(0);

          return (
            <Combobox
              options={[
                { text: "Apple", value: "1" },
                { text: "Banana", value: "2" },
              ]}
              selectedOptions={value}
              onChange={(selectedOptions: number) => {
                setValue(selectedOptions);
                onChange(selectedOptions);
              }}
              placeholder="Select a fruit..."
            />
          );
        }

        cy.mount(<ComboWithNumber />);

        cy.findByPlaceholderText("Select a fruit...").click();
        cy.findByRole("option", { name: "Apple" }).click();

        cy.findByPlaceholderText("Select a fruit...").should(
          "have.value",
          "Apple"
        );

        cy.findByDisplayValue("Apple").should("be.visible");

        cy.get("@onChange").should("have.been.calledWith", 1);
      });
    });

    context("when using string[] value", () => {
      it("should update and return string[] value", () => {
        const onChange = cy.stub().as("onChange");

        function ComboWithStringArray() {
          const [value, setValue] = useState<string[]>([]);

          return (
            <Combobox
              multiple
              options={[
                { text: "Apple", value: "1" },
                { text: "Banana", value: "2" },
              ]}
              selectedOptions={value}
              onChange={(selectedOptions: string[]) => {
                setValue(selectedOptions);
                onChange(selectedOptions);
              }}
              placeholder="Select a fruit..."
            />
          );
        }

        cy.mount(<ComboWithStringArray />);

        cy.findByPlaceholderText("Select a fruit...").click();

        cy.findByRole("option", { name: "Apple" }).click();
        cy.findByRole("option", { name: "Banana" }).click();

        cy.findByDisplayValue("Apple, Banana").should("be.visible");

        cy.get("@onChange").should("have.been.calledWith", ["1", "2"]);
      });
    });

    context("when using number[] value", () => {
      it("should give callback number[] value", () => {
        const onChange = cy.stub().as("onChange");

        function ComboWithStringArray() {
          const [value, setValue] = useState<number[]>([0]);

          return (
            <Combobox
              multiple
              options={[
                { text: "Apple", value: "1" },
                { text: "Banana", value: "2" },
              ]}
              selectedOptions={value}
              onChange={(selectedOptions: number[]) => {
                setValue(selectedOptions);
                onChange(selectedOptions);
              }}
              placeholder="Select a fruit..."
            />
          );
        }

        cy.mount(<ComboWithStringArray />);

        cy.findByPlaceholderText("Select a fruit...").click();

        cy.findByRole("option", { name: "Apple" }).click();
        cy.findByRole("option", { name: "Banana" }).click();

        cy.findByDisplayValue("Apple, Banana").should("be.visible");

        cy.get("@onChange").should("have.been.calledWith", [0, 1, 2]);
      });
    });
  });

  context("with dropdowns", () => {
    it("renders initialize drawer with min-width 200px", () => {
      cy.mount(
        <Combobox
          options={FRUIT_OPTIONS}
          dropdowns={[
            {
              caption: "Button",
              options: [
                {
                  text: "On-site",
                  value: "1",
                  icon: {
                    image: RiHome2Line,
                  },
                },
                {
                  text: "WFH",
                  value: "2",
                  icon: {
                    image: RiUser2Line,
                  },
                },
                {
                  text: "Sick leave",
                  value: "3",
                  icon: {
                    image: RiSettings2Line,
                  },
                },
                {
                  text: "Annual leave",
                  value: "4",
                  icon: {
                    image: RiLogoutBoxLine,
                  },
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

    it("renders with similar height", () => {
      cy.mount(
        <Combobox
          options={FRUIT_OPTIONS}
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

      cy.findByRole("button").should("have.css", "height", "32px");
      cy.findAllByLabelText("field-lane-wrapper")
        .eq(0)
        .should("have.css", "height", "34px");
    });

    context("width", () => {
      context("when given", () => {
        it("should render the width", () => {
          cy.mount(
            <Combobox
              options={FRUIT_OPTIONS}
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
            .parent()
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
          <Combobox
            options={FRUIT_OPTIONS}
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

const FRUIT_OPTIONS: OptionsProps[] = [
  { text: "Apple", value: "1" },
  { text: "Banana", value: "2" },
  { text: "Orange", value: "3" },
  { text: "Grape", value: "4" },
  { text: "Pineapple", value: "5" },
  { text: "Strawberry", value: "6" },
  { text: "Watermelon", value: "7" },
];
