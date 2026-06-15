import { css } from "styled-components";
import {
  Carousel,
  CarouselPosition,
  CarouselProps,
} from "./../../components/carousel";

describe("Carousel", () => {
  function ProductCarousel(props?: CarouselProps) {
    return (
      <Carousel {...props}>
        <div
          style={{
            height: "200px",
          }}
        >
          1
        </div>
        <div
          style={{
            height: "200px",
          }}
        >
          2
        </div>
        <div
          style={{
            height: "200px",
          }}
        >
          3
        </div>
      </Carousel>
    );
  }

  context("length", () => {
    context("when given length", () => {
      it("renders limited controls", () => {
        cy.mount(<ProductCarousel length={2} />);

        cy.findAllByRole("tab").should("have.length", 2);
      });
    });
  });

  context("currentPage", () => {
    it("renders the requested page", () => {
      cy.mount(<ProductCarousel currentPage={1} />);

      cy.findByLabelText("carousel-slide-2-of-3").should(
        "have.attr",
        "aria-hidden",
        "false"
      );
    });
  });

  context("onChange", () => {
    context("when using preventDefault", () => {
      it("shouldn't move to another page", () => {
        const onChange = cy.stub().callsFake((event) => {
          event.preventDefault();
        });

        cy.mount(<ProductCarousel onChange={onChange} />);

        cy.findByLabelText("carousel-next-slide").click();

        cy.findByLabelText("carousel-slide-1-of-3").should(
          "have.attr",
          "aria-hidden",
          "false"
        );

        cy.findByLabelText("carousel-slide-2-of-3").should(
          "have.attr",
          "aria-hidden",
          "true"
        );
      });
    });

    context("when using page", () => {
      it("changes the page", () => {
        const onChange = cy.stub();

        cy.mount(<ProductCarousel onChange={onChange} />);

        cy.findByLabelText("carousel-next-slide").click();

        cy.wrap(onChange).should("have.been.calledWithMatch", {
          page: 1,
        });

        cy.findByLabelText("carousel-slide-2-of-3").should(
          "have.attr",
          "aria-hidden",
          "false"
        );
      });
    });
  });

  context("initialPage", () => {
    context("when given initialPage", () => {
      it("starts from the given page", () => {
        cy.mount(<ProductCarousel initialPage={1} />);

        cy.findByLabelText("carousel-slide-2-of-3").should(
          "have.attr",
          "aria-hidden",
          "false"
        );
      });
    });
  });

  context("control", () => {
    context("when given false", () => {
      it("doesn't render controls", () => {
        cy.mount(<ProductCarousel control={false} />);

        cy.findAllByRole("tab").should("have.length", 0);
      });
    });

    context("when given true (default)", () => {
      it("renders controls", () => {
        cy.mount(<ProductCarousel control />);

        cy.findAllByRole("tab").should("have.length", 3);
      });
    });

    context("when given object", () => {
      context("position", () => {
        context("when given bottom-center", () => {
          it("renders controls at the bottom", () => {
            cy.mount(
              <ProductCarousel
                control={{
                  position: CarouselPosition.BottomCenter,
                }}
              />
            );

            cy.findByRole("tablist").should("have.css", "bottom", "14px");
          });
        });

        context("when given top-center", () => {
          it("renders controls at the top", () => {
            cy.mount(
              <ProductCarousel
                control={{
                  position: CarouselPosition.TopCenter,
                }}
              />
            );

            cy.findByRole("tablist").should("have.css", "top", "14px");
          });
        });
      });
    });
  });

  context("styles", () => {
    context("containerStyle", () => {
      context("when given padding 20px", () => {
        it("should render with padding 20px", () => {
          cy.mount(
            <ProductCarousel
              id="carousel-test"
              styles={{
                containerStyle: css`
                  padding: 20px;
                `,
              }}
            />
          );

          cy.get("#carousel-test").should("have.css", "padding", "20px");
        });
      });
    });

    context("controlStyle", () => {
      context("when given gap 10px", () => {
        it("should render with gap 10px", () => {
          cy.mount(
            <ProductCarousel
              styles={{
                controlStyle: css`
                  gap: 10px;
                `,
              }}
            />
          );

          cy.findByRole("tablist").should("have.css", "gap", "10px");
        });
      });
    });

    context("contentStyle", () => {
      context("when given backgroundColor red", () => {
        it("should render with backgroundColor red", () => {
          cy.mount(
            <ProductCarousel
              styles={{
                contentStyle: css`
                  background-color: red;
                `,
              }}
            />
          );

          cy.findByLabelText("carousel-slide-1-of-3").should(
            "have.css",
            "background-color",
            "rgb(255, 0, 0)"
          );
        });
      });
    });

    context("arrowStyle", () => {
      context("when given color blue", () => {
        it("should render with color blue", () => {
          cy.mount(
            <ProductCarousel
              styles={{
                arrowStyle: css`
                  color: blue;
                `,
              }}
            />
          );

          cy.findByLabelText("carousel-next-slide").should(
            "have.css",
            "color",
            "rgb(0, 0, 255)"
          );
        });
      });
    });
  });

  context("id", () => {
    context("when given id carousel-test", () => {
      it("renders id with carousel-test", () => {
        cy.mount(<ProductCarousel id="carousel-test" />);
        cy.get("#carousel-test").should("exist");
      });
    });
  });

  context("className", () => {
    it("renders coneto-carousel", () => {
      cy.mount(<ProductCarousel />);

      cy.get(".coneto-carousel").should("exist");
    });

    context("when given className test", () => {
      it("renders the className with test", () => {
        cy.mount(<ProductCarousel className="test" />);
        cy.get(".coneto-carousel").should("exist");
        cy.get(".test").should("exist");
      });
    });
  });

  context("autoHeight", () => {
    context("when given true", () => {
      it("should adjust height based on active slide", () => {
        cy.mount(
          <Carousel autoHeight id="carousel-test">
            <div style={{ height: "100px" }}>1</div>
            <div style={{ height: "300px" }}>2</div>
          </Carousel>
        );

        cy.findByLabelText("carousel").should("have.css", "height", "108px");

        cy.findByLabelText("carousel-next-slide").click();

        cy.findByLabelText("carousel").should("have.css", "height", "308px");
      });
    });

    context("when given false (default)", () => {
      it("should not set a fixed height", () => {
        cy.mount(<ProductCarousel autoHeight={false} />);

        cy.findByLabelText("carousel").should("have.css", "height", "208px");

        cy.findByLabelText("carousel-next-slide").click();
        cy.findByLabelText("carousel").should("have.css", "height", "208px");
      });
    });
  });
});
