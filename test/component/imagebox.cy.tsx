import { Imagebox, ImageboxProps } from "./../../components/imagebox";
import { useState } from "react";

describe("Imagebox", () => {
  function ProductImagebox(props: ImageboxProps) {
    const [value, setValue] = useState<string | File | undefined>("");

    return (
      <Imagebox
        value={value}
        editable={false}
        size="xs"
        onFileSelected={setValue}
        {...props}
      />
    );
  }

  context("value", () => {
    const base64with2px =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAE0lEQVR42mP8/5+hHgAHggJ/P6CcgQAAAABJRU5ErkJggg==";
    context("when given a string (base64)", () => {
      it("renders the image", () => {
        cy.mount(<ProductImagebox value={base64with2px} />);

        cy.get("img")
          .should("have.attr", "src")
          .and("match", /^data:image\/.*;base64,/);
      });

      context("when given url", () => {
        it("renders the image from base64", () => {
          cy.mount(
            <ProductImagebox
              value={base64with2px}
              url={
                "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
              }
            />
          );

          cy.get("img")
            .should("have.attr", "src")
            .and("match", /^data:image\/.*;base64,/);
        });
      });
    });
  });

  context("url", () => {
    context("when given url", () => {
      it("renders the image", () => {
        cy.mount(
          <ProductImagebox
            url={"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"}
          />
        );

        cy.get("img")
          .should("exist")
          .and("have.attr", "src")
          .and("include", "unsplash.com");
      });
    });
  });

  context("borderless", () => {
    context("when not given", () => {
      it("renders with border", () => {
        cy.mount(<ProductImagebox />);
        cy.findByLabelText("imagebox-input").should(
          "have.css",
          "border",
          "1px solid rgb(209, 213, 219)"
        );
      });
    });

    context("when given false", () => {
      it("renders with border", () => {
        cy.mount(<ProductImagebox borderless={false} />);
        cy.findByLabelText("imagebox-input").should(
          "have.css",
          "border",
          "1px solid rgb(209, 213, 219)"
        );
      });
    });

    context("when given true", () => {
      it("renders without border (0px)", () => {
        cy.mount(<ProductImagebox borderless />);
        cy.findByLabelText("imagebox-input").should(
          "have.css",
          "border",
          "0px solid rgb(229, 231, 235)"
        );
      });
    });
  });

  context("editable", () => {
    context("when not given (by default)", () => {
      it("renders add icon", () => {
        cy.mount(<ProductImagebox editable={false} />);

        cy.findByLabelText("imagebox-add-icon").should("exist");
      });

      context("when drag and drop image", () => {
        it("renders the image", () => {
          cy.mount(<ProductImagebox />);
          cy.get("img").should("not.exist");

          const firstImage = "test/fixtures/test-images/sample-1.jpg";

          cy.get('input[type="file"]').selectFile(firstImage, {
            force: true,
            action: "drag-drop",
          });
          cy.get("img").should("exist");
        });
      });
    });

    context("when given true", () => {
      it("renders add icon", () => {
        cy.mount(<ProductImagebox editable={false} />);

        cy.findByLabelText("imagebox-add-icon").should("exist");
      });

      context("when drag and drop image", () => {
        it("renders the image", () => {
          cy.mount(<ProductImagebox />);
          cy.get("img").should("not.exist");

          const firstImage = "test/fixtures/test-images/sample-1.jpg";

          cy.get('input[type="file"]').selectFile(firstImage, {
            force: true,
            action: "drag-drop",
          });
          cy.get("img").should("exist");
        });
      });
    });

    context("when given false", () => {
      it("not renders add icon", () => {
        cy.mount(<ProductImagebox editable={false} />);

        cy.findByLabelText("imagebox-add-icon").should("not.exist");
      });

      context("when drag and drop image", () => {
        it("not renders the image", () => {
          cy.mount(<ProductImagebox editable={false} />);
          cy.get("img").should("not.exist");

          const firstImage = "test/fixtures/test-images/sample-1.jpg";

          cy.get('input[type="file"]').selectFile(firstImage, {
            force: true,
            action: "drag-drop",
          });
          cy.get("img").should("not.exist");
        });
      });
    });
  });
});
