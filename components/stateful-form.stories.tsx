import { Meta, StoryObj } from "@storybook/react/";
import StatefulForm, { FormFieldProps } from "./stateful-form";
import { ChangeEvent, useState } from "react";
import { COUNTRY_CODES } from "./../constants/countries";
import { z } from "zod";
import { Button } from "./button";

const meta: Meta<typeof StatefulForm> = {
  title: "Input Elements/StatefulForm",
  component: StatefulForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StatefulForm>;

export const Default: Story = {
  render: () => {
    const EMPLOYEE_FIELDS: FormFieldProps[] = [
      {
        name: "first_name",
        title: "First Name",
        type: "text",
        required: true,
      },
      {
        name: "last_name",
        title: "Last Name",
        type: "text",
        required: false,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
      },
      {
        name: "country_code",
        title: "Country Code",
        type: "hidden",
        required: false,
      },
      {
        name: "phone_number",
        title: "Phone Number",
        type: "tel",
        required: false,
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
      },
      {
        name: "access",
        title: "Has access to login",
        type: "checkbox",
        required: false,
      },
    ];

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
      phone_number: "",
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
      phone_number: z
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

    return (
      <div className="mx-auto flex w-full max-w-[400px] flex-col gap-2 py-4 md:mx-0 md:items-start">
        <StatefulForm
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          onChange={onChangeForm}
          validationSchema={employeeSchema}
          onValidityChange={setIsFormValid}
          mode="onChange"
        />

        <div className="flex w-full flex-row justify-end">
          <Button
            disabled={!isFormValid}
            className="w-full cursor-pointer md:max-w-[180px]"
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
    );
  },
};
