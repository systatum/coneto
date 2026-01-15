import { RiFile2Line, RiNewspaperLine } from "@remixicon/react";
import { Capsule, CapsuleContentProps } from "./../../components/capsule";

describe("Capsule", () => {
  context("when only title", () => {
    it("renders capsule only with text", () => {
      cy.mount(<Capsule activeTab="new" tabs={VIEW_ONLY_TITLE_MODES} />);
      cy.findByText("List").should("exist");
      cy.findByText("New").should("exist");
      cy.findAllByLabelText("capsule-icon").should("have.length", 0);
    });

    it("renders capsule with 8px for active", () => {
      cy.mount(<Capsule activeTab="new" tabs={VIEW_ONLY_TITLE_MODES} />);
      cy.findByText("List").should("exist");
      cy.findByText("New").should("exist");
      cy.findAllByLabelText("capsule-icon").should("have.length", 0);

      cy.findAllByLabelText("capsule")
        .eq(0)
        .should("have.css", "border-radius", "12px");
      cy.findAllByLabelText("active-capsule-box")
        .eq(0)
        .should("have.css", "border-radius", "8px");
      cy.findAllByLabelText("hover-capsule-box")
        .eq(0)
        .should("have.css", "border-radius", "8px");
    });
  });

  context("when only icon", () => {
    it("renders capsule only with icon", () => {
      cy.mount(<Capsule activeTab="new" tabs={VIEW_ONLY_ICON_MODES} />);
      cy.findByText("List").should("not.exist");
      cy.findByText("New").should("not.exist");
      cy.findAllByLabelText("capsule-icon").eq(0).should("exist");
      cy.findAllByLabelText("capsule-icon").eq(1).should("exist");
    });
  });

  context("when given title and icon", () => {
    it("renders capsule with icon & text", () => {
      cy.mount(<Capsule activeTab="new" tabs={VIEW_WITH_ICON_MODES} />);
      cy.findByText("List").should("exist");
      cy.findByText("New").should("exist");
      cy.findAllByLabelText("capsule-icon").eq(0).should("exist");
      cy.findAllByLabelText("capsule-icon").eq(1).should("exist");
      cy.findAllByRole("tab")
        .eq(0)
        .should("have.css", "gap", "4px")
        .and("have.css", "font-size", "12px");
    });
  });

  context("with iconSize", () => {
    it("renders with given number", () => {
      cy.mount(
        <Capsule iconSize={20} activeTab="new" tabs={VIEW_ONLY_ICON_MODES} />
      );

      cy.findAllByLabelText("capsule-icon")
        .eq(0)
        .should("exist")
        .and("have.attr", "width", "20")
        .and("have.attr", "height", "20");
      cy.findAllByLabelText("capsule-icon")
        .eq(1)
        .should("exist")
        .and("have.attr", "width", "20")
        .and("have.attr", "height", "20");
    });
  });

  context("with fontSize", () => {
    it("renders with given number", () => {
      cy.mount(
        <Capsule fontSize={20} activeTab="new" tabs={VIEW_ONLY_TITLE_MODES} />
      );

      cy.findAllByRole("tab").eq(0).should("have.css", "font-size", "20px");
      cy.findAllByRole("tab").eq(1).should("have.css", "font-size", "20px");
    });
  });
});

const VIEW_WITH_ICON_MODES: CapsuleContentProps[] = [
  {
    id: "new",
    title: "New",
    icon: RiFile2Line,
  },
  {
    id: "list",
    title: "List",
    icon: RiNewspaperLine,
  },
];

const VIEW_ONLY_TITLE_MODES: CapsuleContentProps[] = [
  {
    id: "new",
    title: "New",
  },
  {
    id: "list",
    title: "List",
  },
];

const VIEW_ONLY_ICON_MODES: CapsuleContentProps[] = [
  {
    id: "new",
    icon: RiFile2Line,
  },
  {
    id: "list",
    icon: RiNewspaperLine,
  },
];
