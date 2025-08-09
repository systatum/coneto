import { Meta, StoryObj } from "@storybook/react/";
import {
  StatefulForm,
  FormFieldProps,
  StatefulOnChangeType,
} from "./stateful-form";
import { ChangeEvent, useState } from "react";
import { COUNTRY_CODES } from "./../constants/countries";
import { z } from "zod";
import { Button } from "./button";
import {
  OnCompleteFunctionProps,
  OnFileDroppedFunctionProps,
} from "./file-drop-box";
import { BadgeProps } from "./badge";
import { ColorPickProps } from "./colorbox";
import { CountryCodeProps } from "./phonebox";
import { css } from "styled-components";

const meta: Meta<typeof StatefulForm> = {
  title: "Input Elements/StatefulForm",
  component: StatefulForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof StatefulForm>;

export const Default: Story = {
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
            }}
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
    );
  },
};

export const AllCase: Story = {
  render: () => {
    const DEFAULT_COUNTRY_CODES = COUNTRY_CODES.find(
      (data) => data.id === "US" || COUNTRY_CODES[206]
    );

    if (!DEFAULT_COUNTRY_CODES) {
      throw new Error("Default country code 'US' not found in COUNTRY_CODES.");
    }

    const FRUIT_OPTIONS = [
      { text: "Apple", value: 1 },
      { text: "Banana", value: 2 },
      { text: "Orange", value: 3 },
      { text: "Grape", value: 4 },
      { text: "Pineapple", value: 5 },
      { text: "Strawberry", value: 6 },
      { text: "Watermelon", value: 7 },
    ];

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

    const [value, setValue] = useState({
      text: "",
      email: "",
      number: "",
      password: "",
      textarea: "",
      check: false,
      chips: {
        search: "",
        name_tag: "",
        background_color: "",
        text_color: "",
        circle_color: "",
      },
      color: "",
      combo: {
        text: "",
        value: 0 as number | string,
      },
      date: {
        text: "",
        value: 0 as number | string,
      },
      file_drop_box: [] as File[],
      file: "",
      image: "",
      phone: "",
      signature: "",
      country_code: DEFAULT_COUNTRY_CODES,
    });

    const [selectedChips, setSelectedChips] = useState<number[]>([]);

    const handleOptionClicked = (val: BadgeProps) => {
      const valId = val.id ?? 0;

      const isAlreadySelected = selectedChips.some((data) => data === valId);

      if (isAlreadySelected) {
        setSelectedChips((prev) => prev.filter((data) => data !== valId));
      } else {
        setSelectedChips([...selectedChips, valId]);
      }
    };

    const schema = z.object({
      text: z.string().min(3, "Text must be at least 3 characters"),
      email: z.string().email("Please enter a valid email address"),
      number: z
        .union([z.string(), z.number()])
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Number must be numeric",
        }),
      password: z.string().min(6, "Password must be at least 6 characters"),
      textarea: z.string().optional(),
      check: z.boolean().optional(),
      chips: z.object({
        search: z.string().optional(),
        name_tag: z.string().optional(),
        background_color: z.string().optional(),
        text_color: z.string().optional(),
        circle_color: z.string().optional(),
      }),
      color: z.string().optional(),
      combo: z
        .object({
          value: z.union([z.number(), z.string()]).optional(),
          text: z.string().optional(),
        })
        .optional(),
      date: z
        .object({
          value: z.union([z.number(), z.string()]).optional(),
          text: z.string().optional(),
        })
        .optional(),
      file_drop_box: z.array(z.instanceof(File)).optional(),
      file: z.string().optional(),
      image: z.string().optional(),
      signature: z.string().min(1, "Signature is required"),
      phone: z.string().min(8, "Phone number must be 8 digits").optional(),
      country_code: z
        .object({
          id: z.string(),
          name: z.string(),
          flag: z.string(),
          code: z.string(),
        })
        .optional(),
    });

    const onChangeForm = (
      e?: StatefulOnChangeType,
      type?: string | ColorPickProps
    ) => {
      if (e instanceof FileList) {
        const file = e[0];
        if (file && typeof type === "string") {
          setValue((prev) => ({ ...prev, [type]: file }));
        }
        return;
      }

      if (
        e &&
        typeof e === "object" &&
        "value" in e &&
        "text" in e &&
        typeof type === "string"
      ) {
        const isOptionsProps =
          (typeof e.value === "string" || typeof e.value === "number") &&
          typeof e.text === "string";

        if (isOptionsProps) {
          setValue((prev) => ({ ...prev, [type]: e }));
        }
        return;
      }

      if (e && "target" in e) {
        const target = e.target;
        const { name, value } = target;

        let updatedValue: string | boolean | number | CountryCodeProps = value;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
          updatedValue = target.checked;
        }

        if (type === "chips") {
          setValue((prev) => ({
            ...prev,
            chips: {
              ...prev.chips,
              [name]: updatedValue,
            },
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
    }: OnFileDroppedFunctionProps) => {
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
    }: OnCompleteFunctionProps) => {
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

    const FIELDS: FormFieldProps[] = [
      {
        name: "text",
        title: "Text",
        type: "text",
        required: true,
        onChange: onChangeForm,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "number",
        title: "Number",
        type: "number",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "password",
        title: "Password",
        type: "password",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "textarea",
        title: "Textarea",
        type: "textarea",
        rows: 3,
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "check",
        title: "Check",
        type: "checkbox",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "color",
        title: "Color",
        type: "color",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "combo",
        title: "Combo",
        type: "combo",
        required: false,
        onChange: (e) => {
          onChangeForm(e, "combo");
        },
        comboboxProps: {
          options: FRUIT_OPTIONS,
        },
      },
      {
        name: "date",
        title: "Date",
        type: "date",
        required: false,
        onChange: (e) => {
          onChangeForm(e, "date");
        },
      },
      {
        name: "file_drop_box",
        title: "File Drop Box",
        type: "file_drop_box",
        required: false,
        fileDropBoxProps: {
          onComplete: onComplete,
          onFileDropped: onFileDropped,
        },
      },
      {
        name: "file",
        title: "File",
        type: "file",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "image",
        title: "Image",
        type: "image",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "money",
        title: "Money",
        type: "money",
        required: false,
        onChange: onChangeForm,
        moneyProps: {
          separator: "dot",
        },
      },
      {
        name: "phone",
        title: "Phone",
        type: "phone",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "country_code",
        title: "Country Code",
        type: "country_code",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "signature",
        title: "Signature",
        type: "signbox",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "chips",
        title: "Chips",
        type: "chips",
        required: false,
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
          chipsContainerStyle: css`
            max-width: 250px;
          `,
          onOptionClicked: handleOptionClicked,
          selectedOptions: selectedChips,
          inputValue: value.chips,
          creatable: true,
        },
        onChange: onChangeForm,
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
          fields={FIELDS}
          formValues={value}
          validationSchema={schema}
          mode="onChange"
        />
      </div>
    );
  },
};
