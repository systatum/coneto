import { Stepline, SteplineItemProps } from "./../../components/stepline";

describe("Stepline", () => {
  const STEPLINE_ITEMS: SteplineItemProps[] = [
    {
      title: "Application Submitted",
      subtitle: "Your application has been received",
      variant: "completed",
      onClick: () => {
        console.log("Application Submitted");
      },
    },
    {
      title: "Initial Screening",
      subtitle: "Resume and profile review",
      variant: "completed",
      onClick: () => {
        console.log("Initial Screening");
      },
    },
    {
      title: "Technical Interview",
      subtitle: "Assessment of technical skills",
      variant: "error",
      line: "dash",
      onClick: () => {
        console.log("Technical Interview");
      },
    },
    {
      title: "Final Interview",
      subtitle: "Discussion with the team lead",
      line: "dash",
      onClick: () => {
        console.log("Final Interview");
      },
    },
    {
      title: "Offer Sent",
      subtitle: "Waiting for your confirmation",
      line: "dash",
      onClick: () => {
        console.log("Offer Sent");
      },
    },
  ];

  context("clickable", () => {
    context("when clicking", () => {
      it("should render the console", () => {
        cy.mount(
          <Stepline>
            {STEPLINE_ITEMS.map((props, index) => (
              <Stepline.Item key={index} {...props} />
            ))}
          </Stepline>
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        STEPLINE_ITEMS.map((props) => {
          cy.findByText(props.title).click();

          const noLogTitles = ["Offer Sent", "Final Interview"];
          if (noLogTitles.includes(props.title)) {
            cy.get("@consoleLog").should(
              "not.have.been.calledWith",
              props.title
            );
          } else {
            cy.get("@consoleLog").should("have.been.calledWith", props.title);
          }
        });
      });
    });
  });

  context("line", () => {
    context("when given", () => {
      it("should render the line dash | solid | dotted", () => {
        cy.mount(
          <Stepline>
            {STEPLINE_ITEMS.map((props, index) => (
              <Stepline.Item key={index} {...props} />
            ))}
          </Stepline>
        );

        STEPLINE_ITEMS.map((props, index) => {
          if (index > 0) {
            cy.findAllByLabelText("stepline-connector")
              .eq(index - 1)
              .should(
                "have.css",
                "border-bottom-style",
                props.line === "dash"
                  ? "dashed"
                  : props.line === "dot"
                    ? "dotted"
                    : "solid"
              );
          }
        });
      });
    });
  });
});
