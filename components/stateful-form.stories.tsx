import { Meta, StoryObj } from "@storybook/react/";
import { useMemo, useState } from "react";
import styled, { css } from "styled-components";
import { z } from "zod";
import { COUNTRY_CODES } from "./../constants/countries";
import { BadgeProps } from "./badge";
import { Button } from "./button";
import { CapsuleTab } from "./capsule";
import { Card } from "./card";
import { OnCompleteFunction, OnFileDroppedFunction } from "./file-drop-box";
import { Messagebox } from "./messagebox";
import { MoneyboxCurrencyOption } from "./moneybox";
import { CountryCodeProps } from "./phonebox";
import { PinboxParts } from "./pinbox";
import { SelectboxOption } from "./selectbox";
import {
  FormFieldGroup,
  FormValueType,
  StatefulForm,
  StatefulOnChangeType,
} from "./stateful-form";
import { BodyThemeConfig } from "./../theme";
import { useTheme } from "./../theme/provider";
import { darkenColor, lightenColor } from "./../lib/color";

const meta: Meta<typeof StatefulForm> = {
  title: "Input Elements/StatefulForm",
  component: StatefulForm,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
**StatefulForm** is a form renderer capable to handle complex scenarios involving data validation,
nested fields, custom input rendering, and state management. It works seamlessly with Zod.

---

### ✨ Features
- 🖊 **Flexible input types**: Supports text, email, password, textarea, checkbox, radio, phone, file, image, color, date, money, rating, toggle, pin, and fully custom fields.
- 📦 **Nested/grouped fields**: Organize fields in groups or frames for complex layouts.
- ⚠️ **Validation**: Integrates with Zod schemas, supporting \`onChange\`, \`onBlur\`, or \`onSubmit\` validation modes.
- 🔄 **Reactive state**: Emits \`onChange\` callbacks with current form values.
- 🎨 **Custom styling**: Customize container, rows, frames, and labels via \`styles\` prop.
- 🔍 **Error handling**: Automatically shows validation errors for touched fields.
- 🖌 **Custom render**: For fields with \`type="custom"\`, you can render any JSX/component.
- 🎯 **AutoFocus**: Focus on a specific field when the form mounts.

---

### 📌 Usage

\`\`\`tsx
const formValues = {
  username: "",
  password: "",
  rememberMe: false,
};

const fields = [
  { name: "username", type: "text", placeholder: "Enter username", required: true },
  { name: "password", type: "password", placeholder: "Enter password", required: true },
  { name: "rememberMe", type: "checkbox", title: "Remember Me" },
];

<StatefulForm
  fields={fields}
  formValues={formValues}
  validationSchema={z.object({
    username: z.string().min(3),
    password: z.string().min(6),
  })}
  onChange={({ currentState }) => console.log(currentState)}
  onValidityChange={(isValid) => console.log("Form valid:", isValid)}
  labelSize="14px"
  fieldSize="16px"
  styles={{
    containerStyle: css\`padding: 16px; background: #f9f9f9;\`,
    rowStyle: css\`margin-bottom: 12px;\`,
  }}
/>
\`\`\`

- Use \`fields\` to define all form fields, including nested groups or frames.
- Connect \`validationSchema\` for type-safe validation.
- Listen to \`onChange\` for live updates and \`onValidityChange\` to track form validity.
- Customize appearance and spacing using \`styles\`.
- Render fully custom inputs using \`type="custom"\` and the \`render\` prop.
`,
      },
    },
  },
  argTypes: {
    fields: {
      control: false,
      description: `
Array of form fields or grouped fields. Each field can be a single FormFieldProps object or an array of FormFieldProps for grouped layouts. Supports nested frames for complex forms.
- Nested fields can inherit label positioning, spacing, and styles.
- Supports all input types including custom fields.
`,
      table: {
        type: { summary: "FormFieldGroup[]" },
      },
    },
    formValues: {
      control: false,
      description:
        "Current form values object. Keys should match field names. Can include strings, numbers, booleans, arrays, files, or custom types.",
      table: {
        type: { summary: "TypeOf<Z>" },
      },
    },
    validationSchema: {
      control: false,
      description: `
Optional Zod schema for validating form values.
- Supports synchronous and asynchronous validation.
- Works with nested fields automatically.
`,
      table: { type: { summary: "ZodTypeAny" } },
    },
    mode: {
      control: { type: "select" },
      options: ["onChange", "onBlur", "onSubmit"],
      description: "Specifies when validation occurs for form fields.",
    },
    onValidityChange: {
      control: false,
      description:
        "Callback triggered whenever the overall form validity changes. Receives a boolean indicating validity.",
      table: { type: { summary: "(isValid: boolean) => void" } },
    },
    labelSize: {
      control: "text",
      description: "CSS size for labels of all fields.",
    },

    fieldSize: {
      control: "text",
      description: "CSS size for input elements.",
    },
    onChange: {
      control: false,
      description: `
Callback called whenever any field changes.
- Receives \`{ currentState: Record<string, FormValueType> }\`.
- Useful for live form updates or saving.
`,
      table: { type: { summary: "(args: { currentState: any }) => void" } },
    },
    autoFocusField: {
      control: "text",
      description: "Name of the field to focus automatically when form mounts.",
    },
    styles: {
      control: false,
      description: `
Custom styles for form components:
- \`containerStyle\`: CSS for the outermost form wrapper.
- \`rowStyle\`: CSS applied to each row or field group.
- \`frameContainerStyle\`: CSS for frame containers.
- \`frameTitleStyle\`: CSS for frame titles.
`,
      table: { type: { summary: "StatefulFormStyles" } },
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatefulForm>;

export const Default: Story = {
  render: () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US"
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const [value, setValue] = useState({
      salutation: ["1"],
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      note: "",
      access: false,
      country_code: DEFAULT_COUNTRY_CODES,
    });

    const SALUTATION_OPTIONS: SelectboxOption[] = [
      { text: "Mr.", value: "1" },
      { text: "Mrs.", value: "2" },
      { text: "Ms.", value: "3" },
    ];

    const [isFormValid, setIsFormValid] = useState(false);

    const employeeSchema = z.object({
      salutation: z
        .array(z.string().min(1, "Choose one"))
        .min(1, "Combo must have at least one item")
        .refine(
          (arr) =>
            arr.every((val) =>
              SALUTATION_OPTIONS.some((opt) => opt.value === val)
            ),
          "Invalid value in combo"
        ),
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
          name: "salutation",
          title: "Salutation",
          type: "combo",
          required: true,
          placeholder: "Select your salutation",
          width: "40%",
          comboboxProps: {
            options: SALUTATION_OPTIONS,
            strict: true,
          },
        },
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
      [
        {
          name: "email",
          title: "Email",
          type: "email",
          required: true,
          placeholder: "Enter email address",
        },
        {
          name: "text",
          title: "Verify",
          type: "button",
          required: true,
          placeholder: "Enter text",
        },
      ],
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: true,
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
        name: "custom",
        type: "custom",
        render: (
          <Messagebox variant="primary" title="Terms and Conditions">
            <ScrollBox>
              <span>
                Welcome to <strong>Systatum</strong>. Before proceeding, please
                take a moment to read the following information carefully.
              </span>
              <span>
                By using <strong>Systatum</strong> products or services, you
                agree to comply with our terms of use and privacy policies.
                These guidelines are designed to ensure a consistent and secure
                experience for all users within the <strong>Systatum</strong>{" "}
                ecosystem.
              </span>
              <span>
                The <strong>Systatum</strong> platform may update its features,
                security policies, or user interface without prior notice. We
                encourage you to review these updates regularly to stay informed
                about the latest improvements.
              </span>
              <span>
                Your data and privacy are important to <strong>Systatum</strong>
                . We use industry-standard security measures to protect your
                information and maintain compliance with global data protection
                regulations.
              </span>
              <span>
                If you have any questions, feedback, or require further
                assistance, please contact the <strong>Systatum</strong> support
                team. We’re here to help ensure you have the best experience
                possible.
              </span>
            </ScrollBox>
          </Messagebox>
        ),
      },
      {
        name: "access",
        placeholder: "I agree",
        type: "checkbox",
        required: false,
      },
      {
        name: "text",
        title: "Save",
        type: "button",
        required: true,
        disabled: !isFormValid,
        placeholder: "Enter text",
        rowJustifyPosition: "flex-end",
      },
    ];

    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          width: "100%",
          maxWidth: "400px",
          flexDirection: "column",
          gap: "0.5rem",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <StatefulForm
          onChange={({ currentState }) => {
            setValue((prev) => ({ ...prev, ...currentState }));
          }}
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          validationSchema={employeeSchema}
          onValidityChange={setIsFormValid}
          autoFocusField="first_name"
          mode="onChange"
        />
      </div>
    );
  },
};

