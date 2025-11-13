import { Ri24HoursFill } from "@remixicon/react";
import { Togglebox } from "./../../components/togglebox";

describe("Togglebox", () => {
  context("with size", () => {
    it("render with calculate icon, wrapper, and thumb-shift value", () => {
      cy.mount(<Togglebox size={30} icon={Ri24HoursFill} checked={true} />);
      const size = 30;
      const widthWrapper = size * 2;
      const heightWrapper = size * 1;
      const thumbShift = size * 1.02;
      const iconSize = size * 0.6;

      cy.findByLabelText("togglebox-wrapper").each(($wrapper) => {
        expect($wrapper.width()).to.eq(widthWrapper);
        expect($wrapper.height()).to.eq(heightWrapper);
      });
      cy.findByLabelText("togglebox-icon").each(($icon) => {
        expect($icon.width()).to.eq(iconSize);
        expect($icon.height()).to.eq(iconSize);
      });

      cy.wait(400);

      // make sure of the matrix when use of 2d transformation
      // matrix(scaleX, skewY, skewX, scaleY, translateX, translateY)
      cy.findByLabelText("togglebox-thumb")
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
});
