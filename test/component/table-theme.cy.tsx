import { css } from "styled-components";
import { RiEdit2Line, RiFilterLine } from "@remixicon/react";
import { Table, type TableColumn } from "./../../components/table";
import { ThemeProvider } from "./../../theme/provider";
import { lightTheme } from "./../../theme/mode/light";

const customTheme = {
  ...lightTheme,
  table: {
    ...lightTheme.table,
    actionButton: {
      ...lightTheme.table.actionButton,
      textColor: "#ff00ff",
      hoverTextColor: "#00ff00",
      toggleTextColor: "#0000ff",
      toggleHoverTextColor: "#0000ff",
    },
    headerTextColor: "#00ffff",
    headerBackgroundColor: "rgb(9, 9, 9)",
    rowBackgroundColor: "rgba(1, 2, 3, 0.5)",
    rowBackdropFilter: "blur(7px)",
    rowBorderBottomColor: "rgb(1, 2, 3)",
    rowBorderSideColor: "transparent",
  },
};

const columns: TableColumn[] = [
  { id: "when", caption: "When", width: "19%" },
  {
    id: "model",
    caption: "Model",
    width: "15%",
    actions: () => ({
      icon: { image: RiFilterLine },
      subMenu: ({ list }) =>
        list([{ caption: "Filter", onClick: () => undefined }]),
    }),
  },
  { id: "item", caption: "Item", width: "17%" },
  { id: "changes", caption: "Changes", width: "32%" },
  { id: "by", caption: "By", width: "17%" },
];

function mountTable() {
  cy.mountWithoutTheme(
    <ThemeProvider mode="light" themes={{ light: customTheme }}>
      <Table
        columns={columns}
        actions={[
          {
            id: "create",
            caption: "Create",
            onClick: () => undefined,
          },
        ]}
        showPagination
      >
        <Table.Row
          rowId="1"
          content={["Nov 24, 2026", "Student", "A very long item name", "—", "Ayu"]}
          actions={() => [
            { caption: "Edit", icon: { image: RiEdit2Line }, onClick: () => undefined },
          ]}
        />
      </Table>
    </ThemeProvider>
  );
}

describe("Table theme integration", () => {
  it("uses table action colors independently from the normal action-button theme", () => {
    mountTable();

    cy.findAllByLabelText("action-button")
      .first()
      .should("have.css", "color", "rgb(255, 0, 255)")
      .realHover();

    cy.wait(400);

    cy.findAllByLabelText("action-button")
      .first()
      .should("have.css", "color", "rgb(0, 255, 0)");
  });

  it("renders header column actions with the header text color as circles", () => {
    mountTable();

    cy.findByLabelText("table-column-action")
      .should("have.css", "color", "rgb(0, 255, 255)")
      .and("have.css", "border-top-left-radius", "9999px")
      .and("have.css", "width", "32px")
      .and("have.css", "height", "32px");
  });

  it("renders pagination controls as 32px circles", () => {
    mountTable();

    cy.findByLabelText("previous-button-pagination")
      .should("have.css", "width", "32px")
      .and("have.css", "height", "32px")
      .and("have.css", "min-height", "32px")
      .and("have.css", "border-top-left-radius", "9999px");

    cy.findByLabelText("next-button-pagination")
      .should("have.css", "width", "32px")
      .and("have.css", "height", "32px");
  });

  it("applies the configured row glass, border, and header styles", () => {
    mountTable();

    cy.findByLabelText("table-row")
      .should("have.css", "background-color", "rgba(1, 2, 3, 0.5)")
      .and("have.css", "backdrop-filter", "blur(7px)")
      .and("have.css", "border-bottom-color", "rgb(1, 2, 3)")
      .and("have.css", "border-left-color", "rgba(0, 0, 0, 0)");

    cy.findByLabelText("table-header").should(
      "have.css",
      "background-image",
      "none"
    );
  });

  it("makes percentage columns fill the header exactly", () => {
    mountTable();

    cy.findByLabelText("table-header").then(($header) => {
      const headerWidth = $header[0].getBoundingClientRect().width;

      cy.get('[aria-label="table-header"] [aria-label="table-row-cell"]').then(
        ($cells) => {
          const total = [...$cells].reduce(
            (sum, cell) => sum + cell.getBoundingClientRect().width,
            0
          );
          expect(total).to.be.closeTo(headerWidth, 3);
        }
      );
    });
  });

  it("keeps row columns aligned when one cell has long content", () => {
    mountTable();

    cy.findByLabelText("table-header").then(($header) => {
      const headerCells = [...$header[0].querySelectorAll('[aria-label="table-row-cell"]')];
      const headerWidths = headerCells.map(
        (cell) => cell.getBoundingClientRect().width
      );

      cy.findByLabelText("table-row").then(($row) => {
        const rowCells = [...$row[0].querySelectorAll('[aria-label="table-row-cell"]')];
        const rowWidths = rowCells.map(
          (cell) => cell.getBoundingClientRect().width
        );

        expect(rowWidths).to.have.length(headerWidths.length);
        rowWidths.forEach((width, index) => {
          expect(width).to.be.closeTo(headerWidths[index], 1);
        });
      });
    });
  });
});
