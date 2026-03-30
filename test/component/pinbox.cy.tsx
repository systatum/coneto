import { useState } from "react";
import { Pinbox, PinboxProps, PinboxState } from "./../../components/pinbox";

describe("Pinbox", () => {
  function ProductPinbox(props: PinboxProps) {
    const [value, setValue] = useState("");

    return (
      <Pinbox
        value={value}
        onChange={(e) => {
          console.log(`Those character are ${e.target.value}`);
          setValue(e.target.value);
        }}
        {...props}
      />
    );
  }

  context("onPaste", () => {
    context("alphanumeric", () => {
      beforeEach(() => {
        cy.mount(<ProductPinbox parts={PARTS_INPUT} />);
      });

      context("when paste with digit", () => {
        it("shows those number", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "1234",
              },
            });

          cy.get("input").eq(1).should("have.value", "1");
          cy.get("input").eq(2).should("have.value", "2");
          cy.get("input").eq(3).should("have.value", "3");
          cy.get("input").eq(5).should("have.value", "4");
        });

        it("shows static still not replace", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "1234",
              },
            });

          cy.get("input").eq(0).should("have.value", "S");
          cy.get("input").eq(4).should("have.value", "-");
        });
      });

      context("when paste with alphabet", () => {
        it("shows those alphabet", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "abcd",
              },
            });

          cy.get("input").eq(1).should("have.value", "A");
          cy.get("input").eq(2).should("have.value", "B");
          cy.get("input").eq(3).should("have.value", "C");
          cy.get("input").eq(5).should("have.value", "D");
        });

        it("shows static still not replace", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "abcd",
              },
            });

          cy.get("input").eq(0).should("have.value", "S");
          cy.get("input").eq(4).should("have.value", "-");
        });
      });

      context("when paste with alphanumeric", () => {
        it("shows those alphanumeric", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "ab12",
              },
            });

          cy.get("input").eq(1).should("have.value", "A");
          cy.get("input").eq(2).should("have.value", "B");
          cy.get("input").eq(3).should("have.value", "1");
          cy.get("input").eq(5).should("have.value", "2");
        });

        it("shows static still not replace", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "ab12",
              },
            });

          cy.get("input").eq(0).should("have.value", "S");
          cy.get("input").eq(4).should("have.value", "-");
        });
      });
    });

    context("mix parts (alphanumeric, digit, alphabet)", () => {
      beforeEach(() => {
        cy.mount(<ProductPinbox parts={MIX_PARTS_INPUT} />);
      });

      context("when paste with digit", () => {
        it("should stop if the part not compatible (alphabet input)", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "1234",
              },
            });

          cy.get("input").eq(1).should("have.value", "1");
          cy.get("input").eq(2).should("have.value", "2");
          cy.get("input").eq(3).should("have.value", "");
          cy.get("input").eq(5).should("have.value", "");
        });

        it("shows static still not replace", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "1234",
              },
            });

          cy.get("input").eq(0).should("have.value", "S");
          cy.get("input").eq(4).should("have.value", "-");
        });
      });

      context("when paste with alphabet", () => {
        it("should stop if the part not compatible (digit input)", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "abcd",
              },
            });

          cy.get("input").eq(1).should("have.value", "A");
          cy.get("input").eq(2).should("have.value", "");
          cy.get("input").eq(3).should("have.value", "");
          cy.get("input").eq(5).should("have.value", "");
        });

        it("shows static still not replace", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "abcd",
              },
            });

          cy.get("input").eq(0).should("have.value", "S");
          cy.get("input").eq(4).should("have.value", "-");
        });
      });

      context("when paste with alphanumeric", () => {
        it("should stop if the part not compatible (digit/alphabet input)", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "ab12",
              },
            });

          cy.get("input").eq(1).should("have.value", "A");
          cy.get("input").eq(2).should("have.value", "1");
          cy.get("input").eq(3).should("have.value", "");
          cy.get("input").eq(5).should("have.value", "");
        });

        it("shows static still not replace", () => {
          cy.get("input")
            .eq(1)
            .trigger("paste", {
              clipboardData: {
                getData: () => "ab12",
              },
            });

          cy.get("input").eq(0).should("have.value", "S");
          cy.get("input").eq(4).should("have.value", "-");
        });
      });
    });
  });
});

const PARTS_INPUT: PinboxState[] = [
  { type: "static", text: "S" },
  { type: "alphanumeric" },
  { type: "alphanumeric" },
  { type: "alphanumeric" },
  { type: "static", text: "-" },
  { type: "alphanumeric" },
];

const MIX_PARTS_INPUT: PinboxState[] = [
  { type: "static", text: "S" },
  { type: "alphanumeric" },
  { type: "digit" },
  { type: "alphabet" },
  { type: "static", text: "-" },
  { type: "alphabet" },
];
