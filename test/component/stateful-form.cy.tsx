import z from "zod";
import { FormFieldGroup, StatefulForm } from "./../../components/stateful-form";
import { COUNTRY_CODES } from "./../../constants/countries";
import { Boxbar } from "./../../components/boxbar";
import { Badge } from "./../../components/badge";
import { css } from "styled-components";

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

    const employeeSchema = z.object({
      first_name: z
        .string()
        .min(3, "First name must be at least 3 characters long"),
      last_name: z.string().optional(),
      email: z.string().email("Please enter a valid email address"),
      phone: z
        .string()
        .regex(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits")
        .optional(),
      note: z.string().optional(),
      access: z.boolean().refine((val) => val === true, {
        message: "Access must be true",
      }),
    });

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
        title: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];
    it("render in the one row", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          validationSchema={employeeSchema}
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

    const employeeSchema = z.object({
      first_name: z
        .string()
        .min(3, "First name must be at least 3 characters long"),
      last_name: z.string().optional(),
      email: z.string().email("Please enter a valid email address"),
      phone: z
        .string()
        .regex(/^\d{10,15}$/, "Phone number must be between 10 and 15 digits")
        .optional(),
      note: z.string().optional(),
      access: z.boolean().refine((val) => val === true, {
        message: "Access must be true",
      }),
    });

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
        title: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];
    it("render in the one row", () => {
      cy.mount(
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          validationSchema={employeeSchema}
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

    const employeeSchema = z.object({
      first_name: z
        .string()
        .min(3, "First name must be at least 3 characters long"),
      access: z.boolean().refine((val) => val === true, {
        message: "Access must be true",
      }),
    });

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
          validationSchema={employeeSchema}
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

    const employeeSchema = z.object({
      first_name: z
        .string()
        .min(3, "First name must be at least 3 characters long"),
      access: z.boolean().refine((val) => val === true, {
        message: "Access must be true",
      }),
    });

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
          validationSchema={employeeSchema}
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

    const employeeSchema = z.object({
      first_name: z
        .string()
        .min(3, "First name must be at least 3 characters long"),
      middle_name: z
        .string()
        .min(3, "Middle name must be at least 3 characters long"),
      access: z.boolean().refine((val) => val === true, {
        message: "Access must be true",
      }),
    });

    const EMPLOYEE_FIELDS: FormFieldGroup[] = [
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
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          validationSchema={employeeSchema}
          mode="onChange"
        />
      );

      cy.findByText(EMPLOYEE_FIELDS[0]["title"]).should("exist");
      cy.findByText(EMPLOYEE_FIELDS[1]["title"]).should("not.exist");
      cy.findByText(EMPLOYEE_FIELDS[2]["title"]).should("exist");
    });
  });
});
