import { ChangeEvent, useState } from "react";
import {
  CurrencyOptionProps,
  Moneybox,
  MoneyboxProps,
} from "./../../components/moneybox";

describe("Moneybox", () => {
  function ProductMoneybox(
    props: MoneyboxProps & {
      withOnChange?: boolean;
    }
  ) {
    const [value, setValue] = useState("");
    return (
      <Moneybox
        label="Color"
        value={value}
        onChange={
          props?.withOnChange ? (e) => setValue(e.target.value) : undefined
        }
        {...props}
      />
    );
  }

  context("onChange", () => {
    context("when given", () => {
      it("should change the value", () => {
        cy.mount(<ProductMoneybox withOnChange />);

        cy.findByRole("textbox").click().type("1234");

        cy.get("body").click("bottomRight");

        cy.findByRole("textbox").should("have.value", "1,234");
      });
    });

    context("when not given", () => {
      it("should not changes the value", () => {
        cy.mount(<ProductMoneybox />);

        cy.findByRole("textbox").click().type("1234");

        cy.get("body").click("bottomRight");

        cy.findByRole("textbox").should("have.value", "");
      });
    });
  });

  context("editableCurrency", () => {
    const CURRENCY_OPTIONS: CurrencyOptionProps[] = [
      { id: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
      { id: "USD", name: "US Dollar", symbol: "$" },
      { id: "EUR", name: "Euro", symbol: "€" },
      { id: "JPY", name: "Japanese Yen", symbol: "¥" },
      { id: "GBP", name: "British Pound", symbol: "£" },
      { id: "SGD", name: "Singapore Dollar", symbol: "$" },
      { id: "AUD", name: "Australian Dollar", symbol: "$" },
      { id: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
      { id: "KRW", name: "South Korean Won", symbol: "₩" },
      { id: "CNY", name: "Chinese Yuan", symbol: "¥" },
    ];

    function EditableCurrency() {
      const [inputValue, setInputValue] = useState({
        currency: "GBP",
        content: "",
      });

      const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setInputValue((prev) => ({ ...prev, [name]: value }));
      };

      return (
        <Moneybox
          content="value"
          editableCurrency
          onChange={onChange}
          value={inputValue.content}
          currency={inputValue.currency}
          currencyOptions={CURRENCY_OPTIONS}
        />
      );
    }

    context("when initialize currency", () => {
      it("renders symbol with selected", () => {
        cy.mount(<EditableCurrency />);
        CURRENCY_OPTIONS.map((props) => {
          if (props.id === "GBP") {
            cy.findByText(props.symbol).should("exist");
          } else {
            cy.findByText(props.symbol).should("not.exist");
          }
        });
      });
    });

    context("when clicking currency", () => {
      it("renders the dropdown options", () => {
        cy.mount(<EditableCurrency />);
        cy.findByLabelText("currency").click();
        CURRENCY_OPTIONS.map((props) => {
          cy.findByText(props.name).should("exist");
        });
      });

      context("when selecting options", () => {
        it("should change the currency", () => {
          cy.mount(<EditableCurrency />);
          cy.findByLabelText("currency").click();

          cy.findByText("Indonesian Rupiah").click();
          CURRENCY_OPTIONS.map((props) => {
            if (props.id === "IDR") {
              cy.findByText(props.symbol).should("exist");
            } else {
              cy.findByText(props.symbol).should("not.exist");
            }
          });
        });
      });
    });
  });
});
