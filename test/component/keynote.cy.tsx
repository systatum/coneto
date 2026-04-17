import { css } from "styled-components";
import { Keynote, KeynoteStyles } from "./../../components/keynote";

describe("Keynote", () => {
  context("data", () => {
    interface BenchmarkRecord {
      id: number;
      userId: number;
      compilationId: number;
      cpuOps: number;
      cpuReorder: number;
      dnaIP: number;
      e2eNoSetInput: number;
      pcieDMA: number;
      setInput: number;
      createdAt: Date;
      updatedAt: Date;
    }

    const data: BenchmarkRecord = {
      id: 1,
      userId: 101,
      compilationId: 5001,
      cpuOps: 1200,
      cpuReorder: 300,
      dnaIP: 450,
      e2eNoSetInput: 200,
      pcieDMA: 800,
      setInput: 150,
      createdAt: new Date("2025-06-19"),
      updatedAt: new Date("2025-06-20"),
    };

    const keys: (keyof BenchmarkRecord)[] = [
      "id",
      "userId",
      "compilationId",
      "cpuOps",
      "cpuReorder",
      "dnaIP",
      "e2eNoSetInput",
      "pcieDMA",
      "setInput",
      "createdAt",
      "updatedAt",
    ];

    const keyLabels: Record<keyof BenchmarkRecord, string> = {
      id: "ID",
      userId: "User ID",
      compilationId: "Compilation ID",
      cpuOps: "CPU Ops",
      cpuReorder: "CPU Reorder",
      dnaIP: "DNA IP",
      e2eNoSetInput: "E2E No Set Input",
      pcieDMA: "PCIe DMA",
      setInput: "Set Input",
      createdAt: "Created At",
      updatedAt: "Updated At",
    };

    context("when given typeof number", () => {
      it("should still rendered normally", () => {
        cy.mount(
          <Keynote
            data={data}
            keys={keys}
            keyLabels={keys?.map((key) => keyLabels[key])}
          />
        );

        Object.values(data).map((value) => {
          if (typeof value === "number") {
            cy.findByText(value).should("exist");
          }
        });
      });
    });

    context("when given typeof date", () => {
      it("should convert to local date string", () => {
        cy.mount(
          <Keynote
            data={data}
            keys={keys}
            keyLabels={keys?.map((key) => keyLabels[key])}
          />
        );

        Object.values(data).map((value) => {
          if (value instanceof Date) {
            cy.findByText(value?.toLocaleDateString()).should("exist");
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
