import { useEffect, useState } from "react";
import { DocumentViewer } from "./../../components/document-viewer";
import { urlToBase64 } from "./../../lib/base64";
import { css } from "styled-components";

describe("Document Viewer", () => {
  context("styles", () => {
    context("when given boxStyle", () => {
      it("renders with the style with the specified styles", () => {
        cy.mount(
          <DocumentViewer
            selectable
            source={({ pdf }) => pdf("sample.pdf")}
            labels={{ title: "Team Collaboration Notes" }}
            styles={{
              boxStyle: css`
                border-color: blue;
                background-color: rgba(255, 0, 0, 0.2);
              `,
            }}
            boundingBoxes={[
              {
                page: 1,
                x: 0.1319796954314721,
                y: 0.32014388489208634,
                width: 0.751269035532995,
                height: 0.34532374100719426,
                contentOnHover: <p>heyyy</p>,
              },
            ]}
          />
        );

        cy.findByLabelText("selection-box")
          .should("exist")
          .should("have.css", "border-color", "rgb(0, 0, 255)")
          .and("have.css", "background-color", "rgba(255, 0, 0, 0.2)");
      });

      context("when given boxStyle per bounding box", () => {
        it("renders the bounding box using the individual boxStyle", () => {
          cy.mount(
            <DocumentViewer
              selectable
              source={({ pdf }) => pdf("sample.pdf")}
              labels={{ title: "Team Collaboration Notes" }}
              styles={{
                boxStyle: css`
                  border-color: blue;
                  background-color: rgba(255, 0, 0, 0.2);
                `,
              }}
              boundingBoxes={[
                {
                  page: 1,
                  x: 0.1319796954314721,
                  y: 0.32014388489208634,
                  width: 0.751269035532995,
                  height: 0.34532374100719426,
                  contentOnHover: <p>heyyy</p>,
                  boxStyle: {
                    borderColor: "red",
                    backgroundColor: "rgba(255, 0, 0, 0.2)",
                  },
                },
              ]}
            />
          );

          cy.findByLabelText("selection-box")
            .should("exist")
            .should("have.css", "border-color", "rgb(255, 0, 0)")
            .and("have.css", "background-color", "rgba(255, 0, 0, 0.2)");
        });
      });
    });
  });

  context("selectable", () => {
    context("when given true", () => {
      it("renders the crosshair cursor", () => {
        cy.mount(
          <DocumentViewer
            selectable
            source={({ pdf }) => pdf("sample.pdf")}
            labels={{ title: "Team Collaboration Notes" }}
          />
        );

        cy.findByLabelText("view-content")
          .should("exist")
          .should("have.css", "cursor", "crosshair");
      });
    });

    context("when given true", () => {
      it("renders the crosshair cursor", () => {
        cy.mount(
          <DocumentViewer
            source={({ pdf }) => pdf("sample.pdf")}
            labels={{ title: "Team Collaboration Notes" }}
          />
        );

        cy.findByLabelText("view-content")
          .should("exist")
          .should("have.css", "cursor", "auto");
      });
    });
  });

  context("source", () => {
    context("when given with pdf()", () => {
      it("renders the pdf", () => {
        cy.mount(
          <DocumentViewer
            source={({ pdf }) => pdf("sample.pdf")}
            labels={{ title: "Team Collaboration Notes" }}
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
            labels={{ title: "Team Collaboration Notes" }}
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
            labels={{ title: "Document Viewer With Image" }}
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
            labels={{ title: "Document Viewer With Image" }}
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
            labels={{ title: "Document Viewer with Encode String" }}
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
              labels={{ title: "Document Viewer With File" }}
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
              labels={{ title: "Document Viewer With File" }}
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
            labels={{ title: "Team Collaboration Notes" }}
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
            labels={{ title: "Team Collaboration Notes" }}
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
            labels={{ title: "Team Collaboration Notes" }}
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
            labels={{ title: "Team Collaboration Notes" }}
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
            labels={{ title: "Team Collaboration Notes" }}
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
