import {
  FormFieldGroup,
  FormFieldProps,
  StatefulForm,
} from "./../../components/stateful-form";
import { COUNTRY_CODES } from "./../../constants/countries";
import { Boxbar } from "./../../components/boxbar";
import { Badge, BadgeProps } from "./../../components/badge";
import { css } from "styled-components";
import { OptionsProps } from "./../../components/selectbox";
import { CapsuleContentProps } from "./../../components/capsule";

describe("StatefulForm", () => {
  context("when array of array", () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const value = {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    };

    const EMPLOYEE_FIELDS: FormFieldGroup[] = [
      [
        {
          name: "first_name",
          title: "First Name",
          type: "text",
          required: true,
          placeholder: "Enter first name",
        },
        {
          name: "last_name",
          title: "Last Name",
          type: "text",
          required: false,
          placeholder: "Enter last name",
        },
      ],
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email address",
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
        placeholder: "Enter phone number",
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
        placeholder: "Add additional notes",
      },
      {
        name: "access",
        placeholder: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];
    it("render in the one row", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          mode="onChange"
        />
      );
      cy.findAllByLabelText("stateful-form-row")
        .eq(0)
        .within(() => {
          cy.contains("First Name").should("exist");
          cy.contains("Last Name").should("exist");

          cy.contains("Email").should("not.exist");
          cy.contains("Phone Number").should("not.exist");
          cy.contains("Note").should("not.exist");
          cy.contains("Has access to login").should("not.exist");
        });
    });
  });

  context("with justifyContent", () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const value = {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    };

    const EMPLOYEE_FIELDS: FormFieldGroup[] = [
      [
        {
          name: "first_name",
          title: "First Name",
          type: "text",
          required: true,
          placeholder: "Enter first name",
        },
        {
          name: "last_name",
          title: "Last Name",
          type: "text",
          required: false,
          placeholder: "Enter last name",
        },
      ],
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email address",
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
        placeholder: "Enter phone number",
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
        placeholder: "Add additional notes",
      },
      {
        name: "access",
        placeholder: "Has access to login",
        type: "checkbox",
        required: false,
      },
      {
        name: "text",
        title: "Save",
        type: "button",
        required: true,
        placeholder: "Enter text",
        width: "15%",
        rowJustifyContent: "end",
      },
    ];
    it("render style align on the one row", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          mode="onChange"
        />
      );

      cy.findAllByLabelText("stateful-form-row")
        .eq(5)
        .should("have.css", "justify-content", "flex-end");
    });
  });

  context("with autoFocusField", () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const value = {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    };

    const EMPLOYEE_FIELDS: FormFieldGroup[] = [
      [
        {
          name: "first_name",
          title: "First Name",
          type: "text",
          required: true,
          placeholder: "Enter first name",
        },
        {
          name: "last_name",
          title: "Last Name",
          type: "text",
          required: false,
          placeholder: "Enter last name",
        },
      ],
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email address",
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
        placeholder: "Enter phone number",
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
        placeholder: "Add additional notes",
      },
      {
        name: "access",
        placeholder: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];
    it("render in the one row", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          mode="onChange"
          autoFocusField="first_name"
        />
      );
      cy.findAllByLabelText("stateful-form-row")
        .eq(0)
        .within(() => {
          cy.findAllByRole("textbox").eq(0).should("exist").and("be.focused");
        });
    });
  });

  context("when not given a title", () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const value = {
      first_name: "",
      access: false,
    };

    const EMPLOYEE_FIELDS: FormFieldGroup[] = [
      {
        name: "first_name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
      },

      {
        name: "access",
        type: "checkbox",
        required: false,
      },
    ];

    const TITLE_EMPLOYEE_FIELD = ["First Name", "Has access to login"];

    const PLACEHOLDER_EMPLOYEE_FIELD = ["Enter first name"];

    it("should render only the input", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          mode="onChange"
        />
      );
      PLACEHOLDER_EMPLOYEE_FIELD.map((data) => {
        cy.findByPlaceholderText(data).should("exist");
      });
      TITLE_EMPLOYEE_FIELD.map((data) => {
        cy.findByText(data).should("not.exist");
      });
    });
  });

  context("with type custom", () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const value = {
      first_name: "",
      access: false,
    };

    const BADGE_OPTIONS = [
      {
        id: 1,
        caption: "Anime",
      },
      {
        id: 2,
        caption: "Manga",
      },
      {
        id: 3,
        caption: "Comics",
      },
      {
        id: 4,
        caption: "Movies",
      },
      {
        id: 5,
        caption: "Podcasts",
      },
      {
        id: 6,
        caption: "TV Shows",
      },
      {
        id: 7,
        caption: "Novels",
      },
      {
        id: 8,
        caption: "Music",
      },
      {
        id: 9,
        caption: "Games",
      },
      {
        id: 10,
        caption: "Webtoons",
      },
    ];

    const EMPLOYEE_FIELDS: FormFieldGroup[] = [
      {
        name: "first_name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
      },
      {
        name: "custom",
        type: "custom",
        render: (
          <Boxbar>
            {BADGE_OPTIONS.map((badge) => (
              <Badge
                badgeStyle={css`
                  width: 100%;
                  max-width: 100px;

                  &:hover {
                    border-color: #4cbbf7;
                    cursor: pointer;
                    transition: all 0.5s ease-in-out;
                  }
                `}
                key={badge.id}
                caption={badge.caption}
                withCircle
              />
            ))}
          </Boxbar>
        ),
      },
      {
        name: "access",
        type: "checkbox",
        required: false,
      },
    ];

    it("should render custom renderer", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          mode="onChange"
        />
      );

      cy.findByLabelText("boxbar-toggle").click();

      BADGE_OPTIONS.map((data) => {
        cy.findByText(data.caption).should("exist");
      });
    });
  });

  context("with hidden", () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const value = {
      first_name: "",
      access: false,
    };

    const EMPLOYEE_FIELDS_WITH_HIDDEN: FormFieldGroup[] = [
      {
        name: "first_name",
        title: "First Name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
      },
      {
        name: "middle_name",
        title: "Middle Name",
        type: "text",
        required: true,
        placeholder: "Enter first name",
        hidden: true,
      },
      {
        name: "access",
        title: "Access",
        type: "checkbox",
        required: false,
      },
    ];

    it("should hidden the input element", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS_WITH_HIDDEN}
          formValues={value}
          mode="onChange"
        />
      );

      cy.findByText(EMPLOYEE_FIELDS_WITH_HIDDEN[0]["title"]).should("exist");
      cy.findByText(EMPLOYEE_FIELDS_WITH_HIDDEN[1]["title"]).should(
        "not.exist"
      );
      cy.findByText(EMPLOYEE_FIELDS_WITH_HIDDEN[2]["title"]).should("exist");
    });

    it("should hidden the row input element", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS_WITH_HIDDEN}
          formValues={value}
          mode="onChange"
        />
      );

      cy.findAllByLabelText("stateful-form-row").should("have.length", 2);
    });
  });

  context("with width", () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const FRUIT_OPTIONS: OptionsProps[] = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
    ];

    const valueAll = {
      text: "",
      email: "",
      number: "",
      password: "",
      textarea: "",
      rating: "",
      check: false,
      chips: {
        searchText: "",
        selectedOptions: [],
      },
      color: "",
      combo: [""],
      date: [""],
      file_drop_box: [] as File[],
      file: undefined,
      image: undefined,
      money: "",
      phone: "",
      thumb_field: false,
      togglebox: false,
      signature: "",
      capsule: "",
      country_code: DEFAULT_COUNTRY_CODES,
    };

    const BADGE_OPTIONS: BadgeProps[] = [
      {
        id: "1",
        caption: "Anime",
      },
      {
        id: "2",
        caption: "Manga",
      },
    ];

    const CAPSULE_TABS: CapsuleContentProps[] = [
      {
        id: "paid",
        title: "Paid",
      },
      {
        id: "unpaid",
        title: "Unpaid",
      },
    ];

    const ALL_INPUT: FormFieldGroup[] = [
      [
        {
          name: "text",
          title: "Text",
          type: "text",
          required: true,
          placeholder: "Enter text",
          width: "50%",
        },
        {
          name: "email",
          title: "Email",
          type: "email",
          required: false,
          placeholder: "Enter email address",
          width: "50%",
        },
      ],
      {
        name: "number",
        title: "Number",
        type: "number",
        required: false,
        placeholder: "Enter number",
        width: "50%",
      },
      {
        name: "password",
        title: "Password",
        type: "password",
        required: false,
        placeholder: "Enter password",
        width: "50%",
      },
      {
        name: "textarea",
        title: "Textarea",
        type: "textarea",
        rows: 3,
        required: false,
        placeholder: "Enter text here",
        width: "50%",
      },
      {
        name: "check",
        placeholder: "Check",
        type: "checkbox",
        required: false,
        width: "50%",
      },
      {
        name: "color",
        title: "Color",
        type: "color",
        required: false,
        placeholder: "Enter the color here",
        width: "50%",
      },
      {
        name: "combo",
        title: "Combo",
        type: "combo",
        required: false,
        placeholder: "Select a fruit...",
        comboboxProps: {
          options: FRUIT_OPTIONS,
        },
        width: "50%",
      },
      {
        name: "date",
        title: "Date",
        type: "date",
        required: false,
        placeholder: "Select a date",
        width: "50%",
      },
      {
        name: "file_drop_box",
        title: "File Drop Box",
        type: "file_drop_box",
        required: false,
        width: "50%",
      },
      {
        name: "file",
        title: "File",
        type: "file",
        required: false,
        fileInputBoxProps: {
          accept: "image/jpeg",
        },
        width: "50%",
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        required: false,
        width: "50%",
      },
      {
        name: "money",
        title: "Money",
        type: "money",
        required: false,
        placeholder: "Enter amount",
        moneyProps: {
          separator: "dot",
        },
        width: "50%",
      },
      {
        name: "phone",
        title: "Phone",
        type: "phone",
        required: false,
        placeholder: "Enter phone number",
        width: "50%",
      },
      {
        name: "country_code",
        title: "Country Code",
        type: "country_code",
        required: false,
        placeholder: "Enter country code",
        width: "50%",
      },
      {
        name: "signature",
        title: "Signature",
        type: "signbox",
        required: false,
        width: "50%",
      },
      {
        name: "rating",
        title: "Rating",
        type: "rating",
        required: false,
        width: "50%",
      },
      {
        name: "thumb_field",
        title: "Thumb Field",
        type: "thumbfield",
        required: false,
        width: "50%",
      },
      {
        name: "togglebox",
        title: "Togglebox",
        type: "toggle",
        required: false,
        width: "50%",
      },
      {
        name: "chips",
        title: "Chips",
        type: "chips",
        required: false,
        width: "50%",
        chipsProps: {
          options: BADGE_OPTIONS,
          chipStyle: css`
            width: 100%;
            gap: 0.5rem;
            border-color: transparent;
          `,
          chipContainerStyle: css`
            gap: 4px;
          `,
          chipsDrawerStyle: css`
            min-width: 250px;
          `,
          selectedOptions: valueAll.chips.selectedOptions,
          inputValue: valueAll.chips.searchText,
        },
      },
      {
        name: "capsule",
        title: "Monetary Value",
        type: "capsule",
        required: false,
        width: "50%",
        capsuleProps: {
          activeTab: valueAll.capsule,
          tabs: CAPSULE_TABS,
        },
      },
    ];

    context("when given all input elements", () => {
      it("should render input elements with sizing", () => {
        cy.mount(
          <StatefulForm
            fields={ALL_INPUT}
            formValues={valueAll}
            mode="onChange"
          />
        );

        const flattenFields = (groups: FormFieldGroup[]): FormFieldProps[] =>
          groups.flatMap((group) =>
            Array.isArray(group) ? flattenFields(group) : [group]
          );

        const allFields = flattenFields(ALL_INPUT);

        allFields.forEach((prop) => {
          if (prop.name === "country_code") return;
          if (prop.name === "togglebox") {
            cy.findByLabelText("togglebox-row-wrapper").then(($el) => {
              const width = $el.width();
              expect(width).to.be.closeTo(222.5, 10);
            });
          } else {
            cy.findByText(prop.title)
              .parent()
              .then(($el) => {
                const elWidth = $el.width();

                expect(elWidth).to.be.closeTo(222.5, 10);
              });
          }
        });
      });
    });
  });
});