export const WithFrame: Story = {
  render: () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [value, setValue] = useState({
      name: "",
      department: "",
      management_name: "",
      start_date: [""],
      end_date: [""],
      purpose: "",
    });

    const dateArraySchema = z
      .array(
        z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date")
      )
      .min(1, "At least one date is required");

    const employeeSchema = z.object({
      name: z.string().min(3, "Name is required"),
      department: z.string().min(1, "Department is required"),
      management_name: z.string().min(4, "Management Name is required"),
      start_date: dateArraySchema,
      end_date: dateArraySchema,
      purpose: z.string().min(10, "Business purpose is required"),
    });

    const MANAGER_NAME_OPTIONS: SelectboxOption[] = [
      { text: "Alim Naufal", value: "1" },
      { text: "Soekarno", value: "2" },
    ];

    const DEPARTMENT_OPTIONS: SelectboxOption[] = [
      { text: "HR", value: "1" },
      { text: "IT", value: "2" },
    ];

    const EMPLOYEE_FIELDS: FormFieldGroup[] = [
      {
        name: "name",
        title: "Full Name",
        type: "text",
        required: true,
        placeholder: "Enter full name",
      },
      [
        {
          name: "department",
          title: "Department",
          type: "combo",
          required: true,
          placeholder: "Select department",
          comboboxProps: {
            options: DEPARTMENT_OPTIONS,
          },
        },
        {
          name: "manager_name",
          title: "Manager Name",
          type: "combo",
          required: true,
          placeholder: "Select manager",
          comboboxProps: {
            options: MANAGER_NAME_OPTIONS,
          },
        },
      ],
      {
        name: "business_expense",
        title: "Business Expense",
        type: "frame",
        fields: [
          [
            {
              name: "start_date",
              title: "From",
              type: "date",
              placeholder: "Select start date",
              required: true,
            },
            {
              name: "end_date",
              title: "To",
              type: "date",
              required: true,
              placeholder: "Select end date",
            },
          ],
          {
            name: "purpose",
            title: "Purpose",
            type: "text",
            required: true,
            placeholder: "Enter purpose of expense",
          },
        ],
      },
      {
        name: "button",
        title: "Submit",
        type: "button",
        disabled: !isFormValid,
        rowJustifyPosition: "flex-end",
      },
    ];

    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          width: "100%",
          maxWidth: "500px",
          flexDirection: "column",
          gap: "0.5rem",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
      >
        <StatefulForm
          onChange={({ currentState }) => {
            setValue((prev) => ({ ...prev, ...currentState }));
          }}
          validationSchema={employeeSchema}
          onValidityChange={setIsFormValid}
          fields={EMPLOYEE_FIELDS}
          formValues={value}
          mode="onChange"
        />
      </div>
    );
  },
};

