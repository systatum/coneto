import { Ri24HoursFill } from "@remixicon/react";
import { DormantText, DormantTextProps } from "./../../components/dormant-text";
import { Textbox } from "./../../components/textbox";
import { css } from "styled-components";

describe("DormantText", () => {
  function ProductDormantText(props: Partial<DormantTextProps>) {
    const content =
      "This is a very long text that should truncate when the screen is small";
    return (
      <DormantText fullWidth cancelable content={content} {...props}>
        <Textbox autoComplete="off" value={content} />
      </DormantText>
    );
  }

  context("icons", () => {
    const D_ON_CHECKLIST =
      "M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z";
    const D_ON_CANCEL =
      "M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z";

    context("accept", () => {
      it("should render with checklist icon", () => {
        cy.mount(<ProductDormantText />);

        cy.findByLabelText("dormant-label").click();

        cy.wait(300);

        cy.get("svg path")
          .eq(0)
          .invoke("attr", "d")
          .should("equal", D_ON_CHECKLIST);
      });

      context("when given image", () => {
        it("should render the newest icon", () => {
          cy.mount(
            <ProductDormantText
              icons={{
                accept: {
                  image: Ri24HoursFill,
                },
              }}
            />
          );

          cy.findByLabelText("dormant-label").click();

          cy.wait(300);

          cy.get("svg path")
            .eq(0)
            .invoke("attr", "d")
            .should("not.equal", D_ON_CHECKLIST);
        });
      });
    });

    context("cancel", () => {
      it("should render with close icon", () => {
        cy.mount(<ProductDormantText />);

        cy.findByLabelText("dormant-label").click();

        cy.wait(300);

        cy.get("svg path")
          .eq(1)
          .invoke("attr", "d")
          .should("equal", D_ON_CANCEL);
      });

      context("when given image", () => {
        it("should render the newest icon", () => {
          cy.mount(
            <ProductDormantText
              icons={{
                cancel: {
                  image: Ri24HoursFill,
                },
              }}
            />
          );

          cy.findByLabelText("dormant-label").click();

          cy.wait(300);

          cy.get("svg path")
            .eq(1)
            .invoke("attr", "d")
            .should("not.equal", D_ON_CANCEL);
        });
      });
    });
  });

  context("ellipsis", () => {
    context("when container is smaller than content", () => {
      it("should truncate text with ellipsis", () => {
        const content =
          "This is a very long text that should truncate when the screen is small";

        // simulate small screen/container
        cy.mount(
          <div style={{ width: "150px" }}>
            <DormantText
              fullWidth
              cancelable
              content={content}
              dormantedFontSize={14}
            >
              <Textbox autoComplete="off" value={content} />
            </DormantText>
          </div>
        );

        cy.findByLabelText("dormant-label").then(($dormantElement) => {
          const dom = $dormantElement[0];

          //Confirm the text is actually truncated
          expect(dom.scrollWidth).to.be.greaterThan(dom.clientWidth);

          cy.wrap($dormantElement).should("have.css", "overflow", "hidden");
          cy.wrap($dormantElement).should("have.css", "white-space", "nowrap");
          cy.wrap($dormantElement).should(
            "have.css",
            "text-overflow",
            "ellipsis"
          );
        });
      });
    });
  });

  context("style", () => {
    context("when hovered", () => {
      it("renders with cursor text", () => {
        const value = "Test";
        cy.mount(
          <DormantText
            fullWidth
            cancelable
            content={value}
            acceptChangeOn="all"
            dormantedFontSize={14}
          >
            <Textbox autoComplete="off" value={value} />
          </DormantText>
        );

        cy.findByLabelText("dormant-wrapper").should(
          "have.css",
          "cursor",
          "text"
        );
      });
    });
  });

  context("acceptChangeOn", () => {
    context("when given click", () => {
      context("when clicking dormant", () => {
        it("renders the input", () => {
          const value = "Test";
          cy.mount(
            <DormantText
              fullWidth
              cancelable
              content={value}
              styles={{
                dormantedStyle: css`
                  max-height: 24px;
                `,
              }}
              acceptChangeOn="click"
              dormantedFontSize={14}
            >
              <Textbox autoComplete="off" value={value} />
            </DormantText>
          );

          cy.get("input[type='text']").should("not.exist");
          cy.findByLabelText("dormant-wrapper").click();
          cy.get("input[type='text']").should("exist");
        });

        context("when clicking the input element", () => {
          it("should switch to dormant mode", () => {
            const value = "Test";
            cy.mount(
              <DormantText
                fullWidth
                cancelable
                content={value}
                styles={{
                  dormantedStyle: css`
                    max-height: 24px;
                  `,
                }}
                acceptChangeOn="click"
                dormantedFontSize={14}
                onActionClick={() => console.log("acceptChangeOn was succeed")}
              >
                <Textbox autoComplete="off" value={value} />
              </DormantText>
            );

            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.get("input[type='text']").should("not.exist");
            cy.findByLabelText("dormant-wrapper").click();
            cy.findByLabelText("dormant-wrapper").should("not.exist");
            cy.get("input[type='text']").should("exist").click();
            cy.findByLabelText("dormant-wrapper").should("exist");

            cy.get("@consoleLog").should(
              "have.been.calledWith",
              "acceptChangeOn was succeed"
            );
          });
        });

        context("when pressing enter", () => {
          it("should not switch to dormant mode", () => {
            const value = "Test";
            cy.mount(
              <DormantText
                fullWidth
                cancelable
                content={value}
                styles={{
                  dormantedStyle: css`
                    max-height: 24px;
                  `,
                }}
                acceptChangeOn="click"
                dormantedFontSize={14}
                onActionClick={() => console.log("acceptChangeOn was succeed")}
              >
                <Textbox autoComplete="off" value={value} />
              </DormantText>
            );

            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.get("input[type='text']").should("not.exist");
            cy.findByLabelText("dormant-wrapper").click();
            cy.findByLabelText("dormant-wrapper").should("not.exist");
            cy.get("input[type='text']").should("exist").type("{enter}");
            cy.findByLabelText("dormant-wrapper").should("not.exist");
            cy.get("@consoleLog").should(
              "not.have.been.calledWith",
              "acceptChangeOn was succeed"
            );
          });
        });
      });
    });

    context("when given enter", () => {
      context("when clicking dormant", () => {
        it("renders the input", () => {
          const value = "Test";
          cy.mount(
            <DormantText
              fullWidth
              cancelable
              content={value}
              styles={{
                dormantedStyle: css`
                  max-height: 24px;
                `,
              }}
              acceptChangeOn="enter"
              dormantedFontSize={14}
            >
              <Textbox autoComplete="off" value={value} />
            </DormantText>
          );

          cy.get("input[type='text']").should("not.exist");
          cy.findByLabelText("dormant-wrapper").click();
          cy.get("input[type='text']").should("exist");
        });

        context("when clicking the input element", () => {
          it("should not switch to dormant mode", () => {
            const value = "Test";
            cy.mount(
              <DormantText
                fullWidth
                cancelable
                content={value}
                styles={{
                  dormantedStyle: css`
                    max-height: 24px;
                  `,
                }}
                acceptChangeOn="enter"
                dormantedFontSize={14}
                onActionClick={() => console.log("acceptChangeOn was succeed")}
              >
                <Textbox autoComplete="off" value={value} />
              </DormantText>
            );

            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.get("input[type='text']").should("not.exist");
            cy.findByLabelText("dormant-wrapper").click();
            cy.findByLabelText("dormant-wrapper").should("not.exist");
            cy.get("input[type='text']").should("exist").click();
            cy.findByLabelText("dormant-wrapper").should("not.exist");

            cy.get("@consoleLog").should(
              "not.have.been.calledWith",
              "acceptChangeOn was succeed"
            );
          });
        });

        context("when pressing enter", () => {
          it("should switch to dormant mode", () => {
            const value = "Test";
            cy.mount(
              <DormantText
                fullWidth
                cancelable
                content={value}
                styles={{
                  dormantedStyle: css`
                    max-height: 24px;
                  `,
                }}
                acceptChangeOn="enter"
                dormantedFontSize={14}
                onActionClick={() => console.log("acceptChangeOn was succeed")}
              >
                <Textbox autoComplete="off" value={value} />
              </DormantText>
            );

            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.get("input[type='text']").should("not.exist");
            cy.findByLabelText("dormant-wrapper").click();
            cy.findByLabelText("dormant-wrapper").should("not.exist");
            cy.get("input[type='text']").should("exist").type("{enter}");
            cy.findByLabelText("dormant-wrapper").should("exist");

            cy.get("@consoleLog").should(
              "have.been.calledWith",
              "acceptChangeOn was succeed"
            );
          });
        });
      });
    });

    context("when given all", () => {
      context("when clicking dormant", () => {
        it("renders the input", () => {
          const value = "Test";
          cy.mount(
            <DormantText
              fullWidth
              cancelable
              content={value}
              styles={{
                dormantedStyle: css`
                  max-height: 24px;
                `,
              }}
              acceptChangeOn="all"
              dormantedFontSize={14}
            >
              <Textbox autoComplete="off" value={value} />
            </DormantText>
          );

          cy.get("input[type='text']").should("not.exist");
          cy.findByLabelText("dormant-wrapper").click();
          cy.get("input[type='text']").should("exist");
        });

        context("when clicking the input element", () => {
          it("should switch to dormant mode", () => {
            const value = "Test";
            cy.mount(
              <DormantText
                fullWidth
                cancelable
                content={value}
                styles={{
                  dormantedStyle: css`
                    max-height: 24px;
                  `,
                }}
                acceptChangeOn="all"
                dormantedFontSize={14}
                onActionClick={() => console.log("acceptChangeOn was succeed")}
              >
                <Textbox autoComplete="off" value={value} />
              </DormantText>
            );

            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.get("input[type='text']").should("not.exist");
            cy.findByLabelText("dormant-wrapper").click();
            cy.findByLabelText("dormant-wrapper").should("not.exist");
            cy.get("input[type='text']").should("exist").click();
            cy.findByLabelText("dormant-wrapper").should("exist");

            cy.get("@consoleLog").should(
              "have.been.calledWith",
              "acceptChangeOn was succeed"
            );
          });
        });

        context("when pressing enter", () => {
          it("should switch to dormant mode", () => {
            const value = "Test";
            cy.mount(
              <DormantText
                fullWidth
                cancelable
                content={value}
                styles={{
                  dormantedStyle: css`
                    max-height: 24px;
                  `,
                }}
                acceptChangeOn="all"
                dormantedFontSize={14}
                onActionClick={() => console.log("acceptChangeOn was succeed")}
              >
                <Textbox autoComplete="off" value={value} />
              </DormantText>
            );

            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.get("input[type='text']").should("not.exist");
            cy.findByLabelText("dormant-wrapper").click();
            cy.findByLabelText("dormant-wrapper").should("not.exist");
            cy.get("input[type='text']").should("exist").type("{enter}");
            cy.findByLabelText("dormant-wrapper").should("exist");

            cy.get("@consoleLog").should(
              "have.been.calledWith",
              "acceptChangeOn was succeed"
            );
          });
        });
      });
    });
  });

  context("when given dormantedStyle", () => {
    it("renders customize style for dormanted mode", () => {
      const value = "Test";
      cy.mount(
        <DormantText
          fullWidth
          cancelable
          content={value}
          styles={{
            dormantedStyle: css`
              max-height: 24px;
            `,
          }}
          acceptChangeOn="all"
          dormantedFontSize={14}
        >
          <Textbox autoComplete="off" value={value} />
        </DormantText>
      );

      cy.findByLabelText("dormant-wrapper")
        .should("have.css", "height", "24px")
        .click();
      cy.findByLabelText("active-wrapper").should("have.css", "height", "34px");
    });
  });

  context("when given activeStyle", () => {
    it("renders customize style for dormanted mode", () => {
      const value = "Test";
      cy.mount(
        <DormantText
          fullWidth
          cancelable
          content={value}
          styles={{
            activeStyle: css`
              min-height: 24px;
            `,
            actionStyle: css`
              height: 24px;
            `,
          }}
          acceptChangeOn="all"
          dormantedFontSize={14}
        >
          <Textbox
            styles={{
              containerStyle: css`
                height: 24px;
              `,
              self: css`
                height: 24px;
              `,
            }}
            autoComplete="off"
            value={value}
          />
        </DormantText>
      );

      cy.findByLabelText("dormant-wrapper")
        .should("have.css", "height", "39px")
        .click();
      cy.findByLabelText("active-wrapper").should("have.css", "height", "24px");
    });
  });
});
