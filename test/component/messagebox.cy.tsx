import { css } from "styled-components";
import { Messagebox, MessageboxProps } from "./../../components/messagebox";
import { StatefulForm } from "./../../components/stateful-form";

describe("Messagebox", () => {
  function ProductMessagebox(props?: Partial<MessageboxProps>) {
    return (
      <Messagebox title="This is title" {...props}>
        {props?.children ?? "This is content"}
      </Messagebox>
    );
  }

  context("content", () => {
    context("when only given the title", () => {
      it("renders only the title", () => {
        cy.mount(<Messagebox title="This is title" />);
        cy.findByLabelText("messagebox-title").should("exist");
        cy.findByLabelText("messagebox-content").should("not.exist");
      });
    });

    context("when only given the children", () => {
      it("renders only the content", () => {
        cy.mount(<Messagebox>Test</Messagebox>);
        cy.findByLabelText("messagebox-title").should("not.exist");
        cy.findByLabelText("messagebox-content").should("exist");
      });
    });
  });

  context("title", () => {
    context("when given string", () => {
      it("renders the title with string", () => {
        cy.mount(<ProductMessagebox />);
        cy.findByText("This is title").should("exist");
      });
    });

    context("when given react node", () => {
      it("renders the title with element", () => {
        cy.mount(
          <ProductMessagebox
            title={<div aria-label="label-with-react-node">Hi john doe</div>}
          />
        );
        cy.findByLabelText("label-with-react-node").should("exist");
      });
    });
  });

  context("height", () => {
    it("renders with fit-content (by default)", () => {
      cy.mount(<ProductMessagebox />);
      cy.findByLabelText("messagebox-container").should(
        "have.css",
        "height",
        "80.59375px"
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
          "296.125px"
        );
      });
    });

    context("when add inside of form", () => {
      it("sizes itself to its content", () => {
        cy.mount(
          <StatefulForm
            formValues={{
              name: "",
              email: "",
            }}
            fields={[
              {
                name: "name",
                type: "text",
                title: "Name",
              },
              {
                name: "email",
                type: "email",
                title: "Email",
              },
              {
                name: "render",
                type: "custom",
                render: <ProductMessagebox />,
              },
            ]}
          />
        );

        cy.findByLabelText("messagebox-container").should(
          "have.css",
          "height",
          "80.59375px"
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
