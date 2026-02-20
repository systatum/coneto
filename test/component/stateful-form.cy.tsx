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
  context("helper", () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const value = {
      text: "",
      time: "",
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
      combo: [],
      date: [""],
      file_drop_box: [] as File[],
      file: undefined,
      image: undefined,
      money: "",
      phone: "",
      signature: "",
      country_code: DEFAULT_COUNTRY_CODES,
    };

    const FIELDS: FormFieldGroup[] = [
      {
        name: "text",
        title: "Text",
        type: "text",
        required: true,
        placeholder: "Enter text",
        helper: "This is a text input field",
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: false,
        placeholder: "Enter email address",
        helper: "This field is used to enter an email address",
      },
      {
        name: "time",
        title: "Time",
        type: "time",
        required: false,
        placeholder: "Select time",
        helper: "This field allows you to select a time",
      },
      {
        name: "number",
        title: "Number",
        type: "number",
        required: false,
        placeholder: "Enter number",
        helper: "This field only accepts numeric values",
      },
      {
        name: "password",
        title: "Password",
        type: "password",
        required: false,
        placeholder: "Enter password",
        helper: "This field is used to enter a secure password",
      },
      {
        name: "textarea",
        title: "Textarea",
        type: "textarea",
        rows: 3,
        required: false,
        placeholder: "Enter text here",
        helper: "This field allows you to enter multiple lines of text",
      },
      {
        name: "check",
        title: "Check",
        placeholder: "Check",
        type: "checkbox",
        required: false,
        helper: "This checkbox allows you to toggle a boolean value",
      },
      {
        name: "radio",
        title: "Radio",
        placeholder: "Radio",
        type: "radio",
        required: false,
        helper: "This radio allows you to toggle a boolean value",
      },
      {
        name: "color",
        title: "Color",
        type: "color",
        required: false,
        placeholder: "Enter the color here",
        helper: "This field allows you to pick or input a color value",
      },
      {
        name: "combo",
        title: "Combo",
        type: "combo",
        required: false,
        placeholder: "Select a fruit...",
        helper:
          "This field allows you to select one or more options from a list",
      },
      {
        name: "date",
        title: "Date",
        type: "date",
        required: false,
        placeholder: "Select a date",
        helper: "This field allows you to select a date",
      },
      {
        name: "file_drop_box",
        title: "File Drop Box",
        type: "file_drop_box",
        required: false,
        helper: "This field allows you to upload files via drag and drop",
      },
      {
        name: "file",
        title: "File",
        type: "file",
        required: false,
        helper: "This field allows you to upload one or more files",
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        required: false,
        helper: "This field allows you to upload and preview an image",
      },
      {
        name: "money",
        title: "Money",
        type: "money",
        required: false,
        placeholder: "Enter amount",
        helper: "This field is used to input a monetary value",
      },
      {
        name: "phone",
        title: "Phone",
        type: "phone",
        required: false,
        placeholder: "Enter phone number",
        helper:
          "This field allows you to enter a phone number with country code",
      },
      {
        name: "signature",
        title: "Signature",
        type: "signbox",
        required: false,
        helper: "This is signbox type",
      },
    ];

    it("renders with tooltip", () => {
      cy.mount(
        <StatefulForm fields={FIELDS} formValues={value} mode="onChange" />
      );

      cy.findAllByLabelText("tooltip-trigger")
        .should("have.length", 17)
        .children()
        .should("have.css", "cursor", "help");
    });
  });

  context("with style", () => {
    context("when given background wheat", () => {
      const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
        (data) => data.id === "US" || COUNTRY_CODES[206]
      );

      if (!DEFAULT_COUNTRY_CODES) {
        throw new Error(
          "Default country code 'US' not found in COUNTRY_CODES."
        );
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

      const value = {
        text: "",
        time: "",
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
        combo: [],
        date: [""],
        file_drop_box: [] as File[],
        file: undefined,
        image: undefined,
        money: "",
        phone: "",
        signature: "",
        country_code: DEFAULT_COUNTRY_CODES,
      };

      const MONTH_NAMES = [
        { text: "JAN", value: "1" },
        { text: "FEB", value: "2" },
        { text: "MAR", value: "3" },
        { text: "APR", value: "4" },
        { text: "MAY", value: "5" },
        { text: "JUN", value: "6" },
        { text: "JUL", value: "7" },
        { text: "AUG", value: "8" },
        { text: "SEP", value: "9" },
        { text: "OCT", value: "10" },
        { text: "NOV", value: "11" },
        { text: "DEC", value: "12" },
      ];

      const FIELDS: FormFieldGroup[] = [
        {
          name: "text",
          title: "Text",
          type: "text",
          required: true,
          placeholder: "Enter text",
          textboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "email",
          title: "Email",
          type: "email",
          required: false,
          placeholder: "Enter email address",
          textboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "time",
          title: "Time",
          type: "time",
          required: false,
          placeholder: "Enter email address",
          timeboxProps: {
            styles: {
              inputWrapperStyle: css`
                background-color: wheat;
              `,
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "number",
          title: "Number",
          type: "number",
          required: false,
          placeholder: "Enter number",
          textboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "password",
          title: "Password",
          type: "password",
          required: false,
          placeholder: "Enter password",
          textboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "textarea",
          title: "Textarea",
          type: "textarea",
          rows: 3,
          required: false,
          placeholder: "Enter text here",
          textareaProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "check",
          placeholder: "Check",
          type: "checkbox",
          required: false,
          checkboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "color",
          title: "Color",
          type: "color",
          required: false,
          placeholder: "Enter the color here",
          colorboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "combo",
          title: "Combo",
          type: "combo",
          required: false,
          placeholder: "Select a fruit...",
          comboboxProps: {
            options: FRUIT_OPTIONS,
            styles: {
              selectboxStyle: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "date",
          title: "Date",
          type: "date",
          required: false,
          placeholder: "Select a date",
          dateProps: {
            monthNames: MONTH_NAMES,
            styles: {
              selectboxStyle: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "file_drop_box",
          title: "File Drop Box",
          type: "file_drop_box",
          required: false,
          fileDropBoxProps: {
            styles: {
              dragOverStyle: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "file",
          title: "File",
          type: "file",
          required: false,
          fileInputBoxProps: {
            accept: "image/jpeg",
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "image",
          title: "Image",
          type: "image",
          required: false,
          imageboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "money",
          title: "Money",
          type: "money",
          required: false,
          placeholder: "Enter amount",
          moneyProps: {
            separator: "dot",
            styles: {
              inputWrapperStyle: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "phone",
          title: "Phone",
          type: "phone",
          required: false,
          placeholder: "Enter phone number",
          phoneboxProps: {
            styles: {
              inputWrapperStyle: css`
                background-color: wheat;
              `,
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        {
          name: "signature",
          title: "Signature",
          type: "signbox",
          required: false,
          signboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
      ];

      it("renders with background wheat", () => {
        cy.mount(
          <StatefulForm fields={FIELDS} formValues={value} mode="onChange" />
        );

        const isFieldWithPlaceholder = (
          field: FormFieldGroup
        ): field is FormFieldProps & { placeholder: string } =>
          !Array.isArray(field) &&
          "placeholder" in field &&
          typeof field.placeholder === "string";

        const PLACEHOLDER_FIELDS = FIELDS.filter(
          (field): field is FormFieldProps & { placeholder: string } =>
            isFieldWithPlaceholder(field) &&
            [
              "text",
              "email",
              "number",
              "password",
              "textarea",
              "money",
              "phone",
              "color",
              "combo",
              "date",
              "signature",
              "image",
            ].includes(field.type)
        );

        PLACEHOLDER_FIELDS.forEach((field) => {
          if (field.type === "image") {
            cy.findByPlaceholderText("imagebox-input")
              .should("exist")
              .and("have.css", "background-color", "rgb(245, 222, 179)");
          } else if (field.type === "signbox") {
            cy.findByPlaceholderText("signbox-canvas")
              .should("exist")
              .and("have.css", "background-color", "rgb(245, 222, 179)");
          } else if (field.type === "phone") {
            cy.findByPlaceholderText(field.placeholder)
              .should("exist")
              .parent()
              .and("have.css", "background-color", "rgb(245, 222, 179)");
          } else if (field.type === "color") {
            cy.findByPlaceholderText(field.placeholder)
              .should("exist")
              .parent()
              .parent()
              .and("have.css", "background-color", "rgb(245, 222, 179)");
          } else if (field.type === "money") {
            cy.findByPlaceholderText(field.placeholder)
              .should("exist")
              .parent()
              .and("have.css", "background-color", "rgb(245, 222, 179)");
          } else {
            cy.findByPlaceholderText(field.placeholder)
              .should("exist")
              .and("have.css", "background-color", "rgb(245, 222, 179)");
          }
        });
      });
    });
  });

  context("radio", () => {
    const value = {
      access: false,
    };

    const RADIO_FIELDS: FormFieldGroup[] = [
      {
        name: "access",
        title: "Access",
        placeholder: "Access",
        type: "radio",
        required: false,
      },
    ];
    context("with title", () => {
      it("should render on the label field", () => {
        cy.mount(
          <StatefulForm
            fields={RADIO_FIELDS}
            formValues={value}
            mode="onChange"
          />
        );

        cy.findByLabelText("radio-title-wrapper").should(
          "have.text",
          RADIO_FIELDS[0]["title"]
        );
      });
    });

    context("with placeholder", () => {
      it("should render on the right side", () => {
        cy.mount(
          <StatefulForm
            fields={RADIO_FIELDS}
            formValues={value}
            mode="onChange"
          />
        );

        cy.findByLabelText("radio-label-wrapper").should(
          "have.text",
          RADIO_FIELDS[0]["placeholder"]
        );
      });
    });
  });

  context("capsule", () => {
    const value = {
      capsule: "unpaid",
    };

    context("when initial value", () => {
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

      const CHECKBOX_TITLE_FIELDS: FormFieldGroup[] = [
        {
          name: "capsule",
          title: "Monetary Value",
          type: "capsule",
          required: false,
          capsuleProps: {
            tabs: CAPSULE_TABS,
          },
        },
      ];

      it("should render active related with id value", () => {
        cy.mount(
          <StatefulForm
            fields={CHECKBOX_TITLE_FIELDS}
            formValues={value}
            mode="onChange"
          />
        );

        cy.contains("Paid").should("have.css", "color", "rgb(17, 24, 39)");
        cy.contains("Unpaid").should("have.css", "color", "rgb(255, 255, 255)");
      });
    });
  });

  context("checkbox", () => {
    const value = {
      access: false,
    };

    const CHECKBOX_TITLE_FIELDS: FormFieldGroup[] = [
      {
        name: "access",
        title: "Access",
        placeholder: "Access placeholder",
        type: "checkbox",
        required: false,
      },
    ];
    const statefulForCheckbox = () =>
      cy.mount(
        <StatefulForm
          fields={CHECKBOX_TITLE_FIELDS}
          formValues={value}
          mode="onChange"
        />
      );

    context("with title", () => {
      it("should render on the label field", () => {
        statefulForCheckbox();

        cy.findByLabelText("title-wrapper").should(
          "have.text",
          CHECKBOX_TITLE_FIELDS[0]["title"]
        );
      });

      context("when clicking", () => {
        it("renders checked the checkbox", () => {
          statefulForCheckbox();

          cy.findByRole("checkbox").should("not.be.checked");
          cy.findByText("Access").click();
          cy.findByRole("checkbox").should("be.checked");
        });
      });
    });

    context("with placeholder", () => {
      it("should render on the right side", () => {
        statefulForCheckbox();

        cy.findByLabelText("title-wrapper").should("not.exist");
        cy.findByLabelText("label-wrapper").should(
          "have.text",
          CHECKBOX_TITLE_FIELDS[0]["placeholder"]
        );
      });

      context("when clicking", () => {
        it("renders checked the checkbox", () => {
          statefulForCheckbox();

          cy.findByRole("checkbox").should("not.be.checked");
          cy.findByText("Access placeholder").click();
          cy.findByRole("checkbox").should("be.checked");
        });
      });
    });
  });

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
        title: "Check",
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
          styles: {
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
          },
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
