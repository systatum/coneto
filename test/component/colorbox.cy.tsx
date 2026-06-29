import { Colorbox, ColorboxProps } from "./../../components/colorbox";
import { Button } from "./../../components/button";
import {
  RiHome2Line,
  RiLogoutBoxLine,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";
import { useState } from "react";
import { css } from "styled-components";

describe("Colorbox", () => {
  function ProductColorbox(
    props: ColorboxProps & {
      withOnChange?: boolean;
    }
  ) {
    const [value, setValue] = useState("");
    return (
      <Colorbox
        label="Color"
        value={value}
        onChange={
          props?.withOnChange ? (e) => setValue(e.target.value) : undefined
        }
        {...props}
      />
    );
  }

  context("styles", () => {
    context("self", () => {
      context("when given border-radius 12px", () => {
        it("should render with border-radius 12px", () => {
          cy.mount(
            <ProductColorbox
              withOnChange
              styles={{
                self: css`
                  border-radius: 12px;
                `,
              }}
            />
          );

          cy.findByLabelText("colorbox").should(
            "have.css",
            "border-radius",
            "12px"
          );
        });
      });
    });

    context("textInputGroupStyle", () => {
      context("when given padding 30px", () => {
        it("should render with padding 30px", () => {
          cy.mount(
            <ProductColorbox
              withOnChange
              styles={{
                textInputGroupStyle: css`
                  padding: 30px;
                `,
              }}
            />
          );

          cy.findByLabelText("colorbox-input-group")
            .should("have.css", "padding-top", "30px")
            .and("have.css", "padding-right", "30px")
            .and("have.css", "padding-bottom", "30px")
            .and("have.css", "padding-left", "30px");
        });
      });
    });

    context("boxStyle", () => {
      context("when given background red", () => {
        it("should render box with rgb(255, 0, 0)", () => {
          cy.mount(
            <ProductColorbox
              withOnChange
              styles={{
                boxStyle: css`
                  background-color: red;
                `,
              }}
            />
          );

          cy.findByLabelText("colorbox-box").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("textInputStyle", () => {
      context("when given font-size 20px", () => {
        it("should render with font-size 20px", () => {
          cy.mount(
            <ProductColorbox
              withOnChange
              styles={{
                textInputStyle: css`
                  font-size: 20px;
                `,
              }}
            />
          );

          cy.findByLabelText("colorbox-input").should(
            "have.css",
            "font-size",
            "20px"
          );
        });
      });
    });
  });

  context("onChange", () => {
    context("when given", () => {
      it("should change the value", () => {
        cy.mount(<ProductColorbox withOnChange />);

        cy.findByRole("textbox")
          .click()
          .type("1234")
          .should("have.value", "1234");
      });
    });

    context("when not given", () => {
      it("should not changes the value", () => {
        cy.mount(<ProductColorbox />);

        cy.findByRole("textbox").type("1234").should("have.value", "");
      });
    });
  });

  context("with dropdowns", () => {
    it("renders initialize drawer with min-width 200px", () => {
      cy.mount(
        <Colorbox
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
        <Colorbox
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

      cy.findByRole("button").should("have.css", "height", "32px");
      cy.findAllByLabelText("field-lane-wrapper")
        .eq(0)
        .should("have.css", "height", "34px");
    });

    context("width", () => {
      context("when given", () => {
        it("should render the width", () => {
          cy.mount(
            <Colorbox
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
          <Colorbox
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
