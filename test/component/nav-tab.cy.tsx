import {
  ReviewTabContent,
  WriteTabContent,
} from "./../../components/nav-tab.stories";
import { NavTab, NavTabContentProps } from "./../../components/nav-tab";
import { css } from "styled-components";

describe("NavTab", () => {
  context("active color", () => {
    context("when given", () => {
      it("renders with color", () => {
        cy.mount(
          <NavTab tabs={TABS_ITEMS} activeTab={"2"} activeColor="red" />
        );
        cy.findByLabelText("nav-tab-list").should(
          "have.css",
          "background-color",
          "rgb(255, 0, 0)"
        );
      });
    });
  });

  context("with box style", () => {
    context("when given", () => {
      it("renders with expected", () => {
        cy.mount(
          <NavTab
            tabs={TABS_ITEMS}
            activeTab={"2"}
            boxStyle={css`
              padding: 20px;
              background-color: white;
            `}
          />
        );
        cy.findAllByLabelText("nav-tab-box")
          .eq(0)
          .should("have.css", "padding", "20px")
          .and("have.css", "background-color", "rgb(255, 255, 255)");
      });
    });
  });

  context("with children", () => {
    context("when given", () => {
      it("renders with expected", () => {
        cy.mount(
          <NavTab
            tabs={TABS_ITEMS}
            activeTab={"2"}
            boxStyle={css`
              padding: 20px;
              background-color: white;
            `}
          >
            <div
              style={{
                padding: "8px",
              }}
            >
              This is description from children
            </div>
          </NavTab>
        );
        cy.findByText("This is description from children").should("be.visible");
      });
    });
  });
});

const TABS_ITEMS: NavTabContentProps[] = [
  {
    id: "1",
    title: "Write",
    content: <WriteTabContent />,
    onClick: () => {
      console.log("test tab 1");
    },
  },
  {
    id: "2",
    title: "Review",
    content: <ReviewTabContent />,
    onClick: () => {
      console.log("test tab 2");
    },
  },
];
