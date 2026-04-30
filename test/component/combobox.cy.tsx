import {
  Combobox,
  ComboboxAction,
  ComboboxItemAction,
  ComboboxOption,
  ComboboxProps,
} from "./../../components/combobox";
import { Button } from "./../../components/button";
import {
  RiAddLine,
  RiDeleteBack2Line,
  RiHome2Line,
  RiLogoutBoxLine,
  RiRunLine,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";
import { useState } from "react";

const FRUIT_OPTIONS: ComboboxOption[] = [
  { text: "Apple", value: "1" },
  { text: "Banana", value: "2" },
  { text: "Orange", value: "3" },
  { text: "Grape", value: "4" },
  { text: "Pineapple", value: "5" },
  { text: "Strawberry", value: "6" },
  { text: "Watermelon", value: "7" },
];

const OPTION_ACTIONS = (id: string | number): ComboboxItemAction[] => [
  {
    caption: "Run",
    onClick: () => {
      console.log(`run this ${id}`);
    },
    icon: { image: RiRunLine },
  },
  {
    caption: "Delete",
    onClick: () => {
      console.log(`delete this ${id}`);
    },
    icon: { image: RiDeleteBack2Line },
  },
];

const FRUIT_OPTIONS_WITH_ACTIONS: ComboboxOption[] = [
  { text: "Apple", value: "1", actions: OPTION_ACTIONS },
  { text: "Banana", value: "2", actions: OPTION_ACTIONS },
  { text: "Orange", value: "3", actions: OPTION_ACTIONS },
  { text: "Grape", value: "4", actions: OPTION_ACTIONS },
  { text: "Pineapple", value: "5", actions: OPTION_ACTIONS },
  { text: "Strawberry", value: "6", actions: OPTION_ACTIONS },
  { text: "Watermelon", value: "7", actions: OPTION_ACTIONS },
];

const MIX_FRUIT_OPTIONS: ComboboxOption[] = [
  {
    text: "Watery",
    value: "Watery",
    groupOptions: [
      {
        text: "Sweet",
        value: "Watery-Sweet",
        groupOptions: [
          { text: "Watermelon", value: "7" },
          { text: "Pear", value: "19" },
          { text: "Grape", value: "4" },
        ],
        groupSetting: { collapsible: true },
      },
      {
        text: "Balanced",
        value: "Watery-Balanced",
        groupOptions: [
          { text: "Apple", value: "1" },
          { text: "Papaya", value: "11" },
        ],
        groupSetting: { collapsible: true },
      },
    ],
    groupSetting: { collapsible: true },
  },
  {
    text: "Berry",
    value: "Berry",
    hidden: true,
    groupOptions: [
      {
        text: "Balanced",
        value: "Berry-Balanced",
        groupOptions: [
          { text: "Strawberry", value: "6" },
          { text: "Blueberry", value: "9" },
          { text: "Raspberry", value: "16" },
        ],
        groupSetting: { collapsible: true },
      },
    ],
    groupSetting: { collapsible: true },
  },
  { text: "Peppers", value: "99" },
  { text: "Eggplants", value: "100", hidden: true },
];

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
        onChange={(selectedOptions: string) => {
          console.log(`the value is ${selectedOptions}`);
          setValue(selectedOptions);
        }}
        placeholder="Select a fruit..."
        {...props}
      />
    );
  }

  context("option with actions", () => {
    context("with single option", () => {
      beforeEach(() => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<ProductCombobox options={FRUIT_OPTIONS_WITH_ACTIONS} />);
        cy.findByLabelText("action-button").should("not.exist");

        cy.findByPlaceholderText("Select a fruit...").click();
        cy.findByText("Apple").trigger("mouseover");
      });

      it("renders the action in the combobox option", () => {
        cy.findAllByLabelText("action-button").eq(0).should("exist");
      });

      context("with clicking the ellipsis", () => {
        it("shows the tip menu option", () => {
          cy.findAllByLabelText("action-button").eq(0).should("exist").click();
          cy.findByText("Run").should("exist");
          cy.findByText("Delete").should("exist");
        });

        context("when clicking the one of tip menu option", () => {
          it("renders the console log", () => {
            cy.findAllByLabelText("action-button")
              .eq(0)
              .should("exist")
              .click();
            cy.findByText("Run").should("exist").click();

            cy.get("@consoleLog").should("have.been.calledWith", "run this 1");
          });
        });
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

    context("when selected the value", () => {
      const firstSelection = () => {
        cy.mount(
          <ProductCombobox
            options={FRUIT_OPTIONS}
            placeholder="Select a fruit..."
          />
        );
        cy.findByPlaceholderText("Select a fruit...").type("Banana");
        cy.findByRole("option", { name: "Banana" }).click();
        cy.findByPlaceholderText("Select a fruit...").should(
          "have.value",
          "Banana"
        );
      };

      beforeEach(() => {
        firstSelection();
      });

      it("should display the selected value", () => {
        // selection in beforeEach
      });

      context("when hovering the selected option", () => {
        it("still highlight with selected option (rgb(97, 169, 249))", () => {
          cy.findByLabelText("selectbox-opener").click();
          cy.wait(500);

          // hovering the selected option
          cy.findAllByLabelText("tree-list-group-title")
            .eq(1)
            .trigger("mouseover");

          cy.findAllByLabelText("tree-list-group-title")
            .eq(1)
            .should("have.css", "background-color", "rgb(97, 169, 249)");
        });
      });

      context("when clicking arrow", () => {
        it("should highlight selected option (rgb(97, 169, 249))", () => {
          cy.findByLabelText("selectbox-opener").click();
          cy.wait(500);
          cy.findAllByLabelText("tree-list-group-title")
            .eq(1)
            .should("have.css", "background-color", "rgb(97, 169, 249)");
        });
      });

      context("when pressing arrow up/arrow down", () => {
        it("should highlight selected option (rgb(97, 169, 249))", () => {
          cy.findByPlaceholderText("Select a fruit...").type("{uparrow}");

          cy.wait(500);
          cy.findAllByLabelText("tree-list-group-title")
            .eq(1)
            .should("have.css", "background-color", "rgb(97, 169, 249)");
        });
      });
    });
  });

  context("common behavior", () => {
    const selectApple = (props = {}) => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.mount(<ProductCombobox {...props} />);
      cy.findByPlaceholderText("Select a fruit...").type("Apple");
      cy.findByRole("option", { name: "Apple" }).click();
      cy.findByPlaceholderText("Select a fruit...").should(
        "have.value",
        "Apple"
      );
      cy.findByDisplayValue("Apple").should("be.visible");
    };

    context("non-strict value", () => {
      beforeEach(() => selectApple({ strict: false }));

      context("when clicking the combobox", () => {
        it("should not reveal the dropdown", () => {
          cy.findByPlaceholderText("Select a fruit...").click();
          cy.findByRole("option", { name: "Apple" }).should("not.exist");
        });

        context("when typing", () => {
          it("should reveal the dropdown", () => {
            cy.findByPlaceholderText("Select a fruit...")
              .click()
              .clear()
              .type("Banana");
            cy.findByRole("option", { name: "Banana" }).should("exist");
          });
        });
      });

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
              .should("have.value", "AppleAlim");
          });

          it("should not give callback value", () => {
            cy.findByPlaceholderText("Select a fruit...")
              .click()
              .type("Alim{enter}");

            cy.get("@consoleLog").should(
              "have.been.calledWith",
              "the value is AppleAlim"
            );
          });
        });
      });
    });

    context("strict mode", () => {
      beforeEach(() => selectApple({ strict: true }));

      context("when clicking the combobox", () => {
        it("should reveal the dropdown", () => {
          cy.findByPlaceholderText("Select a fruit...").click();
          cy.findByRole("option", { name: "Apple" }).should("exist");
        });

        context("when typing", () => {
          it("should reveal the dropdown", () => {
            cy.findByPlaceholderText("Select a fruit...")
              .click()
              .clear()
              .type("Banana");
            cy.findByRole("option", { name: "Banana" }).should("exist");
          });
        });
      });

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

          it("should not give callback value", () => {
            cy.findByPlaceholderText("Select a fruit...")
              .click()
              .type("Alim{enter}");

            cy.get("@consoleLog").should(
              "not.have.been.calledWith",
              "the value is AppleAlim"
            );
          });
        });
      });
    });
  });

  context("categorize", () => {
    const selectApple = (props = {}) => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.mount(<ProductCombobox {...props} />);
      cy.findByPlaceholderText("Select a fruit...").click();
    };

    beforeEach(() => {
      selectApple({
        options: MIX_FRUIT_OPTIONS,
      });
    });

    context("style", () => {
      it("renders border-left 2px solid rgb(215, 214, 214)", () => {
        cy.findByText("Watery").click();
        cy.findByText("Sweet").click();
        cy.findAllByLabelText("vertical-line")
          .eq(3)
          .should("have.css", "border-left", "2px solid rgb(215, 214, 214)");
      });

      context("relation vertical line level", () => {
        it("renders border-left none", () => {
          cy.findByText("Watery").click();
          cy.findByText("Sweet").click();
          cy.findAllByLabelText("vertical-line-level").should(
            "have.css",
            "border",
            ""
          );
        });
      });
    });

    it("should not reveal the option", () => {
      MIX_FRUIT_OPTIONS.flatMap((option) => {
        if (option.text !== "Berry" && option.text !== "Eggplants") {
          cy.findByText(option.text).should("be.visible");
        }
      });
    });

    context("hidden", () => {
      context("when given in the group", () => {
        it("should not render the group", () => {
          MIX_FRUIT_OPTIONS.flatMap((option) => {
            if (option.text === "Berry") {
              cy.findByText("Berry").should("not.exist");
            }
          });
        });
      });

      context("when given in the text", () => {
        it("should not render the option", () => {
          MIX_FRUIT_OPTIONS.flatMap((option) => {
            if ("text" in option) {
              cy.findByText("Eggplants").should("not.exist");
            }
          });
        });
      });
    });

    context("when clicking the group", () => {
      const expectedText = [
        { text: "Watermelon", value: "7" },
        { text: "Pear", value: "19" },
        { text: "Grape", value: "4" },
      ];
      it("should reveal the option", () => {
        expectedText.map((option) => {
          cy.findByText(option?.text).should("not.exist");
        });

        cy.findByText("Watery").click();

        cy.findByText("Sweet").click();
        cy.findByText("Balanced").click();

        expectedText.map((option) => {
          cy.findByText(option?.text).should("exist");
        });
      });

      context("when clicking the option", () => {
        it("should selecting the option", () => {
          expectedText.map((option) => {
            cy.findByText(option?.text).should("not.exist");
          });

          cy.findByText("Watery").click();

          cy.findByText("Sweet").click();
          cy.findByText("Balanced").click();

          expectedText.map((option) => {
            cy.findByText(option?.text).should("exist");
          });

          cy.findByText("Watermelon").click();
          cy.findByPlaceholderText("Select a fruit...").should(
            "have.value",
            "Watermelon"
          );
        });
      });
    });

    context("initialState", () => {
      const setAllOpened = (items: ComboboxOption[]): ComboboxOption[] =>
        items.map((item) => ({
          ...item,
          groupSetting: { ...item?.groupSetting, initialState: "opened" },
          groupOptions: item.groupOptions?.length
            ? setAllOpened(item.groupOptions)
            : item.groupOptions,
        }));

      const MIX_FRUIT_OPTIONS_WITH_INITIAL_OPENED = setAllOpened(FRUIT_OPTIONS);

      context("when given opened", () => {
        beforeEach(() => {
          cy.mount(
            <ProductCombobox
              name="mix"
              options={MIX_FRUIT_OPTIONS_WITH_INITIAL_OPENED}
            />
          );
          cy.findByPlaceholderText("Select a fruit...").click();
        });

        it("should reveal all option", () => {
          MIX_FRUIT_OPTIONS_WITH_INITIAL_OPENED.flatMap((option) => {
            if (!option.groupOptions) return;

            option.groupOptions.forEach((opt) => {
              cy.findByText(opt.text).should("be.visible");
            });
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
          .should("have.css", "background-color", "rgba(0, 0, 0, 0)");
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

  context("actions", () => {
    const FRUIT_ACTIONS: ComboboxAction[] = [
      {
        caption: "Add Fruit",
        onClick: () => {},
        icon: {
          image: RiAddLine,
        },
      },
      {
        hidden: true,
        caption: "Delete Fruit",
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

    context("when given with hidden field", () => {
      it("renders without hidden action", () => {
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

        cy.findByText("Apple").click();
        cy.findByText("Banana").click();

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

        cy.findByText("Apple").click();
        cy.findByText("Banana").click();

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

      cy.findByLabelText("tip-menu").should("have.css", "width", "200px");
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
