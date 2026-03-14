import { css } from "styled-components";
import {
  CapsuleTab,
  CapsuleTabContentProps,
  CapsuleTabStylesProps,
} from "./../../components/capsule-tab";
import { useState } from "react";

describe("Capsule Tab", () => {
  const TABS_ITEMS: CapsuleTabContentProps[] = [
    { id: "1", title: "Write", content: "Write Tab" },
    { id: "2", title: "Review", content: "Review Tab" },
  ];

  function ProductCapsuleTab({
    withCallback,
    styles,
  }: {
    styles?: CapsuleTabStylesProps;
    withCallback?: boolean;
  }) {
    const [activeTab, setActiveTab] = useState("2");

    return (
      <CapsuleTab
        tabs={TABS_ITEMS}
        activeTab={activeTab}
        onTabChange={
          withCallback
            ? (id) => {
                setActiveTab(id);
                console.log(`the activeTab now in the id: ${id}`);
              }
            : undefined
        }
        styles={styles}
      />
    );
  }

  context("styles", () => {
    context("capsuleWrapperStyle", () => {
      it("renders with padding left and right with 5px", () => {
        cy.mount(<ProductCapsuleTab />);

        const capsule = cy.findAllByLabelText("capsule").eq(0);

        capsule.should("have.css", "padding-left", "5px");
        capsule.should("have.css", "padding-right", "5px");
      });

      context("when given padding left and right by 20px", () => {
        it("renders with those styles", () => {
          cy.mount(
            <ProductCapsuleTab
              styles={{
                capsuleWrapperStyle: css`
                  padding-left: 20px;
                  padding-right: 20px;
                `,
              }}
            />
          );

          const capsule = cy.findAllByLabelText("capsule").eq(0);

          capsule.should("have.css", "padding-left", "20px");
          capsule.should("have.css", "padding-right", "20px");
        });
      });
    });

    it("renders capsule with 12px for active", () => {
      cy.mount(
        <ProductCapsuleTab
          styles={{
            self: css`
              padding: 20px;
            `,
          }}
        />
      );

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
            <ProductCapsuleTab
              styles={{
                self: css`
                  padding: 20px;
                `,
              }}
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

  context("tabs", () => {
    context("when given", () => {
      it("renders on the left side", () => {
        cy.mount(<ProductCapsuleTab />);

        cy.findByLabelText("capsule")
          .should("have.css", "justify-content", "normal")
          .and("have.css", "width", "458px");
      });
    });
  });

  context("activeTab", () => {
    context("when given", () => {
      it("renders with initialize and equal with id state", () => {
        cy.mount(<ProductCapsuleTab />);
        cy.contains("Write").should("have.css", "color", "rgb(17, 24, 39)");
        cy.contains("Review").should("have.css", "color", "rgb(255, 255, 255)");

        cy.findByText("Review Tab").should("be.visible");
      });

      context("when clicking", () => {
        it("renders the content and can move to other tab", () => {
          cy.mount(<ProductCapsuleTab />);
          cy.findByText("Write Tab").should("not.exist");
          cy.findByText("Review Tab").should("exist");

          cy.contains("Write").click();

          cy.findByText("Write Tab").should("exist");
          cy.findByText("Review Tab").should("not.exist");
        });
      });
    });

    context("when given onTabChange", () => {
      it("renders the content fully using activeTab from outer", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<ProductCapsuleTab withCallback />);
        cy.findByText("Write Tab").should("not.exist");
        cy.findByText("Review Tab").should("exist");

        cy.contains("Write").click();

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the activeTab now in the id: 1"
        );

        cy.findByText("Write Tab").should("exist");
        cy.findByText("Review Tab").should("not.exist");

        cy.contains("Review").click();

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "the activeTab now in the id: 2"
        );

        cy.findByText("Write Tab").should("not.exist");
        cy.findByText("Review Tab").should("exist");
      });
    });
  });
});
