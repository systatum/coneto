import { css } from "styled-components";
import { Messagebox, MessageboxProps } from "./../../components/messagebox";

describe("Messagebox", () => {
  function ProductMessagebox(props?: Partial<MessageboxProps>) {
    return (
      <Messagebox title="This is title" {...props}>
        {props?.children ?? "This is content"}
      </Messagebox>
    );
  }
  context("height", () => {
    it("renders with fit-content (by default)", () => {
      cy.mount(<ProductMessagebox />);
      cy.findByLabelText("messagebox-container").should(
        "have.css",
        "height",
        "78.59375px"
      );
    });

    context("when given children", () => {
      it("sizes itself to its content", () => {
        cy.mount(
          <ProductMessagebox>
            {Array.from({ length: 12 }).map((_, i) => (
              <p key={i}>{i}</p>
            ))}
          </ProductMessagebox>
        );
        cy.findByLabelText("messagebox-container").should(
          "have.css",
          "height",
          "294.125px"
        );
      });
    });

    context("when given height 400px", () => {
      it("renders height 400px", () => {
        cy.mount(
          <ProductMessagebox
            styles={{
              containerStyle: css`
                height: 400px;
              `,
            }}
          />
        );
        cy.findByLabelText("messagebox-container").should(
          "have.css",
          "height",
          "400px"
        );
      });
    });
  });
});
