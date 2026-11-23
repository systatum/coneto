import { Textbox } from "./../../components/textbox";
import { Textarea } from "./../../components/textarea";
import { ThemeProvider } from "./../../theme/provider";
import { lightTheme } from "./../../theme/mode/light";

const customTheme = {
  ...lightTheme,
  textbox: { ...lightTheme.textbox, borderRadius: "17px" },
  textarea: { ...lightTheme.textarea, borderRadius: "17px" },
};

describe("Text field theme radius", () => {
  it("applies textbox borderRadius from the theme", () => {
    cy.mountWithoutTheme(
      <ThemeProvider mode="light" themes={{ light: customTheme }}>
        <Textbox name="name" value="" onChange={() => undefined} />
      </ThemeProvider>
    );

    cy.get("input").should("have.css", "border-top-left-radius", "17px");
  });

  it("applies textarea borderRadius from the theme", () => {
    cy.mountWithoutTheme(
      <ThemeProvider mode="light" themes={{ light: customTheme }}>
        <Textarea name="description" value="" onChange={() => undefined} />
      </ThemeProvider>
    );

    cy.get("textarea").should("have.css", "border-top-left-radius", "17px");
  });
});
