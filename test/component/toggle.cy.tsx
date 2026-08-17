import { Ri24HoursFill } from "@remixicon/react";
import { Toggle } from "../../components/toggle";

describe("Toggle", () => {
  context("with size", () => {
    it("render with calculate icon, wrapper, and thumb-shift value", () => {
      cy.mount(
        <Toggle size={30} icon={{ image: Ri24HoursFill }} checked={true} />
      );
      const size = 30;
      const widthWrapper = size * 2;
      const heightWrapper = size * 1;
      const thumbShift = size * 1.02;
      const iconSize = size * 0.6;

      cy.findByLabelText("toggle-wrapper").each(($wrapper) => {
        expect($wrapper.width()).to.be.closeTo(widthWrapper, 0.01);
        expect($wrapper.height()).to.be.closeTo(heightWrapper, 0.01);
      });
      cy.findByLabelText("toggle-icon").each(($icon) => {
        expect($icon.width()).to.be.closeTo(iconSize, 0.01);
        expect($icon.height()).to.be.closeTo(iconSize, 0.01);
      });

      cy.wait(400);

      // make sure of the matrix when use of 2d transformation
      // matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)
      cy.findByLabelText("toggle-thumb")
        .should("exist")
        .invoke("css", "transform")
        .then((transform) => {
          const transformStr = String(transform);
          const match = transformStr.match(
            /matrix\([^,]+,\s*[^,]+,\s*[^,]+,\s*[^,]+,\s*([\d.-]+),/
          );

          expect(match, `Invalid transform: ${transformStr}`).to.not.be.null;

          const translateX = parseFloat(match![1]);
          expect(translateX).to.be.closeTo(thumbShift, 0.5);
        });
    });
  });

  context("with description", () => {
    it("render with align center", () => {
      cy.mount(
        <Toggle
          label="Click and load"
          description="Click and you will see a loading icon"
          checked={true}
        />
      );
      cy.findByLabelText("toggle-row-wrapper")
        .should("have.css", "flex-direction", "row")
        .and("have.css", "align-items", "center");
    });
  });
});
