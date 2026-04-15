import {
  FormFieldGroup,
  FormFieldProps,
  FormFieldType,
  StatefulForm,
  StatefulFormProps,
} from "./../../components/stateful-form";
import { COUNTRY_CODES } from "./../../constants/countries";
import { Boxbar } from "./../../components/boxbar";
import { Badge, BadgeProps } from "./../../components/badge";
import { css } from "styled-components";
import { SelectboxOption } from "./../../components/selectbox";
import { CapsuleTab } from "./../../components/capsule";
import { useMemo, useState } from "react";
import {
  OnCompleteFunction,
  FileDropBox,
  OnFileDroppedFunction,
} from "./../../components/file-drop-box";
import { Table } from "./../../components/table";
import { RiDeleteBin2Fill } from "@remixicon/react";
import z from "zod";
import { PinboxParts } from "./../../components/pinbox";

const DEFAULT_COUNTRY_CODES = (() => {
  const code =
    COUNTRY_CODES.find((data) => data.id === "US") ?? COUNTRY_CODES[206];
  if (!code)
    throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
  return code;
})();

const FRUIT_OPTIONS: SelectboxOption[] = [
  { text: "Apple", value: "1" },
  { text: "Banana", value: "2" },
  { text: "Orange", value: "3" },
  { text: "Grape", value: "4" },
  { text: "Pineapple", value: "5" },
  { text: "Strawberry", value: "6" },
  { text: "Watermelon", value: "7" },
];

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

const CAPSULE_TABS: CapsuleTab[] = [
  { id: "paid", title: "Paid" },
  { id: "unpaid", title: "Unpaid" },
];

const PARTS_INPUT: PinboxParts[] = [
  { type: "static", text: "S" },
  { type: "alphanumeric" },
  { type: "digit" },
  { type: "alphabet" },
  { type: "static", text: "-" },
];

const BADGE_OPTIONS_FULL = [
  { id: 1, caption: "Anime" },
  { id: 2, caption: "Manga" },
  { id: 3, caption: "Comics" },
  { id: 4, caption: "Movies" },
  { id: 5, caption: "Podcasts" },
  { id: 6, caption: "TV Shows" },
  { id: 7, caption: "Novels" },
  { id: 8, caption: "Music" },
  { id: 9, caption: "Games" },
  { id: 10, caption: "Webtoons" },
];

const BADGE_OPTIONS_SHORT: BadgeProps[] = [
  { id: "1", caption: "Anime" },
  { id: "2", caption: "Manga" },
];

const TYPE_TO_ID_PREFIX: Record<FormFieldType, string> = {
  text: "textbox",
  message: "textbox",
  number: "textbox",
  email: "textbox",
  password: "textbox",
  textarea: "textarea",
  checkbox: "checkbox",
  radio: "radio",
  phone: "phonebox",
  color: "colorbox",
  file_drop_box: "file-drop-box",
  file: "file-input-box",
  image: "imagebox",
  signbox: "signbox",
  money: "moneybox",
  date: "datebox",
  combo: "combobox",
  rating: "rating",
  thumbfield: "thumbfield",
  toggle: "toggle",
  capsule: "capsule",
  time: "timebox",
  button: "button",
  pin: "pinbox",
  chips: "chips",
  custom: "custom",
  frame: "frame",
};

const allValue = {
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
  toggle: false,
  signature: "",
  capsule: "",
  country_code: DEFAULT_COUNTRY_CODES,
};

const ALL_INPUT: FormFieldGroup[] = [
  [
    {
      name: "text",
      title: "Text",
      type: "text",
      required: true,
      placeholder: "Enter text",
    },
    {
      name: "email",
      title: "Email",
      type: "email",
      required: true,
      placeholder: "Enter email address",
    },
  ],
  {
    name: "time",
    title: "Time",
    type: "time",
    required: true,
    placeholder: "Enter time",
  },
  {
    name: "number",
    title: "Number",
    type: "number",
    required: true,
    placeholder: "Enter number",
  },
  {
    name: "password",
    title: "Password",
    type: "password",
    required: true,
    placeholder: "Enter password",
  },
  {
    name: "textarea",
    title: "Textarea",
    type: "textarea",
    rows: 3,
    required: true,
    placeholder: "Enter text here",
  },
  {
    name: "pin",
    title: "Pin",
    type: "pin",
    required: true,
    pinboxProps: {
      parts: PARTS_INPUT,
    },
  },
  {
    name: "check",
    title: "Checkbox",
    type: "checkbox",
    required: false,
  },
  {
    name: "radio",
    title: "Radio",
    type: "radio",
    required: false,
  },
  {
    name: "color",
    title: "Color",
    type: "color",
    required: true,
    placeholder: "Enter the color here",
  },
  {
    name: "combo",
    title: "Combo",
    type: "combo",
    required: true,
    placeholder: "Select a fruit...",
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
  },
  {
    name: "file_drop_box",
    title: "File Drop Box",
    type: "file_drop_box",
    required: true,
  },
  {
    name: "file",
    title: "File",
    type: "file",
    required: true,
    fileInputBoxProps: {
      accept: "image/jpeg",
    },
  },
  {
    name: "image",
    title: "Image",
    type: "image",
    required: true,
  },
  {
    name: "money",
    title: "Money",
    type: "money",
    required: true,
    placeholder: "Enter amount",
    moneyProps: {
      separator: "dot",
    },
  },
  {
    name: "phone",
    title: "Phone",
    type: "phone",
    required: true,
    placeholder: "Enter phone number",
  },
  {
    name: "signature",
    title: "Signature",
    type: "signbox",
    required: true,
  },
  {
    name: "rating",
    title: "Rating",
    type: "rating",
    required: true,
  },
  {
    name: "thumb_field",
    title: "Thumb Field",
    type: "thumbfield",
    required: true,
  },
  {
    name: "toggle",
    title: "Toggle",
    type: "toggle",
    required: true,
  },
  {
    name: "chips",
    title: "Chips",
    type: "chips",
    required: false,
    chipsProps: {
      options: BADGE_OPTIONS_SHORT,
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
      selectedOptions: allValue.chips.selectedOptions,
      inputValue: allValue.chips.searchText,
    },
  },
  {
    name: "capsule",
    title: "Monetary Value",
    type: "capsule",
    required: true,
    capsuleProps: {
      tabs: CAPSULE_TABS,
    },
  },
];

