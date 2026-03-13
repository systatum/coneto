import { css } from "styled-components";
import {
  CapsuleTab,
  CapsuleTabContentProps,
} from "./../../components/capsule-tab";

describe("Capsule Tab", () => {
  const TABS_ITEMS: CapsuleTabContentProps[] = [
    { id: "1", title: "Write", content: "Write" },
    { id: "2", title: "Review", content: "Review" },
  ];

  context("styles", () => {
    it("renders capsule with 12px for active", () => {
      cy.mount(<CapsuleTab activeTab="1" tabs={TABS_ITEMS} />);

      cy.findAllByLabelText("active-capsule-box")
        .eq(0)
        .should("have.css", "border-radius", "12px");
      cy.findAllByLabelText("hover-capsule-box")
        .eq(0)
        .should("have.css", "border-radius", "12px");
    });

    context("self", () => {
      context("when given padding 20px", () => {
        it("renders the container wrapper with padding 20px", () => {
          cy.mount(
            <CapsuleTab
              activeTab="1"
              styles={{
                self: css`
                  padding: 20px;
                `,
              }}
              tabs={TABS_ITEMS}
            />
          );

          cy.findByLabelText("capsule-tab-wrapper").should(
            "have.css",
            "padding",
            "20px"
          );
        });
      });
    });

    context("contentStyle", () => {
      context("when given padding 20px", () => {
        it("renders the content wrapper with padding 20px", () => {
          cy.mount(
            <CapsuleTab
              activeTab="1"
              styles={{
                contentStyle: css`
                  padding: 20px;
                `,
              }}
              tabs={TABS_ITEMS}
            />
          );

          cy.findByLabelText("capsule-tab-content").should(
            "have.css",
            "padding",
            "20px"
          );
        });
      });
    });
  });

  context("when given", () => {
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
