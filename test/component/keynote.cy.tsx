import { css } from "styled-components";
import { Keynote, KeynoteStyles } from "./../../components/keynote";
import { ReactNode } from "react";

describe("Keynote", () => {
  context("data", () => {
    interface KeynoteValueSample {
      numberValue: number;
      dateValue: Date;
      booleanTrueValue: boolean;
      booleanFalseValue: boolean;
      objectValue: Record<string, unknown>;
      nullValue: null;
      undefinedValue?: undefined;
      reactNode: ReactNode;
    }

    const data: KeynoteValueSample = {
      numberValue: 1200,
      dateValue: new Date("2025-06-19"),
      booleanTrueValue: true,
      booleanFalseValue: false,
      objectValue: { mode: "benchmark" },
      nullValue: null,
      undefinedValue: undefined,
      reactNode: (
        <div
          aria-label="test"
          style={{
            backgroundColor: "red",
          }}
        >
          Test the element
        </div>
      ),
    };

    const keys: (keyof KeynoteValueSample)[] = [
      "numberValue",
      "dateValue",
      "booleanTrueValue",
      "booleanFalseValue",
      "objectValue",
      "nullValue",
      "undefinedValue",
      "reactNode",
    ];

    const keyLabels: Record<keyof KeynoteValueSample, string> = {
      numberValue: "Number",
      dateValue: "Date",
      booleanTrueValue: "Boolean (true)",
      booleanFalseValue: "Boolean (false)",
      objectValue: "Object",
      nullValue: "Null",
      undefinedValue: "Undefined",
      reactNode: "ReactNode",
    };
    beforeEach(() => {
      cy.mount(
        <Keynote
          data={data}
          keys={keys}
          keyLabels={keys?.map((key) => keyLabels[key])}
        />
      );
    });

    context("when given a number", () => {
      it("should still rendered normally", () => {
        Object.values(data).map((value) => {
          if (typeof value === "number") {
            cy.findByText(value).should("exist");
          }
        });
      });
    });

    context("when given boolean", () => {
      context("when it's true", () => {
        it("renders the text with 'true' text", () => {
          Object.values(data).map((value) => {
            if (typeof value === "boolean") {
              cy.findByText("true").should("exist");
            }
          });
        });
      });

      context("when it's false", () => {
        it("renders the text with 'false' text", () => {
          Object.values(data).map((value) => {
            if (typeof value === "boolean") {
              cy.findByText("false").should("exist");
            }
          });
        });
      });
    });

    context("when given string", () => {
      it("should still rendered normally", () => {
        Object.values(data).map((value) => {
          if (typeof value === "string") {
            cy.findByText(value).should("exist");
          }
        });
      });
    });

    context("when given object", () => {
      it("renders the object JSON representation", () => {
        Object.values(data).map((value) => {
          if (typeof value === "object") {
            cy.findByText('{"mode":"benchmark"}').should("exist");
          }
        });
      });
    });

    context("when given React Element", () => {
      it("should render the element", () => {
        cy.findByLabelText("test")
          .should("exist")
          .and("have.text", "Test the element")
          .and("have.css", "background-color", "rgb(255, 0, 0)");
      });
    });

    context("when given date", () => {
      it("should convert to local date string", () => {
        Object.values(data).map((value) => {
          if (value instanceof Date) {
            cy.findByText(value?.toLocaleDateString()).should("exist");
          }
        });
      });
    });

    context("when given undefined", () => {
      it("should convert to '-' text", () => {
        Object.values(data).map((value) => {
          if (typeof value === undefined) {
            cy.findByText("-").should("exist");
          }
        });
      });
    });

    context("when given null", () => {
      it("should convert to '-' text", () => {
        Object.values(data).map((value) => {
          if (typeof value === null) {
            cy.findByText("-").should("exist");
          }
        });
      });
    });
  });

  context("rendered condition", () => {
    context("when not given keyLabels", () => {
      it("should still rendered with key", () => {
        const data = {
          modelType: "MXQ83700F3",
          requestCreatedBy: "adam@systatum.com",
          lastSynced: "2025-06-20",
          createdOn: "2025-06-19",
          desc: "Backup unit installed on site",
        };

        cy.mount(
          <Keynote
            data={data}
            keys={[
              "modelType",
              "requestCreatedBy",
              "lastSynced",
              "createdOn",
              "desc",
            ]}
          />
        );

        const expectedValue = [
          "modelType",
          "requestCreatedBy",
          "lastSynced",
          "createdOn",
          "desc",
        ];

        expectedValue.map((value) => {
          cy.findByText(value).should("exist");
        });
        Object.values(data).map((value) => {
          cy.findByText(value).should("exist");
        });
      });
    });

    context("when keyLabels is less than the key", () => {
      it("should rendered with key", () => {
        const data = {
          modelType: "MXQ83700F3",
          requestCreatedBy: "adam@systatum.com",
          lastSynced: "2025-06-20",
          createdOn: "2025-06-19",
          desc: "Backup unit installed on site",
        };

        cy.mount(
          <Keynote
            data={data}
            keys={[
              "modelType",
              "requestCreatedBy",
              "lastSynced",
              "createdOn",
              "desc",
            ]}
            keyLabels={["Model Type", "Request Created By", "Last Synced"]}
          />
        );

        const expectedValue = [
          "Model Type",
          "Request Created By",
          "Last Synced",
          "createdOn",
          "desc",
        ];

        expectedValue.map((value) => {
          cy.findByText(value).should("exist");
        });
      });
    });

    context("when key is less than data", () => {
      it("should rendered data by keys", () => {
        const data = {
          modelType: "MXQ83700F3",
          requestCreatedBy: "adam@systatum.com",
          lastSynced: "2025-06-20",
          createdOn: "2025-06-19",
          desc: "Backup unit installed on site",
        };

        cy.mount(
          <Keynote
            data={data}
            keys={["modelType", "requestCreatedBy"]}
            keyLabels={[
              "Model Type",
              "Request Created By",
              "Last Synced",
              "Created On",
              "Description",
            ]}
          />
        );

        cy.findAllByLabelText("keynote-point-wrapper").should("have.length", 2);

        const renderedKeys = Object.keys(data).slice(0, 2);
        const notRenderedKeys = Object.keys(data).slice(3, 5);

        renderedKeys.map((key) => {
          cy.findByText(data[key]).should("exist");
        });

        notRenderedKeys.map((key) => {
          cy.findByText(data[key]).should("not.exist");
        });
      });
    });

    context("when key and keyLabels is equal ", () => {
      it("should rendered keynote", () => {
        const data = {
          modelType: "MXQ83700F3",
          requestCreatedBy: "adam@systatum.com",
          lastSynced: "2025-06-20",
          createdOn: "2025-06-19",
          desc: "Backup unit installed on site",
        };

        cy.mount(
          <Keynote
            data={data}
            keys={[
              "modelType",
              "requestCreatedBy",
              "lastSynced",
              "createdOn",
              "desc",
            ]}
            keyLabels={[
              "Model Type",
              "Request Created By",
              "Last Synced",
              "Created On",
              "Description",
            ]}
          />
        );

        Array.from({ length: 5 }).map((_, index) => {
          cy.findAllByLabelText("keynote-point-wrapper")
            .eq(index)
            .should("exist");
        });
      });
    });
  });

  context("styles", () => {
    function ProductKeyNote({ styles }: { styles?: KeynoteStyles }) {
      const data = {
        modelType: "MXQ83700F3",
        requestCreatedBy: "adam@systatum.com",
        lastSynced: "2025-06-20",
        createdOn: "2025-06-19",
        desc: "/home/alim.naufal@systatum.local/Documents/works/mydb-studio-system/winamp/node_modules/.pnpm/electron@40.1.0/node_modules/electron/dist/electron,--no-sandbox,dist-electron/electron/main.js",
      };

      return (
        <Keynote
          data={data}
          styles={styles}
          keys={[
            "modelType",
            "requestCreatedBy",
            "lastSynced",
            "createdOn",
            "desc",
          ]}
          keyLabels={[
            "Model Type",
            "Request Created By",
            "Last Synced",
            "Created On",
            "Description",
          ]}
        />
      );
    }

    context("when given gap by 8px between content", () => {
      it("renders with 8px gap", () => {
        cy.mount(
          <ProductKeyNote
            styles={{
              self: css`
                gap: 8px;
              `,
            }}
          />
        );

        cy.findByLabelText("keynote-wrapper").should("have.css", "gap", "8px");
      });
    });

    context("keynotePointStyles", () => {
      context("when given with font size 20px and padding-y 12px", () => {
        it("renders custom font-size styles to label and value", () => {
          cy.mount(
            <ProductKeyNote
              styles={{
                rowStyle: css`
                  padding: 12px 0;
                `,
                rowKeyStyle: css`
                  font-size: 20px;
                `,
                rowValueStyle: css`
                  font-size: 20px;
                `,
              }}
            />
          );

          cy.contains("Model Type").should("have.css", "font-size", "20px");

          cy.contains("MXQ83700F3").should("have.css", "font-size", "20px");

          cy.contains("Model Type")
            .parent()
            .should("have.css", "padding-top", "12px")
            .and("have.css", "padding-bottom", "12px");
        });
      });
    });

    context("key label", () => {
      it("renders with 14px and width 30%", () => {
        cy.mount(<ProductKeyNote />);

        Array.from({ length: 5 }).map((_, index) => {
          cy.findAllByLabelText("keynote-point-key")
            .eq(index)
            .should("have.css", "font-size", "14px")
            .and("have.css", "width", "138px");
        });
      });
    });

    context("value label", () => {
      it("renders text wrapping styles correctly", () => {
        cy.mount(<ProductKeyNote />);

        cy.findAllByLabelText("keynote-point-value").each(($el) => {
          cy.wrap($el)
            .should("have.css", "font-size", "14px")
            .and("have.css", "white-space", "normal")
            .and("have.css", "overflow-wrap", "anywhere")
            .and("have.css", "word-break")
            .and((wordBreak) => {
              expect(["break-word", "break-all", "normal"]).to.include(
                wordBreak
              );
            });
        });
      });

      it("renders with 14px and width 70%", () => {
        cy.mount(<ProductKeyNote />);

        Array.from({ length: 5 }).map((_, index) => {
          cy.findAllByLabelText("keynote-point-value")
            .eq(index)
            .should("have.css", "font-size", "14px")
            .and("have.css", "width", "322px");
        });
      });

      it("renders with text-align end", () => {
        cy.mount(<ProductKeyNote />);

        Array.from({ length: 5 }).map((_, index) => {
          cy.findAllByLabelText("keynote-point-value")
            .eq(index)
            .should("have.css", "text-align", "end");
        });
      });
    });
  });
});
