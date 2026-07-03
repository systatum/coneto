import {
  Combobox,
  ComboboxAction,
  ComboboxItemAction,
  ComboboxOption,
  ComboboxProps,
} from "./../../components/combobox";
import { Button } from "./../../components/button";
import {
  RiAddBoxLine,
  RiAddLine,
  RiDeleteBack2Line,
  RiFlashlightLine,
  RiHome2Line,
  RiLogoutBoxLine,
  RiRunLine,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";
import { useEffect, useState } from "react";
import { Sidebar } from "./../../components/sidebar";
import { css } from "styled-components";
import { NavTab, NavTabTab } from "./../../components/nav-tab";
import { FormFieldGroup, StatefulForm } from "./../../components/stateful-form";
import { Table, TableColumn, TableSubMenuList } from "./../../components/table";
import { Card } from "./../../components/card";

const flattenOptions = (items: ComboboxOption[]): string[] =>
  items.flatMap((item) =>
    item.groupOptions?.length
      ? [item.text, ...flattenOptions(item.groupOptions)]
      : [item.text]
  );

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
          {
            text: "Bold",
            value: "092",
            groupOptions: [
              { text: "Watermelon", value: "7" },
              { text: "Pear", value: "19" },
            ],
          },
          { text: "Grape", value: "4" },
        ],
        groupSetting: { collapsible: true },
      },
      {
        text: "Balanced",
        value: "Watery-Balanced",
        groupOptions: [{ text: "Apple", value: "1" }],
        groupSetting: { collapsible: true },
      },
      { text: "Papaya", value: "11" },
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

  context("drawerHeight", () => {
    context("when given 60dvh", () => {
      it("should render with 420px", () => {
        cy.viewport(500, 700);

        cy.mount(
          <ProductCombobox options={FRUIT_OPTIONS} drawerHeight={"60dvh"} />
        );

        cy.findByRole("textbox").click();

        cy.window().then((win) => {
          const expectedHeight = `${win.innerHeight * 0.6}px`;

          cy.findByLabelText("combobox-drawer").should(
            "have.css",
            "height",
            expectedHeight
          );
        });
      });

      context("when typing and less than 5 option", () => {
        it("should render drawer with fit content (less than 420px)", () => {
          cy.viewport(500, 700);

          cy.mount(
            <ProductCombobox options={FRUIT_OPTIONS} drawerHeight={"60dvh"} />
          );

          cy.findByRole("textbox").click();

          cy.window().then((win) => {
            const expectedHeight = `${win.innerHeight * 0.6}px`;

            cy.findByLabelText("combobox-drawer").should(
              "have.css",
              "height",
              expectedHeight
            );
          });

          cy.findByRole("textbox").click();

          cy.window().then((win) => {
            const expectedHeight = `${win.innerHeight * 0.6}px`;

            cy.findByLabelText("combobox-drawer").should(
              "have.css",
              "height",
              expectedHeight
            );
          });
        });
      });
    });

    context("when given mobile", () => {
      context("when given 60dvh", () => {
        it("should render with 420px", () => {
          cy.viewport(500, 700);

          cy.mount(
            <ProductCombobox
              mobile
              options={FRUIT_OPTIONS}
              drawerHeight={"60dvh"}
            />
          );

          cy.findByRole("textbox").click();

          cy.window().then((win) => {
            const expectedHeight = `${win.innerHeight * 0.6}px`;

            cy.findByLabelText("combobox-drawer-mobile").should(
              "have.css",
              "height",
              expectedHeight
            );
          });
        });
      });
    });
  });

  context("dynamic options", () => {
    context("when fetch after move", () => {
      function ProductDynamicCombobox({ timeDelay }: { timeDelay?: number }) {
        interface FormValues {
          compilation?: number;
          machine?: number;
        }

        const [activeTab, setActiveTab] = useState("1");

        const [formValues, setFormValues] = useState<FormValues>({
          compilation: 1,
          machine: 1,
        });

        const TABS_ITEMS: NavTabTab[] = [
          {
            id: "1",
            title: "Project",
            content: (
              <CompilationHistorySection
                setFormValues={setFormValues}
                setActiveTab={setActiveTab}
              />
            ),
          },
          {
            id: "2",
            title: "Inference",
            content: (
              <InferenceSection
                timeDelay={timeDelay}
                formValues={formValues}
                setFormValues={setFormValues}
              />
            ),
          },
        ];

        function CompilationHistorySection({
          setActiveTab,
          setFormValues,
        }: {
          setActiveTab?: (activeTab?: string) => void;
          setFormValues?: React.Dispatch<React.SetStateAction<FormValues>>;
          setCompilations?: React.Dispatch<
            React.SetStateAction<ComboboxOption[]>
          >;
        }) {
          const [searchQuery, setSearchQuery] = useState("");

          const compilationHistories = [
            {
              id: 1,
              createdAt: "2026-06-15T10:00:00Z",
              target: "NPU",
              modelId: "SmolLM2-135m",
            },
            {
              id: 2,
              createdAt: "2026-06-16T14:30:00Z",
              target: "GPU",
              modelId: "Llama-3.2-1B",
            },
            {
              id: 3,
              createdAt: "2026-06-17T08:15:00Z",
              target: "CPU",
              modelId: "Gemma-2B",
            },
          ];

          const filteredCompilationHistories = compilationHistories.filter(
            (item) =>
              item.modelId.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.target.toLowerCase().includes(searchQuery.toLowerCase())
          );

          const COMPILATION_HISTORY_COLUMNS: TableColumn[] = [
            { id: "createdAt", caption: "Date", width: "30%" },
            { id: "target", caption: "Target", width: "30%" },
            { id: "modelId", caption: "Model", width: "40%" },
          ];

          const ROW_ACTION = (id?: string): TableSubMenuList[] => [
            {
              caption: "Infer",
              icon: { image: RiFlashlightLine },
              onClick: async () => {
                await setFormValues((prev) => ({
                  ...prev,
                  compilation: Number(id),
                }));

                await setActiveTab("2");
              },
            },
          ];

          return (
            <Card
              title="Compilation History"
              subtitle="Record of previous compilations"
              styles={{
                containerStyle: css`
                  width: 100%;
                  border: none;
                  padding: 0px;
                `,
              }}
            >
              <Table
                columns={COMPILATION_HISTORY_COLUMNS}
                searchable
                searchbox={{
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                }}
              >
                {filteredCompilationHistories.map((compilation) => (
                  <Table.Row
                    key={compilation.id}
                    rowId={String(compilation.id)}
                    content={[
                      new Date(compilation.createdAt)
                        .toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: false,
                        })
                        .replace(",", ""),
                      compilation.target,
                      compilation.modelId,
                    ]}
                    actions={ROW_ACTION}
                  />
                ))}
              </Table>
            </Card>
          );
        }

        function InferenceSection({
          formValues,
          setFormValues,
          timeDelay = 0,
        }: {
          setFormValues?: React.Dispatch<React.SetStateAction<FormValues>>;
          formValues?: FormValues;
          timeDelay?: number;
        }) {
          const [compilations, setCompilations] = useState<ComboboxOption[]>(
            []
          );

          useEffect(() => {
            if (compilations.length === 0) {
              const timeout = setTimeout(() => {
                setCompilations([
                  {
                    text: "SmolLM2-135m (NPU)",
                    value: 1,
                  },
                  {
                    text: "Llama-3.2-1B (GPU)",
                    value: 2,
                  },
                  {
                    text: "Gemma-2B (CPU)",
                    value: 3,
                  },
                ]);
              }, timeDelay);

              return () => clearTimeout(timeout);
            }
          }, []);

          const MACHINE_OPTIONS: ComboboxOption[] = [
            {
              text: "Local",
              value: 1,
            },
            {
              text: "Server",
              value: 2,
            },
          ];

          const FIELDS: FormFieldGroup[] = [
            [
              {
                id: "compilation",
                title: "Compilation",
                name: "compilation",
                type: "combo",
                required: true,
                combobox: {
                  options: compilations,
                },
              },
              {
                id: "machine",
                title: "Machine",
                name: "machine",
                type: "combo",
                required: true,
                combobox: {
                  options: MACHINE_OPTIONS,
                },
              },
              {
                id: "button",
                title: "Run",
                name: "run",
                type: "button",
              },
            ],
          ];

          return (
            <>
              <StatefulForm
                styles={{
                  containerStyle: css`
                    padding: 10px;
                    height: 400px;
                  `,
                }}
                onChange={({ currentState }) =>
                  setFormValues((prev) => ({ ...prev, ...currentState }))
                }
                formValues={formValues}
                fields={FIELDS}
              />
            </>
          );
        }

        return (
          <NavTab
            styles={{
              contentStyle: css`
                padding: 0px;
              `,
            }}
            tabs={TABS_ITEMS}
            activeTab={activeTab}
            onChange={(activeTab) => setActiveTab(activeTab)}
            size="sm"
            actions={[
              {
                caption: "Add",
                icon: { image: RiAddBoxLine },
                onClick: () => {
                  console.log(`Add button was clicked`);
                },
              },
            ]}
          />
        );
      }

      it("shows properly text (not the value)", () => {
        cy.mount(<ProductDynamicCombobox />);
        cy.findByText("Inference").click();
        cy.findAllByPlaceholderText("Search your item...")
          .eq(0)
          .should("not.have.value", "1");

        cy.findAllByPlaceholderText("Search your item...")
          .eq(0)
          .should("have.value", "SmolLM2-135m (NPU)");
      });

      context("when given timeout 300ms", () => {
        it("still changes to text, even the options was delayed", () => {
          cy.mount(<ProductDynamicCombobox timeDelay={300} />);
          cy.findByText("Inference").click();
          cy.findAllByPlaceholderText("Search your item...")
            .eq(0)
            .should("have.value", "1");
          cy.wait(300);

          // changes even delayed
          cy.findAllByPlaceholderText("Search your item...")
            .eq(0)
            .should("have.value", "SmolLM2-135m (NPU)");
        });
      });
    });
  });

  context("mobile", () => {
    beforeEach(() => {
      cy.window().then((win) => {
        cy.spy(win.console, "log").as("consoleLog");
      });

      cy.mount(<ProductCombobox options={FRUIT_OPTIONS} mobile />);

      cy.findByPlaceholderText("Select a fruit...").click();
    });

    it("renders on the bottom screen", () => {
      cy.findByLabelText("combobox-drawer-mobile")
        .should("have.css", "bottom", "10px")
        .and("have.css", "position", "fixed");
    });

    it("renders the item with height 47px, padding-x 6px and padding-y 15px", () => {
      cy.findAllByLabelText("tree-list-group-title")
        .eq(0)
        .should("have.css", "height", "45px")
        .and("have.css", "padding", "6px 15px");
    });

    it("renders with 96dvw and height 220px", () => {
      cy.viewport(500, 700);

      cy.window().then((win) => {
        const expectedWidth = `${win.innerWidth * 0.96}px`;

        cy.findByLabelText("combobox-drawer-mobile").should(
          "have.css",
          "width",
          expectedWidth
        );

        cy.findByLabelText("combobox-drawer-mobile").should(
          "have.css",
          "height",
          "220px"
        );
      });
    });

    context("when inside of fixed content", () => {
      it("should be centered in the screen", () => {
        cy.viewport(500, 700);

        cy.mount(
          <Sidebar>
            <ProductCombobox options={FRUIT_OPTIONS} mobile />
          </Sidebar>
        );

        cy.findByRole("button").click();

        cy.findByRole("textbox").click();

        // Ensures the combobox takes 96% of the viewport width
        // when wrapped in a fixed-position container
        cy.window().then((win) => {
          const expectedWidth = `${win.innerWidth * 0.96}px`;

          cy.findByLabelText("combobox-drawer-mobile").should(
            "have.css",
            "width",
            expectedWidth
          );

          cy.findByLabelText("combobox-drawer-mobile").should(
            "have.css",
            "height",
            "220px"
          );
        });
      });
    });

    context("multiple", () => {
      context("when given true", () => {
        it("should not given padding top and bottom (not centered)", () => {
          cy.mount(<ProductCombobox options={FRUIT_OPTIONS} mobile multiple />);

          cy.findByPlaceholderText("Select a fruit...").click();

          cy.findByLabelText("combobox-drawer")
            .should("have.css", "padding-top", "0px")
            .and("have.css", "padding-bottom", "0px");
        });
      });

      context("when given false", () => {
        it("should given padding top and bottom (centered)", () => {
          cy.mount(<ProductCombobox options={FRUIT_OPTIONS} mobile />);

          cy.findByPlaceholderText("Select a fruit...").click();

          // automatic padding calculation
          cy.findByLabelText("combobox-drawer")
            .invoke("css", "padding-top")
            .then((value) => {
              const paddingTop = Number.parseFloat(String(value));
              expect(paddingTop).to.be.closeTo(100, 0.1);
            });
        });
      });
    });

    context("when selecting an option", () => {
      it("should update the selected value", () => {
        cy.findByPlaceholderText("Select a fruit...").should("have.value", "");
        cy.findByText("Apple").click();
        cy.findByPlaceholderText("Select a fruit...").should(
          "have.value",
          "Apple"
        );
      });

      context("when clicking the selectbox again", () => {
        it("should expand again (same behavior on the strict)", () => {
          cy.findByPlaceholderText("Select a fruit...").should(
            "have.value",
            ""
          );
          cy.findByText("Apple").click();
          cy.findByPlaceholderText("Select a fruit...").should(
            "have.value",
            "Apple"
          );

          cy.findByLabelText("combobox-drawer").should("not.exist");

          cy.findByPlaceholderText("Select a fruit...").click();
          cy.findByLabelText("combobox-drawer").should("exist");
        });
      });
    });

    context("fade", () => {
      it("shows on the top and bottom", () => {
        cy.findByLabelText("combobox-fade-top").should("exist");
        cy.findByLabelText("combobox-fade-bottom").should("exist");
      });

      context("when clicking item and open again", () => {
        it("should shows the fade top and bottom", () => {
          cy.findByLabelText("combobox-fade-top").should(
            "have.css",
            "opacity",
            "1"
          );
          cy.findByLabelText("combobox-fade-bottom").should(
            "have.css",
            "opacity",
            "1"
          );

          cy.findByText("Orange").click();
          cy.get("body").click("right");
          cy.findByPlaceholderText("Select a fruit...").click();

          cy.wait(300);

          cy.findByLabelText("combobox-fade-top").should(
            "have.css",
            "opacity",
            "1"
          );
          cy.findByLabelText("combobox-fade-bottom").should(
            "have.css",
            "opacity",
            "1"
          );
        });

        context("when scrolling item selected until fade top", () => {
          it("should not shows the fade top", () => {
            cy.findByLabelText("combobox-fade-top").should(
              "have.css",
              "opacity",
              "1"
            );
            cy.findByLabelText("combobox-fade-bottom").should(
              "have.css",
              "opacity",
              "1"
            );

            cy.findByText("Orange").click();
            cy.get("body").click("right");

            cy.findByPlaceholderText("Select a fruit...").click();

            cy.wait(300);

            cy.findByLabelText("combobox-fade-top").should(
              "have.css",
              "opacity",
              "1"
            );
            cy.findByLabelText("combobox-fade-bottom").should(
              "have.css",
              "opacity",
              "1"
            );

            // scroll behavior into top fade
            cy.get("#combo-list").contains("Orange").scrollIntoView();

            cy.findByLabelText("combobox-fade-top").should(
              "have.css",
              "opacity",
              "0"
            );
          });
        });

        context("when scrolling item selected until fade bottom", () => {
          it("should not shows the fade bottom", () => {
            cy.findByLabelText("combobox-fade-top").should(
              "have.css",
              "opacity",
              "1"
            );
            cy.findByLabelText("combobox-fade-bottom").should(
              "have.css",
              "opacity",
              "1"
            );

            cy.findByText("Orange").click();
            cy.findByPlaceholderText("Select a fruit...").click();

            cy.wait(300);

            cy.findByLabelText("combobox-fade-top").should(
              "have.css",
              "opacity",
              "1"
            );
            cy.findByLabelText("combobox-fade-bottom").should(
              "have.css",
              "opacity",
              "1"
            );

            // scroll behavior into top fade
            cy.get("#combo-list")
              .contains("Orange")
              .scrollIntoView({ offset: { top: -999, left: 0 } });

            cy.findByLabelText("combobox-fade-bottom").should(
              "have.css",
              "opacity",
              "0"
            );
          });
        });
      });
    });
  });

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

    const setAllOpened = (
      items: ComboboxOption[],
      collapsible?: boolean
    ): ComboboxOption[] =>
      items
        .filter((item) => !item.hidden)
        .map((item) => ({
          ...item,
          groupSetting: {
            ...item?.groupSetting,
            initialState: "opened",
            collapsible,
          },
          groupOptions: item.groupOptions?.length
            ? setAllOpened(item.groupOptions, collapsible)
            : item.groupOptions,
        }));

    const MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_FALSE = setAllOpened(
      MIX_FRUIT_OPTIONS,
      false
    );

    const MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_TRUE = setAllOpened(
      MIX_FRUIT_OPTIONS,
      true
    );

    context("collapsible", () => {
      context("with true", () => {
        beforeEach(() => {
          cy.mount(
            <ProductCombobox
              options={MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_TRUE}
            />
          );
          cy.findByPlaceholderText("Select a fruit...").click();
        });

        it("renders all option", () => {
          const allTexts = flattenOptions(
            MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_FALSE
          );
          cy.get("#combo-list").scrollTo("bottom", {
            ensureScrollable: false,
          });

          allTexts.forEach((text) => {
            cy.get("#combo-list")
              .contains(text)
              .scrollIntoView()
              .should("be.visible");
          });
        });

        context("when clicking the group", () => {
          it("can hidden the option", () => {
            const allTexts = flattenOptions(
              MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_FALSE
            );
            allTexts.forEach((text) => {
              if (text === "Watermelon" || text === "Pear")
                cy.findByText(text).should("exist");
            });

            cy.findByText("Bold").click();

            allTexts.forEach((text) => {
              if (text === "Watermelon" || text === "Pear")
                cy.findByText(text).should("not.exist");
            });
          });
        });

        context("when clicking the option", () => {
          it("renders choosen text option", () => {
            const allTexts = flattenOptions(
              MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_FALSE
            );
            allTexts.forEach((text) => {
              if (text === "Watermelon" || text === "Pear")
                cy.findByText(text).should("exist");
            });

            cy.findByText("Watermelon").click();

            cy.findByPlaceholderText("Select a fruit...").should(
              "have.value",
              "Watermelon"
            );
          });
        });
      });

      context("with false", () => {
        beforeEach(() => {
          cy.mount(
            <ProductCombobox
              options={MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_FALSE}
            />
          );
          cy.findByPlaceholderText("Select a fruit...").click();
        });

        it("renders all option", () => {
          const allTexts = flattenOptions(
            MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_FALSE
          );
          cy.get("#combo-list").scrollTo("bottom", {
            ensureScrollable: false,
          });
          allTexts.forEach((text) => {
            cy.get("#combo-list")
              .contains(text)
              .scrollIntoView()
              .should("be.visible");
          });
        });

        context("when clicking the group", () => {
          it("not choosen and still opened", () => {
            const allTexts = flattenOptions(
              MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_FALSE
            );
            cy.get("#combo-list").scrollTo("bottom", {
              ensureScrollable: false,
            });
            allTexts.forEach((text) => {
              cy.get("#combo-list")
                .contains(text)
                .scrollIntoView()
                .should("be.visible");
            });

            cy.findByText("Watery").click();

            cy.findByPlaceholderText("Select a fruit...").should(
              "have.value",
              ""
            );
          });
        });

        context("when clicking the option", () => {
          it("renders choosen text option", () => {
            const allTexts = flattenOptions(
              MIX_FRUIT_OPTIONS_WITH_COLLAPSIBLE_FALSE
            );
            cy.get("#combo-list").scrollTo("bottom", {
              ensureScrollable: false,
            });
            allTexts.forEach((text) => {
              cy.get("#combo-list")
                .contains(text)
                .scrollIntoView()
                .should("be.visible");
            });

            cy.findByText("Watermelon").click();

            cy.findByPlaceholderText("Select a fruit...").should(
              "have.value",
              "Watermelon"
            );
          });
        });
      });
    });

    context("vertical line", () => {
      /**
       * vertical-line-level = ANCESTOR lines (Array.from({ length: level }) loop)
       * vertical-line       = OWN line (rendered inside TreeListItemWrapper)
       *
       * vertical-line-level: always forced border-left: none in combobox (aria-label rule)
       * vertical-line: visible, colored rgb(215, 214, 214) when data-selected="false"
       */
      context("when nested level 1", () => {
        it("not renders border-left (empty)", () => {
          cy.findByText("Watery").click();
          cy.findByText("Sweet").click();

          cy.findAllByLabelText("vertical-line-level")
            .filter('[data-level="0"]')
            .should("have.css", "border", "");
        });
      });

      context("when nested level 2", () => {
        beforeEach(() => {
          cy.findByText("Watery").click();
          cy.findByText("Sweet").click();
        });

        it("data-level 0 has no border-left", () => {
          cy.findAllByLabelText("vertical-line-level")
            .filter('[data-level="0"]')
            .should("have.css", "border-left-width", "0px");
          // bold option
        });

        it("data-level 1 has border-left", () => {
          cy.findAllByLabelText("vertical-line")
            .eq(2)
            .filter('[data-level="1"]')
            .should("have.css", "border-left", "2px solid rgb(215, 214, 214)");

          // bold option
        });
      });

      context("when nested level 3", () => {
        beforeEach(() => {
          cy.findByText("Watery").click();
          cy.findByText("Sweet").click();
          cy.findByText("Bold").click();
        });

        it("data-level 0 has no border-left", () => {
          cy.findAllByLabelText("vertical-line-level")
            .filter('[data-level="0"]')
            .should("have.css", "border-width", "0px");
          // watermelon option
        });

        it("data-level 1 has no border-left", () => {
          cy.findAllByLabelText("vertical-line-level")
            .filter('[data-level="1"]')
            .should("have.css", "border-width", "0px");
          // watermelon option
        });

        it("data-level 2 has border-left", () => {
          cy.findAllByLabelText("vertical-line")
            .eq(3)
            .filter('[data-level="2"]')
            .should("have.css", "border-left", "2px solid rgb(215, 214, 214)");
          // watermelon option
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
        { text: "Pear", value: "19" },
        { text: "Grape", value: "4" },
      ];

      it("should reveal the option", () => {
        expectedText.map((option) => {
          cy.findByText(option?.text).should("not.exist");
        });

        cy.findByText("Watery").click();

        cy.findByText("Sweet").click();
        cy.findByText("Bold").click();

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
          cy.findByText("Bold").click();

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
      const setInitialState = (
        items: ComboboxOption[],
        initial: "opened" | "closed" = "opened"
      ): ComboboxOption[] =>
        items.map((item) => ({
          ...item,
          groupSetting: { ...item?.groupSetting, initialState: initial },
          groupOptions: item.groupOptions?.length
            ? setInitialState(item.groupOptions, initial)
            : item.groupOptions,
        }));

      const MIX_FRUIT_OPTIONS_WITH_INITIAL_OPENED = setInitialState(
        MIX_FRUIT_OPTIONS,
        "opened"
      );

      const MIX_FRUIT_OPTIONS_WITH_INITIAL_CLOSED = setInitialState(
        MIX_FRUIT_OPTIONS,
        "closed"
      );

      context("with opened", () => {
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
          const allTexts = flattenOptions(
            MIX_FRUIT_OPTIONS_WITH_INITIAL_OPENED
          );

          allTexts.forEach((text) => {
            if (
              text !== "Berry" &&
              text !== "Strawberry" &&
              text !== "Blueberry" &&
              text !== "Raspberry" &&
              text !== "Eggplants"
            )
              cy.get("#combo-list")
                .contains(text)
                .scrollIntoView()
                .should("be.visible");
          });
        });
      });

      context("with closed", () => {
        beforeEach(() => {
          cy.mount(
            <ProductCombobox
              name="mix"
              options={MIX_FRUIT_OPTIONS_WITH_INITIAL_CLOSED}
            />
          );
          cy.findByPlaceholderText("Select a fruit...").click();
        });

        it("should only show root level options", () => {
          // only root visible: Watery, Peppers (Berry, Eggplants hidden)
          cy.get("#combo-list").contains("Watery").should("be.visible");
          cy.get("#combo-list").contains("Peppers").should("be.visible");

          // children not visible until clicked
          cy.get("#combo-list").contains("Sweet").should("not.exist");
          cy.get("#combo-list").contains("Balanced").should("not.exist");
          cy.get("#combo-list").contains("Papaya").should("not.exist");
        });

        context("when clicking watery", () => {
          it("should reveal children", () => {
            cy.get("#combo-list").contains("Sweet").should("not.exist");
            cy.get("#combo-list").contains("Balanced").should("not.exist");
            cy.get("#combo-list").contains("Papaya").should("not.exist");

            cy.get("#combo-list").contains("Watery").click();

            // level 1 children now visible
            cy.get("#combo-list").contains("Sweet").should("be.visible");
            cy.get("#combo-list").contains("Balanced").should("be.visible");
            cy.get("#combo-list").contains("Papaya").should("be.visible");
          });
        });

        context("when clicking nested level 2", () => {
          it("should reveal children at level 2", () => {
            cy.get("#combo-list").contains("Bold").should("not.exist");
            cy.get("#combo-list").contains("Grape").should("not.exist");

            cy.get("#combo-list").contains("Watery").click();
            cy.get("#combo-list").contains("Sweet").click();

            cy.get("#combo-list").contains("Bold").should("be.visible");
            cy.get("#combo-list").contains("Grape").should("be.visible");
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