export const ConditionalElement: Story = {
  render: () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const [formFields, setFormFields] = useState({
      quantType: "",
      compEffort: "",
      scheIterations: "",
      target: "",
      hostArch: "",
    });

    const schema = z.object({
      quantType: z.string().optional(),
      compEffort: z.string().optional(),
      scheIterations: z
        .string()
        .regex(/^[0-9]*$/, "Must be a number")
        .optional(),
      target: z.string().min(1, "Target is required"),
      hostArch: z.string().optional(),
    });

    const HostArchitecture = {
      x86: 0,
      x64: 1,
      ARM: 2,
      ARM64: 3,
    } as const;

    const CompilationTarget = {
      Interpreter: 0,
      Simulator: 1,
      IP: 2,
    } as const;

    const CompilationEffort = {
      SimpleScheduling: 0,
      Performance: 1,
      Aggressive: 2,
    } as const;

    const Quantization = {
      Int8: 0,
      Bf16: 1,
      Fp16: 2,
      Fp32: 3,
    } as const;

    const HOST_ARCHITECTURE_OPTIONS: SelectboxOption[] = [
      { value: String(HostArchitecture.x86), text: "x86" },
      { value: String(HostArchitecture.x64), text: "x64" },
      { value: String(HostArchitecture.ARM), text: "ARM" },
      { value: String(HostArchitecture.ARM64), text: "ARM64" },
    ];

    const COMPILATION_TARGET_OPTIONS: SelectboxOption[] = [
      { value: String(CompilationTarget.Interpreter), text: "Interpreter" },
      { value: String(CompilationTarget.Simulator), text: "Simulator" },
      { value: String(CompilationTarget.IP), text: "IP" },
    ];

    const COMPILATION_EFFORT_OPTIONS: SelectboxOption[] = [
      {
        value: String(CompilationEffort.SimpleScheduling),
        text: "Simple scheduling",
      },
      {
        value: String(CompilationEffort.Performance),
        text: "Performance",
      },
      {
        value: String(CompilationEffort.Aggressive),
        text: "Aggressive",
      },
    ];

    const QUANTIZATION_TYPE_OPTIONS: SelectboxOption[] = [
      { value: String(Quantization.Int8), text: "INT8" },
      { value: String(Quantization.Bf16), text: "BF16" },
      { value: String(Quantization.Fp16), text: "FP16" },
      { value: String(Quantization.Fp32), text: "FP32" },
    ];

    const COMPILATION_FIELDS: FormFieldGroup[] = useMemo(() => {
      const isInt8Quantization =
        formFields.quantType === String(Quantization.Int8);

      const isPerfCompilation =
        formFields.compEffort === String(CompilationEffort.Performance);

      return [
        {
          name: "quantType",
          title: "Precision",
          type: "combo",
          required: false,
          placeholder: "Select the quantization",
          comboboxProps: {
            options: QUANTIZATION_TYPE_OPTIONS,
          },
        },
        [
          {
            name: "compEffort",
            title: "Compilation Effort",
            type: "combo",
            required: false,
            placeholder: "Compilation effort",
            hidden: !isInt8Quantization,
            comboboxProps: {
              options: COMPILATION_EFFORT_OPTIONS,
            },
          },
          {
            name: "scheIterations",
            title: "Scheduling Iterations",
            type: "text",
            required: isInt8Quantization && isPerfCompilation,
            placeholder: "Scheduling iterations",
            hidden: !(isInt8Quantization && isPerfCompilation),
          },
        ],
        {
          name: "target",
          title: "Target",
          type: "combo",
          required: true,
          placeholder: "Select the target platform",
          comboboxProps: {
            options: COMPILATION_TARGET_OPTIONS,
          },
        },
        {
          name: "hostArch",
          title: "Host Architecture",
          type: "combo",
          required: false,
          placeholder: "Host architecture",
          comboboxProps: {
            options: HOST_ARCHITECTURE_OPTIONS,
          },
        },
        {
          name: "button",
          title: "Submit",
          type: "button",
          disabled: !isFormValid,
          rowJustifyPosition: "flex-end",
        },
      ] as FormFieldGroup[];
    }, [formFields.compEffort, formFields.quantType, isFormValid]);

    return (
      <StatefulForm
        onChange={({ currentState }) => {
          setFormFields((prev) => ({ ...prev, ...currentState }));
        }}
        onValidityChange={setIsFormValid}
        validationSchema={schema}
        fields={COMPILATION_FIELDS}
        formValues={formFields}
        mode="onChange"
      />
    );
  },
};

