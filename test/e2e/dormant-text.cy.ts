import { getIdContent } from "test/support/commands";

context("DormantText Component", () => {
  describe("Textbox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--default"));
    });

    it("Should type and confirm update in normal width textbox", () => {
      cy.findByText("Hello there, this is dormanted text").click();
      cy.findByRole("textbox").clear().type("Updated text normal");
      cy.findByRole("button").click();
      cy.findByText("Updated text normal").should("exist");
    });

    it("Should type and confirm update in full width textbox", () => {
      cy.findByText(
        "Hello there, this is dormanted text with full width"
      ).click();
      cy.findAllByRole("textbox").clear().type("Updated text full");
      cy.findAllByRole("button").click();
      cy.findByText("Updated text full").should("exist");
    });

    it("Should type and confirm update using Enter key", () => {
      cy.findByText(
        "Hello there, this is dormanted text with enable keydown"
      ).click();
      cy.findAllByRole("textbox").clear().type("Updated with Enter{enter}");
      cy.findByText("Updated with Enter").should("exist");
    });
  });

  describe("Combobox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-combobox"));
    });

    it("Should select option from combobox and accepted by pressing enter", () => {
      cy.findByText("Apple").click();
      cy.findByPlaceholderText("Select a fruit...").type(
        "{downarrow}{downarrow}{enter}"
      );
      cy.findByText("Orange").should("exist");
    });

    it("Should select option from full width combobox", () => {
      cy.findByText("Banana").click();
      cy.findByPlaceholderText("Select a fruit full...").type(
        "{downarrow}{downarrow}{enter}"
      );
      cy.findAllByText("Orange").should("have.length.at.least", 1);
    });
  });

  describe("Datebox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-datebox"));
    });

    it("Should open date picker and click a date", () => {
      cy.findAllByText("07/25/2025").eq(2).click();
      cy.get('[data-type="selectbox"]').click();
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("JAN").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2024").click();
      cy.findByText("3").click();
    });
  });

  describe("Colorbox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-colorbox"));
    });

    it("Should input a valid hex color and accepted by pressing click or enter", () => {
      cy.findAllByText("#zzzzzz").eq(2).click();
      cy.findByRole("textbox").clear().type("00ff00");
      cy.findByDisplayValue("00ff00").should("exist");
    });
  });

  describe("Moneybox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-moneybox"));
    });

    it("Should input and update money value and accepted by click", () => {
      cy.findAllByText("$ 100,000").eq(2).click();
      cy.get('input[name="keydown"]').clear().type("500000");
      cy.findByRole("button").click();
      cy.findByText("$ 500,000").should("exist");
    });
  });

  describe("Phonebox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-phonebox"));
    });

    it("Should input phone number and accepted by pressing enter", () => {
      cy.findAllByText("+1 812-345-7890").eq(2).click();

      cy.findByLabelText("Select country code").click();
      cy.findAllByLabelText("search-countries").type("Indonesia");
      cy.findByText("Indonesia").click();
      cy.findByPlaceholderText("Enter your phone number").type(
        "08123456789{enter}"
      );
    });
  });

  describe("Timebox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-timebox"));
    });

    it("Should input time and update with new behaviour and accepted by pressing enter", () => {
      cy.findAllByText("12:00:00").eq(1).click();
      cy.findByPlaceholderText("HH")
        .clear()
        .type("14{rightarrow}30{rightarrow}00{enter}");

      cy.findByText("14:30:00").should("exist");
    });
  });
});
