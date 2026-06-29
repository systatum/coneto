import { Ri24HoursFill, RiCloseFill, RiCloseLine } from "@remixicon/react";
import { Title } from "./../../components/title";
import { Button } from "./../../components/button";
import { css } from "styled-components";

describe("Title", () => {
  context("basic render", () => {
    it("should render title text", () => {
      cy.mount(<Title text="Hello Title" />);

      cy.findByLabelText("title-title")
        .should("exist")
        .and("contain", "Hello Title");
    });

    it("should render pretitle and subtitle", () => {
      cy.mount(<Title pretitle="Pre" text="Main" subtitle="Sub" />);

      cy.findByLabelText("title-pretitle").should("contain", "Pre");
      cy.findByLabelText("title-title").should("contain", "Main");
      cy.findByLabelText("title-subtitle").should("contain", "Sub");
    });
  });

  context("styles", () => {
    context("actions styles", () => {
      context("containerStyle", () => {
        context("when given border blue color", () => {
          it("renders the blue colors on the container", () => {
            cy.mount(
              <Title
                rightSection={[
                  {
                    type: "actions",
                    actions: [
                      {
                        icon: { image: RiCloseLine },
                        onClick: () => {
                          console.log("close was clicked");
                        },
                        styles: {
                          containerStyle: css`
                            border: 1px solid blue;
                          `,
                        },
                      },
                      {
                        icon: { image: Ri24HoursFill },
                        onClick: () => {
                          console.log("close was clicked");
                        },
                      },
                    ],
                  },
                ]}
              />
            );

            cy.findAllByLabelText("action-button")
              .parent()
              .eq(0)
              .should("have.css", "border", "1px solid rgb(0, 0, 255)");
            cy.findAllByLabelText("action-button")
              .parent()
              .eq(1)
              .should("not.have.css", "border", "1px solid rgb(0, 0, 255)");
          });
        });
      });

      context("self", () => {
        context("when given padding 50px", () => {
          it("renders specific style with 50px", () => {
            cy.mount(
              <Title
                rightSection={[
                  {
                    type: "actions",
                    actions: [
                      {
                        icon: { image: RiCloseLine },
                        onClick: () => {
                          console.log("close was clicked");
                        },
                        styles: {
                          self: css`
                            padding: 50px;
                          `,
                        },
                      },
                      {
                        icon: { image: Ri24HoursFill },
                        onClick: () => {
                          console.log("close was clicked");
                        },
                      },
                    ],
                  },
                ]}
              />
            );

            cy.findAllByLabelText("action-button")
              .eq(0)
              .should("have.css", "padding", "50px");
            cy.findAllByLabelText("action-button")
              .eq(1)
              .should("have.css", "padding", "20px");
          });
        });
      });
    });

    context("containerStyle", () => {
      context("when given gap: 20px", () => {
        it("should apply container gap", () => {
          cy.mount(
            <Title
              text="Hello"
              styles={{
                containerStyle: css`
                  gap: 20px;
                `,
              }}
            />
          );

          cy.findByLabelText("title-container").should(
            "have.css",
            "gap",
            "20px"
          );
        });
      });

      context("when given flex-direction: row-reverse", () => {
        it("should override container direction", () => {
          cy.mount(
            <Title
              text="Hello"
              styles={{
                containerStyle: css`
                  flex-direction: row-reverse;
                `,
              }}
            />
          );

          cy.findByLabelText("title-container").should(
            "have.css",
            "flex-direction",
            "row-reverse"
          );
        });
      });
    });

    context("textContainerStyle", () => {
      context("when given align-items: center", () => {
        it("should center text container", () => {
          cy.mount(
            <Title
              text="Hello"
              styles={{
                textContainerStyle: css`
                  align-items: center;
                `,
              }}
            />
          );

          cy.findByLabelText("title-text-container").should(
            "have.css",
            "align-items",
            "center"
          );
        });
      });
    });

    context("titleStyle", () => {
      context("when given font-size override", () => {
        it("should override title font size", () => {
          cy.mount(
            <Title
              text="Hello"
              styles={{
                titleStyle: css`
                  font-size: 40px;
                `,
              }}
            />
          );

          cy.findByLabelText("title-title").should(($el) => {
            const size = getComputedStyle($el[0]).fontSize;
            expect(size).to.eq("40px");
          });
        });
      });

      context("when given color override", () => {
        it("should override title color", () => {
          cy.mount(
            <Title
              text="Hello"
              styles={{
                titleStyle: css`
                  color: red;
                `,
              }}
            />
          );

          cy.findByLabelText("title-title").should(($el) => {
            const color = getComputedStyle($el[0]).color;
            expect(color).to.not.be.empty;
          });
        });
      });
    });

    context("subtitleStyle", () => {
      it("should apply subtitle custom styles", () => {
        cy.mount(
          <Title
            text="Hello"
            subtitle="World"
            styles={{
              subtitleStyle: css`
                font-size: 18px;
                opacity: 0.5;
              `,
            }}
          />
        );

        cy.findByLabelText("title-subtitle").should(($el) => {
          const style = getComputedStyle($el[0]);
          expect(style.fontSize).to.eq("18px");
          expect(Number(style.opacity)).to.eq(0.5);
        });
      });
    });

    context("textWrapperStyle", () => {
      it("should apply wrapper styles", () => {
        cy.mount(
          <Title
            text="title"
            pretitle="pretitle"
            subtitle="subtitle"
            styles={{
              textWrapperStyle: css`
                gap: 20px;
              `,
            }}
          />
        );

        cy.findByLabelText("title-text-wrapper").should(
          "have.css",
          "gap",
          "20px"
        );
      });
    });

    context("section styles", () => {
      context("leftSectionStyle", () => {
        it("should apply left section custom style", () => {
          cy.mount(
            <Title
              text="Hello"
              leftSection={[
                {
                  type: "custom",
                  render: <div>Left</div>,
                },
                {
                  type: "custom",
                  render: <div>Also Left</div>,
                },
              ]}
              styles={{
                leftSectionStyle: css`
                  gap: 12px;
                `,
              }}
            />
          );

          cy.findByLabelText("title-left-section").should(
            "have.css",
            "gap",
            "12px"
          );
        });
      });

      context("rightSectionStyle", () => {
        it("should apply right section style", () => {
          cy.mount(
            <Title
              text="Hello"
              rightSection={[
                {
                  type: "custom",
                  render: <div>Right</div>,
                },
                {
                  type: "custom",
                  render: <div>Still Right</div>,
                },
              ]}
              styles={{
                rightSectionStyle: css`
                  gap: 30px;
                `,
              }}
            />
          );

          cy.findByLabelText("title-right-section").should(
            "have.css",
            "gap",
            "30px"
          );
        });
      });
    });
  });

  context("size", () => {
    context("when given sm", () => {
      it("should render small font size (17px)", () => {
        cy.mount(<Title.Small text="Small Title" />);

        cy.findByLabelText("title-title").should(($el) => {
          expect(getComputedStyle($el[0]).fontSize).to.eq("17px");
        });
      });
    });

    context("when given md", () => {
      it("should render medium font size (24px)", () => {
        cy.mount(<Title.Medium text="Medium Title" />);

        cy.findByLabelText("title-title").should(($el) => {
          expect(getComputedStyle($el[0]).fontSize).to.eq("24px");
        });
      });
    });

    context("when given lg", () => {
      it("should render large layout with column direction", () => {
        cy.mount(<Title.Large text="Large Title" />);

        cy.findByLabelText("title-container").should(
          "have.css",
          "flex-direction",
          "column"
        );
      });

      it("should render large title font size (28px)", () => {
        cy.mount(<Title.Large text="Large Title" />);

        cy.findByLabelText("title-title").should(($el) => {
          expect(getComputedStyle($el[0]).fontSize).to.eq("28px");
        });
      });
    });
  });

  context("icon", () => {
    it("should render icon when provided", () => {
      cy.mount(
        <Title
          text="Icon"
          icon={{ image: "https://placehold.co/40", color: "#000" }}
        />
      );

      cy.findByLabelText("title-icon").should("exist");
    });

    it("should scale icon based on size", () => {
      cy.mount(
        <Title.Large text="Icon" icon={{ image: "x", color: "#000" }} />
      );

      cy.findByLabelText("title-icon").should(($el) => {
        const size = $el[0].getBoundingClientRect().width;
        expect(size).to.be.greaterThan(30);
      });
    });
  });

  context("sections", () => {
    context("with capsule", () => {
      it("should render capsule section", () => {
        cy.mount(
          <Title
            text="Capsule"
            leftSection={[
              {
                type: "capsule",
                capsule: {
                  tabs: [
                    {
                      id: "new",
                      title: "New",
                    },
                    {
                      id: "list",
                      title: "List",
                    },
                  ],
                  activeTab: "new",
                },
              },
            ]}
          />
        );

        cy.findByLabelText("capsule").should("exist");
        cy.findByText("New").should("exist");
        cy.findByText("List").should("exist");
      });
    });

    context("with custom", () => {
      it("should render custom section content", () => {
        cy.mount(
          <Title
            text="Custom"
            rightSection={[
              {
                type: "custom",
                render: <Button>Click Me</Button>,
              },
            ]}
          />
        );

        cy.findByRole("button").should("have.text", "Click Me").should("exist");
      });
    });

    context("with actions", () => {
      context("when given id", () => {
        it("should render the id from action", () => {
          cy.mount(
            <Title
              text="With Actions"
              rightSection={[
                {
                  type: "actions",
                  actions: [
                    {
                      id: "Test",
                      caption: "Edit",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                    },
                    {
                      caption: "Not Editable",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                    },
                  ],
                },
              ]}
            />
          );

          cy.get("#Test").should("exist").and("have.length", 1);
        });
      });

      context("when given className", () => {
        it("should render the className", () => {
          cy.mount(
            <Title
              text="With Actions"
              rightSection={[
                {
                  type: "actions",
                  actions: [
                    {
                      className: "test-className",
                      caption: "Edit",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                    },
                    {
                      className: "test-another-className",
                      caption: "Edit",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                    },
                  ],
                },
              ]}
            />
          );

          cy.get(".test-className").should("exist").and("have.length", 1);
          cy.get(".test-another-className")
            .should("exist")
            .and("have.length", 1);
        });
      });

      context("when given hidden", () => {
        it("should not shows the action", () => {
          cy.mount(
            <Title
              text="With Actions"
              rightSection={[
                {
                  type: "actions",
                  actions: [
                    {
                      className: "test-className",
                      caption: "Edit",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                      hidden: true,
                    },
                    {
                      className: "test-another-className",
                      caption: "Edit",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                    },
                  ],
                },
              ]}
            />
          );

          cy.get(".test-className").should("not.exist");
          cy.get(".test-another-className")
            .should("exist")
            .and("have.length", 1);
        });
      });

      context("when given disabled", () => {
        it("should disabled the action", () => {
          cy.mount(
            <Title
              text="With Actions"
              rightSection={[
                {
                  type: "actions",
                  actions: [
                    {
                      className: "test-className",
                      caption: "Edit",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                      disabled: true,
                    },
                    {
                      className: "test-another-className",
                      caption: "Edit",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                    },
                  ],
                },
              ]}
            />
          );

          cy.findAllByLabelText("action-button").eq(0).should("be.disabled");
          cy.findAllByLabelText("action-button")
            .eq(1)
            .should("not.be.disabled");
        });
      });

      it("should render actions section", () => {
        cy.mount(
          <Title
            text="With Actions"
            rightSection={[
              {
                type: "actions",
                actions: [
                  {
                    caption: "Edit",
                    icon: { image: RiCloseFill },
                    onClick: cy.stub(),
                  },
                ],
              },
            ]}
          />
        );

        cy.findAllByLabelText("title-right-section").eq(0).should("exist");
      });

      context("when hovering", () => {
        it("should render icon with transparent background color (0.45)", () => {
          cy.mount(
            <Title
              text="Icon"
              rightSection={[
                {
                  type: "actions",
                  actions: [
                    {
                      caption: "Edit",
                      icon: { image: RiCloseFill },
                      onClick: cy.stub(),
                    },
                  ],
                },
              ]}
            />
          );

          cy.findByLabelText("action-button").realHover();

          cy.wait(200);
          cy.findByLabelText("action-button").should(
            "have.css",
            "background-color",
            "rgba(255, 255, 255, 0.45)"
          );
        });
      });
    });
  });
});