export const LeftLabeled: Story = {
  render: () => {
    const { currentTheme, mode } = useTheme();
    const bodyTheme = currentTheme?.body;

    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (country) => country.id === "US"
    );

    const [isFormValid, setIsFormValid] = useState(false);
    const [value, setValue] = useState<{
      name: string;
      email: string;
      phone: string;
      country_code: CountryCodeProps;
      password: string;
    }>({
      name: "",
      email: "",
      phone: "",
      country_code: DEFAULT_COUNTRY_CODES,
      password: "",
    });

    const SIGN_UP_FIELDS: FormFieldGroup[] = [
      {
        name: "name",
        title: "Name",
        placeholder: "Enter your name",
        type: "text",
        required: true,
        labelPosition: "left",
      },
      {
        name: "phone",
        title: "Phone",
        placeholder: "Enter your phone",
        type: "phone",
        phoneboxProps: {
          countryCodeValue: value.country_code,
        },
        required: true,
        labelPosition: "left",
      },
      {
        name: "email",
        title: "Email",
        placeholder: "Enter your email",
        type: "email",
        required: true,
        labelPosition: "left",
      },
      {
        name: "password",
        title: "Password",
        placeholder: "Enter your password",
        type: "password",
        required: true,
        labelPosition: "left",
      },
    ];

    const signUpSchema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      phone: z.string().min(8, "Phone number must be 8 digits"),
      email: z.string().email("Please enter a valid email"),
      password: z.string().min(8, "Password must be at least 8 characters"),
    });

    return (
      <Card
        styles={{
          containerStyle: css`
            width: 450px;
          `,
        }}
      >
        <FormBody>
          <Container>
            <Title>Sign Up</Title>
            <Description>Create a new account to get started.</Description>
          </Container>

          <StatefulForm
            fields={SIGN_UP_FIELDS}
            formValues={value}
            validationSchema={signUpSchema}
            mode="onChange"
            onValidityChange={setIsFormValid}
            onChange={({ currentState }) =>
              setValue((prev) => ({ ...prev, ...currentState }))
            }
          />

          <Button
            type="submit"
            disabled={!isFormValid}
            styles={{
              containerStyle: { width: "100%" },
              self: { width: "100%" },
            }}
          >
            Sign Up
          </Button>
        </FormBody>

        <Footer $theme={bodyTheme} $mode={mode}>
          <span>Already have an account?</span>
          <div
            style={{
              cursor: "pointer",
            }}
            onClick={() => {}}
          >
            Sign In
          </div>
        </Footer>
      </Card>
    );
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-family: monospace;
  font-weight: 600;
  font-size: 1.125rem;
  @media (min-width: 640px) {
    font-size: 1.25rem;
  }
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.span`
  font-size: 0.625rem;
  font-weight: 500;
  color: #6b7280;
  @media (min-width: 768px) {
    font-size: 0.75rem;
  }
`;

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
`;

const Footer = styled.div<{
  $theme?: BodyThemeConfig;
  $mode: "light" | "dark";
}>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  background-color: ${({ $theme, $mode }) =>
    $mode === "dark"
      ? lightenColor($theme?.backgroundColor, 0.1)
      : darkenColor($theme?.backgroundColor, 0.1)};
  padding: 1rem 0;
  font-size: 0.875rem;
  text-align: center;

  a {
    cursor: pointer;
    font-weight: 500;
    color: #6b7280;
    display: flex;
    align-items: center;
    &:hover {
      color: #4b5563;
    }
  }

  .loader {
    margin-left: 0.5rem;
  }
`;

const ScrollBox = styled.div`
  max-height: 120px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #aaa;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;
`;

