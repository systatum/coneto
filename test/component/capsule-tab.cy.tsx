import {
  CapsuleTab,
  CapsuleTabContentProps,
} from "./../../components/capsule-tab";

describe("Capsule Tab", () => {
  context("when given", () => {
    const TABS_ITEMS: CapsuleTabContentProps[] = [
      { id: "1", title: "Write", content: "Write" },
      { id: "2", title: "Review", content: "Review" },
    ];
    it("renders on the left side", () => {
      cy.mount(<CapsuleTab tabs={TABS_ITEMS} />);

      cy.findByLabelText("capsule")
        .should("have.css", "justify-content", "normal")
        .and("have.css", "width", "458px");
    });
  });

  context("activeTab", () => {
    context("when given", () => {
      const TABS_ITEMS: CapsuleTabContentProps[] = [
        { id: "1", title: "Write", content: "Write" },
        { id: "2", title: "Review", content: "Review" },
      ];
      it("renders with active equal the id argument", () => {
        cy.mount(<CapsuleTab tabs={TABS_ITEMS} activeTab={"2"} />);
        cy.contains("Write").should("have.css", "color", "rgb(17, 24, 39)");
        cy.contains("Review").should("have.css", "color", "rgb(255, 255, 255)");
      });
    });
  });
});
