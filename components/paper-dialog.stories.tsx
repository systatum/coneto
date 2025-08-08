import { Meta, StoryObj } from "@storybook/react";
import { PaperDialog, PaperDialogRef } from "./paper-dialog";
import { Button } from "./button";
import { StatefulForm, FormFieldProps } from "./stateful-form";
import { ChangeEvent, useRef, useState } from "react";
import { z } from "zod";
import { COUNTRY_CODES } from "./../constants/countries";

const meta: Meta<typeof PaperDialog> = {
  title: "Stage/PaperDialog",
  component: PaperDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof PaperDialog>;

export const Default: Story = {
  render: () => {
    const dialogRef = useRef<PaperDialogRef>(null);

    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const [value, setValue] = useState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    });
    const [isFormValid, setIsFormValid] = useState(false);

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
      access: z.boolean().optional(),
    });

    const onChangeForm = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const target = e.target;
      const { name, value } = target;

      let updatedValue: string | boolean | number = value;

      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        updatedValue = target.checked;
      }

      setValue((prev) => ({ ...prev, [name]: updatedValue }));
    };

    const EMPLOYEE_FIELDS: FormFieldProps[] = [
      {
        name: "first_name",
        title: "First Name",
        type: "text",
        required: true,
        onChange: onChangeForm,
      },
      {
        name: "last_name",
        title: "Last Name",
        type: "text",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        onChange: onChangeForm,
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "access",
        title: "Has access to login",
        type: "checkbox",
        required: false,
        onChange: onChangeForm,
      },
    ];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Button onClick={() => dialogRef.current?.openDialog()}>Open</Button>
        <Button onClick={() => dialogRef.current?.closeDialog()}>Close</Button>
        <PaperDialog ref={dialogRef}>
          <PaperDialog.Content
            style={{
              padding: "36px",
              gap: "24px",
            }}
          >
            <Button onClick={() => dialogRef.current?.minimizedDialog()}>
              Minimize here.
            </Button>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
                Add New Employee
              </h2>
              <p style={{ fontSize: "14px", color: "#4B5563" }}>
                Fill out the information below to add a new employee to your
                team.
              </p>
            </div>

            <div
              style={{
                maxWidth: "400px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <StatefulForm
                fields={EMPLOYEE_FIELDS}
                formValues={value}
                validationSchema={employeeSchema}
                onValidityChange={setIsFormValid}
                mode="onChange"
              />

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  disabled={!isFormValid}
                  buttonStyle={{
                    width: "100%",
                    cursor: "pointer",
                    maxWidth: "180px",
                  }}
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </PaperDialog.Content>
        </PaperDialog>
      </div>
    );
  },
};

export const Closable: Story = {
  render: () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const [value, setValue] = useState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    });
    const [isFormValid, setIsFormValid] = useState(false);

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
      access: z.boolean().optional(),
    });

    const onChangeForm = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const target = e.target;
      const { name, value } = target;

      let updatedValue: string | boolean | number = value;

      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        updatedValue = target.checked;
      }

      setValue((prev) => ({ ...prev, [name]: updatedValue }));
    };

    const EMPLOYEE_FIELDS: FormFieldProps[] = [
      {
        name: "first_name",
        title: "First Name",
        type: "text",
        required: true,
        onChange: onChangeForm,
      },
      {
        name: "last_name",
        title: "Last Name",
        type: "text",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        onChange: onChangeForm,
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "access",
        title: "Has access to login",
        type: "checkbox",
        required: false,
        onChange: onChangeForm,
      },
    ];

    return (
      <PaperDialog closable>
        <PaperDialog.Trigger>Trigger</PaperDialog.Trigger>
        <PaperDialog.Content
          style={{
            padding: "36px",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Add New Employee
            </h2>
            <p style={{ fontSize: "14px", color: "#4B5563" }}>
              Fill out the information below to add a new employee to your team.
            </p>
          </div>

          <div
            style={{
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <StatefulForm
              fields={EMPLOYEE_FIELDS}
              formValues={value}
              validationSchema={employeeSchema}
              onValidityChange={setIsFormValid}
              mode="onChange"
            />

            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button
                disabled={!isFormValid}
                buttonStyle={{
                  width: "100%",
                  cursor: "pointer",
                  maxWidth: "180px",
                }}
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </PaperDialog.Content>
      </PaperDialog>
    );
  },
};

export const FixedLeft: Story = {
  render: () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const [value, setValue] = useState({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    });
    const [isFormValid, setIsFormValid] = useState(false);

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
      access: z.boolean().optional(),
    });

    const onChangeForm = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const target = e.target;
      const { name, value } = target;

      let updatedValue: string | boolean | number = value;

      if (target instanceof HTMLInputElement && target.type === "checkbox") {
        updatedValue = target.checked;
      }

      setValue((prev) => ({ ...prev, [name]: updatedValue }));
    };

    const EMPLOYEE_FIELDS: FormFieldProps[] = [
      {
        name: "first_name",
        title: "First Name",
        type: "text",
        required: true,
        onChange: onChangeForm,
      },
      {
        name: "last_name",
        title: "Last Name",
        type: "text",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        onChange: onChangeForm,
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "access",
        title: "Has access to login",
        type: "checkbox",
        required: false,
        onChange: onChangeForm,
      },
    ];

    return (
      <PaperDialog closable position="left">
        <PaperDialog.Trigger>Trigger</PaperDialog.Trigger>
        <PaperDialog.Content
          style={{
            padding: "36px",
            gap: "24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
              Add New Employee
            </h2>
            <p style={{ fontSize: "14px", color: "#4B5563" }}>
              Fill out the information below to add a new employee to your team.
            </p>
          </div>

          <div
            style={{
              maxWidth: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <StatefulForm
              fields={EMPLOYEE_FIELDS}
              formValues={value}
              validationSchema={employeeSchema}
              onValidityChange={setIsFormValid}
              mode="onChange"
            />

            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button
                disabled={!isFormValid}
                buttonStyle={{
                  width: "100%",
                  cursor: "pointer",
                  maxWidth: "180px",
                }}
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </PaperDialog.Content>
      </PaperDialog>
    );
  },
};
