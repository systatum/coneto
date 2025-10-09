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
        placeholder: "Enter first name",
        onChange: onChangeForm,
      },
      {
        name: "last_name",
        title: "Last Name",
        type: "text",
        required: false,
        placeholder: "Enter last name",
        onChange: onChangeForm,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: true,
        placeholder: "Enter email address",
        onChange: onChangeForm,
      },
      {
        name: "phone",
        title: "Phone Number",
        type: "phone",
        required: false,
        placeholder: "Enter phone number",
        onChange: onChangeForm,
      },
      {
        name: "note",
        title: "Note",
        type: "textarea",
        rows: 3,
        required: false,
        placeholder: "Add additional notes",
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
          <Button disabled={!isFormValid} type="submit">
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

    interface AllCaseValueProps {
      text: string;
      email: string;
      number: string;
      password: string;
      textarea: string;
      rating: string;
      check: boolean;
      chips: {
        searchText: string;
        selectedOptions: BadgeProps[];
      };
      color: string;
      combo: {
        text: string;
        value: number | string;
      };
      date: {
        text: string;
        value: number | string;
      };
      file_drop_box: File[];
      file: File | undefined;
      image: string;
      phone: string;
      thumb_field: boolean;
      togglebox: boolean;
      signature: string;
      country_code: typeof DEFAULT_COUNTRY_CODES;
    }

    const [value, setValue] = useState<AllCaseValueProps>({
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
      combo: {
        text: "",
        value: 0 as number | string,
      },
      date: {
        text: "",
        value: 0 as number | string,
      },
      file_drop_box: [] as File[],
      file: undefined,
      image: "",
      phone: "",
      thumb_field: null,
      togglebox: false,
      signature: "",
      country_code: DEFAULT_COUNTRY_CODES,
    });

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
      number: z
        .union([z.string(), z.number()])
        .refine((val) => val === "" || !isNaN(Number(val)), {
          message: "Number must be numeric",
        }),
      password: z.string().min(6, "Password must be at least 6 characters"),
      textarea: z.string().optional(),
      check: z.boolean().optional(),
      chips: z.object({
        searchText: z.string().optional(),
        selectedOptions: z.array(badgeSchema).optional(),
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
      file: z
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
      image: z.string().optional(),
      signature: z.string().min(1, "Signature is required"),
      phone: z.string().min(8, "Phone number must be 8 digits").optional(),
      rating: z.string().optional(),
      thumb_field: z.boolean().optional(),
      togglebox: z.boolean().optional(),
      country_code: z
        .object({
          id: z.string(),
          name: z.string(),
          flag: z.string(),
          code: z.string(),
        })
        .optional(),
    });

    const onChangeForm = (e?: StatefulOnChangeType, type?: string) => {
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
        let updatedValue:
          | string
          | boolean
          | number
          | CountryCodeProps
          | File
          | FileList = value;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
          updatedValue = target.checked;
          console.log(target.checked);
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
    console.log(value);

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

    const MONTH_NAMES = [
      { text: "JAN", value: 1 },
      { text: "FEB", value: 2 },
      { text: "MAR", value: 3 },
      { text: "APR", value: 4 },
      { text: "MAY", value: 5 },
      { text: "JUN", value: 6 },
      { text: "JUL", value: 7 },
      { text: "AUG", value: 8 },
      { text: "SEP", value: 9 },
      { text: "OCT", value: 10 },
      { text: "NOV", value: 11 },
      { text: "DEC", value: 12 },
    ];

    const FIELDS: FormFieldProps[] = [
      {
        name: "text",
        title: "Text",
        type: "text",
        required: true,
        placeholder: "Enter text",
        onChange: onChangeForm,
      },
      {
        name: "email",
        title: "Email",
        type: "email",
        required: false,
        placeholder: "Enter email address",
        onChange: onChangeForm,
      },
      {
        name: "number",
        title: "Number",
        type: "number",
        required: false,
        placeholder: "Enter number",
        onChange: onChangeForm,
      },
      {
        name: "password",
        title: "Password",
        type: "password",
        required: false,
        placeholder: "Enter password",
        onChange: onChangeForm,
      },
      {
        name: "textarea",
        title: "Textarea",
        type: "textarea",
        rows: 3,
        required: false,
        placeholder: "Enter text here",
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
        placeholder: "Enter the color here",
        onChange: onChangeForm,
      },
      {
        name: "combo",
        title: "Combo",
        type: "combo",
        required: false,
        placeholder: "Select a fruit...",
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
        placeholder: "Select a date",
        onChange: (e) => {
          onChangeForm(e, "date");
        },
        dateProps: {
          monthNames: MONTH_NAMES,
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
        fileInputBoxProps: {
          accept: "image/jpeg",
        },
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
        placeholder: "Enter amount",
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
        placeholder: "Enter phone number",
        onChange: onChangeForm,
      },
      {
        name: "country_code",
        title: "Country Code",
        type: "country_code",
        required: false,
        placeholder: "Enter country code",
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
        name: "rating",
        title: "Rating",
        type: "rating",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "thumb_field",
        title: "Thumb Field",
        type: "thumbfield",
        required: false,
        onChange: onChangeForm,
      },
      {
        name: "togglebox",
        title: "Togglebox",
        type: "toggle",
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
          chipsDrawerStyle: css`
            min-width: 250px;
          `,
          onOptionClicked: handleOptionClicked,
          selectedOptions: value.chips.selectedOptions,
          inputValue: value.chips.searchText,
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
          flexDirection: "column",
          gap: "0.5rem",
          paddingTop: "1rem",
          paddingBottom: "1rem",
          maxWidth: "500px",
        }}
      >
        <StatefulForm
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
