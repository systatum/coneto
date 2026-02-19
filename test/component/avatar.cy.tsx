import { Avatar, AvatarProps } from "./../../components/avatar";

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
