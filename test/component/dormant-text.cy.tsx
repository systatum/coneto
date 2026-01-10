import { DormantText } from "./../../components/dormant-text";
import { Textbox } from "./../../components/textbox";
import { css } from "styled-components";

describe("DormantText", () => {
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
              dormantedStyle={css`
                max-height: 24px;
              `}
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
                dormantedStyle={css`
                  max-height: 24px;
                `}
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
                dormantedStyle={css`
                  max-height: 24px;
                `}
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
              dormantedStyle={css`
                max-height: 24px;
              `}
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
                dormantedStyle={css`
                  max-height: 24px;
                `}
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
                dormantedStyle={css`
                  max-height: 24px;
                `}
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
              dormantedStyle={css`
                max-height: 24px;
              `}
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
                dormantedStyle={css`
                  max-height: 24px;
                `}
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
                dormantedStyle={css`
                  max-height: 24px;
                `}
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
          dormantedStyle={css`
            max-height: 24px;
          `}
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
          activeStyle={css`
            min-height: 24px;
          `}
          actionStyle={css`
            height: 24px;
          `}
          acceptChangeOn="all"
          dormantedFontSize={14}
        >
          <Textbox
            styles={{
              containerStyle: css`
                height: 24px;
              `,
              style: css`
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
