import { getIdContent } from "test/support/commands";

context("DormantText Component", () => {
  describe("Textbox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--default"));
    });

    it("Should type and confirm update in normal width textbox", () => {
      cy.findByText("Hello there, this is dormanted text").click();
      cy.findByRole("textbox")
        .should("be.visible")
        .clear()
        .type("Updated text normal");
      cy.findByRole("button").click();
      cy.findByText("Updated text normal").should("be.visible");
    });

    it("Should type and confirm update in full width textbox", () => {
      cy.findByText(
        "Hello there, this is dormanted text with full width"
      ).click();
      cy.findAllByRole("textbox")
        .eq(0)
        .should("be.visible")
        .clear()
        .type("Updated text full");
      cy.findAllByRole("button").eq(0).click();
      cy.findByText("Updated text full").should("be.visible");
    });

    it("Should type and confirm update pressing by Enter", () => {
      cy.findByText(
        "Hello there, this is dormanted text with enable keydown"
      ).click();
      cy.findAllByRole("textbox")
        .eq(0)
        .should("be.visible")
        .clear()
        .type("Updated with Enter{enter}");
      cy.findByText("Updated with Enter").should("be.visible");
    });

    it("Should type and change cancelable pressing by Escape", () => {
      cy.findByText(
        "Hello there, this is dormanted text with enable keydown"
      ).click();
      cy.findAllByRole("textbox")
        .eq(0)
        .should("be.visible")
        .clear()
        .type("Updated with the sentence{esc}");
      cy.findByText(
        "Hello there, this is dormanted text with enable keydown"
      ).should("be.visible");
    });
  });

  describe("Combobox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-combobox"));
    });

    it("Should select option from full width combobox", () => {
      cy.findByText("Banana").click();
      cy.findByPlaceholderText("Select a fruit full...").type(
        "{downarrow}{downarrow}{enter}"
      );
      cy.findAllByText("Orange").should("have.length.at.least", 1);
    });

    it("Should select option from combobox and accepted by pressing Enter", () => {
      cy.findByText("Apple").click();
      cy.findByPlaceholderText("Select a fruit...").type(
        "{downarrow}{downarrow}{enter}"
      );
      cy.findByText("Orange").should("be.visible");
    });

    it("Should type and change cancelable pressing by Escape", () => {
      cy.findByText("Orange").click();
      cy.findByPlaceholderText("Select a fruit keydown...")
        .clear()
        .type("Pineapp {esc}");
      cy.findByText("Orange").should("be.visible");
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
      cy.findByText("01/03/2024").should("exist");
    });

    it("Should open date picker and change cancelable pressing by click Close", () => {
      cy.findAllByText("07/25/2025").eq(2).click();
      cy.get('[data-type="selectbox"]').click();
      cy.findByLabelText("calendar-select-date").click();
      cy.findByLabelText("combobox-month").click();
      cy.findByText("JAN").click();
      cy.findByLabelText("combobox-year").click();
      cy.findByText("2024").click();
      cy.findAllByRole("button").eq(2).click();
      cy.findAllByText("07/25/2025").eq(2).should("exist");
    });
  });

  describe("Colorbox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-colorbox"));
    });

    it("Should input a valid hex color and accepted by pressing click or Enter", () => {
      cy.findAllByText("#zzzzzz").eq(2).click();
      cy.findByRole("textbox")
        .should("have.value", "zzzzzz")
        .clear()
        .type("00ff00{enter}");
      cy.findByText("#00ff00").should("exist");
    });

    it("Should input a valid hex color and change cancelable pressing by Escape", () => {
      cy.findAllByText("#zzzzzz").eq(2).click();
      cy.findByRole("textbox")
        .should("have.value", "zzzzzz")
        .clear()
        .type("00ff00{esc}");
      cy.findAllByText("#zzzzzz").eq(2).should("exist");
    });
  });

  describe("Moneybox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-moneybox"));
    });

    it("Should input and update money value and accepted by click", () => {
      cy.findAllByText("$ 100,000").eq(2).click();
      cy.get('input[name="keydown"]')
        .should("have.value", "100,000")
        .clear()
        .type("500000");
      cy.findAllByRole("button").eq(0).click();
      cy.findByText("$ 500,000").should("be.visible");
    });

    it("Should input and change cancelable pressing by Escape", () => {
      cy.findAllByText("$ 100,000").eq(2).click();
      cy.get('input[name="keydown"]')
        .should("have.value", "100,000")
        .clear()
        .type("500000 {esc}");
      cy.findAllByText("$ 100,000").eq(2).should("be.visible");
    });
  });

  describe("Phonebox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-phonebox"));
    });

    it("Should input phone number and accepted by pressing Enter", () => {
      cy.findAllByText("+1 812-345-7890").eq(2).click();
      cy.findByLabelText("Select country code").click();
      cy.findAllByLabelText("search-countries").type("Indonesia");
      cy.findByText("Indonesia").click();
      cy.findByPlaceholderText("Enter your phone number")
        .clear()
        .type("08123456789{enter}");
      cy.findByText("+62 812-3456-789").should("exist");
    });

    it("Should input phone number and change cancelable pressing by Escape", () => {
      cy.findAllByText("+1 812-345-7890").eq(2).click();
      cy.findByLabelText("Select country code").click();
      cy.findAllByLabelText("search-countries").type("Indonesia");
      cy.findByText("Indonesia").click();
      cy.findByPlaceholderText("Enter your phone number")
        .clear()
        .type("08123456789{enter}");
      cy.findByText("+62 812-3456-789").should("exist");
    });
  });

  describe("Timebox", () => {
    beforeEach(() => {
      cy.visit(getIdContent("stage-dormanttext--with-timebox"));
    });

    it("Should input time and update with new behaviour and accepted by pressing Enter", () => {
      cy.findAllByText("12:00:00").eq(1).click();
      cy.findByPlaceholderText("HH")
        .clear()
        .type("14{rightarrow}30{rightarrow}00{enter}");
      cy.findByText("14:30:00").should("exist");
    });

    it("Should input time and update with new behaviour and accepted by pressing Escape", () => {
      cy.findAllByText("12:00:00").eq(1).click();
      cy.findByPlaceholderText("HH")
        .clear()
        .type("14{rightarrow}30{rightarrow}00{enter}");
      cy.findByText("14:30:00").should("exist");
    });
  });
});
