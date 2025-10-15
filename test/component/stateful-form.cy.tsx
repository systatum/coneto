import z from "zod";
import { FormFieldGroup, StatefulForm } from "./../../components/stateful-form";
import { COUNTRY_CODES } from "./../../constants/countries";

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
});
