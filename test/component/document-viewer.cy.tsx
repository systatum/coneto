import { DocumentViewer } from "./../../components/document-viewer";

describe("Document Viewer", () => {
  context("scroll", () => {
    context("when scroll to the bottom", () => {
      it("on the latest page", () => {
        cy.mount(
          <DocumentViewer
            source="sample.pdf"
            title="Team Collaboration Notes"
          />
        );
        cy.wait(400);

        cy.findByText("Team Collaboration Notes").should("exist");
        cy.findByLabelText("container-content")
          .should("exist")
          .scrollTo("bottom");
      });
    });
  });

  context("page size", () => {
    context("when change to 75%", () => {
      it("renders viewport change scale to 0.75 or 75%", () => {
        cy.mount(
          <DocumentViewer
            source="sample.pdf"
            title="Team Collaboration Notes"
          />
        );
        cy.wait(400);

        cy.findByPlaceholderText("zoom your pdf...").as("input");

        cy.get("@input").type("{uparrow}{enter}");
      });
    });

    context("default initial 75%", () => {
      it("renders viewport scale 75%", () => {
        cy.mount(
          <DocumentViewer
            initialZoom="0.75"
            source="sample.pdf"
            title="Team Collaboration Notes"
          />
        );

        cy.findByPlaceholderText("zoom your pdf...").should(
          "have.value",
          "75%"
        );
      });
    });
  });

  context("selection", () => {
    context("when hovered selection", () => {
      it("renders contentOnHover", () => {
        const boundingBoxes = [
          {
            page: 1,
            x: 0.1319796954314721,
            y: 0.32014388489208634,
            width: 0.751269035532995,
            height: 0.34532374100719426,
            contentOnHover: <p>heyyy</p>,
            boxStyle: { borderColor: "#aqua", backgroundColor: "#aqua" },
          },
        ];
        cy.mount(
          <DocumentViewer
            source="sample.pdf"
            boundingBoxes={boundingBoxes}
            title="Team Collaboration Notes"
          />
        );
        cy.wait(400);

        cy.findAllByLabelText("selection-box").eq(0).trigger("mouseover");
        cy.findAllByLabelText("selection-content-hovered")
          .eq(0)
          .should("be.visible")
          .and("contain.text", "heyyy");
      });
    });
    context("when drag selection", () => {
      it("renders selected rectangle", () => {
        cy.mount(
          <DocumentViewer
            source="sample.pdf"
            title="Team Collaboration Notes"
          />
        );
        cy.wait(400);

        cy.findAllByLabelText("container-content")
          .eq(0)
          .trigger("mousemove", { clientX: 100, clientY: 100 });

        cy.findAllByLabelText("container-content")
          .eq(0)
          .trigger("mousedown", { clientX: 100, clientY: 100, button: 0 });

        cy.findAllByLabelText("container-content")
          .eq(0)
          .trigger("mousemove", { clientX: 150, clientY: 150 });
      });
    });
  });
});
