import { Crumb } from "../../components/crumb";
import { mount } from "cypress/react";

describe("Crumb Component", () => {
  const CrumbData = [
    { text: "Home", href: "/" },
    { text: "About", href: "/about" },
    { text: "Services", href: "/services" },
    { text: "Contact", href: "/contact" },
  ];
  const CrumbItems = CrumbData.map((data, index) => (
    <Crumb.Item key={index} path={data.href}>
      {data.text}
    </Crumb.Item>
  ));

  context("fontSize", () => {
    context("when a custom fontSize is provided", () => {
      it("renders the crumb links with the correct font size and calculates chevron size", () => {
        mount(<Crumb fontSize={20}>{CrumbItems}</Crumb>);

        cy.get("a").first().should("have.css", "font-size", "20px");
        cy.findByLabelText("crumb")
          .find("svg")
          .first()
          .should(($icon) => {
            const iconSize = parseFloat($icon.css("width"));
            expect(iconSize).to.equal(20 * 1.25);
          });
      });
    });
  });

  context("maxShown", () => {
    context("when 1", () => {
      it("displays one ellipsis on the left and the last link on the right", () => {
        mount(<Crumb maxShown={1}>{CrumbItems}</Crumb>);

        cy.findByLabelText("ellipsis").should("exist");
        cy.contains("Contact").should("exist");
      });
    });

    context("when 2", () => {
      it("displays first link on the left, one ellipsis in the middle, and the last link on the right", () => {
        mount(<Crumb maxShown={2}>{CrumbItems}</Crumb>);

        cy.contains("Home").should("exist");
        cy.findByLabelText("ellipsis").should("exist");
        cy.contains("Contact").should("exist");
      });
    });

    context("when maxShown smaller than data and not having actions", () => {
      it("displays link for the first, ellipsis, and 2 link from latest", () => {
        mount(<Crumb maxShown={3}>{CrumbItems}</Crumb>);

        cy.contains("Home").should("exist");
        cy.contains("Service").should("exist");
        cy.contains("Contact").should("exist");
      });
    });

    context("when maxShown smaller than data and click ellipsis", () => {
      it("displays all links and no ellipsis", () => {
        mount(<Crumb maxShown={5}>{CrumbItems}</Crumb>);

        cy.contains("Home").should("exist");
        cy.contains("About").should("exist");
        cy.contains("Contact").should("exist");
        cy.findByLabelText("ellipsis").should("not.exist");
      });
    });
  });

  context("arrowColor", () => {
    context("when given", () => {
      it("renders arrow icons with the specified color", () => {
        mount(
          <Crumb arrowColor="red" maxShown={4}>
            {CrumbItems}
          </Crumb>
        );

        cy.findAllByLabelText("arrow-icon")
          .eq(0)
          .should("have.css", "color", "rgb(255, 0, 0)");
      });
    });
  });

  context("lastTextColor", () => {
    context("when given", () => {
      it("renders the last crumb link with the specified color", () => {
        mount(<Crumb lastTextColor="green">{CrumbItems}</Crumb>);

        cy.get("a").last().should("have.css", "color", "rgb(0, 128, 0)");
      });
    });
  });

  context("hoverColor", () => {
    context("when default", () => {
      it("uses the default hover color", () => {
        mount(<Crumb>{CrumbItems}</Crumb>);

        cy.get("a")
          .first()
          .invoke("attr", "style", "color: #61a9f9;")
          .should("have.css", "color", "rgb(97, 169, 249)");
      });
    });

    context("when given", () => {
      it("changes the color of the crumb link on hover", () => {
        mount(<Crumb hoverColor="red">{CrumbItems}</Crumb>);

        cy.get("a")
          .first()
          .invoke("attr", "style", "color: red;")
          .should("have.css", "color", "rgb(255, 0, 0)");
      });
    });
  });
});
