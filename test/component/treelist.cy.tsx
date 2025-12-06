import {
  TreeList,
  TreeListActionsProps,
  TreeListContentProps,
} from "./../../components/treelist";
import { RiAtLine, RiSearchLine } from "@remixicon/react";

describe("Treelist", () => {
  context("initialState", () => {
    let TREE_LIST_DATA: TreeListContentProps[];

    beforeEach(() => {
      const setPerson = cy.stub().as("setPerson");

      TREE_LIST_DATA = [
        {
          id: "member",
          caption: "Member of Technical Staff",
          initialState: "closed",
          items: [
            { id: "mts-1", caption: "Adam Noto Hakarsa", onClick: setPerson },
            { id: "mts-2", caption: "Mohamad Naufal Alim", onClick: setPerson },
          ],
        },
        {
          id: "product",
          caption: "Product Management Team",
          items: [
            { id: "pmt-1", caption: "Samantha Lee", onClick: setPerson },
            { id: "pmt-2", caption: "Jason Kim", onClick: setPerson },
            { id: "pmt-3", caption: "Rina Patel", onClick: setPerson },
          ],
        },
      ];
    });

    context("when given", () => {
      it("renders with closed items", () => {
        cy.mount(
          <TreeList
            showHierarchyLine
            collapsible
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.contains("Adam Noto Hakarsa").should("not.exist");
        cy.findByText("Member of Technical Staff").click();
      });
    });
  });

  context("selectedItem", () => {
    let TREE_LIST_DATA: TreeListContentProps[];

    beforeEach(() => {
      const setPerson = cy.stub().as("setPerson");

      TREE_LIST_DATA = [
        {
          id: "member",
          caption: "Member of Technical Staff",
          items: [
            { id: "mts-1", caption: "Adam Noto Hakarsa", onClick: setPerson },
            { id: "mts-2", caption: "Mohamad Naufal Alim", onClick: setPerson },
          ],
        },
        {
          id: "product",
          caption: "Product Management Team",
          items: [
            { id: "pmt-1", caption: "Samantha Lee", onClick: setPerson },
            { id: "pmt-2", caption: "Jason Kim", onClick: setPerson },
            { id: "pmt-3", caption: "Rina Patel", onClick: setPerson },
          ],
        },
      ];
    });

    context("when given", () => {
      it("renders highlight active item", () => {
        cy.mount(
          <TreeList
            selectedItem="mts-1"
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.contains("Adam Noto Hakarsa")
          .parent()
          .parent()
          .should("have.css", "border-left-color", "rgb(59, 130, 246)");
      });
    });
  });

  context("caption", () => {
    let TREE_LIST_DATA: TreeListContentProps[];

    beforeEach(() => {
      const setPerson = cy.stub().as("setPerson");

      TREE_LIST_DATA = [
        {
          id: "member",
          caption: "Member of Technical Staff",
          items: [
            { id: "mts-1", caption: "Adam Noto Hakarsa", onClick: setPerson },
            { id: "mts-2", caption: "Mohamad Naufal Alim", onClick: setPerson },
          ],
        },
        {
          id: "product",
          caption: "Product Management Team",
          items: [
            { id: "pmt-1", caption: "Samantha Lee", onClick: setPerson },
            { id: "pmt-2", caption: "Jason Kim", onClick: setPerson },
            { id: "pmt-3", caption: "Rina Patel", onClick: setPerson },
          ],
        },
      ];
    });

    it("renders all group and item text", () => {
      cy.mount(
        <TreeList content={TREE_LIST_DATA} emptySlate={<p>Not found.</p>} />
      );
      TREE_LIST_DATA.map((props) => {
        cy.findByText(props.caption).should("be.visible");
        {
          props.items.map((item) => {
            cy.findByText(item.caption).should("be.visible");
          });
        }
      });
    });
  });

  context("collapsible", () => {
    let TREE_LIST_DATA: TreeListContentProps[];

    beforeEach(() => {
      const setPerson = cy.stub().as("setPerson");

      TREE_LIST_DATA = [
        {
          id: "member",
          caption: "Member of Technical Staff",
          items: [
            { id: "mts-1", caption: "Adam Noto Hakarsa", onClick: setPerson },
            { id: "mts-2", caption: "Mohamad Naufal Alim", onClick: setPerson },
          ],
        },
        {
          id: "product",
          caption: "Product Management Team",
          items: [
            { id: "pmt-1", caption: "Samantha Lee", onClick: setPerson },
            { id: "pmt-2", caption: "Jason Kim", onClick: setPerson },
            { id: "pmt-3", caption: "Rina Patel", onClick: setPerson },
          ],
        },
      ];
    });

    context("when click list item", () => {
      it("renders highlight selected item", () => {
        cy.mount(
          <TreeList
            collapsible
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.contains("Adam Noto Hakarsa")
          .parent()
          .parent()
          .should("have.css", "border-left-color", "rgba(0, 0, 0, 0)");
        cy.contains("Adam Noto Hakarsa")
          .click()
          .parent()
          .parent()
          .should("have.css", "border-left-color", "rgb(59, 130, 246)");
      });
    });

    context("when click toggle", () => {
      it("renders collapse and expand items", () => {
        cy.mount(
          <TreeList
            collapsible
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
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
          id: "member",
          caption: "Member of Technical Staff",
          items: [
            { id: "mts-1", caption: "Adam Noto Hakarsa", onClick: setPerson },
            { id: "mts-2", caption: "Mohamad Naufal Alim", onClick: setPerson },
          ],
        },
        {
          id: "product",
          caption: "Product Management Team",
          items: [
            { id: "pmt-1", caption: "Samantha Lee", onClick: setPerson },
            { id: "pmt-2", caption: "Jason Kim", onClick: setPerson },
            { id: "pmt-3", caption: "Rina Patel", onClick: setPerson },
          ],
        },
      ];

      TREE_LIST_ACTIONS = [
        {
          id: "discover",
          caption: "Discover",
          onClick: onDiscover,
          icon: RiSearchLine,
        },
        {
          id: "mention",
          caption: "Mention",
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

    context("with setActive", () => {
      const TREE_LIST_ACTIONS_WITH_ACTIVE = [
        {
          id: "discover",
          caption: "Discover",
          onClick: ({ setActive }) => {
            console.log("discover was selected");
            setActive(true);
          },
          icon: RiSearchLine,
        },
        {
          id: "mention",
          caption: "Mention",
          onClick: ({ setActive }) => {
            console.log("mention was selected");
            setActive(true);
          },
          icon: RiAtLine,
        },
      ];
      context("when clicking", () => {
        it("renders selected active on actions level", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });
          cy.mount(
            <TreeList
              content={TREE_LIST_DATA}
              actions={TREE_LIST_ACTIONS_WITH_ACTIVE}
              emptySlate={<p>Not found.</p>}
            />
          );

          cy.findByText("Discover").should("exist").click();
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "discover was selected"
          );
          cy.findByText("Discover")
            .parent()
            .should("have.css", "border-left-color", "rgb(59, 130, 246)");
        });
      });
    });
  });
});
