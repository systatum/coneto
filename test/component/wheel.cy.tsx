import { Wheel, WheelProps } from "./../../components/wheel";
import { useState } from "react";

describe("Wheel", () => {
  function ProductWheel(props: WheelProps) {
    const [values, setValues] = useState({
      hour: "10",
      minute: "30",
      second: "30",
      ampm: "am",
    });

    return (
      <Wheel
        onChange={(values) => {
          setValues({
            ampm: values.ampm,
            hour: values.hour,
            minute: values.minute,
            second: values.second,
          });
        }}
        parts={[
          { id: "hour", values: hours, width: "64px" },
          { id: "minute", values: minutes, width: "72px" },
          { id: "second", values: seconds, width: "72px" },
          { id: "ampm", values: ampm, width: "64px" },
        ]}
        values={values}
        {...props}
      />
    );
  }

  context("values", () => {
    context("when given normal values", () => {
      it("renders with selected values (rgb(17,24,39)", () => {
        cy.mount(
          <ProductWheel
            values={{
              hour: "10",
              minute: "30",
              second: "30",
              ampm: "am",
            }}
          />
        );

        cy.findAllByLabelText("wheel-column-item")
          .filter('[aria-selected="true"]')
          .first()
          .should("contain", "10")
          .and("have.css", "color", "rgb(17, 24, 39)");
      });
    });

    context("when given undefined", () => {
      it("renders without selected values (rgba(17,24,39,0.35)", () => {
        cy.mount(
          <ProductWheel
            values={{
              hour: undefined,
              minute: undefined,
              second: undefined,
              ampm: undefined,
            }}
          />
        );

        cy.findAllByLabelText("wheel-column-item")
          .filter('[aria-selected="false"]')
          .each(($el) => {
            cy.wrap($el).should("have.css", "color", "rgba(17, 24, 39, 0.35)");
          });
      });
    });

    context("when given null", () => {
      it("renders without selected values (rgba(17,24,39,0.35)", () => {
        cy.mount(
          <ProductWheel
            values={{
              hour: null,
              minute: null,
              second: null,
              ampm: null,
            }}
          />
        );

        cy.findAllByLabelText("wheel-column-item")
          .filter('[aria-selected="false"]')
          .each(($el) => {
            cy.wrap($el).should("have.css", "color", "rgba(17, 24, 39, 0.35)");
          });
      });
    });
  });

  context("parts", () => {
    context("width", () => {
      context("when given 200px", () => {
        it("should render with 200px on each part", () => {
          cy.mount(
            <ProductWheel
              parts={[
                { id: "hour", values: hours, width: "200px" },
                { id: "minute", values: minutes, width: "200px" },
              ]}
            />
          );
          cy.findAllByLabelText("wheel-column-container").should(
            "have.css",
            "width",
            "200px"
          );
        });
      });

      context("when not given", () => {
        it("should render by default with 72px each part", () => {
          cy.mount(
            <ProductWheel
              parts={[
                { id: "hour", values: hours },
                { id: "minute", values: minutes },
              ]}
            />
          );
          cy.findAllByLabelText("wheel-column-container").should(
            "have.css",
            "width",
            "72px"
          );
        });
      });
    });

    context("when given hour and minute", () => {
      it("renders one separator", () => {
        cy.mount(
          <ProductWheel
            parts={[
              { id: "hour", values: hours, width: "64px" },
              { id: "minute", values: minutes, width: "72px" },
            ]}
          />
        );
        cy.findAllByLabelText("wheel-separator").should("have.length", 1);
      });
    });

    context("when given hour, minute, and am/pm", () => {
      it("renders one separator", () => {
        cy.mount(
          <ProductWheel
            parts={[
              { id: "hour", values: hours, width: "64px" },
              { id: "minute", values: minutes, width: "72px" },
              { id: "ampm", values: ampm, width: "64px" },
            ]}
          />
        );
        cy.findAllByLabelText("wheel-separator").should("have.length", 1);
      });
    });

    context("when given hour, minute, second, and am/pm", () => {
      it("renders two separator", () => {
        cy.mount(
          <ProductWheel
            parts={[
              { id: "hour", values: hours, width: "64px" },
              { id: "minute", values: minutes, width: "72px" },
              { id: "second", values: seconds, width: "72px" },
              { id: "ampm", values: ampm, width: "64px" },
            ]}
          />
        );
        cy.findAllByLabelText("wheel-separator").should("have.length", 2);
      });
    });
  });

  context("onWheel behavior", () => {
    context("when scroll to bottom in hour", () => {
      it("should be scroll to the top", () => {
        cy.mount(<ProductWheel />);

        cy.findAllByLabelText("wheel-column-item")
          .filter('[aria-selected="true"]')
          .first()
          .should("contain", "10");

        Cypress._.times(9, () => {
          cy.findAllByLabelText("wheel-column-container")
            .eq(0)
            .realMouseWheel({ deltaY: -120 });
        });

        cy.wait(200);

        cy.findAllByLabelText("wheel-column-item")
          .filter('[aria-selected="true"]')
          .first()
          .should("contain", "1");
      });
    });
  });

  context("pointer behavior (drag)", () => {
    context("when drag to top in hour", () => {
      it("should scroll to the bottom", () => {
        cy.mount(<ProductWheel />);

        cy.findAllByLabelText("wheel-column-item")
          .filter('[aria-selected="true"]')
          .first()
          .should("contain", "10");

        cy.findAllByLabelText("wheel-column-container")
          .eq(0)
          .trigger("pointerdown", {
            pointerId: 1,
            clientY: 300,
            buttons: 1,
          })
          .trigger("pointermove", {
            pointerId: 1,
            clientY: 100,
            buttons: 1,
          })
          .trigger("pointerup", {
            pointerId: 1,
          });

        cy.wait(200);

        cy.findAllByLabelText("wheel-column-item")
          .filter('[aria-selected="true"]')
          .first()
          .should("contain", "11");
      });
    });
  });
});

const hours = Array.from({ length: 12 }, (_, i) => {
  const h = i;
  return { value: h.toString(), text: h.toString() };
});

const minutes = Array.from({ length: 60 }, (_, i) => ({
  value: i.toString(),
  text: i.toString().padStart(2, "0"),
}));

const seconds = minutes;

const ampm = [
  { value: "am", text: "AM" },
  { value: "pm", text: "PM" },
];
