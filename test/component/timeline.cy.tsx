import { Timeline, TimelineItemProps } from "./../../components/timeline";

describe("Timeline", () => {
  context("Clickable", () => {
    const TIMELINE_ITEMS: TimelineItemProps[] = [
      {
        title: "Traveled to Japan",
        subtitle: [
          "- Visited Tokyo, Kyoto, and Osaka",
          "- Tried authentic sushi and stayed in a ryokan",
        ],
        onClick: () => {
          console.log("Traveled to Japan");
        },
        sidenote: [<span style={{ fontSize: "14px" }}>Oct 2025</span>],
        variant: "todo",
      },
      {
        title: "Started Daily Meditation Habit",
        subtitle: ["Practicing mindfulness for 10 minutes every morning"],
        onClick: () => {
          console.log("Started Daily Meditation Habit");
        },
        sidenote: [<span style={{ fontSize: "14px" }}>Jan 2023</span>],
        variant: "error",
      },
      {
        title: "Ran First Half Marathon",
        subtitle: ["variant 21 km in under 2 hours"],
        onClick: () => {
          console.log("Ran First Half Marathon");
        },
        sidenote: [<span style={{ fontSize: "14px" }}>Sep 2022</span>],
        variant: "completed",
      },
      {
        title: "Adopted a Dog",
        subtitle: ["Golden Retriever named Mochi"],
        onClick: () => {
          console.log("Adopted a Dog");
        },
        sidenote: [<span style={{ fontSize: "14px" }}>Jun 2022</span>],
        variant: "completed",
      },
    ];

    context("when clicking", () => {
      it("should render the console", () => {
        cy.mount(
          <Timeline isClickable>
            {TIMELINE_ITEMS.map((props, index) => (
              <Timeline.Item {...props} key={index} />
            ))}
          </Timeline>
        );

        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        TIMELINE_ITEMS.map((props) => {
          cy.findByText(props.title).click();
          cy.get("@consoleLog").should("have.been.calledWith", props.title);
        });
      });
    });

    context("line", () => {
      context("when given", () => {
        it("should render the line dash | solid | dotted", () => {
          cy.mount(
            <Timeline isClickable>
              {TIMELINE_ITEMS.map((props, index) => (
                <Timeline.Item {...props} key={index} />
              ))}
            </Timeline>
          );
          TIMELINE_ITEMS.map((props, index) => {
            if (index < TIMELINE_ITEMS.length - 1) {
              cy.findAllByLabelText("timeline-connector")
                .eq(index)
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
});
