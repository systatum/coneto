import {
  TreeList,
  TreeListActionsProps,
  TreeListContentProps,
} from "./../../components/treelist";
import { RiAtLine, RiSearchLine } from "@remixicon/react";

describe("Treelist", () => {
  context("selectedItem", () => {
    let TREE_LIST_DATA: TreeListContentProps[];

    beforeEach(() => {
      const setPerson = cy.stub().as("setPerson");

      TREE_LIST_DATA = [
        {
          title: "Member of Technical Staff",
          items: [
            { id: "mts-1", title: "Adam Noto Hakarsa", onClick: setPerson },
            { id: "mts-2", title: "Mohamad Naufal Alim", onClick: setPerson },
          ],
        },
        {
          title: "Product Management Team",
          items: [
            { id: "pmt-1", title: "Samantha Lee", onClick: setPerson },
            { id: "pmt-2", title: "Jason Kim", onClick: setPerson },
            { id: "pmt-3", title: "Rina Patel", onClick: setPerson },
          ],
        },
      ];
    });

    context("when given", () => {
      it("render highlight active item", () => {
        cy.mount(
          <TreeList
            selectedItem="mts-1"
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.contains("Adam Noto Hakarsa")
          .parent()
          .should("have.css", "border-left-color", "rgb(59, 130, 246)");
      });
    });
  });

  context("collapsible", () => {
    let TREE_LIST_DATA: TreeListContentProps[];

    beforeEach(() => {
      const setPerson = cy.stub().as("setPerson");

      TREE_LIST_DATA = [
        {
          title: "Member of Technical Staff",
          collapsible: true,
          items: [
            { id: "mts-1", title: "Adam Noto Hakarsa", onClick: setPerson },
            { id: "mts-2", title: "Mohamad Naufal Alim", onClick: setPerson },
          ],
        },
        {
          title: "Product Management Team",
          collapsible: true,
          items: [
            { id: "pmt-1", title: "Samantha Lee", onClick: setPerson },
            { id: "pmt-2", title: "Jason Kim", onClick: setPerson },
            { id: "pmt-3", title: "Rina Patel", onClick: setPerson },
          ],
        },
      ];
    });

    context("when click list item", () => {
      it("render highlight selected item", () => {
        cy.mount(
          <TreeList content={TREE_LIST_DATA} emptySlate={<p>Not found.</p>} />
        );

        cy.contains("Adam Noto Hakarsa")
          .parent()
          .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
        cy.contains("Adam Noto Hakarsa")
          .click()
          .parent()
          .should("have.css", "border-left-color", "rgb(59, 130, 246)");
      });
    });

    context("when click toggle", () => {
      it("renders collapse and expand items", () => {
        cy.mount(
          <TreeList content={TREE_LIST_DATA} emptySlate={<p>Not found.</p>} />
        );

        cy.contains("Adam Noto Hakarsa").should("be.visible");

        cy.contains("Member of Technical Staff").click();
        cy.contains("Adam Noto Hakarsa").should("not.be.visible");

        cy.contains("Member of Technical Staff").click();
        cy.contains("Adam Noto Hakarsa").should("be.visible");
      });
    });
  });

  context("actions", () => {
    let TREE_LIST_DATA: TreeListContentProps[];
    let TREE_LIST_ACTIONS: TreeListActionsProps[];

    beforeEach(() => {
      const onDiscover = cy.stub().as("onDiscover");
      const onMention = cy.stub().as("onMention");
      const setPerson = cy.stub().as("setPerson");

      TREE_LIST_DATA = [
        {
          title: "Member of Technical Staff",
          items: [
            { id: "mts-1", title: "Adam Noto Hakarsa", onClick: setPerson },
            { id: "mts-2", title: "Mohamad Naufal Alim", onClick: setPerson },
          ],
        },
        {
          title: "Product Management Team",
          items: [
            { id: "pmt-1", title: "Samantha Lee", onClick: setPerson },
            { id: "pmt-2", title: "Jason Kim", onClick: setPerson },
            { id: "pmt-3", title: "Rina Patel", onClick: setPerson },
          ],
        },
      ];

      TREE_LIST_ACTIONS = [
        {
          title: "Discover",
          onClick: onDiscover,
          icon: RiSearchLine,
        },
        {
          title: "Mention",
          onClick: onMention,
          icon: RiAtLine,
        },
      ];
    });

    context("when given", () => {
      it("renders content action", () => {
        cy.mount(
          <TreeList
            content={TREE_LIST_DATA}
            actions={TREE_LIST_ACTIONS}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.findByText("Discover").should("exist").click();
        cy.get("@onDiscover").should("have.been.calledOnce");

        cy.findByText("Mention").should("exist").click();
        cy.get("@onMention").should("have.been.calledOnce");
      });
    });
  });
});
