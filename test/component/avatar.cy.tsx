import {
  Avatar,
  AvatarProps,
  AvatarStackAction,
  AvatarStackAvatar,
  AvatarStackProps,
} from "./../../components/avatar";

describe("Avatar", () => {
  function AvatarComponent() {
    const args: AvatarProps = {
      firstName: "John",
      lastName: "",
      changeable: false,
      frameSize: 70,
    };

    return (
      <Avatar
        {...args}
        onMouseEnter={() => console.log("now is hovering avatar")}
        onMouseLeave={() => console.log("now is leaving avatar")}
        onClick={() => console.log("now is clicking avatar")}
      />
    );
  }

  context("Avatar.Stack", () => {
    const AVATARS: AvatarStackAvatar[] = [
      {
        firstName: "Adam",
        lastName: "Hakarsa",
        profileImageUrl: "https://randomuser.me/api/portraits/men/1.jpg",
        hoverCaption: "Adam Hakarsa",
      },
      {
        firstName: "Liam",
        lastName: "Anderson",
        profileImageUrl: "https://randomuser.me/api/portraits/men/2.jpg",
      },
      {
        firstName: "Sophia",
        lastName: "Brown",
        hoverCaption: "Sophia Brown",
      },
      {
        firstName: "Noah",
        lastName: "Taylor",
        hoverCaption: "Noah Taylor",
      },
      {
        firstName: "Emma",
        lastName: "Wilson",
        profileImageUrl: "https://randomuser.me/api/portraits/women/4.jpg",
        hoverCaption: "Emma Wilson",
      },
    ];

    const ONE_ACTIONS: AvatarStackAction[] = [
      {
        hoverCaption: "Add another person",
        onClick: () => {
          console.log("was added");
        },
      },
    ];

    function ProductAvatarStack(props: AvatarStackProps) {
      return (
        <Avatar.Stack avatars={AVATARS} actions={ONE_ACTIONS} {...props} />
      );
    }

    context("fontSize", () => {
      it("renders with font-size 18px (by default)", () => {
        cy.mount(<ProductAvatarStack />);

        cy.findAllByLabelText("avatar-content")
          .eq(2)
          .should("have.css", "font-size", "18px");
        cy.findAllByLabelText("avatar-content")
          .eq(3)
          .should("have.css", "font-size", "18px");
      });

      context("when given 20px by parent", () => {
        it("renders all font-size with 20px", () => {
          cy.mount(<ProductAvatarStack fontSize={20} />);

          cy.findAllByLabelText("avatar-content")
            .eq(2)
            .should("have.css", "font-size", "20px");
          cy.findAllByLabelText("avatar-content")
            .eq(3)
            .should("have.css", "font-size", "20px");
        });

        context("when given 25px for one specified avatar", () => {
          it("renders the specified avatar font-size with 25px", () => {
            const FINAL_AVATARS_WITH_SPECIFIED_FONT_SIZE = AVATARS.map(
              (avatar, index) =>
                index === 2
                  ? {
                      ...avatar,
                      fontSize: 25,
                    }
                  : avatar
            );

            cy.mount(
              <ProductAvatarStack
                fontSize={20}
                avatars={FINAL_AVATARS_WITH_SPECIFIED_FONT_SIZE}
              />
            );

            cy.findAllByLabelText("avatar-content")
              .eq(2)
              .should("have.css", "font-size", "25px");
            cy.findAllByLabelText("avatar-content")
              .eq(3)
              .should("have.css", "font-size", "20px");
          });
        });
      });
    });

    context("frameSize", () => {
      it("renders with size 50px (by default)", () => {
        cy.mount(<ProductAvatarStack />);

        cy.findAllByLabelText("avatar-content")
          .should("have.css", "width", "50px")
          .and("have.css", "height", "50px");
      });

      context("when given 70px by parent", () => {
        it("should renders all frame-size with 70px", () => {
          cy.mount(<ProductAvatarStack frameSize={70} />);

          cy.findAllByLabelText("avatar-content")
            .should("have.css", "width", "70px")
            .and("have.css", "height", "70px");
        });

        context("when given 100px for one specified avatar", () => {
          it("renders the specified avatar font-size with 100px", () => {
            const FINAL_AVATARS_WITH_SPECIFIED_FRAME_SIZE = AVATARS.map(
              (avatar, index) =>
                index === 2
                  ? {
                      ...avatar,
                      frameSize: 100,
                    }
                  : avatar
            );

            cy.mount(
              <ProductAvatarStack
                frameSize={70}
                avatars={FINAL_AVATARS_WITH_SPECIFIED_FRAME_SIZE}
              />
            );

            FINAL_AVATARS_WITH_SPECIFIED_FRAME_SIZE.map((_, index) => {
              if (index === 2) {
                cy.findAllByLabelText("avatar-content")
                  .eq(2)
                  .should("have.css", "width", "100px")
                  .and("have.css", "height", "100px");
              } else {
                cy.findAllByLabelText("avatar-content")
                  .eq(index)
                  .should("have.css", "width", "70px")
                  .and("have.css", "height", "70px");
              }
            });
          });
        });
      });
    });

    context("actions", () => {
      it("renders all the action", () => {
        cy.mount(<ProductAvatarStack />);

        cy.findByLabelText("avatar-stack-action").should("exist");
      });

      context("hoverCaption", () => {
        it("renders the hoverCaption on hover", () => {
          const actions: AvatarStackAction[] = [
            {
              hoverCaption: "Add another person",
              onClick: cy.stub(),
            },
          ];

          cy.mount(<ProductAvatarStack actions={actions} />);

          cy.findByText("Add another person").should("not.exist");

          cy.findByLabelText("avatar-stack-action").realHover();

          cy.wait(200);

          cy.findByText("Add another person").should("exist");
        });
      });

      context("hidden", () => {
        context("when given", () => {
          it("does not render the action", () => {
            const actions: AvatarStackAction[] = [
              {
                hoverCaption: "Add another person",
                onClick: cy.stub(),
              },
              {
                hidden: true,
                hoverCaption: "Hidden Action",
              },
            ];

            cy.mount(<ProductAvatarStack actions={actions} />);

            cy.findAllByLabelText("avatar-stack-action").should(
              "not.have.length",
              2
            );
          });
        });
      });

      context("onClick", () => {
        context("when clicking an action", () => {
          it("renders calls onClick", () => {
            const onClick = cy.stub();

            const actions: AvatarStackAction[] = [
              {
                onClick,
              },
            ];

            cy.mount(<ProductAvatarStack actions={actions} />);

            cy.findByLabelText("avatar-stack-action").click();

            cy.wrap(onClick).should("have.been.calledOnce");
          });
        });
      });
    });

    context("id", () => {
      context("when given id avatar-stack-test", () => {
        it("renders the id with avatar-stack-test", () => {
          cy.mount(<ProductAvatarStack id="avatar-stack-test" />);

          cy.get("#avatar-stack-test").should("exist");
        });
      });
    });

    context("className", () => {
      it("renders coneto-avatar-stack", () => {
        cy.mount(<ProductAvatarStack />);

        cy.get(".coneto-avatar-stack").should("exist");
      });

      context("when given className test", () => {
        it("renders the className with test", () => {
          cy.mount(<ProductAvatarStack className="test" />);

          cy.get(".coneto-avatar-stack").should("exist");
          cy.get(".test").should("exist");
        });
      });
    });
  });

  context("onMouseEnter", () => {
    context("when hovering", () => {
      it("should give callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<AvatarComponent />);
        cy.findByLabelText("avatar-content").trigger("mouseover");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is hovering avatar"
        );
      });
    });
  });

  context("onMouseLeave", () => {
    context("when hover & leave", () => {
      it("should give callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<AvatarComponent />);
        cy.findByLabelText("avatar-content")
          .trigger("mouseover")
          .trigger("mouseout");

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is hovering avatar"
        );
        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is leaving avatar"
        );
      });
    });
  });

  context("onClick", () => {
    context("when clicking", () => {
      it("should give callback", () => {
        cy.window().then((win) => {
          cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<AvatarComponent />);
        cy.findByLabelText("avatar-content").click();

        cy.get("@consoleLog").should(
          "have.been.calledWith",
          "now is clicking avatar"
        );
      });
    });
  });
});
