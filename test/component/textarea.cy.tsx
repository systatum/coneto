import { Textarea, TextareaProps } from "./../../components/textarea";
import { Button } from "./../../components/button";
import {
  RiHome2Line,
  RiLogoutBoxLine,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";
import { useState } from "react";

describe("Textarea", () => {
  function ProductTextarea(
    props: TextareaProps & {
      withOnChange?: boolean;
    }
  ) {
    const [value, setValue] = useState("");

    return (
      <Textarea
        value={value}
        onChange={
          props?.withOnChange ? (e) => setValue(e.target.value) : undefined
        }
        {...props}
      />
    );
  }

  context("autogrow", () => {
    it("renders with the default height of 68px", () => {
      cy.mount(<ProductTextarea autogrow />);

      cy.get("#textarea").should("have.css", "height", "68px");
    });

    context("when typing", () => {
      it("increases the height as content grows", () => {
        cy.mount(<ProductTextarea withOnChange autogrow />);

        cy.get("#textarea")
          .should("have.css", "height", "68px")
          .type("halo{enter}my name{enter}is{enter}john{enter}doe");
        cy.get("#textarea").should("have.css", "height", "104px");
      });
    });

    context("when provides initial value", () => {
      it("renders with a height larger than the default", () => {
        cy.mount(
          <ProductTextarea
            value={`
            Line 1
Line 2
Line 3
Line 4
Line 5
Line 6
Line 7
Line 8
Line 9
          `}
            autogrow
          />
        );

        cy.get("#textarea").should("have.css", "height", "212px");
      });
    });
  });

  context("width", () => {
    context("when given 250px", () => {
      it("should have the correct width", () => {
        cy.mount(<ProductTextarea width={250} />);

        cy.get("#textarea").should("have.css", "width", "250px");
      });
    });
  });

  context("onChange", () => {
    context("when given", () => {
      it("should change the value", () => {
        cy.mount(<ProductTextarea withOnChange />);

        cy.get("#textarea").type("Test").should("have.value", "Test");
      });
    });

    context("when not given", () => {
      it("should not changes the value", () => {
        cy.mount(<ProductTextarea />);

        cy.get("#textarea").type("Test").should("have.value", "");
      });
    });
  });

  context("with dropdowns", () => {
    it("renders initialize drawer with min-width 200px", () => {
      cy.mount(
        <Textarea
          dropdowns={[
            {
              caption: "Button",
              options: [
                {
                  text: "On-site",
                  value: "1",
                  icon: { image: RiHome2Line },
                },
                {
                  text: "WFH",
                  value: "2",
                  icon: { image: RiUser2Line },
                },
                {
                  text: "Sick leave",
                  value: "3",
                  icon: { image: RiSettings2Line },
                },
                {
                  text: "Annual leave",
                  value: "4",
                  icon: { image: RiLogoutBoxLine },
                },
              ],
            },
          ]}
        />
      );

      cy.findByText("Button").click();

      cy.findByLabelText("tip-menu").should("have.css", "width", "200px");
    });

    it("renders with similar height", () => {
      cy.mount(
        <Textarea
          dropdowns={[
            {
              caption: "Button",
              options: [
                {
                  text: "On-site",
                  value: "1",
                  icon: { image: RiHome2Line },
                },
                {
                  text: "WFH",
                  value: "2",
                  icon: { image: RiUser2Line },
                },
                {
                  text: "Sick leave",
                  value: "3",
                  icon: { image: RiSettings2Line },
                },
                {
                  text: "Annual leave",
                  value: "4",
                  icon: { image: RiLogoutBoxLine },
                },
              ],
            },
          ]}
        />
      );

      cy.findAllByRole("button").eq(0).should("have.css", "height", "68px");
      cy.findAllByLabelText("field-lane-wrapper")
        .eq(0)
        .should("have.css", "height", "70px");
    });

    context("width", () => {
      context("when given", () => {
        it("should render the width", () => {
          cy.mount(
            <Textarea
              dropdowns={[
                {
                  caption: "Width",
                  width: "100px",
                  render: ({ render }) =>
                    render(
                      <Button.TipMenuContainer>
                        Buttton with Width
                      </Button.TipMenuContainer>
                    ),
                },
              ]}
            />
          );

          cy.findByText("Width")
            .parent()
            .then(($el) => {
              const width = $el.css("width");

              expect(parseFloat(width)).to.be.closeTo(100, 1);
            })
            .should("have.css", "align-items", "center")
            .and("have.css", "justify-content", "center");
        });
      });
    });

    context("when given multiple", () => {
      it("renders more than one dropdown", () => {
        cy.mount(
          <Textarea
            dropdowns={[
              {
                caption: "Dropdown 1",
                width: "100px",
                render: ({ render }) =>
                  render(
                    <Button.TipMenuContainer>
                      Drawer on Dropdown 1
                    </Button.TipMenuContainer>
                  ),
              },
              {
                caption: "Dropdown 2",
                width: "100px",
                render: ({ render }) =>
                  render(
                    <Button.TipMenuContainer>
                      Drawer on Dropdown 2
                    </Button.TipMenuContainer>
                  ),
              },
            ]}
          />
        );

        cy.findByText("Drawer on Dropdown 1").should("not.exist");
        cy.findByText("Dropdown 1").click();
        cy.findByText("Drawer on Dropdown 1").should("exist");

        cy.findByText("Drawer on Dropdown 2").should("not.exist");
        cy.findByText("Dropdown 2").click();
        cy.findByText("Drawer on Dropdown 2").should("exist");
      });
    });
  });
});