const flattenFields = (groups: FormFieldGroup[]): FormFieldProps[] =>
  groups.flatMap((group) =>
    Array.isArray(group) ? flattenFields(group) : [group]
  );

describe("StatefulForm", () => {
  context("height", () => {
    it("mostly renders with 34px", () => {
      cy.mount(
        <StatefulForm
          fields={ALL_INPUT}
          formValues={allValue}
          mode="onChange"
        />
      );

      flattenFields(ALL_INPUT).map((field) => {
        if (field.type === "frame" || field.type === "chips") {
          return;
        } else if (
          field.type === "radio" ||
          field.type === "image" ||
          field.type === "rating" ||
          field.type === "checkbox" ||
          field.type === "signbox" ||
          field.type === "file"
        ) {
          cy.findAllByLabelText("radio-input-container").should(
            "have.css",
            "height",
            "16px"
          );
          cy.findAllByLabelText("file-input-box-wrapper").should(
            "have.css",
            "height",
            "47px"
          );
          cy.findAllByLabelText("imagebox-input").should(
            "have.css",
            "height",
            "120px"
          );
          cy.findAllByLabelText("signbox-canvas").should(
            "have.css",
            "height",
            "200px"
          );
          cy.findAllByLabelText("file-drop-box-area").should(
            "have.css",
            "height",
            "221px"
          );
          cy.findAllByLabelText("signbox-canvas").should(
            "have.css",
            "height",
            "200px"
          );
          cy.findAllByLabelText("rating-wrapper").should(
            "have.css",
            "height",
            "24px"
          );
        } else {
          cy.findAllByLabelText("field-lane-control").should(
            "have.css",
            "height",
            "34px"
          );
        }
      });
    });
  });

  context("combobox", () => {
    const comboField = flattenFields(ALL_INPUT).filter(
      (field) => field.type === "combo"
    );

    function ComboboxInput(props: Partial<StatefulFormProps<any>>) {
      const [value, setValue] = useState({ combo: ["4"] });

      return (
        <StatefulForm
          fields={comboField}
          formValues={value}
          onChange={({ currentState }) =>
            setValue((prev) => ({ ...prev, ...currentState }))
          }
          {...props}
        />
      );
    }

    beforeEach(() => {
      cy.mount(<ComboboxInput />);
    });

    it("should shows value from formValues", () => {
      cy.get("#combobox-combo").should("have.value", "Grape");
    });

    context("when given value from selectedOptions", () => {
      const comboFieldWithValue = comboField.map((field) => ({
        ...field,
        comboboxProps: {
          ...field?.comboboxProps,
          selectedOptions: ["1"],
        },
      }));

      beforeEach(() => {
        cy.mount(<ComboboxInput fields={comboFieldWithValue} />);
      });
      it("should shows value from formValues", () => {
        cy.get("#combobox-combo").should("have.value", "Apple");
      });
    });
  });

  context("with type frame", () => {
    function StatefulWithFrame() {
      const [isFormValid, setIsFormValid] = useState(false);
      const [value, setValue] = useState({
        start_date: [""],
        end_date: [""],
        purpose: "",
      });

      const EMPLOYEE_FIELDS: FormFieldGroup[] = [
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
                rowStyle: css`
                  background-color: #f3f4f6;
                  padding: 10px;
                `,
              },
              {
                name: "end_date",
                title: "To",
                type: "date",
                placeholder: "Select end date",
              },
            ],
            {
              name: "purpose",
              title: "Purpose",
              type: "text",
              placeholder: "Enter purpose of expense",
              rowStyle: css`
                background-color: #f3f4f6;
                padding: 10px;
              `,
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

      const dateArraySchema = z
        .array(
          z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date")
        )
        .min(1, "At least one date is required");

      const employeeSchema = z.object({
        start_date: dateArraySchema,
        end_date: dateArraySchema,
        purpose: z.string().min(10, "Business purpose is required"),
      });

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
            fields={EMPLOYEE_FIELDS}
            onValidityChange={setIsFormValid}
            validationSchema={employeeSchema}
            formValues={value}
            mode="onChange"
          />
        </div>
      );
    }

    const initializeFrame = () => {
      cy.mount(<StatefulWithFrame />);
      cy.findAllByLabelText("frame").then(() => {
        cy.findAllByLabelText("stateful-form-row").should("have.length", 4);
        cy.get("#datebox-start_date").should("exist");
        cy.get("#datebox-end_date").should("exist");
        cy.get("#textbox-purpose").should("exist");
        cy.findByRole("button").should("exist").and("be.disabled");
      });
    };

    beforeEach(() => {
      initializeFrame();
    });

    it("shows the form fields inside of frame", () => {
      // shows from beforeEach
    });

    context("when typing", () => {
      it("should added value", () => {
        cy.get("#datebox-start_date")
          .click()
          .then(($el) => {
            cy.findByLabelText("calendar-select-date").click();
            cy.findByLabelText("combobox-month").click();
            cy.findByText("March").click();
            cy.findByLabelText("combobox-year").click();
            cy.findByText("2026").click();
            cy.findByText("20").click();
            cy.wrap($el).should("have.value", "03/20/2026");
          });
        cy.get("#datebox-end_date")
          .click()
          .then(($el) => {
            cy.findByLabelText("calendar-select-date").click();
            cy.findByLabelText("combobox-month").click();
            cy.findByText("March").click();
            cy.findByLabelText("combobox-year").click();
            cy.findByText("2026").click();
            cy.findByText("20").click();
            cy.wrap($el).should("have.value", "03/20/2026");
          });
        cy.get("#textbox-purpose")
          .type("Getting better life")
          .should("have.value", "Getting better life");

        cy.findByRole("button").should("exist").and("not.be.disabled");
      });
    });

    context("when typing but not fully", () => {
      it("renders error validation", () => {
        cy.findByText("Business purpose is required").should("not.exist");

        cy.get("#datebox-start_date")
          .click()
          .then(($el) => {
            cy.findByLabelText("calendar-select-date").click();
            cy.findByLabelText("combobox-month").click();
            cy.findByText("March").click();
            cy.findByLabelText("combobox-year").click();
            cy.findByText("2026").click();
            cy.findByText("20").click();
            cy.wrap($el).should("have.value", "03/20/2026");
          });
        cy.get("#datebox-end_date")
          .click()
          .then(($el) => {
            cy.findByLabelText("calendar-select-date").click();
            cy.findByLabelText("combobox-month").click();
            cy.findByText("March").click();
            cy.findByLabelText("combobox-year").click();
            cy.findByText("2026").click();
            cy.findByText("20").click();
            cy.wrap($el).should("have.value", "03/20/2026");
          });
        cy.get("#textbox-purpose")
          .type("Getting")
          .should("have.value", "Getting");
        cy.get("body").click("bottomRight");

        cy.findByText("Business purpose is required").should("exist");
        cy.findByRole("button").should("exist").and("be.disabled");
      });
    });
  });

  context("conditional form", () => {
    function ConditionalStatefulForm() {
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
          },
        ];
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
    }

    context("when choosen option", () => {
      it("shows the value on the another field", () => {
        cy.mount(<ConditionalStatefulForm />);
        cy.findAllByLabelText("stateful-form-row").should("have.length", 4);
        cy.findByText("Compilation Effort").should("not.exist");
        cy.findByText("Precision").should("exist").click();
        cy.findByText("INT8").should("exist").click();

        cy.findAllByLabelText("stateful-form-row").should("have.length", 5);
        cy.findByText("Compilation Effort").should("exist");
      });
    });
  });

  context("disabled", () => {
    context("when given by parent", () => {
      it("should render with cursor not-allowed and user-select none", () => {
        const onChange = cy.spy().as("onChange");
        cy.mount(
          <StatefulForm
            fields={ALL_INPUT}
            formValues={allValue}
            disabled={true}
            mode="onChange"
            onChange={onChange}
          />
        );

        cy.findAllByLabelText("field-lane-wrapper")
          .should("have.css", "cursor", "not-allowed")
          .and("have.css", "user-select", "none");
        cy.findAllByLabelText("chip-input")
          .should("have.css", "cursor", "not-allowed")
          .and("have.css", "user-select", "none");
        cy.findAllByLabelText("file-drop-box-container")
          .should("have.css", "cursor", "not-allowed")
          .and("have.css", "user-select", "none");
      });

      context("when trying to interact", () => {
        it("should not change value", () => {
          const onChange = cy.spy().as("onChange");
          cy.mount(
            <StatefulForm
              fields={ALL_INPUT}
              formValues={allValue}
              disabled={true}
              mode="onChange"
              onChange={onChange}
            />
          );

          cy.get("input, textarea, [role='radio'], [role='checkbox']").each(
            ($el) => {
              cy.wrap($el).should("be.disabled").click({ force: true });
            }
          );

          cy.get("@onChange").should("not.have.been.called");
        });
      });
    });

    context("when given by per field", () => {
      const INPUT_WITH_DISABLED: FormFieldGroup[] = ALL_INPUT.map((group) =>
        Array.isArray(group)
          ? group.map((item) => ({
              ...item,
              disabled: true,
            }))
          : {
              ...group,
              disabled: true,
            }
      );
      context("when given true", () => {
        it("should render with cursor not-allowed and user-select none", () => {
          cy.mount(
            <StatefulForm
              fields={INPUT_WITH_DISABLED}
              formValues={allValue}
              mode="onChange"
              styles={{
                containerStyle: css`
                  width: 480px;
                `,
              }}
            />
          );

          cy.findAllByLabelText("field-lane-wrapper")
            .should("have.css", "cursor", "not-allowed")
            .and("have.css", "user-select", "none");
          cy.findAllByLabelText("chip-input")
            .should("have.css", "cursor", "not-allowed")
            .and("have.css", "user-select", "none");
          cy.findAllByLabelText("file-drop-box-container")
            .should("have.css", "cursor", "not-allowed")
            .and("have.css", "user-select", "none");
        });
      });

      it("should renders with disabled each input", () => {
        cy.mount(
          <StatefulForm
            fields={INPUT_WITH_DISABLED}
            formValues={allValue}
            mode="onChange"
          />
        );

        cy.get("input, textarea, [role='radio'], [role='checkbox']").each(
          ($el) => {
            cy.wrap($el).should("be.disabled");
          }
        );
      });
    });
  });

  context("label", () => {
    context("labelPosition", () => {
      context("when given labelPosition left", () => {
        const INPUT_WITH_LABEL_POSITION: FormFieldGroup[] = ALL_INPUT.map(
          (group) =>
            Array.isArray(group)
              ? group.map((item) => ({
                  ...item,
                  labelPosition: "left",
                }))
              : {
                  ...group,
                  labelPosition: "left",
                }
        );

        it("should render with flex-row and 25% width label", () => {
          cy.mount(
            <StatefulForm
              fields={INPUT_WITH_LABEL_POSITION}
              formValues={allValue}
              mode="onChange"
              styles={{
                containerStyle: css`
                  width: 480px;
                `,
              }}
            />
          );

          cy.findAllByLabelText("stateful-form-label-wrapper").each(
            ($el, i) => {
              cy.wrap($el)
                .invoke("css", "width")
                .then((width) => {
                  const w = width as unknown as string;
                  if (i < 2) {
                    expect(parseFloat(w)).to.be.closeTo(45, 3);
                  } else {
                    expect(parseFloat(w)).to.be.closeTo(90, 6);
                  }
                });
            }
          );
        });
      });
    });

    context("labelWidth", () => {
      context("when given 70%", () => {
        const INPUT_WITH_LABEL_POSITION_LEFT_AND_WIDTH_MAX: FormFieldGroup[] =
          ALL_INPUT.map((group) =>
            Array.isArray(group)
              ? group.map((item) => ({
                  ...item,
                  labelPosition: "left",
                  labelWidth: "70%",
                }))
              : {
                  ...group,
                  labelPosition: "left",
                  labelWidth: "70%",
                }
          );

        it("should render with 70% width", () => {
          cy.mount(
            <StatefulForm
              fields={INPUT_WITH_LABEL_POSITION_LEFT_AND_WIDTH_MAX}
              formValues={allValue}
              mode="onChange"
              styles={{
                containerStyle: css`
                  width: 480px;
                `,
              }}
            />
          );

          cy.findAllByLabelText("stateful-form-label-wrapper").each(
            ($el, i) => {
              cy.wrap($el)
                .invoke("css", "width")
                .then((width) => {
                  const w = width as unknown as string;
                  if (i < 2) {
                    expect(parseFloat(w)).to.be.closeTo(100, 6);
                  } else {
                    expect(parseFloat(w)).to.be.closeTo(200, 12);
                  }
                });
            }
          );
        });
      });
    });

    context("labelGap", () => {
      context("when given 30px", () => {
        const INPUT_WITH_LABEL_POSITION_AND_GAP: FormFieldGroup[] =
          ALL_INPUT.map((group) =>
            Array.isArray(group)
              ? group.map((item) => ({
                  ...item,
                  labelPosition: "left",
                  labelGap: 30,
                }))
              : {
                  ...group,
                  labelPosition: "left",
                  labelGap: 30,
                }
          );

        it("should render with 30px width", () => {
          cy.mount(
            <StatefulForm
              fields={INPUT_WITH_LABEL_POSITION_AND_GAP}
              formValues={allValue}
              mode="onChange"
            />
          );

          cy.findAllByLabelText("field-lane-wrapper")
            .should("have.length", 22)
            .each(($el) => {
              cy.wrap($el).should("have.css", "gap", "30px");
            });
          cy.findAllByLabelText("file-drop-box-container")
            .should("have.length", 1)
            .each(($el) => {
              cy.wrap($el).should("have.css", "gap", "30px");
            });
        });
      });
    });
  });

  context("asterisk", () => {
    context("when given required", () => {
      it("should render asterisk", () => {
        cy.mount(
          <StatefulForm
            fields={ALL_INPUT}
            formValues={allValue}
            mode="onChange"
          />
        );

        const inputWithRequired = flattenFields(ALL_INPUT).filter(
          (props) => props.required
        );

        cy.findAllByLabelText("stateful-form-label-asterisk").should(
          "have.length",
          inputWithRequired.length
        );
      });
    });
  });

  context("pinbox", () => {
    const pinboxSchema = z.object({
      pin: z.string().min(4, "Pinbox does not follow the acceptable format"),
    });

    const FIELDS: FormFieldGroup[] = [
      {
        name: "pin",
        title: "Pin",
        type: "pin",
        required: false,
        helper: "This pinbox allows you to enter your PIN code.",
        pinboxProps: {
          parts: PARTS_INPUT,
        },
      },
    ];

    function PinboxProduct() {
      const [state, setState] = useState({ pin: "" });
      return (
        <StatefulForm
          validationSchema={pinboxSchema}
          onChange={({ currentState }) => setState(currentState)}
          fields={FIELDS}
          formValues={state}
        />
      );
    }

    context("validation error", () => {
      context("when pressing 2 character (not eligible)", () => {
        it("should not show an error", () => {
          cy.mount(<PinboxProduct />);
          cy.findAllByRole("textbox").eq(1).type("23");
          cy.findByText("Pinbox does not follow the acceptable format").should(
            "not.exist"
          );
        });

        context("when blurring from the input", () => {
          it("should displaying an error", () => {
            cy.mount(<PinboxProduct />);
            cy.findAllByRole("textbox").eq(1).type("23");
            cy.findByText(
              "Pinbox does not follow the acceptable format"
            ).should("not.exist");
            cy.get("body").click("top");
            cy.wait(200);
            cy.findByText(
              "Pinbox does not follow the acceptable format"
            ).should("exist");
          });
        });
      });
    });
  });

  context("button", () => {
    context("when given an onClick", () => {
      context("when clicking", () => {
        it("renders the callback from top-level", () => {
          cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
          });

          cy.mount(
            <StatefulForm
              fields={[
                {
                  name: "button",
                  title: "Button",
                  type: "button",
                  onClick: () =>
                    console.log("this is callback from the top level"),
                },
              ]}
              formValues={{}}
              mode="onChange"
            />
          );

          cy.findByRole("button").eq(0).click();

          cy.get("@consoleLog").should(
            "have.been.calledWith",
            "this is callback from the top level"
          );
        });
      });

      context("when given a buttonProps.onClick", () => {
        context("when clicking", () => {
          it("renders the callback from buttonProps instead", () => {
            cy.window().then((win) => {
              cy.spy(win.console, "log").as("consoleLog");
            });

            cy.mount(
              <StatefulForm
                fields={[
                  {
                    name: "button",
                    title: "Button",
                    type: "button",
                    onClick: () =>
                      console.log("this is callback from the top level"),
                    buttonProps: {
                      onClick: () =>
                        console.log("this is callback from the specific level"),
                    },
                  },
                ]}
                formValues={{}}
                mode="onChange"
              />
            );

            cy.findByRole("button").eq(0).click();

            cy.get("@consoleLog").should(
              "have.been.calledWith",
              "this is callback from the specific level"
            );
          });
        });
      });
    });
  });

  context("when array of array", () => {
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

    context("when given without title", () => {
      const FIELDS_WITHOUT_TITLE: FormFieldGroup[] = [
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
            type: "text",
            required: false,
            placeholder: "Enter last name",
          },
          {
            name: "phone",
            type: "phone",
            required: false,
            placeholder: "Enter phone number",
          },
          {
            name: "combo",
            type: "combo",
            required: false,
            placeholder: "Select a fruit...",
            comboboxProps: {
              options: [],
            },
          },
          {
            name: "date",
            type: "date",
            required: false,
            placeholder: "Select a date",
          },
          {
            name: "capsule",
            type: "capsule",
            required: false,
            capsuleProps: {
              tabs: CAPSULE_TABS,
            },
          },
          {
            name: "button",
            title: "Button",
            type: "button",
          },
        ],
      ];

      it("should not break the height", () => {
        cy.viewport(1000, 900);
        cy.mount(
          <StatefulForm
            fields={FIELDS_WITHOUT_TITLE}
            formValues={value}
            mode="onChange"
          />
        );

        cy.findAllByLabelText("stateful-form-row")
          .eq(0)
          .within(() => {
            cy.contains("First Name").should("exist");
            cy.contains("Last Name").should("not.exist");
            cy.contains("Phone").should("not.exist");
            cy.contains("Combo").should("not.exist");
          })
          .should("have.css", "height", "60px");

        cy.get("#textbox-first_name")
          .parent()
          .parent()
          .should("have.css", "height", "60px");
        cy.get("#textbox-last_name")
          .parent()
          .parent()
          .should("have.css", "height", "60px");
        cy.get("#phonebox-phone")
          .parent()
          .parent()
          .parent()
          .should("have.css", "height", "60px");
        cy.get("#capsule-capsule")
          .parent()
          .parent()
          .parent()
          .should("have.css", "height", "60px");
        cy.get("#combobox-combo")
          .parent()
          .parent()
          .parent()
          .should("have.css", "height", "60px");
        cy.get("#datebox-date")
          .parent()
          .parent()
          .parent()
          .should("have.css", "height", "60px");
        cy.findAllByRole("button")
          .eq(1)
          .parent()
          .should("have.css", "margin-top", "26px");
      });
    });
  });

  context("id", () => {
    it("renders each field with a proper and unique ID", () => {
      cy.mount(
        <StatefulForm
          fields={ALL_INPUT}
          formValues={allValue}
          mode="onChange"
        />
      );

      flattenFields(ALL_INPUT).map((field) => {
        if (field.type === "frame" || field.type === "chips") {
          return;
        } else if (field.type === "radio") {
          cy.get(`#radio-value-radio`).should("exist");
        } else {
          const prefix =
            TYPE_TO_ID_PREFIX[field.type] ??
            field.type.replace(/\s+/g, "_").toLowerCase();
          const expectedId = field.name
            ? `${prefix}-${field.name.replace(/\s+/g, "_").toLowerCase()}`
            : prefix;

          cy.get(`#${expectedId}`).should("exist");
        }
      });
    });

    context("when given with non-ASCII IDs", () => {
      const FIELDS_NOT_NORMAL_ASCII: FormFieldGroup[] = [
        {
          name: "text",
          title: "Text",
          type: "text",
          required: true,
          placeholder: "Enter text",
          id: "field-text-📝 hello world",
        },
        {
          name: "email",
          title: "Email",
          type: "email",
          required: false,
          placeholder: "Enter email address",
          id: "field-email-📧 123!",
        },
        {
          name: "time",
          title: "Time",
          type: "time",
          required: false,
          placeholder: "Enter time",
          id: "field-time-⏰ something",
        },
        {
          name: "number",
          title: "Number",
          type: "number",
          required: false,
          placeholder: "Enter number",
          id: "field-number-🔢 test id",
        },
        {
          name: "password",
          title: "Password",
          type: "password",
          required: false,
          placeholder: "Enter password",
          id: "field-password-🔑 secret💡",
        },
        {
          name: "textarea",
          title: "Textarea",
          type: "textarea",
          rows: 3,
          required: false,
          placeholder: "Enter text here",
          id: "field-textarea-📝 multi words!",
        },
        {
          name: "check",
          placeholder: "Check",
          type: "checkbox",
          required: false,
          id: "field-check-☑️ yes/no?",
        },
        {
          name: "color",
          title: "Color",
          type: "color",
          required: false,
          placeholder: "Enter the color here",
          id: "field-color-🎨 rainbow 🌈",
        },
        {
          name: "combo",
          title: "Combo",
          type: "combo",
          required: false,
          placeholder: "Select a fruit...",
          comboboxProps: { options: FRUIT_OPTIONS },
          id: "field-combo-🍎 choose one",
        },
        {
          name: "date",
          title: "Date",
          type: "date",
          required: false,
          placeholder: "Select a date",
          dateProps: { monthNames: MONTH_NAMES },
          id: "field-date-📅 01/01/2026",
        },
        {
          name: "file_drop_box",
          title: "File Drop Box",
          type: "file_drop_box",
          required: false,
          id: "field-file_drop_box-📂 drop here",
        },
        {
          name: "file",
          title: "File",
          type: "file",
          required: false,
          id: "field-file-📄 upload file!",
        },
        {
          name: "image",
          title: "Image",
          type: "image",
          required: false,
          id: "field-image-🖼️ my image",
        },
        {
          name: "money",
          title: "Money",
          type: "money",
          required: false,
          placeholder: "Enter amount",
          id: "field-money-💰 $1000",
        },
        {
          name: "phone",
          title: "Phone",
          type: "phone",
          required: false,
          placeholder: "Enter phone number",
          id: "field-phone-📞 askdaosdk",
        },
        {
          name: "signature",
          title: "Signature",
          type: "signbox",
          required: false,
          id: "field-signature-✍️ sign here!",
        },
      ];

      it("renders sanitized ASCII-only IDs for input elements", () => {
        cy.mount(
          <StatefulForm
            fields={FIELDS_NOT_NORMAL_ASCII}
            formValues={allValue}
            mode="onChange"
          />
        );

        const sanitized = flattenFields(FIELDS_NOT_NORMAL_ASCII).map((field) =>
          StatefulForm.sanitizeId({ id: field.id })
        );

        const expected = [
          "field-text-_hello_world",
          "field-email-_123",
          "field-time-_something",
          "field-number-_test_id",
          "field-password-_secret",
          "field-textarea-_multi_words",
          "field-check-_yesno",
          "field-color-_rainbow_",
          "field-combo-_choose_one",
          "field-date-_01012026",
          "field-file_drop_box-_drop_here",
          "field-file-_upload_file",
          "field-image-_my_image",
          "field-money-_1000",
          "field-phone-_askdaosdk",
          "field-signature-_sign_here",
        ];

        sanitized.map((result, i) => {
          expect(result).to.equal(expected[i]);
        });
      });
    });
  });

  context("with type custom", () => {
    function StatefulFormCustom() {
      const [value, setValue] = useState({
        first_name: "",
        access: false,
        files: [],
      });

      const [isFormValid, setIsFormValid] = useState(false);

      const onFileDropped = async ({
        error,
        files,
        setProgressLabel,
        succeed,
      }: OnFileDroppedFunction) => {
        const file = files[0];
        setValue((prev) => ({ ...prev, files: [...prev.files, file] }));
        setProgressLabel(`Uploading ${file.name}`);

        return new Promise<void>((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 20;

            if (progress >= 100) {
              clearInterval(interval);
              if (file === null) {
                error(file, `file ${file.name} is not uploaded`);
              } else {
                succeed(file);
              }
              setProgressLabel(`Uploaded ${files[0].name}`);
              resolve();
            }
          }, 300);
        });
      };

      const onComplete = async ({
        failedFiles,
        setProgressLabel,
        succeedFiles,
        hideProgressLabel,
        showUploaderForm,
      }: OnCompleteFunction) => {
        console.log(succeedFiles, "This is succeedFiles");
        console.log(failedFiles, "This is failedFiles");
        await setProgressLabel(
          `Upload complete! Success: ${succeedFiles.length}, Failed: ${failedFiles.length}`
        );
        await hideProgressLabel();
        await showUploaderForm();
      };

      const CUSTOM_FIELDS: FormFieldGroup[] = [
        {
          name: "first_name",
          title: "First Name",
          type: "text",
          required: true,
          placeholder: "Enter first name",
        },
        {
          name: "boxbar",
          type: "custom",
          render: (
            <Boxbar>
              {BADGE_OPTIONS_FULL.map((badge) => (
                <Badge
                  styles={{
                    self: css`
                      width: 100%;
                      max-width: 100px;

                      &:hover {
                        border-color: #4cbbf7;
                        cursor: pointer;
                        transition: all 0.5s ease-in-out;
                      }
                    `,
                  }}
                  key={badge.id}
                  caption={badge.caption}
                  withCircle
                />
              ))}
            </Boxbar>
          ),
        },
        {
          name: "files",
          type: "custom",
          render: (
            <FileDropBox
              label="Files"
              onFileDropped={onFileDropped}
              onComplete={onComplete}
            >
              <Table
                styles={{
                  containerStyle: css`
                    ${value.files.length === 0 &&
                    css`
                      display: none;
                    `}
                  `,
                }}
                columns={[
                  {
                    id: "file_name",
                    caption: "File Name",
                  },
                  {
                    id: "date",
                    caption: "Date",
                  },
                ]}
              >
                {value.files.map((props) => (
                  <Table.Row
                    actions={(id) => [
                      {
                        caption: "Delete",
                        icon: { image: RiDeleteBin2Fill },
                        onClick: () => {
                          if (id) {
                            setValue((prev) => ({
                              ...prev,
                              files: prev.files.filter(
                                (val) => val.name !== id
                              ),
                            }));
                          }
                        },
                      },
                    ]}
                    rowId={props.name}
                    content={[
                      props.name,
                      new Date(props.lastModified).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      }),
                    ]}
                  />
                ))}
              </Table>
            </FileDropBox>
          ),
        },
        {
          name: "access",
          type: "checkbox",
          placeholder: "Access",
          required: false,
        },
        {
          name: "verify",
          title: "Verify",
          type: "button",
          required: false,
          disabled: !isFormValid,
          rowJustifyPosition: "flex-end",
        },
      ];

      const customSchema = z.object({
        first_name: z
          .string()
          .min(3, "First name must be at least 3 characters long"),
        access: z.boolean().refine((val) => val === true, {
          message: "Access must be true",
        }),
        files: z
          .array(
            z.instanceof(File).refine(
              (file) => {
                if (!file) return false;

                const allowedExtensions = ["png", "jpg", "jpeg", "gif"];
                const ext = file.name.split(".").pop()?.toLowerCase();

                const isImage =
                  (file.type && file.type.startsWith("image/")) ||
                  (ext ? allowedExtensions.includes(ext) : false);

                if (!isImage) return false;

                if (file.size > 5 * 1024 * 1024) return false;

                return true;
              },
              {
                message:
                  "File must be an image (png, jpg, jpeg, gif) and ≤ 5 MB",
              }
            )
          )
          .min(1, "At least one file must be selected"),
      });

      return (
        <StatefulForm
          fields={CUSTOM_FIELDS}
          formValues={value}
          validationSchema={customSchema}
          onValidityChange={setIsFormValid}
          onChange={({ currentState }) =>
            setValue((prev) => ({ ...prev, ...currentState }))
          }
          mode="onChange"
        />
      );
    }

    it("should render custom renderer", () => {
      cy.mount(<StatefulFormCustom />);

      cy.findByLabelText("boxbar-toggle").click();

      BADGE_OPTIONS_FULL.map((data) => {
        cy.findByText(data.caption).should("exist");
      });
    });

    context("when given validationSchema", () => {
      it("should synchronize values after all fields valid", () => {
        cy.mount(<StatefulFormCustom />);
        cy.findAllByRole("button").eq(1).and("be.disabled");

        cy.get("#textbox-first_name").type("Alim Naufal");
        cy.findByLabelText("file-drop-box-area").selectFile(
          [
            "test/fixtures/test-images/sample-1.jpg",
            "test/fixtures/test-images/sample-2.jpg",
          ],
          {
            action: "drag-drop",
            force: true,
          }
        );
        cy.wait(1000);

        cy.findByLabelText("file-drop-box-area").then(($input) => {
          cy.spy($input[0], "click").as("fileClick");
        });
        cy.findByText("sample-1.jpg").should("be.visible").click();
        cy.findByText("sample-2.jpg").should("be.visible").click();
        cy.findByText("Access").should("be.visible").click();

        cy.findAllByRole("button").eq(1).and("not.be.disabled");
      });
    });
  });

  context("helper", () => {
    const FIELD_HELPERS: Record<string, string> = {
      text: "Enter any text value.",
      email: "Enter a valid email address.",
      number: "Enter a numeric value.",
      password: "Enter a secure password.",
      textarea: "Enter a longer message.",
      time: "Select a time value.",
      pin: "Enter your PIN code.",
      checkbox: "Toggle the checkbox.",
      radio: "Select one option.",
      color: "Choose a color.",
      combo: "Select an option from the list.",
      date: "Select a date.",
      file_drop_box: "Drag and drop a file here.",
      file: "Upload a file.",
      image: "Upload an image.",
      money: "Enter a monetary value.",
      phone: "Enter a phone number.",
      signbox: "Provide your signature.",
      rating: "Rate the item.",
      thumbfield: "Upload or select a thumbnail.",
      toggle: "Toggle the switch.",
      chips: "Select one or more chips.",
      capsule: "Choose a monetary option.",
    };

    const INPUT_WITH_HELPER = ALL_INPUT.map((group) =>
      Array.isArray(group)
        ? group.map((item) => ({
            ...item,
            helper: FIELD_HELPERS[item.type],
          }))
        : {
            ...group,
            helper: FIELD_HELPERS[group.type],
          }
    );

    const FLAT_INPUT = INPUT_WITH_HELPER.flatMap((props) => props);

    it("renders with tooltip", () => {
      cy.mount(
        <StatefulForm
          fields={INPUT_WITH_HELPER}
          formValues={allValue}
          mode="onChange"
        />
      );

      cy.findAllByLabelText("tooltip-trigger")
        .should("have.length", FLAT_INPUT.length)
        .each(($el, index) => {
          cy.wrap($el).trigger("mouseover");

          cy.findByText(String(FLAT_INPUT[index].helper));
        });
    });
  });

  context("with style", () => {
    context("when given background wheat", () => {
      const FIELD_STYLES = {
        text: {
          textboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        email: {
          textboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        number: {
          textboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        password: {
          textboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        textarea: {
          textareaProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        time: {
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
        checkbox: {
          checkboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        color: {
          colorboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        combo: {
          comboboxProps: {
            styles: {
              selectboxStyle: css`
                background-color: wheat;
              `,
            },
          },
        },
        date: {
          dateProps: {
            styles: {
              selectboxStyle: css`
                background-color: wheat;
              `,
            },
          },
        },
        file_drop_box: {
          fileDropBoxProps: {
            styles: {
              dragOverStyle: css`
                background-color: wheat;
              `,
            },
          },
        },
        file: {
          fileInputBoxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        image: {
          imageboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
        money: {
          moneyProps: {
            styles: {
              inputWrapperStyle: css`
                background-color: wheat;
              `,
            },
          },
        },
        phone: {
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
        signbox: {
          signboxProps: {
            styles: {
              self: css`
                background-color: wheat;
              `,
            },
          },
        },
      };

      const INPUT_WITH_STYLE = ALL_INPUT.map((group) =>
        Array.isArray(group)
          ? group.map((item) => ({
              ...item,
              ...FIELD_STYLES[item.type],
            }))
          : {
              ...group,
              ...FIELD_STYLES[group.type],
            }
      );

      it("renders with background wheat", () => {
        cy.mount(
          <StatefulForm
            fields={INPUT_WITH_STYLE}
            formValues={allValue}
            mode="onChange"
          />
        );

        const isFieldWithPlaceholder = (
          field: FormFieldGroup
        ): field is FormFieldProps & { placeholder: string } =>
          !Array.isArray(field) &&
          "placeholder" in field &&
          typeof field.placeholder === "string";

        const PLACEHOLDER_FIELDS = INPUT_WITH_STYLE.filter(
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

        cy.findAllByText(RADIO_FIELDS[0]["title"]).eq(0).should("be.visible");
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

        cy.findByText("Paid").should("have.css", "color", "rgb(17, 24, 39)");
        cy.findByText("Unpaid").should(
          "have.css",
          "color",
          "rgb(255, 255, 255)"
        );
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

        cy.findAllByText(CHECKBOX_TITLE_FIELDS[0]["title"])
          .eq(0)
          .should("be.visible");
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

        cy.findAllByText(CHECKBOX_TITLE_FIELDS[0]["placeholder"])
          .eq(0)
          .should("be.visible");
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

  context("with justifyContent", () => {
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
        rowJustifyPosition: "flex-end",
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

  context("with hidden", () => {
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
    context("when given all input elements", () => {
      it("should render input elements with sizing", () => {
        const INPUT_WITH_WIDTH = ALL_INPUT.map((group) =>
          Array.isArray(group)
            ? group.map((item) => ({ ...item, width: "50%" }))
            : { ...group, width: "50%" }
        );

        cy.mount(
          <StatefulForm
            fields={INPUT_WITH_WIDTH}
            formValues={allValue}
            mode="onChange"
          />
        );

        flattenFields(INPUT_WITH_WIDTH).forEach((prop) => {
          if (prop.name === "country_code") return;
          if (prop.name === "toggle") {
            cy.findByLabelText("toggle-row-wrapper").then(($el) => {
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
