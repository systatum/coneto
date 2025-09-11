import { getIdContent } from "test/support/commands";

context("Crumb Component", () => {
  describe("Default", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-crumb--default"));
    });

    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
    ];

    it("Should show limited items and expand on ellipsis click", () => {
      cy.findAllByRole("link").should("have.length", 3);
      cy.findByText("Item 1").should("exist");
      cy.findByText("Item 4").should("exist");
      cy.findByText("Item 5").should("exist");

      cy.findByLabelText("ellipsis").click();

      CRUMB_ITEMS.forEach((label) => {
        cy.findByText(label.label).should("exist");
      });
    });

    it("Should show length items and count the calculate icon size expected", () => {
      cy.findByLabelText("ellipsis").click();

      CRUMB_ITEMS.forEach((data) => {
        cy.findByText(data.label)
          .should("exist")
          .and("have.attr", "href", data.path);
      });

      cy.findByLabelText("crumb").find("svg").should("have.length", 4);

      cy.findByLabelText("crumb")
        .find("svg")
        .each(($icon) => {
          const size = 14 * 1.25;
          expect($icon.width()).to.eq(size);
          expect($icon.height()).to.eq(size);
        });
    });

    it("Should visiting and expected link same like window location", () => {
      cy.findByLabelText("ellipsis").click();
      cy.findByText("Item 2").then(($link) => {
        const href = $link.prop("href");
        cy.window().then((win) => {
          win.history.pushState({}, "", href);
          expect(win.location.pathname).to.eq("/item2");
        });
      });
    });
  });

  describe("Custom", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-crumb--custom"));
    });

    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
      { label: "Item 6", path: "/item6" },
    ];

    it("Should show limited items (max shown 4) with custom styles and expand on ellipsis", () => {
      cy.findAllByRole("link").should("have.length", 4);
      cy.findByText("Item 1").should("exist");
      cy.findByText("Item 4").should("exist");
      cy.findByText("Item 5").should("exist");
      cy.findByText("Item 6").should("exist");

      cy.findByLabelText("ellipsis").click();

      CRUMB_ITEMS.forEach((data) => {
        cy.findByText(data.label)
          .should("exist")
          .and("have.attr", "href", data.path);
      });
    });

    it("Should show length items and count the calculate icon size expected", () => {
      cy.findByLabelText("ellipsis").click();

      CRUMB_ITEMS.forEach((data) => {
        cy.findByText(data.label)
          .should("exist")
          .and("have.attr", "href", data.path);
      });

      cy.findByLabelText("crumb").find("svg").should("have.length", 5);

      cy.findByLabelText("crumb")
        .find("svg")
        .each(($icon) => {
          const size = 16 * 1.25;
          expect($icon.width()).to.eq(size);
          expect($icon.height()).to.eq(size);
        });
    });

    it("Should visiting and expected link same like window location", () => {
      cy.findByLabelText("ellipsis").click();
      cy.findByText("Item 3").then(($link) => {
        const href = $link.prop("href");
        cy.window().then((win) => {
          win.history.pushState({}, "", href);
          expect(win.location.pathname).to.eq("/item3");
        });
      });
    });
  });

  describe("OneData", () => {
    beforeEach(() => {
      cy.visit(getIdContent("controls-crumb--one-data"));
    });

    const CRUMB_ITEMS = [
      { label: "Item 1", path: "/" },
      { label: "Item 2", path: "/item2" },
      { label: "Item 3", path: "/item3" },
      { label: "Item 4", path: "/item4" },
      { label: "Item 5", path: "/item5" },
      { label: "Item 6", path: "/item6" },
    ];

    it("Should only show ellipsis and last item when maxShown it's just one data", () => {
      cy.findAllByRole("link").should("have.length", 1);
      cy.findByText("Item 6").should("exist");

      cy.findByLabelText("ellipsis").should("exist");

      cy.findByLabelText("ellipsis").click();

      CRUMB_ITEMS.forEach((data) => {
        cy.findByText(data.label)
          .should("exist")
          .and("have.attr", "href", data.path);
      });
    });

    it("Should show length items and count the calculate icon size expected", () => {
      cy.findByLabelText("ellipsis").click();

      CRUMB_ITEMS.forEach((data) => {
        cy.findByText(data.label)
          .should("exist")
          .and("have.attr", "href", data.path);
      });

      cy.findByLabelText("crumb").find("svg").should("have.length", 5);

      cy.findByLabelText("crumb")
        .find("svg")
        .each(($icon) => {
          const size = 14 * 1.25;
          expect($icon.width()).to.be.closeTo(size, 0.01);
          expect($icon.height()).to.be.closeTo(size, 0.01);
        });
    });

    it("Should visiting and expected link same like window location", () => {
      cy.findByLabelText("ellipsis").click();
      cy.findByText("Item 3").then(($link) => {
        const href = $link.prop("href");
        cy.window().then((win) => {
          win.history.pushState({}, "", href);
          expect(win.location.pathname).to.eq("/item3");
        });
      });
    });
  });
});
