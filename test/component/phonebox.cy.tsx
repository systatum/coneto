import {
  Phonebox,
  PhoneboxCountryCode,
  PhoneboxProps,
} from "./../../components/phonebox";
import { Button } from "./../../components/button";
import {
  RiHome2Line,
  RiLogoutBoxLine,
  RiSettings2Line,
  RiUser2Line,
} from "@remixicon/react";
import { css } from "styled-components";
import { useState } from "react";
import { COUNTRY_CODES } from "./../../constants/countries";
import { StatefulOnChangeType } from "./../../components/stateful-form";

describe("Phonebox", () => {
  function ProductPhonebox(props?: PhoneboxProps) {
    interface ValueProps {
      phone?: string;
      country_code?: PhoneboxCountryCode;
    }

    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US"
    )!;

    const [value, setValue] = useState<ValueProps>({
      phone: "",
      country_code: DEFAULT_COUNTRY_CODES,
    });

    const handleChange = (e: StatefulOnChangeType) => {
      const { name, value } = e.target;
      setValue((prev) => ({ ...prev, [name]: value }));
    };

    return (
      <Phonebox
        mobile
        value={value.phone}
        countryCodeValue={value.country_code}
        onChange={handleChange}
        {...props}
      />
    );
  }
  context("mobile", () => {
    it("renders the drawer with in the bottom screen", () => {
      cy.mount(<ProductPhonebox mobile />);
      cy.findByLabelText("phonebox-country-toggle").click();
      cy.findByLabelText("combobox-drawer-mobile")
        .should("have.css", "bottom", "10px")
        .and("have.css", "position", "fixed");
    });

    it("renders the drawer with height 220px", () => {
      cy.mount(<ProductPhonebox mobile />);

      cy.findByLabelText("phonebox-country-toggle").click();
      cy.findByLabelText("combobox-drawer-mobile").should(
        "have.css",
        "height",
        "220px"
      );
    });

    context("drawerHeight", () => {
      context("when given 400px", () => {
        it("renders the drawer with height 400px", () => {
          cy.mount(<ProductPhonebox mobile drawerHeight="400px" />);
          cy.findByLabelText("phonebox-country-toggle").click();
          cy.findByLabelText("combobox-drawer-mobile").should(
            "have.css",
            "height",
            "400px"
          );
        });
      });
    });
  });

  context("with dropdowns", () => {
    it("renders initialize drawer with min-width 200px", () => {
      cy.mount(
        <Phonebox
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
        <Phonebox
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

      cy.findAllByRole("button").eq(0).should("have.css", "height", "32px");
      cy.findAllByLabelText("field-lane-wrapper")
        .eq(0)
        .should("have.css", "height", "34px");
    });

    context("width", () => {
      context("when given", () => {
        it("should render the width", () => {
          cy.mount(
            <Phonebox
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
          <Phonebox
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

  context("country code drawer", () => {
    context("searchbox", () => {
      it("renders always less than drawer width", () => {
        cy.mount(
          <Phonebox
            styles={{
              controlStyle: css`
                width: 260px;
              `,
            }}
          />
        );

        cy.findByLabelText("combobox-drawer").should("not.exist");
        cy.findByLabelText("phonebox-country-toggle").click();
        cy.findByLabelText("combobox-drawer").then(($drawer) => {
          const drawerWidth = $drawer[0].getBoundingClientRect().width;

          cy.findByLabelText("textbox-search").then(($textbox) => {
            const textboxWidth = $textbox[0].getBoundingClientRect().width;
            expect(textboxWidth).to.be.lessThan(drawerWidth);
          });
        });
      });
    });
  });
});
