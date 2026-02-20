import {
  TreeList,
  TreeListActionsProps,
  TreeListContentProps,
} from "./../../components/treelist";
import {
  RiAddBoxLine,
  RiAtLine,
  RiSearchLine,
  RiTable2,
} from "@remixicon/react";
import { StatefulForm } from "./../../components/stateful-form";

describe("Treelist", () => {
  context("common behavior", () => {
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

    function TreeListDefault() {
      return (
        <TreeList
          content={TREE_LIST_DATA}
          onMouseEnter={() => console.log("now is hovering treelist")}
          onMouseLeave={() => console.log("now is leaving treelist")}
          onClick={() => console.log("now is clicking treelist")}
        />
      );
    }

    context("onMouseEnter", () => {
      context("when hovering", () => {
        it("should give callback", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<TreeListDefault />);
          cy.findByLabelText("tree-list-wrapper").trigger("mouseover");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is hovering treelist"
          );
        });
      });
    });

    context("onMouseLeave", () => {
      context("when hover & leave", () => {
        it("should give callback", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<TreeListDefault />);
          cy.findByLabelText("tree-list-wrapper")
            .trigger("mouseover")
            .trigger("mouseout");

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is hovering treelist"
          );
          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is leaving treelist"
          );
        });
      });
    });

    context("onClick", () => {
      context("when clicking", () => {
        it("should give callback", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(<TreeListDefault />);
          cy.findByLabelText("tree-list-wrapper").click();

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "now is clicking treelist"
          );
        });
      });
    });
  });

  context("alwaysShowDragIcon", () => {
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

    context("when given false", () => {
      it("renders with closed items", () => {
        cy.mount(
          <TreeList
            alwaysShowDragIcon={false}
            showHierarchyLine
            collapsible
            draggable
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.findAllByLabelText("draggable-request")
          .eq(0)
          .should("not.be.visible")
          .and("have.css", "opacity", "0");
        cy.contains("Adam Noto Hakarsa").trigger("mouseover");
        cy.findAllByLabelText("draggable-request")
          .eq(0)
          .should("be.visible")
          .and("have.css", "opacity", "1");
      });
    });

    context("when given true", () => {
      it("shows the drag icon only on hover", () => {
        cy.mount(
          <TreeList
            alwaysShowDragIcon={true}
            showHierarchyLine
            collapsible
            draggable
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.findAllByLabelText("draggable-request")
          .eq(0)
          .should("be.visible")
          .and("have.css", "opacity", "1");
        cy.contains("Adam Noto Hakarsa").trigger("mouseover");
      });
    });

    context("when not given", () => {
      it("defaults to always showing the drag icon", () => {
        cy.mount(
          <TreeList
            showHierarchyLine
            collapsible
            draggable
            content={TREE_LIST_DATA}
            emptySlate={<p>Not found.</p>}
          />
        );

        cy.findAllByLabelText("draggable-request")
          .eq(0)
          .should("be.visible")
          .and("have.css", "opacity", "1");
      });
    });
  });

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

    context("with subMenu", () => {
      context("with show", () => {
        const TREE_LIST_ACTIONS_WITH_RENDER: TreeListActionsProps[] = [
          {
            id: "add-new-branch",
            icon: RiAddBoxLine,
            caption: "Add New Branch",
            subMenu: ({ show }) =>
              show(
                <StatefulForm
                  fields={[
                    {
                      name: "division_name",
                      title: "Division Name",
                      type: "text",
                      required: true,
                    },
                  ]}
                  formValues={{
                    division_name: "",
                  }}
                  onChange={({ currentState }) => console.log(currentState)}
                  mode="onChange"
                />
              ),
          },
          {
            id: "table-view",
            caption: "Table View",
            onClick: ({ setActive }) => {
              setActive(true);
            },
            icon: RiTable2,
          },
        ];

        it("renders action with tip drawer & arrow", () => {
          cy.mount(
            <TreeList
              content={TREE_LIST_DATA}
              actions={TREE_LIST_ACTIONS_WITH_RENDER}
              emptySlate={<p>Not found.</p>}
            />
          );

          cy.findByText("Division Name").should("not.exist");

          cy.findByText("Add New Branch").should("exist").click();
          cy.findByText("Division Name").should("exist");

          cy.findByLabelText("tooltip-arrow").should("be.visible");
        });
      });

      context("with render", () => {
        const TREE_LIST_ACTIONS_WITH_RENDER: TreeListActionsProps[] = [
          {
            id: "add-new-branch",
            icon: RiAddBoxLine,
            caption: "Add New Branch",
            subMenu: ({ render }) =>
              render(
                <StatefulForm
                  fields={[
                    {
                      name: "division_name",
                      title: "Division Name",
                      type: "text",
                      required: true,
                    },
                  ]}
                  formValues={{
                    division_name: "",
                  }}
                  onChange={({ currentState }) => console.log(currentState)}
                  mode="onChange"
                />
              ),
          },
          {
            id: "table-view",
            caption: "Table View",
            onClick: ({ setActive }) => {
              setActive(true);
            },
            icon: RiTable2,
          },
        ];

        it("renders action with tip drawer", () => {
          cy.mount(
            <TreeList
              content={TREE_LIST_DATA}
              actions={TREE_LIST_ACTIONS_WITH_RENDER}
              emptySlate={<p>Not found.</p>}
            />
          );

          cy.findByText("Division Name").should("not.exist");

          cy.findByText("Add New Branch").should("exist").click();
          cy.findByText("Division Name").should("exist");

          cy.findByLabelText("tooltip-arrow").should("not.be.visible");
        });
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