export const AllCase: Story = {
  render: () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const FRUIT_OPTIONS: SelectboxOption[] = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
    ];

    const BADGE_OPTIONS: BadgeProps[] = [
      {
        id: "1",
        caption: "Anime",
      },
      {
        id: "2",
        caption: "Manga",
      },
      {
        id: "3",
        caption: "Comics",
      },
      {
        id: "4",
        caption: "Movies",
      },
      {
        id: "5",
        caption: "Podcasts",
      },
      {
        id: "6",
        caption: "TV Shows",
      },
      {
        id: "7",
        caption: "Novels",
      },
      {
        id: "8",
        caption: "Music",
      },
      {
        id: "9",
        caption: "Games",
      },
      {
        id: "10",
        caption: "Webtoons",
      },
    ];

    const CURRENCY_OPTIONS: MoneyboxCurrencyOption[] = [
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

    interface AllCaseValueProps {
      text: string;
      time: string;
      email: string;
      number: string;
      password: string;
      textarea: string;
      rating: string;
      check: boolean;
      chips?: {
        searchText: string;
        selectedOptions: BadgeProps[];
      };
      color: string;
      combo: string[];
      date: string[];
      file_drop_box?: File[];
      file: File[] | undefined;
      image: File | undefined;
      money: string;
      phone: string;
      thumb_field: boolean;
      togglebox: boolean;
      signature: string;
      capsule: string;
      country_code?: CountryCodeProps;
      currency: string;
      pin: string;
    }

    const [value, setValue] = useState<AllCaseValueProps>({
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
      thumb_field: false,
      togglebox: false,
      signature: "",
      capsule: "",
      country_code: DEFAULT_COUNTRY_CODES,
      currency: "USD",
      pin: "",
    });

    const CAPSULE_TABS: CapsuleTab[] = [
      {
        id: "paid",
        title: "Paid",
      },
      {
        id: "unpaid",
        title: "Unpaid",
      },
    ];

    const PARTS_INPUT: PinboxParts[] = [
      {
        type: "static",
        text: "S",
      },
      {
        type: "alphanumeric",
      },
      {
        type: "digit",
      },
      {
        type: "alphabet",
      },
      {
        type: "static",
        text: "-",
      },
      {
        type: "alphabet",
      },
    ];

    const handleOptionClicked = (badge: BadgeProps) => {
      const isAlreadySelected = value.chips.selectedOptions.some(
        (data) => data.id === badge.id
      );

      setValue((prev) => ({
        ...prev,
        chips: {
          ...prev.chips,
          selectedOptions: isAlreadySelected
            ? prev.chips.selectedOptions.filter((data) => data.id !== badge.id)
            : [...prev.chips.selectedOptions, badge],
        },
      }));
    };

    const badgeSchema = z.object({
      id: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
      variant: z.string().optional(),
      withCircle: z.boolean().optional(),
      caption: z.string().optional(),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      circleColor: z.string().optional(),
    });

    const schema = z.object({
      text: z.string().min(3, "Text must be at least 3 characters"),
      email: z.string().email("Please enter a valid email address"),
      time: z.string().optional(),
      number: z.string().refine((val) => val === "" || !isNaN(Number(val)), {
        message: "Number must be numeric",
      }),
      password: z.string().min(6, "Password must be at least 6 characters"),
      textarea: z.string().min(10, "Text must be at least 10 characters"),
      check: z.boolean(),
      chips: z.object({
        searchText: z.string().optional(),
        selectedOptions: z.array(badgeSchema).optional(),
      }),
      color: z.string().min(4, "Color is required"),
      combo: z
        .array(z.string().min(1, "Choose one"))
        .min(1, "Combo must have at least one item")
        .refine(
          (arr) =>
            arr.every((val) =>
              FRUIT_OPTIONS.some((opt) => {
                return opt.value === val;
              })
            ),
          "Invalid value in combo"
        ),
      date: z.array(
        z
          .string()
          .nonempty("Choose your date")
          .refine(
            (val) =>
              /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(val),
            {
              message: "Invalid date",
            }
          )
      ),
      file_drop_box: z.any().optional(),
      file: z
        .preprocess((value) => {
          if (value instanceof FileList) return Array.from(value);
          if (Array.isArray(value)) return value;
          return [];
        }, z.array(z.any()))
        .refine((files) => files.length > 0, {
          message: "At least one file is required",
        })
        .refine((files) => files.every((file) => file.type === "image/jpeg"), {
          message: "Only JPEG files are allowed",
        })
        .refine(
          (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
          {
            message: "Each file must be 5MB or less",
          }
        ),
      image: z
        .any()
        .refine(
          (file) => {
            return file?.type === "image/jpeg";
          },
          {
            message: "Only JPEG file are allowed",
          }
        )
        .refine((file) => file?.size <= 5 * 1024 * 1024, {
          message: "File size must be 5MB or less",
        }),
      money: z.string().optional(),
      signature: z.string().min(1, "Signature is required"),
      phone: z.string().min(8, "Phone number must be 8 digits").optional(),
      rating: z.string().optional(),
      thumb_field: z.boolean(),
      togglebox: z.boolean(),
      capsule: z.string().max(4, "Paid is required"),
      pin: z.string().min(4, "Pinbox does not follow the acceptable format"),
      country_code: z
        .object({
          id: z.string(),
          name: z.string(),
          flag: z.string(),
          code: z.string(),
        })
        .optional(),
    });

    const onChangeForm = (e?: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const target = e.target;
        const { name, value } = target;

        let updatedValue: FormValueType = value;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
          updatedValue = target.checked;
        }

        if (target.name === "chips") {
          setValue((prev) => ({
            ...prev,
            chips: { ...prev.chips, ["searchText"]: String(updatedValue) },
          }));
        } else {
          setValue((prev) => ({ ...prev, [name]: updatedValue }));
        }
      }
    };

    const onFileDropped = async ({
      error,
      files,
      setProgressLabel,
      succeed,
    }: OnFileDroppedFunction) => {
      const file = files[0];
      setProgressLabel(`Uploading ${file.name}`);

      return new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;

          if (progress >= 100) {
            clearInterval(interval);
            if (file === null) {
              error(file, `file ${files[0].name} is not uploaded`);
            } else {
              succeed(file);
            }
            setProgressLabel(`Uploaded ${files[0].name}`);
            resolve();
          }
        }, 300);
      });
    };

    const onComplete = ({
      failedFiles,
      setProgressLabel,
      succeedFiles,
    }: OnCompleteFunction) => {
      setValue((prev) => ({
        ...prev,
        file_drop_box: succeedFiles,
      }));
      console.log(succeedFiles, "This is succeedFiles");
      console.log(failedFiles, "This is failedFiles");
      setProgressLabel(
        `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
      );
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
        helper: "This field is used to enter a single line of text",
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email address",
        helper: "This field is used to enter an email address",
      },
      {
        name: "time",
        title: "Time",
        type: "time",
        required: true,
        placeholder: "Enter time",
        helper: "This field allows you to select a time",
      },
      {
        name: "number",
        title: "Number",
        type: "number",
        required: true,
        placeholder: "Enter number",
        helper: "This field only accepts numeric values",
      },
      {
        name: "password",
        title: "Password",
        type: "password",
        required: true,
        placeholder: "Enter password",
        helper: "This field is used to enter a secure password",
      },
      {
        name: "textarea",
        title: "Textarea",
        type: "textarea",
        rows: 3,
        required: true,
        placeholder: "Enter text here",
        helper: "This field allows you to enter multiple lines of text",
      },
      {
        name: "pin",
        title: "Pin",
        type: "pin",
        required: true,
        helper: "This pinbox allows you to enter your PIN code.",
        pinboxProps: {
          parts: PARTS_INPUT,
        },
      },
      {
        name: "check",
        title: "Checkbox",
        placeholder: "Check",
        type: "checkbox",
        helper: "This checkbox allows you to toggle a boolean value",
      },
      {
        name: "radio",
        title: "Radio",
        placeholder: "Radio",
        type: "radio",
        helper: "This radio allows you to select one option",
      },
      {
        name: "color",
        title: "Color",
        type: "color",
        required: true,
        placeholder: "Enter the color here",
        helper: "This field allows you to pick or input a color value",
      },
      {
        name: "combo",
        title: "Combo",
        type: "combo",
        required: true,
        placeholder: "Select a fruit...",
        helper: "This field allows you to select one or more options",
        comboboxProps: {
          options: FRUIT_OPTIONS,
        },
      },
      {
        name: "date",
        title: "Date",
        type: "date",
        required: true,
        placeholder: "Select a date",
        helper: "This field allows you to select a date",
        dateProps: {
          monthNames: MONTH_NAMES,
        },
      },
      {
        name: "file_drop_box",
        title: "File Drop Box",
        type: "file_drop_box",
        required: true,
        helper: "This field allows you to upload files via drag and drop",
        fileDropBoxProps: {
          onComplete,
          onFileDropped,
        },
      },
      {
        name: "file",
        title: "File",
        type: "file",
        required: true,
        helper: "This field allows you to upload one or more files",
        fileInputBoxProps: {
          accept: "image/jpeg",
        },
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        required: true,
        helper: "This field allows you to upload and preview an image",
      },
      {
        name: "money",
        title: "Money",
        type: "money",
        required: true,
        placeholder: "Enter amount",
        helper: "This field is used to input a monetary value",
        moneyProps: {
          separator: "dot",
          editableCurrency: true,
          currencyOptions: CURRENCY_OPTIONS,
          currency: value.currency,
        },
      },
      {
        name: "phone",
        title: "Phone",
        type: "phone",
        required: true,
        placeholder: "Enter phone number",
        helper: "This field allows you to enter a phone number",
      },
      {
        name: "signature",
        title: "Signature",
        type: "signbox",
        required: true,
        helper: "This field allows you to draw a signature",
      },
      {
        name: "rating",
        title: "Rating",
        type: "rating",
        required: true,
        helper: "This field allows you to provide a rating",
      },
      {
        name: "thumb_field",
        title: "Thumb Field",
        type: "thumbfield",
        required: true,
        helper: "This field allows you to select a thumbs-up or down value",
      },
      {
        name: "togglebox",
        title: "Togglebox",
        type: "toggle",
        placeholder: "Toggle",
        required: true,
        helper: "This field allows you to toggle a boolean state",
      },
      {
        name: "chips",
        title: "Chips",
        type: "chips",
        required: false,
        helper: "This field allows you to select multiple items",
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
          onOptionClicked: handleOptionClicked,
          selectedOptions: value.chips.selectedOptions,
          inputValue: value.chips.searchText,
        },
        onChange: onChangeForm,
      },
      {
        name: "capsule",
        title: "Monetary Value",
        type: "capsule",
        required: true,
        helper: "This field allows you to switch between monetary options",
        capsuleProps: {
          tabs: CAPSULE_TABS,
        },
      },
      {
        name: "text",
        title: "Save",
        type: "button",
        required: true,
        disabled: !isFormValid,
        rowJustifyPosition: "flex-end",
      },
    ];

    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          gap: "0.5rem",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          maxWidth: "500px",
        }}
      >
        <StatefulForm
          onChange={({ currentState }) => {
            const { chips, ...rest } = currentState;
            void chips;

            setValue((prev) => ({
              ...prev,
              ...rest,
            }));
          }}
          onValidityChange={setIsFormValid}
          labelSize="14px"
          fieldSize="14px"
          fields={FIELDS}
          formValues={value}
          validationSchema={schema}
          mode="onChange"
        />
      </div>
    );
  },
};

export const AllCaseDisabled: Story = {
  render: () => {
    const [isFormValid, setIsFormValid] = useState(false);
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const FRUIT_OPTIONS: SelectboxOption[] = [
      { text: "Apple", value: "1" },
      { text: "Banana", value: "2" },
      { text: "Orange", value: "3" },
      { text: "Grape", value: "4" },
      { text: "Pineapple", value: "5" },
      { text: "Strawberry", value: "6" },
      { text: "Watermelon", value: "7" },
    ];

    const BADGE_OPTIONS: BadgeProps[] = [
      {
        id: "1",
        caption: "Anime",
      },
      {
        id: "2",
        caption: "Manga",
      },
      {
        id: "3",
        caption: "Comics",
      },
      {
        id: "4",
        caption: "Movies",
      },
      {
        id: "5",
        caption: "Podcasts",
      },
      {
        id: "6",
        caption: "TV Shows",
      },
      {
        id: "7",
        caption: "Novels",
      },
      {
        id: "8",
        caption: "Music",
      },
      {
        id: "9",
        caption: "Games",
      },
      {
        id: "10",
        caption: "Webtoons",
      },
    ];

    const CURRENCY_OPTIONS: MoneyboxCurrencyOption[] = [
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

    interface AllCaseValueProps {
      text: string;
      time: string;
      email: string;
      number: string;
      password: string;
      textarea: string;
      rating: string;
      check: boolean;
      chips?: {
        searchText: string;
        selectedOptions: BadgeProps[];
      };
      color: string;
      combo: string[];
      date: string[];
      file_drop_box?: File[];
      file: File[] | undefined;
      image: File | undefined;
      money: string;
      phone: string;
      thumb_field: boolean;
      togglebox: boolean;
      signature: string;
      capsule: string;
      country_code?: CountryCodeProps;
      currency: string;
      pin: string;
    }

    const [value, setValue] = useState<AllCaseValueProps>({
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
      thumb_field: false,
      togglebox: false,
      signature: "",
      capsule: "",
      country_code: DEFAULT_COUNTRY_CODES,
      currency: "USD",
      pin: "",
    });

    const CAPSULE_TABS: CapsuleTab[] = [
      {
        id: "paid",
        title: "Paid",
      },
      {
        id: "unpaid",
        title: "Unpaid",
      },
    ];

    const PARTS_INPUT: PinboxParts[] = [
      {
        type: "static",
        text: "S",
      },
      {
        type: "alphanumeric",
      },
      {
        type: "digit",
      },
      {
        type: "alphabet",
      },
      {
        type: "static",
        text: "-",
      },
      {
        type: "alphabet",
      },
    ];

    const handleOptionClicked = (badge: BadgeProps) => {
      const isAlreadySelected = value.chips.selectedOptions.some(
        (data) => data.id === badge.id
      );

      setValue((prev) => ({
        ...prev,
        chips: {
          ...prev.chips,
          selectedOptions: isAlreadySelected
            ? prev.chips.selectedOptions.filter((data) => data.id !== badge.id)
            : [...prev.chips.selectedOptions, badge],
        },
      }));
    };

    const badgeSchema = z.object({
      id: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
      variant: z.string().optional(),
      withCircle: z.boolean().optional(),
      caption: z.string().optional(),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      circleColor: z.string().optional(),
    });

    const schema = z.object({
      text: z.string().min(3, "Text must be at least 3 characters"),
      email: z.string().email("Please enter a valid email address"),
      time: z.string().optional(),
      number: z.string().refine((val) => val === "" || !isNaN(Number(val)), {
        message: "Number must be numeric",
      }),
      password: z.string().min(6, "Password must be at least 6 characters"),
      textarea: z.string().min(10, "Text must be at least 10 characters"),
      check: z.boolean(),
      chips: z.object({
        searchText: z.string().optional(),
        selectedOptions: z.array(badgeSchema).optional(),
      }),
      color: z.string().min(4, "Color is required"),
      combo: z
        .array(z.string().min(1, "Choose one"))
        .min(1, "Combo must have at least one item")
        .refine(
          (arr) =>
            arr.every((val) =>
              FRUIT_OPTIONS.some((opt) => {
                return opt.value === val;
              })
            ),
          "Invalid value in combo"
        ),
      date: z.array(
        z
          .string()
          .nonempty("Choose your date")
          .refine(
            (val) =>
              /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/.test(val),
            {
              message: "Invalid date",
            }
          )
      ),
      file_drop_box: z.any().optional(),
      file: z
        .preprocess((value) => {
          if (value instanceof FileList) return Array.from(value);
          if (Array.isArray(value)) return value;
          return [];
        }, z.array(z.any()))
        .refine((files) => files.length > 0, {
          message: "At least one file is required",
        })
        .refine((files) => files.every((file) => file.type === "image/jpeg"), {
          message: "Only JPEG files are allowed",
        })
        .refine(
          (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
          {
            message: "Each file must be 5MB or less",
          }
        ),
      image: z
        .any()
        .refine(
          (file) => {
            return file?.type === "image/jpeg";
          },
          {
            message: "Only JPEG file are allowed",
          }
        )
        .refine((file) => file?.size <= 5 * 1024 * 1024, {
          message: "File size must be 5MB or less",
        }),
      money: z.string().optional(),
      signature: z.string().min(1, "Signature is required"),
      phone: z.string().min(8, "Phone number must be 8 digits").optional(),
      rating: z.string().optional(),
      thumb_field: z.boolean(),
      togglebox: z.boolean(),
      capsule: z.string().max(4, "Paid is required"),
      pin: z.string().min(4, "Pinbox does not follow the acceptable format"),
      country_code: z
        .object({
          id: z.string(),
          name: z.string(),
          flag: z.string(),
          code: z.string(),
        })
        .optional(),
    });

    const onChangeForm = (e?: StatefulOnChangeType) => {
      if (e && "target" in e) {
        const target = e.target;
        const { name, value } = target;

        let updatedValue: FormValueType = value;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
          updatedValue = target.checked;
        }

        if (target.name === "chips") {
          setValue((prev) => ({
            ...prev,
            chips: { ...prev.chips, ["searchText"]: String(updatedValue) },
          }));
        } else {
          setValue((prev) => ({ ...prev, [name]: updatedValue }));
        }
      }
    };

    const onFileDropped = async ({
      error,
      files,
      setProgressLabel,
      succeed,
    }: OnFileDroppedFunction) => {
      const file = files[0];
      setProgressLabel(`Uploading ${file.name}`);

      return new Promise<void>((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 20;

          if (progress >= 100) {
            clearInterval(interval);
            if (file === null) {
              error(file, `file ${files[0].name} is not uploaded`);
            } else {
              succeed(file);
            }
            setProgressLabel(`Uploaded ${files[0].name}`);
            resolve();
          }
        }, 300);
      });
    };

    const onComplete = ({
      failedFiles,
      setProgressLabel,
      succeedFiles,
    }: OnCompleteFunction) => {
      setValue((prev) => ({
        ...prev,
        file_drop_box: succeedFiles,
      }));
      console.log(succeedFiles, "This is succeedFiles");
      console.log(failedFiles, "This is failedFiles");
      setProgressLabel(
        `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
      );
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
        helper: "This field is used to enter a single line of text",
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email address",
        helper: "This field is used to enter an email address",
      },
      {
        name: "time",
        title: "Time",
        type: "time",
        required: true,
        placeholder: "Enter time",
        helper: "This field allows you to select a time",
      },
      {
        name: "number",
        title: "Number",
        type: "number",
        required: true,
        placeholder: "Enter number",
        helper: "This field only accepts numeric values",
      },
      {
        name: "password",
        title: "Password",
        type: "password",
        required: true,
        placeholder: "Enter password",
        helper: "This field is used to enter a secure password",
      },
      {
        name: "textarea",
        title: "Textarea",
        type: "textarea",
        rows: 3,
        required: true,
        placeholder: "Enter text here",
        helper: "This field allows you to enter multiple lines of text",
      },
      {
        name: "pin",
        title: "Pin",
        type: "pin",
        required: true,
        helper: "This pinbox allows you to enter your PIN code.",
        pinboxProps: {
          parts: PARTS_INPUT,
        },
      },
      {
        name: "check",
        title: "Checkbox",
        placeholder: "Check",
        type: "checkbox",
        helper: "This checkbox allows you to toggle a boolean value",
      },
      {
        name: "radio",
        title: "Radio",
        placeholder: "Radio",
        type: "radio",
        helper: "This radio allows you to select one option",
      },
      {
        name: "color",
        title: "Color",
        type: "color",
        required: true,
        placeholder: "Enter the color here",
        helper: "This field allows you to pick or input a color value",
      },
      {
        name: "combo",
        title: "Combo",
        type: "combo",
        required: true,
        placeholder: "Select a fruit...",
        helper: "This field allows you to select one or more options",
        comboboxProps: {
          options: FRUIT_OPTIONS,
        },
      },
      {
        name: "date",
        title: "Date",
        type: "date",
        required: true,
        placeholder: "Select a date",
        helper: "This field allows you to select a date",
        dateProps: {
          monthNames: MONTH_NAMES,
        },
      },
      {
        name: "file_drop_box",
        title: "File Drop Box",
        type: "file_drop_box",
        required: true,
        helper: "This field allows you to upload files via drag and drop",
        fileDropBoxProps: {
          onComplete,
          onFileDropped,
        },
      },
      {
        name: "file",
        title: "File",
        type: "file",
        required: true,
        helper: "This field allows you to upload one or more files",
        fileInputBoxProps: {
          accept: "image/jpeg",
        },
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        required: true,
        helper: "This field allows you to upload and preview an image",
      },
      {
        name: "money",
        title: "Money",
        type: "money",
        required: true,
        placeholder: "Enter amount",
        helper: "This field is used to input a monetary value",
        moneyProps: {
          separator: "dot",
          editableCurrency: true,
          currencyOptions: CURRENCY_OPTIONS,
          currency: value.currency,
        },
      },
      {
        name: "phone",
        title: "Phone",
        type: "phone",
        required: true,
        placeholder: "Enter phone number",
        helper: "This field allows you to enter a phone number",
      },
      {
        name: "signature",
        title: "Signature",
        type: "signbox",
        required: true,
        helper: "This field allows you to draw a signature",
      },
      {
        name: "rating",
        title: "Rating",
        type: "rating",
        required: true,
        helper: "This field allows you to provide a rating",
      },
      {
        name: "thumb_field",
        title: "Thumb Field",
        type: "thumbfield",
        required: true,
        helper: "This field allows you to select a thumbs-up or down value",
      },
      {
        name: "togglebox",
        title: "Togglebox",
        type: "toggle",
        placeholder: "Toggle",
        required: true,
        helper: "This field allows you to toggle a boolean state",
      },
      {
        name: "chips",
        title: "Chips",
        type: "chips",
        required: false,
        helper: "This field allows you to select multiple items",
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
          onOptionClicked: handleOptionClicked,
          selectedOptions: value.chips.selectedOptions,
          inputValue: value.chips.searchText,
        },
        onChange: onChangeForm,
      },
      {
        name: "capsule",
        title: "Monetary Value",
        type: "capsule",
        required: true,
        helper: "This field allows you to switch between monetary options",
        capsuleProps: {
          tabs: CAPSULE_TABS,
        },
      },
      {
        name: "text",
        title: "Save",
        type: "button",
        required: true,
        rowJustifyPosition: "flex-end",
      },
    ];

    return (
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          gap: "0.5rem",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          maxWidth: "500px",
        }}
      >
        <StatefulForm
          disabled
          onChange={({ currentState }) => {
            const { chips, ...rest } = currentState;
            void chips;

            setValue((prev) => ({
              ...prev,
              ...rest,
            }));
          }}
          onValidityChange={setIsFormValid}
          labelSize="14px"
          fieldSize="14px"
          fields={FIELDS}
          formValues={value}
          validationSchema={schema}
          mode="onChange"
        />
      </div>
    );
  },
};
