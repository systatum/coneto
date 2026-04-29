import { EmptySlate, EmptySlateProps } from "./../../components/empty-slate";

describe("EmptySlate", () => {
  function ProductEmptySlate(props: Partial<EmptySlateProps>) {
    return (
      <EmptySlate
        icon={{ image: "https://picsum.photos/200?random=1" }}
        title="Manage your inventory transfers"
        subtitle="Track and receive your incoming inventory from suppliers."
        {...props}
      />
    );
  }
  context("actions", () => {
    context("when given", () => {
      it("renders the actions button", () => {
        cy.mount(
          <ProductEmptySlate
            actions={[
              {
                caption: "Add Item",
              },
              {
                caption: "Learn More",
                variant: "primary",
              },
            ]}
          />
        );

        cy.findByText("Add Item").should("exist");
        cy.findByText("Learn More").should("exist");
      });
    });
  });
});
