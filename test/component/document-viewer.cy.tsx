import { useEffect, useState } from "react";
import { DocumentViewer } from "./../../components/document-viewer";
import { urlToBase64 } from "./../../lib/base64";

describe("Document Viewer", () => {
  context("source", () => {
    context("when given with pdf()", () => {
      it("renders the pdf", () => {
        cy.mount(
          <DocumentViewer
            source={({ pdf }) => pdf("sample.pdf")}
            title="Team Collaboration Notes"
          />
        );

        cy.findByText("Team Collaboration Notes").should("exist");
        cy.findByLabelText("doc-viewer-container")
          .should("exist")
          .within(() => {
            cy.get("canvas", { timeout: 10000 }).should("exist");
          });
      });

      it("renders with page number", () => {
        cy.mount(
          <DocumentViewer
            source={({ pdf }) => pdf("sample.pdf")}
            title="Team Collaboration Notes"
          />
        );

        cy.findByLabelText("doc-viewer-toolbar-title").should("exist");
        cy.findByLabelText("doc-viewer-toolbar-combo").should("exist");
        cy.findByLabelText("doc-viewer-toolbar-page").should("not.exist");
      });
    });

    context("when given with image()", () => {
      it("renders the image", () => {
        cy.mount(
          <DocumentViewer
            title="Document Viewer With Image"
            source={({ image }) =>
              image(
                "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
              )
            }
          />
        );

        cy.findByText("Document Viewer With Image").should("exist");
        cy.findByLabelText("doc-viewer-container")
          .should("exist")
          .within(() => {
            cy.get("canvas", { timeout: 10000 }).should("exist");
          });
      });

      it("renders without page number", () => {
        cy.mount(
          <DocumentViewer
            title="Document Viewer With Image"
            source={({ image }) =>
              image(
                "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
              )
            }
          />
        );

        cy.findByLabelText("doc-viewer-toolbar-wrapper").should(
          "have.css",
          "justify-content",
          "space-between"
        );
        cy.findByLabelText("doc-viewer-toolbar-title").should("exist");
        cy.findByLabelText("doc-viewer-toolbar-combo").should("exist");
        cy.findByLabelText("doc-viewer-toolbar-page").should("not.exist");
      });
    });

    context("when given with encodedString()", () => {
      function DocumentViewerWithBase64() {
        const [base64, setBase64] = useState<string | null>(null);

        useEffect(() => {
          urlToBase64(
            "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
          ).then(setBase64);
        }, []);

        return (
          <DocumentViewer
            title="Document Viewer with Encode String"
            source={({ encodedString }) => encodedString(base64, "png")}
          />
        );
      }
      it("renders the image from base 64", () => {
        cy.mount(<DocumentViewerWithBase64 />);

        cy.findByText("Document Viewer with Encode String").should("exist");
        cy.findByLabelText("doc-viewer-container")
          .should("exist")
          .within(() => {
            cy.get("canvas", { timeout: 10000 }).should("exist");
          });
      });

      it("renders the image from base 64", () => {
        cy.mount(<DocumentViewerWithBase64 />);

        cy.findByLabelText("doc-viewer-toolbar-wrapper").should(
          "have.css",
          "justify-content",
          "space-between"
        );
        cy.findByLabelText("doc-viewer-toolbar-title").should("exist");
        cy.findByLabelText("doc-viewer-toolbar-combo").should("exist");
        cy.findByLabelText("doc-viewer-toolbar-page").should("not.exist");
      });
    });

    context("when given with file()", () => {
      it("renders the image from local file", () => {
        cy.fixture("test-images/sample-1.jpg", "base64").then((base64) => {
          const blob = Cypress.Blob.base64StringToBlob(base64, "image/jpeg");

          const file = new File([blob], "sample-1.jpg", {
            type: "image/jpeg",
          });

          cy.mount(
            <DocumentViewer
              title="Document Viewer With File"
              source={({ file: fileBuilder }) => fileBuilder(file)}
            />
          );
        });

        cy.findByText("Document Viewer With File").should("exist");

        cy.findByLabelText("doc-viewer-container")
          .should("exist")
          .within(() => {
            cy.get("canvas", { timeout: 10000 }).should("exist");
          });
      });

      it("renders without number page", () => {
        cy.fixture("test-images/sample-1.jpg", "base64").then((base64) => {
          const blob = Cypress.Blob.base64StringToBlob(base64, "image/jpeg");

          const file = new File([blob], "sample-1.jpg", {
            type: "image/jpeg",
          });

          cy.mount(
            <DocumentViewer
              title="Document Viewer With File"
              source={({ file: fileBuilder }) => fileBuilder(file)}
            />
          );
        });

        cy.findByLabelText("doc-viewer-toolbar-wrapper").should(
          "have.css",
          "justify-content",
          "space-between"
        );
        cy.findByLabelText("doc-viewer-toolbar-title").should("exist");
        cy.findByLabelText("doc-viewer-toolbar-combo").should("exist");
        cy.findByLabelText("doc-viewer-toolbar-page").should("not.exist");
      });
    });
  });

  context("scroll", () => {
    context("when scroll to the bottom", () => {
      it("on the latest page", () => {
        cy.mount(
          <DocumentViewer
            source={({ pdf }) => pdf("sample.pdf")}
            title="Team Collaboration Notes"
          />
        );

        cy.findByText("Team Collaboration Notes").should("exist");
        cy.findByLabelText("doc-viewer-container")
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
            source={({ pdf }) => pdf("sample.pdf")}
            title="Team Collaboration Notes"
          />
        );

        cy.findByPlaceholderText("zoom your pdf...").as("input");

        cy.get("@input").type("{uparrow}{enter}");
      });
    });

    context("default initial 75%", () => {
      it("renders viewport scale 75%", () => {
        cy.mount(
          <DocumentViewer
            initialZoom={75}
            source={({ pdf }) => pdf("sample.pdf")}
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

  context("bounding boxes", () => {
    context("when hovered", () => {
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
            source={({ pdf }) => pdf("sample.pdf")}
            boundingBoxes={boundingBoxes}
            title="Team Collaboration Notes"
          />
        );

        cy.findAllByLabelText("selection-box").eq(0).trigger("mouseover");
        cy.findAllByLabelText("selection-content-hovered")
          .eq(0)
          .should("be.visible")
          .and("contain.text", "heyyy");
      });
    });

    context("when creating", () => {
      it("renders selected rectangle", () => {
        cy.mount(
          <DocumentViewer
            source={({ pdf }) => pdf("sample.pdf")}
            title="Team Collaboration Notes"
          />
        );

        cy.findAllByLabelText("doc-viewer-container")
          .eq(0)
          .trigger("mousemove", { clientX: 100, clientY: 100, force: true });

        cy.findAllByLabelText("doc-viewer-container")
          .eq(0)
          .trigger("mousedown", {
            clientX: 100,
            clientY: 100,
            button: 0,
            force: true,
          });

        cy.findAllByLabelText("doc-viewer-container")
          .eq(0)
          .trigger("mousemove", { clientX: 150, clientY: 150, force: true });
      });
    });
  });
});
