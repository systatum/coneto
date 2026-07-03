import { useForm, UseFormProps, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { ZodTypeAny, TypeOf, ZodObject } from "zod";
import React, {
  ChangeEvent,
  Fragment,
  LabelHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { Phonebox, PhoneboxCountryCode, PhoneboxProps } from "./phonebox";
import { Checkbox, CheckboxProps } from "./checkbox";
import { Textbox, TextboxProps } from "./textbox";
import { Colorbox, ColorboxProps } from "./colorbox";
import { FileDropBox, FileDropBoxProps } from "./file-drop-box";
import { FileInputBox, FileInputBoxProps } from "./file-input-box";
import { Imagebox, ImageboxProps } from "./imagebox";
import { Moneybox, MoneyboxProps } from "./moneybox";
import { Datebox, DateboxProps } from "./datebox";
import { Combobox, ComboboxProps } from "./combobox";
import { Chips, ChipsProps } from "./chips";
import { Signbox, SignboxProps } from "./signbox";
import { Textarea, TextareaProps } from "./textarea";
import styled, { css, CSSProp } from "styled-components";
import { Rating, RatingProps } from "./rating";
import { ThumbField, ThumbFieldProps } from "./thumb-field";
import { Toggle, ToggleProps } from "./toggle";
import { Capsule, CapsuleProps } from "./capsule";
import { Timebox, TimeboxProps } from "./timebox";
import { Button, ButtonProps } from "./button";
import { Radio, RadioProps } from "./radio";
import { Helper } from "./helper";
import { FigureProps } from "./figure";
import { Pinbox, PinboxProps } from "./pinbox";
import { FieldLaneProps } from "./field-lane";
import { Frame, FrameProps } from "./frame";
import { applyClassName } from "./../constants/classname";
import { useTheme, StatefulFormThemeConfig } from "./../theme";

export type StatefulOnChangeType =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | {
      target: {
        name: string;
        value: FormValueType;
      };
    };

export type FormValueType =
  | string
  | number
  | boolean
  | File
  | FileList
  | File[]
  | null
  | undefined
  | PhoneboxCountryCode
  | string[]
  | number[];

export const FormFieldType = {
  Text: "text",
  Message: "message",
  Number: "number",
  Email: "email",
  Password: "password",
  Textarea: "textarea",
  Checkbox: "checkbox",
  Radio: "radio",
  Phone: "phone",
  Color: "color",
  FileDropBox: "file_drop_box",
  File: "file",
  Image: "image",
  Signbox: "signbox",
  Money: "money",
  Date: "date",
  Combo: "combo",
  Chips: "chips",
  Rating: "rating",
  Thumbfield: "thumbfield",
  Toggle: "toggle",
  Capsule: "capsule",
  Time: "time",
  Button: "button",
  Pin: "pin",
  Frame: "frame",
  Custom: "custom",
} as const;

export type FormFieldType = (typeof FormFieldType)[keyof typeof FormFieldType];

export const StatefulFormMode = {
  OnChange: "onChange",
  OnBlur: "onBlur",
  OnSubmit: "onSubmit",
} as const;

export type StatefulFormMode =
  (typeof StatefulFormMode)[keyof typeof StatefulFormMode];

export interface StatefulFormProps<Z extends ZodTypeAny> {
  fields: FormFieldGroup[];
  formValues: TypeOf<Z>;
  validationSchema?: Z;
  mode?: StatefulFormMode;
  onValidityChange?: (e: boolean) => void;
  labelSize?: string;
  fieldSize?: string;
  onChange?: (args: { currentState: any }) => void;
  autoFocusField?: string;
  styles?: StatefulFormStyles;
  disabled?: boolean;
  mobile?: boolean;
  className?: string;
  id?: string;
}

export interface StatefulFormStyles {
  containerStyle?: CSSProp;
  rowStyle?: CSSProp;
  frameContainerStyle?: CSSProp;
  frameTitleStyle?: CSSProp;
}

export type FormFieldGroup = FormFieldProps | FormFieldProps[];

export const FormFieldRowJustifyPosition = {
  Center: "center",
  Start: "start",
  End: "end",
  SpaceBetween: "space-between",
} as const;

export type FormFieldRowJustifyPosition =
  (typeof FormFieldRowJustifyPosition)[keyof typeof FormFieldRowJustifyPosition];

export const FormFieldRowItemsAligment = {
  Center: "center",
  Start: "start",
  End: "end",
  Stretch: "stretch",
} as const;

export type FormFieldRowItemsAligment =
  (typeof FormFieldRowItemsAligment)[keyof typeof FormFieldRowItemsAligment];

export interface FormFieldProps {
  name: string;
  id?: string;
  className?: string;
  title?: string;
  helper?: string;
  required?: boolean;
  type?: FormFieldType;
  placeholder?: string;
  render?: ReactNode;
  hidden?: boolean;
  rows?: number;
  width?: string;
  rowStyle?: CSSProp;
  fields?: FormFieldGroup[];
  icon?: FigureProps["image"];
  labelPosition?: FieldLaneProps["labelPosition"];
  labelGap?: FieldLaneProps["labelGap"];
  labelWidth?: FieldLaneProps["labelWidth"];
  disabled?: boolean;
  rowJustifyPosition?: FormFieldRowJustifyPosition;
  rowItemsAlignment?: FormFieldRowItemsAligment;
  onChange?: (e?: StatefulOnChangeType) => void;
  onClick?: (e?: React.MouseEvent) => void;
  textbox?: TextboxProps;
  textarea?: TextareaProps;
  checkbox?: CheckboxProps;
  radio?: RadioProps;
  phonebox?: PhoneboxProps;
  colorbox?: ColorboxProps;
  money?: MoneyboxProps;
  fileDropBox?: FileDropBoxProps;
  fileInputBox?: FileInputBoxProps;
  imagebox?: ImageboxProps;
  signbox?: SignboxProps;
  date?: DateboxProps;
  combobox?: ComboboxProps;
  chips?: ChipsProps;
  rating?: RatingProps;
  thumbField?: ThumbFieldProps;
  toggle?: ToggleProps;
  capsule?: CapsuleProps;
  timebox?: TimeboxProps;
  button?: ButtonProps;
  pinbox?: PinboxProps;
  frame?: FrameProps;
}

function StatefulForm<Z extends ZodTypeAny>({
  fields,
  validationSchema,
  formValues,
  mode = "onChange",
  onValidityChange,
  fieldSize,
  labelSize,
  onChange,
  styles,
  autoFocusField,
  disabled,
  mobile,
  className,
  id,
}: StatefulFormProps<Z>) {
  const handleFieldChange = (name: keyof TypeOf<Z>, value: FormValueType) => {
    if (disabled) return;
    onChange?.({ currentState: { [name]: value } });
  };

  const finalSchema = getSchemaForVisibleFields(validationSchema, fields);

  const formConfig: UseFormProps<TypeOf<Z>> = {
    mode,
    defaultValues: formValues,
  };

  if (validationSchema) {
    formConfig.resolver = zodResolver(finalSchema);
  }

  const {
    register,
    control,
    setValue,
    formState: { errors, touchedFields, isValid },
  } = useForm(formConfig) as ReturnType<typeof useForm<TypeOf<Z>>>;

  const customFieldNames = fields
    .flat()
    .filter((field) => field.type === "custom")
    .map((field) => field.name);

  const customValues = customFieldNames.map((name) => formValues[name]);

  useEffect(() => {
    customFieldNames.map((name) => {
      setValue(name as any, formValues[name as any], {
        shouldValidate: true,
        shouldTouch: true,
        shouldDirty: true,
      });
    });
  }, [JSON.stringify(customValues), setValue]);

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid, onValidityChange]);

  const shouldShowError = (name: keyof TypeOf<Z>): boolean => {
    const fieldConfig = findField(fields, name as string);

    if (
      !fieldConfig ||
      fieldConfig.type === "custom" ||
      fieldConfig.type === "button" ||
      fieldConfig.hidden
    ) {
      return false;
    }

    const value = formValues[name];
    const touched = touchedFields[name];
    const error = errors[name];

    const isFile = (val: unknown): val is File => val instanceof File;

    const isFileArray = (val: unknown): val is File[] =>
      Array.isArray(val) && val.every((v) => v instanceof File);

    const hasErrorMessage = (err: unknown): boolean => {
      if (!err || typeof err !== "object") return false;

      if (typeof (err as any)?.message === "string") return true;

      if (typeof (err as any)?.text?.message === "string") return true;

      if (Array.isArray(err)) {
        return err.some((item) => hasErrorMessage(item));
      }

      return Object.values(err).some((v) => hasErrorMessage(v));
    };

    if (typeof value === "string") {
      return value.length > 0 && !!touched && hasErrorMessage(error);
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return !!touched && hasErrorMessage(error);
    }

    if (isFile(value) || isFileArray(value)) {
      return !!touched && hasErrorMessage(error);
    }

    if (typeof value === "object" && value !== null) {
      return !!touched && hasErrorMessage(error);
    }

    return !!touched && hasErrorMessage(error);
  };

  function findField(
    fields: FormFieldGroup[],
    name: string
  ): FormFieldProps | undefined {
    for (const f of fields) {
      if (Array.isArray(f)) {
        const found = findField(f, name);
        if (found) return found;
      } else if (f.type === "frame" && f.fields) {
        const found = findField(f.fields, name);
        if (found) return found;
      } else if (f.name === name) {
        return f;
      }
    }
    return undefined;
  }

  return (
    <FormFields
      id={id}
      mobile={mobile}
      className={className}
      labelSize={labelSize}
      fieldSize={fieldSize}
      control={control}
      fields={fields}
      disabled={disabled}
      formValues={formValues}
      register={register}
      errors={errors}
      setValue={setValue}
      onChange={handleFieldChange}
      autoFocusField={autoFocusField}
      styles={styles}
      shouldShowError={shouldShowError}
    />
  );
}

function unwrapSchema(schema: ZodTypeAny): ZodTypeAny {
  if (schema._def.typeName === "ZodEffects") {
    return unwrapSchema(schema._def.schema);
  }
  return schema;
}

function getSchemaForVisibleFields<Z extends ZodTypeAny>(
  validationSchema?: Z,
  fields?: FormFieldGroup[]
) {
  if (!validationSchema) return undefined;

  const baseSchema = unwrapSchema(validationSchema);

  if (baseSchema._def.typeName !== "ZodObject") {
    throw new Error("StatefulForm only supports Zod object schemas");
  }

  const objSchema = baseSchema as ZodObject<any>;

  function flattenFields(fields: FormFieldGroup[]): FormFieldProps[] {
    return fields.flatMap((f) => {
      if (Array.isArray(f)) return flattenFields(f);

      if (f.type === "frame" && f.fields) {
        return flattenFields(f.fields as FormFieldGroup[]);
      }

      return [f];
    });
  }

  const flatFields: FormFieldProps[] = flattenFields(fields);

  const newShape = Object.fromEntries(
    flatFields.map((field) => {
      const key = field.name;
      const originalFieldSchema = objSchema.shape[key];

      if (!originalFieldSchema) return [key, z.any()];
      return [
        key,
        field.hidden || field.type === "custom"
          ? originalFieldSchema.optional()
          : originalFieldSchema,
      ];
    })
  );

  return z.object(newShape);
}

interface FormFieldsProps<T extends FieldValues> {
  fields: FormFieldGroup[];
  formValues: T;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  shouldShowError: (name: string) => boolean;
  control: Control<T>;
  labelSize?: string;
  fieldSize?: string;
  setValue?: UseFormSetValue<T>;
  onChange?: (name: keyof T, value: FormValueType) => void;
  autoFocusField?: string;
  styles?: StatefulFormStyles;
  rowWithFrame?: boolean;
  disabled?: boolean;
  mobile?: boolean;
  className?: string;
  id?: string;
}

function FormFields<T extends FieldValues>({
  fields,
  formValues,
  register,
  errors,
  shouldShowError,
  control,
  fieldSize,
  labelSize,
  setValue,
  onChange,
  styles,
  autoFocusField,
  rowWithFrame,
  disabled,
  mobile,
  className,
  id,
}: FormFieldsProps<T>) {
  const { currentTheme } = useTheme();
  const statefulFormTheme = currentTheme?.statefulForm;
  const pinboxTheme = currentTheme?.pinbox;
  const phoneboxTheme = currentTheme?.phonebox;

  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = refs.current[autoFocusField];
      el?.focus?.();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ContainerFormField
      id={id}
      className={applyClassName("stateful-form", className)}
      $style={styles?.containerStyle}
    >
      {fields.map((group: FormFieldGroup, indexGroup: number) => {
        const visibleFields = (Array.isArray(group) ? group : [group]).filter(
          (field) => !field.hidden
        );

        if (visibleFields.length === 0) {
          return;
        }

        const rowJustifiedContent = visibleFields.find(
          (f) => f.rowJustifyPosition
        )?.rowJustifyPosition;

        const rowAlignedItem = visibleFields.find(
          (f) => f.rowItemsAlignment
        )?.rowItemsAlignment;

        const rowStyleItem = visibleFields.find((f) => f.rowStyle)?.rowStyle;

        const nonButtonFields = visibleFields.filter(
          (f) => f.type !== "button"
        );
        const hasFieldTitle = nonButtonFields.some((f) => f.title);

        const mobileInputStyle =
          mobile &&
          css`
            background-color: transparent;
            border: transparent;
            padding: 0px;
            &:focus {
              border: transparent;
              box-shadow: none;
            }

            &:-webkit-autofill,
            &:-webkit-autofill:hover,
            &:-webkit-autofill:focus,
            &:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 1000px transparent inset;
              box-shadow: 0 0 0 1000px transparent inset;

              background-color: transparent !important;
              transition: background-color 9999s ease-in-out 0s;
            }
          `;

        const mobileBodyStyle =
          mobile &&
          css`
            gap: 0px;
            justify-content: space-between;
            align-items: center;
          `;

        const mobileControlStyle =
          mobile &&
          css`
            width: fit-content;
          `;

        const mobileLabelStyle =
          mobile &&
          css`
            width: 100%;
          `;

        const isButtonRow =
          visibleFields.length > 0 &&
          visibleFields.every((field) => field.type === "button");

        const mobileRowFormFieldStyle =
          mobile &&
          css`
            background-color: ${statefulFormTheme?.mobileRowFrameBackgroundColor};
            min-height: 40px;
            padding: 10px 20px;
            border-radius: 24px;
            flex-direction: column;
            justify-content: center;

            ${isButtonRow &&
            css`
              min-height: 48px;
              padding: 0px;
              flex-direction: row;
              gap: 0px;
              overflow: hidden;
            `}
          `;

        return (
          <RowFormField
            aria-label="stateful-form-row"
            $style={css`
              ${styles?.rowStyle}
              ${rowJustifiedContent &&
              css`
                justify-content: ${rowJustifiedContent};
              `};

              ${rowWithFrame &&
              css`
                background-color: ${statefulFormTheme?.rowFrameBackgroundColor};
                padding: 10px;
              `}

              ${mobileRowFormFieldStyle}

              ${rowAlignedItem &&
              css`
                align-items: ${rowAlignedItem};
              `};

              ${rowStyleItem}
            `}
            key={indexGroup}
          >
            {visibleFields.map((field: FormFieldProps, index: number) => {
              const labelPosition = mobile
                ? (field?.labelPosition ?? "left")
                : field?.labelPosition;
              const isLast = index === visibleFields.length - 1;
              const showSeparator =
                mobile && !isLast && Array.isArray(group) && !isButtonRow;
              const label = mobile ? null : field?.title;
              const placeholder = mobile
                ? (field.placeholder ?? field.title)
                : field.placeholder;
              const required = mobile ? false : field.required;

              if (field.type === "frame") {
                return (
                  <Frame
                    key={index}
                    title={field.title}
                    {...field?.frame}
                    className={field?.className}
                    styles={{
                      containerStyle: css`
                        margin-top: 10px;
                        min-width: 0;

                        ${styles?.frameContainerStyle};
                        ${field?.frame?.styles?.containerStyle};
                      `,
                      titleStyle: css`
                        font-size: 12px;
                        color: black;
                        margin-top: 2px;

                        ${styles?.frameTitleStyle};
                        ${field?.frame?.styles?.titleStyle}
                      `,
                    }}
                  >
                    {field?.fields && (
                      <FormFields
                        labelSize={labelSize}
                        fieldSize={fieldSize}
                        mobile={mobile}
                        control={control}
                        fields={field?.fields}
                        formValues={formValues}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        onChange={onChange}
                        autoFocusField={autoFocusField}
                        disabled={disabled}
                        styles={styles}
                        shouldShowError={shouldShowError}
                        rowWithFrame={true}
                      />
                    )}
                  </Frame>
                );
              }

              const fieldNode = (() => {
                switch (field.type) {
                  case "custom": {
                    return <Fragment key={index}>{field.render}</Fragment>;
                  }

                  case "text":
                  case "message":
                  case "number":
                  case "email":
                  case "password": {
                    return (
                      <Textbox
                        key={index}
                        id={field.id}
                        label={label}
                        className={field?.className}
                        type={field.type}
                        labelGap={field.labelGap}
                        labelWidth={field.labelWidth}
                        labelPosition={labelPosition}
                        placeholder={placeholder}
                        value={formValues[field.name as keyof T] ?? ""}
                        required={required}
                        helper={field.helper}
                        {...register(field.name as Path<T>, {
                          onChange: (e) => {
                            if (field.onChange) {
                              field.onChange(e);
                            }
                            if (onChange) {
                              onChange(field.name as keyof T, e.target.value);
                            }
                          },
                        })}
                        ref={(el) => {
                          if (el) refs.current[field.name] = el;
                          const { ref } = register(field.name as Path<T>);
                          if (ref) ref(el);
                        }}
                        showError={shouldShowError(field.name)}
                        errorMessage={
                          errors[field.name as keyof T]?.message as
                            | string
                            | undefined
                        }
                        disabled={field.disabled || disabled}
                        {...field.textbox}
                        styles={{
                          ...field.textbox?.styles,
                          labelStyle: css`
                            ${labelSize &&
                            css`
                              font-size: ${labelSize};
                            `};

                            ${mobileLabelStyle};

                            ${field.textbox?.styles?.labelStyle};
                          `,
                          self: css`
                            ${fieldSize &&
                            css`
                              font-size: ${fieldSize};
                            `};
                            height: 34px;

                            ${mobileInputStyle};
                            ${field.textbox?.styles?.self}
                          `,
                          containerStyle: css`
                            ${field.width &&
                            css`
                              width: ${field.width};
                            `}
                            ${field.textbox?.styles?.containerStyle}
                          `,
                          bodyStyle: css`
                            ${!field.title &&
                            hasFieldTitle &&
                            css`
                              min-height: 60px;
                              justify-content: end;
                            `};

                            ${field.textbox?.styles?.bodyStyle}
                          `,
                        }}
                      />
                    );
                  }

                  case "pin": {
                    return (
                      <Controller
                        key={index}
                        control={control}
                        name={field.name as Path<T>}
                        render={({ field: controllerField }) => (
                          <Pinbox
                            key={index}
                            id={field.id}
                            name={field.name}
                            className={field?.className}
                            labelPosition={labelPosition}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            required={required}
                            label={field.title}
                            showIconError={mobile ? false : true}
                            value={controllerField.value ?? ""}
                            helper={field.helper}
                            onBlur={controllerField.onBlur}
                            onChange={(e) => {
                              controllerField.onChange(e);

                              if (field.onChange) {
                                field.onChange(e);
                              }

                              if (onChange) {
                                onChange(field.name as keyof T, e.target.value);
                              }
                            }}
                            showError={shouldShowError(field.name)}
                            errorMessage={
                              errors[field.name as keyof T]?.message as
                                | string
                                | undefined
                            }
                            disabled={field.disabled || disabled}
                            {...field.pinbox}
                            styles={{
                              ...field.pinbox?.styles,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `}
                                ${field.pinbox?.styles?.containerStyle}
                              `,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `}
                                ${mobileLabelStyle};

                                ${field.pinbox?.styles?.labelStyle}
                              `,
                              bodyStyle: css`
                                ${!field.title &&
                                hasFieldTitle &&
                                css`
                                  margin-top: 30px;
                                  justify-content: end;
                                `};
                                ${mobileBodyStyle};

                                ${field.pinbox?.styles?.bodyStyle}
                              `,
                              self: css`
                                ${mobile &&
                                css`
                                  background-color: transparent;
                                  border: none;
                                  box-shadow: none;
                                  border-bottom: 1px solid
                                    ${shouldShowError(field.name)
                                      ? pinboxTheme.errorBorderColor ||
                                        "#f87171"
                                      : pinboxTheme.borderColor || "#d1d5db"};

                                  &:focus {
                                    border: none;
                                    box-shadow: none;
                                    border-bottom: 1px solid
                                      ${pinboxTheme.focusedBorderColor ||
                                      "#61A9F9"};
                                    z-index: 9999;
                                  }
                                `};

                                ${field.pinbox?.styles?.self}
                              `,
                              controlStyle: css`
                                ${mobileControlStyle};

                                ${field.pinbox?.styles?.controlStyle}
                              `,
                            }}
                            ref={controllerField.ref}
                          />
                        )}
                      />
                    );
                  }

                  case "button": {
                    const defaultVariant = field?.button?.variant ?? "default";

                    const mobileButtonStyle =
                      mobile &&
                      css`
                        ${isButtonRow &&
                        css`
                          height: 48px;
                        `};
                        border-radius: 0px;
                        width: 100%;

                        ${defaultVariant === "default" &&
                        css`
                          background-color: ${statefulFormTheme?.mobileRowFrameBackgroundColor};
                        `}
                      `;

                    return (
                      <Button
                        key={index}
                        mobile={mobile}
                        {...field.button}
                        className={field?.className}
                        id={field.id}
                        title={
                          field.button?.title
                            ? field.button?.title
                            : field.placeholder
                        }
                        activeBackgroundColor={"red"}
                        variant={defaultVariant}
                        styles={{
                          ...field.button?.styles,
                          self: css`
                            ${field.icon &&
                            css`
                              gap: 2px;
                            `}
                            width:100%;
                            height: 34px;
                            font-size: ${labelSize ?? "12px"};
                            ${mobileButtonStyle};

                            ${field.button?.styles?.self};
                          `,
                          containerStyle: css`
                            ${field.width &&
                            css`
                              width: ${field.width};
                            `};

                            ${!mobile &&
                            hasFieldTitle &&
                            css`
                              margin-top: 26px;
                              justify-content: end;
                              align-items: end;
                            `};

                            ${mobileButtonStyle};

                            ${field.button?.styles?.containerStyle};
                          `,
                        }}
                        onClick={(e) => {
                          if (field?.button?.onClick) {
                            field?.button?.onClick?.(e);
                          } else {
                            field?.onClick?.(e);
                          }
                        }}
                        disabled={field.disabled || disabled}
                      >
                        {field.icon && (
                          <field.icon
                            size={fieldSize ? parseInt(fieldSize) : 16}
                          />
                        )}

                        {field.title}
                      </Button>
                    );
                  }

                  case "time": {
                    return (
                      <Timebox
                        key={index}
                        id={field.id}
                        label={field.title}
                        labelGap={field.labelGap}
                        labelWidth={field.labelWidth}
                        labelPosition={labelPosition}
                        value={formValues[field.name as keyof T] ?? ""}
                        required={required}
                        placeholder={
                          typeof field.placeholder === "string"
                            ? (() => {
                                const [hour = "", minute = "", second = ""] =
                                  field.placeholder.split(/[:/]/);

                                return { hour, minute, second };
                              })()
                            : field.placeholder
                        }
                        helper={field.helper}
                        className={field?.className}
                        mobile={mobile}
                        {...register(field.name as Path<T>, {
                          onChange: (e) => {
                            if (field.onChange) {
                              field.onChange(e);
                            }
                            if (onChange) {
                              onChange(field.name as keyof T, e.target.value);
                            }
                          },
                        })}
                        showError={shouldShowError(field.name)}
                        errorMessage={
                          errors[field.name as keyof T]?.message as
                            | string
                            | undefined
                        }
                        disabled={field.disabled || disabled}
                        {...field.timebox}
                        styles={{
                          ...field.timebox?.styles,
                          self: css`
                            ${fieldSize &&
                            css`
                              font-size: ${fieldSize};
                            `};

                            max-width: none;
                            min-width: 0;
                            width: 40px;
                            max-width: 40px;
                            height: 32px;
                            max-height: 32px;

                            ${mobileInputStyle};
                            ${mobile &&
                            css`
                              background-color: transparent;
                              border: none;
                              box-shadow: none;
                              border-bottom: 1px solid
                                ${shouldShowError(field.name)
                                  ? pinboxTheme.errorBorderColor || "#f87171"
                                  : pinboxTheme.borderColor || "#d1d5db"};

                              &:focus {
                                border: none;
                                box-shadow: none;
                                border-bottom: 1px solid
                                  ${shouldShowError(field.name)
                                    ? pinboxTheme.errorBorderColor || "#f87171"
                                    : pinboxTheme.borderColor || "#d1d5db"};
                                z-index: 9999;
                              }
                            `};

                            ${field?.timebox?.styles?.self};
                          `,
                          inputWrapperStyle: css`
                            width: 100%;

                            ${mobile &&
                            css`
                              width: fit-content;
                            `};

                            ${mobileInputStyle};

                            ${field.timebox?.styles?.inputWrapperStyle};
                          `,
                          containerStyle: css`
                            width: 100%;

                            ${field.width &&
                            css`
                              width: ${field.width};
                            `};

                            ${field.timebox?.styles?.containerStyle}
                          `,
                          labelStyle: css`
                            ${labelSize &&
                            css`
                              font-size: ${labelSize};
                            `};
                            ${mobileLabelStyle};

                            ${field.timebox?.styles?.labelStyle}
                          `,
                          bodyStyle: css`
                            ${!field.title &&
                            hasFieldTitle &&
                            css`
                              min-height: 60px;
                              justify-content: end;
                            `};

                            ${mobile &&
                            css`
                              justify-content: space-between;
                            `};

                            ${field.timebox?.styles?.bodyStyle}
                          `,
                          controlStyle: css`
                            ${mobile &&
                            css`
                              width: fit-content;
                            `};

                            ${field.timebox?.styles?.controlStyle}
                          `,
                        }}
                        ref={(el) => {
                          if (el) refs.current[field.name] = el;
                          const { ref } = register(field.name as Path<T>);
                          if (ref) ref(el);
                        }}
                      />
                    );
                  }

                  case "textarea": {
                    return (
                      <Textarea
                        key={index}
                        id={field.id}
                        label={label}
                        rows={field.rows}
                        labelGap={field.labelGap}
                        labelWidth={field.labelWidth}
                        labelPosition={labelPosition}
                        placeholder={placeholder}
                        className={field?.className}
                        value={formValues[field.name as keyof T] ?? ""}
                        required={required}
                        helper={field.helper}
                        {...register(field.name as Path<T>, {
                          onChange: (e) => {
                            if (field.onChange) {
                              field.onChange(e);
                            }
                            if (onChange) {
                              onChange(field.name as keyof T, e.target.value);
                            }
                          },
                        })}
                        ref={(el) => {
                          if (el) refs.current[field.name] = el;
                          const { ref } = register(field.name as Path<T>);
                          if (ref) ref(el);
                        }}
                        showError={shouldShowError(field.name)}
                        errorMessage={
                          errors[field.name as keyof T]?.message as
                            | string
                            | undefined
                        }
                        disabled={field.disabled || disabled}
                        {...field.textarea}
                        styles={{
                          ...field.textarea?.styles,
                          labelStyle: css`
                            ${labelSize &&
                            css`
                              font-size: ${labelSize};
                            `}
                            ${mobileLabelStyle};

                            ${field.textarea?.styles?.labelStyle}
                          `,
                          self: css`
                            ${mobileInputStyle};

                            ${fieldSize &&
                            css`
                              font-size: ${fieldSize};
                            `};
                            ${field.textarea?.styles?.self}
                          `,
                          containerStyle: css`
                            ${field.width &&
                            css`
                              width: ${field.width};
                            `};

                            ${field.textarea?.styles?.containerStyle};
                          `,
                          bodyStyle: css`
                            ${!field.title &&
                            hasFieldTitle &&
                            css`
                              min-height: 60px;
                              justify-content: end;
                            `};
                            ${field.textarea?.styles?.bodyStyle};
                          `,
                        }}
                      />
                    );
                  }

                  case "checkbox": {
                    return (
                      <Controller
                        key={index}
                        control={control}
                        name={field.name as Path<T>}
                        render={({ field: controllerField }) => {
                          const titleCheckbox = mobile
                            ? (field.title ?? field.placeholder)
                            : field.title;
                          const placeholderCheckbox = mobile
                            ? undefined
                            : field.placeholder;
                          return (
                            <Checkbox
                              id={field.id}
                              title={titleCheckbox}
                              label={placeholderCheckbox}
                              labelGap={field.labelGap}
                              labelWidth={field.labelWidth}
                              labelPosition={labelPosition}
                              className={field?.className}
                              name={field.name}
                              value={field.name}
                              placeholder={placeholderCheckbox}
                              checked={controllerField.value ?? false}
                              helper={field.helper}
                              ref={(el) => {
                                if (el) refs.current[field.name] = el;
                                const { ref } = register(field.name as Path<T>);
                                if (ref) ref(el);
                              }}
                              errorMessage={
                                errors[field.name as keyof T]?.message as
                                  | string
                                  | undefined
                              }
                              required={required}
                              showError={shouldShowError(field.name)}
                              onChange={(e) => {
                                controllerField?.onChange(e);
                                controllerField?.onBlur();
                                if (onChange) {
                                  onChange(
                                    field.name as keyof T,
                                    e.target.checked
                                  );
                                }
                                field.onChange?.(e);
                              }}
                              disabled={field.disabled || disabled}
                              {...field.checkbox}
                              styles={{
                                ...field.checkbox?.styles,
                                titleStyle: css`
                                  ${labelSize &&
                                  css`
                                    font-size: ${labelSize};
                                  `};
                                  ${mobileLabelStyle};
                                  ${field.checkbox?.styles?.titleStyle}
                                `,
                                labelStyle: css`
                                  ${labelSize &&
                                  css`
                                    font-size: ${labelSize};
                                  `};

                                  ${field.checkbox?.styles?.labelStyle}
                                `,
                                self: css`
                                  ${labelSize &&
                                  css`
                                    width: calc(${labelSize} + 2px);
                                    height: calc(${labelSize} + 2px);
                                  `};
                                  ${field.checkbox?.styles?.self}
                                `,
                                iconStyle: css`
                                  ${labelSize &&
                                  css`
                                    width: calc(${labelSize} - 4px);
                                    height: calc(${labelSize} - 4px);
                                  `};
                                  ${field.checkbox?.styles?.iconStyle}
                                `,
                                containerStyle: css`
                                  width: 100%;
                                  ${field.width &&
                                  css`
                                    width: ${field.width};
                                  `};
                                  ${field.checkbox?.styles?.containerStyle}
                                `,
                                boxStyle: css`
                                  ${labelSize &&
                                  css`
                                    width: calc(${labelSize} + 2px);
                                    height: calc(${labelSize} + 2px);
                                  `};
                                  ${field.checkbox?.styles?.boxStyle}
                                `,
                                bodyStyle: css`
                                  ${!field.title &&
                                  hasFieldTitle &&
                                  css`
                                    min-height: 60px;
                                    justify-content: end;
                                  `};
                                  min-height: 34px;
                                  justify-content: center;
                                  ${mobileBodyStyle};

                                  ${field.checkbox?.styles?.bodyStyle}
                                `,
                                controlStyle: css`
                                  ${mobileControlStyle};

                                  ${field.checkbox?.styles?.controlStyle}
                                `,
                              }}
                            />
                          );
                        }}
                      />
                    );
                  }

                  case "radio": {
                    return (
                      <Controller
                        key={index}
                        control={control}
                        name={field.name as Path<T>}
                        render={({ field: controllerField }) => {
                          const titleRadio = mobile
                            ? (field.title ?? field.placeholder)
                            : field.title;
                          const placeholderRadio = mobile
                            ? undefined
                            : field.placeholder;
                          return (
                            <Radio
                              {...field.radio}
                              id={field.id}
                              labelGap={field.labelGap}
                              labelWidth={field.labelWidth}
                              labelPosition={labelPosition}
                              className={field?.className}
                              name={field.name}
                              title={titleRadio}
                              label={placeholderRadio}
                              placeholder={placeholderRadio}
                              checked={controllerField.value ?? false}
                              errorMessage={
                                errors[field.name as keyof T]?.message as
                                  | string
                                  | undefined
                              }
                              helper={field.helper}
                              required={required}
                              showError={shouldShowError(field.name)}
                              onChange={(e) => {
                                controllerField?.onChange(e);
                                controllerField?.onBlur();
                                if (onChange) {
                                  onChange(
                                    field.name as keyof T,
                                    e.target.checked
                                  );
                                }
                                field.onChange?.(e);
                              }}
                              disabled={field.disabled || disabled}
                              styles={{
                                ...field.radio?.styles,
                                labelStyle: css`
                                  ${labelSize &&
                                  css`
                                    font-size: ${labelSize};
                                  `};

                                  ${field.radio?.styles?.labelStyle}
                                `,
                                titleStyle: css`
                                  ${labelSize &&
                                  css`
                                    font-size: ${labelSize};
                                  `};
                                  ${mobileLabelStyle};
                                  ${field.radio?.styles?.titleStyle}
                                `,
                                self: css`
                                  ${fieldSize &&
                                  css`
                                    width: ${fieldSize};
                                    height: ${fieldSize};
                                  `}
                                  ${field.radio?.styles?.self}
                                `,
                                containerStyle: css`
                                  width: 100%;
                                  ${field.width &&
                                  css`
                                    width: ${field.width};
                                  `};
                                  ${field.radio?.styles?.containerStyle}
                                `,
                                bodyStyle: css`
                                  min-height: 34px;
                                  justify-content: center;
                                  ${!field.title &&
                                  hasFieldTitle &&
                                  css`
                                    min-height: 60px;
                                    justify-content: end;
                                  `};

                                  ${mobileBodyStyle};

                                  ${field.radio?.styles?.bodyStyle}
                                `,
                                controlStyle: css`
                                  ${mobileControlStyle};

                                  ${field.radio?.styles?.controlStyle}
                                `,
                              }}
                            />
                          );
                        }}
                      />
                    );
                  }

                  case "phone": {
                    return (
                      <Controller
                        key={index}
                        control={control}
                        name={"phone" as Path<T>}
                        render={({ field: controllerField }) => (
                          <Phonebox
                            id={field.id}
                            name={field.name}
                            label={label}
                            mobile={mobile}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            labelPosition={labelPosition}
                            className={field?.className}
                            required={required}
                            ref={(el) => {
                              if (el) refs.current[field.name] = el;
                              controllerField.ref(el);
                            }}
                            onBlur={controllerField.onBlur}
                            value={controllerField.value}
                            helper={field.helper}
                            placeholder={placeholder}
                            errorIconPosition={mobile ? "none" : "absolute"}
                            onChange={(
                              e:
                                | {
                                    target: {
                                      name: string;
                                      value: PhoneboxCountryCode;
                                    };
                                  }
                                | ChangeEvent<HTMLInputElement>
                            ) => {
                              if (e.target.name === "phone") {
                                controllerField.onChange(e);
                                onChange?.("phone", e.target.value);
                              } else if (e.target.name === "country_code") {
                                onChange?.("country_code", e.target.value);
                              }
                              field.onChange?.(e);
                            }}
                            showError={shouldShowError(field.name)}
                            errorMessage={
                              errors[field.name as keyof T]?.message as
                                | string
                                | undefined
                            }
                            disabled={field.disabled || disabled}
                            {...field.phonebox}
                            styles={{
                              ...field.phonebox?.styles,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};
                                ${mobileLabelStyle};
                                ${field.phonebox?.styles?.labelStyle}
                              `,
                              toggleStyle: css`
                                background-color: transparent;
                                &:hover {
                                  background-color: transparent;
                                }
                                ${field.phonebox?.styles?.toggleStyle}
                              `,
                              inputWrapperStyle: css`
                                ${mobileInputStyle};
                                ${mobile &&
                                css`
                                  justify-content: space-between;
                                `}
                                ${field.phonebox?.styles?.inputWrapperStyle}
                              `,
                              self: css`
                                ${fieldSize &&
                                css`
                                  font-size: ${fieldSize};
                                `}
                                ${mobileInputStyle};
                                ${mobile &&
                                css`
                                  text-align: end;
                                  width: fit-content;
                                `}
                                ${field.phonebox?.styles?.inputWrapperStyle};
                              `,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `};
                                ${field.phonebox?.styles?.containerStyle}
                              `,
                              bodyStyle: css`
                                ${!field.title &&
                                hasFieldTitle &&
                                css`
                                  min-height: 60px;
                                  justify-content: end;
                                `};

                                ${field.phonebox?.styles?.bodyStyle}
                              `,
                            }}
                          />
                        )}
                      />
                    );
                  }

                  case "color": {
                    return (
                      <Controller
                        key={index}
                        name={field.name as Path<T>}
                        control={control}
                        render={({ field: controllerField, fieldState }) => (
                          <Colorbox
                            id={field.id}
                            name={field.name}
                            label={field.title}
                            placeholder={field.placeholder}
                            required={required}
                            className={field?.className}
                            helper={field.helper}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            labelPosition={labelPosition}
                            ref={(el) => {
                              if (el) refs.current[field.name] = el;
                              const { ref } = register(field.name as Path<T>);
                              if (ref) ref(el);
                            }}
                            value={controllerField.value}
                            onChange={(e) => {
                              controllerField?.onChange(e);
                              controllerField?.onBlur();
                              field.onChange?.(e);
                              if (onChange) {
                                onChange(field.name as keyof T, e.target.value);
                              }
                            }}
                            showError={shouldShowError(field.name)}
                            errorMessage={fieldState.error?.message}
                            disabled={field.disabled || disabled}
                            {...field.colorbox}
                            styles={{
                              ...field.colorbox?.styles,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};
                                ${mobileLabelStyle};
                                ${mobile &&
                                css`
                                  width: 100%;
                                `}

                                ${field.colorbox?.styles?.labelStyle}
                              `,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `};
                                ${field.colorbox?.styles?.containerStyle}
                              `,
                              textInputGroupStyle: css`
                                ${mobileInputStyle};
                                ${mobile &&
                                field.title &&
                                css`
                                  width: fit-content;
                                `};

                                ${field.colorbox?.styles?.textInputGroupStyle};
                              `,
                              textInputStyle: css`
                                ${fieldSize &&
                                css`
                                  font-size: ${fieldSize};
                                `};
                                ${mobile &&
                                css`
                                  &:-webkit-autofill,
                                  &:-webkit-autofill:hover,
                                  &:-webkit-autofill:focus,
                                  &:-webkit-autofill:active {
                                    -webkit-box-shadow: 0 0 0 1000px transparent
                                      inset;
                                    box-shadow: 0 0 0 1000px transparent inset;

                                    background-color: transparent !important;
                                    transition: background-color 9999s
                                      ease-in-out 0s;
                                    color: ${statefulFormTheme.textColor};
                                    -webkit-text-fill-color: ${statefulFormTheme.textColor};
                                  }
                                  width: 60px;
                                `};

                                ${field.colorbox?.styles?.textInputStyle}
                              `,
                              self: css`
                                ${mobileInputStyle};
                                ${mobile &&
                                css`
                                  flex-direction: row-reverse;
                                `}

                                ${field.colorbox?.styles?.self}
                              `,
                              bodyStyle: css`
                                ${!field.title &&
                                hasFieldTitle &&
                                css`
                                  min-height: 60px;
                                  justify-content: end;
                                `};

                                ${field.colorbox?.styles?.bodyStyle}
                              `,
                            }}
                          />
                        )}
                      />
                    );
                  }

                  case "file_drop_box": {
                    return (
                      <FileDropBox
                        key={index}
                        id={field.id}
                        label={field.title}
                        placeholder={field.placeholder}
                        className={field?.className}
                        labelGap={field.labelGap}
                        labelWidth={field.labelWidth}
                        labelPosition={field.labelPosition}
                        helper={field.helper}
                        name={field.name}
                        required={required}
                        disabled={field.disabled || disabled}
                        {...register(field.name as Path<T>, {
                          onChange: (e) => {
                            if (field.onChange) {
                              field.onChange(e);
                            }
                            if (onChange) {
                              onChange(field.name as keyof T, e.target.value);
                            }
                          },
                        })}
                        {...field.fileDropBox}
                        styles={{
                          ...field.fileDropBox?.styles,
                          labelStyle: css`
                            ${labelSize &&
                            css`
                              font-size: ${labelSize};
                            `};
                            ${mobileLabelStyle};

                            ${field.fileDropBox?.styles?.labelStyle}
                          `,
                          containerStyle: css`
                            ${field.width &&
                            css`
                              width: ${field.width};
                            `};
                            ${field.fileDropBox?.styles?.containerStyle}
                          `,
                          dragOverStyle: css`
                            ${mobile &&
                            css`
                              background-color: transparent;
                            `};
                            ${field.fileDropBox?.styles?.dragOverStyle}
                          `,
                        }}
                      />
                    );
                  }

                  case "file": {
                    return (
                      <FileInputBox
                        key={index}
                        id={field.id}
                        labelGap={field.labelGap}
                        labelWidth={field.labelWidth}
                        labelPosition={field.labelPosition}
                        className={field?.className}
                        label={field.title}
                        placeholder={field.placeholder}
                        required={required}
                        showError={shouldShowError(field.name)}
                        helper={field.helper}
                        name={field.name}
                        disabled={field.disabled || disabled}
                        errorMessage={
                          errors[field.name as keyof T]?.message as
                            | string
                            | undefined
                        }
                        {...field.fileInputBox}
                        onFilesSelected={(files: File[]) => {
                          if (files && files.length > 0) {
                            setValue(field.name as Path<T>, files as any, {
                              shouldValidate: true,
                              shouldTouch: true,
                            });

                            onChange?.(field.name, files);

                            field.onChange?.({
                              target: { name: field.name, value: files },
                            });
                          } else {
                            setValue(field.name as Path<T>, undefined, {
                              shouldValidate: true,
                              shouldTouch: true,
                            });

                            onChange?.(field.name, undefined);

                            field.onChange?.({
                              target: { name: field.name, value: undefined },
                            });
                          }
                        }}
                        styles={{
                          ...field.fileInputBox?.styles,
                          labelStyle: css`
                            ${labelSize &&
                            css`
                              font-size: ${labelSize};
                            `};
                            ${mobileLabelStyle};

                            ${field.fileInputBox?.styles?.labelStyle}
                          `,
                          containerStyle: css`
                            ${field.width &&
                            css`
                              width: ${field.width};
                            `};
                            ${field.fileInputBox?.styles?.containerStyle}
                          `,
                          bodyStyle: css`
                            ${!field.title &&
                            hasFieldTitle &&
                            css`
                              margin-top: 26px;
                              justify-content: end;
                            `};

                            ${field.fileInputBox?.styles?.bodyStyle}
                          `,
                          self: css`
                            background-color: transparent;
                            ${field.fileInputBox?.styles?.self}
                          `,
                        }}
                      />
                    );
                  }

                  case "image": {
                    return (
                      <Imagebox
                        key={index}
                        id={field.id}
                        labelGap={field.labelGap}
                        labelWidth={field.labelWidth}
                        labelPosition={labelPosition}
                        className={field?.className}
                        name={field.name}
                        helper={field.helper}
                        value={formValues[field.name as keyof T] ?? ""}
                        onFileSelected={(e: File | undefined) => {
                          const file = e;
                          if (file instanceof File) {
                            setValue(field.name as Path<T>, file as any, {
                              shouldValidate: true,
                              shouldTouch: true,
                            });
                          } else {
                            setValue(field.name as Path<T>, undefined, {
                              shouldValidate: true,
                              shouldTouch: true,
                            });
                          }
                          field.onChange?.({
                            target: {
                              name: field.name,
                              value: file ?? undefined,
                            },
                          });
                          if (onChange) {
                            onChange(field.name as keyof T, file ?? undefined);
                          }
                        }}
                        label={field.title}
                        disabled={field.disabled || disabled}
                        required={required}
                        {...register(field.name as Path<T>, {
                          onChange: (e) => {
                            if (field.onChange) {
                              field.onChange(e);
                            }
                            if (onChange) {
                              onChange(field.name as keyof T, e.target.value);
                            }
                          },
                        })}
                        showError={shouldShowError(field.name)}
                        errorMessage={
                          errors[field.name as keyof T]?.message as
                            | string
                            | undefined
                        }
                        {...field.imagebox}
                        styles={{
                          ...field.imagebox?.styles,
                          containerStyle: css`
                            ${field.width &&
                            css`
                              width: ${field.width};
                            `};
                            ${field.imagebox?.styles?.containerStyle}
                          `,
                          labelStyle: css`
                            ${labelSize &&
                            css`
                              font-size: ${labelSize};
                            `};
                            ${mobileLabelStyle};

                            ${field.imagebox?.styles?.labelStyle}
                          `,
                          bodyStyle: css`
                            ${!field.title &&
                            hasFieldTitle &&
                            css`
                              margin-top: 26px;
                              justify-content: end;
                            `};

                            ${mobileBodyStyle};

                            ${field.imagebox?.styles?.bodyStyle}
                          `,
                          controlStyle: css`
                            ${mobileControlStyle};
                            ${field.imagebox?.styles?.controlStyle}
                          `,
                        }}
                      />
                    );
                  }

                  case "signbox": {
                    return (
                      <Signbox
                        key={index}
                        id={field.id}
                        clearable
                        name={field.name}
                        label={field.title}
                        labelGap={field.labelGap}
                        labelWidth={field.labelWidth}
                        labelPosition={labelPosition}
                        className={field?.className}
                        helper={field.helper}
                        required={required}
                        value={formValues[field.name as keyof T] ?? ""}
                        {...register(field.name as Path<T>, {
                          onChange: (e) => {
                            if (field.onChange) {
                              field.onChange(e);
                            }
                            if (onChange) {
                              onChange(field.name as keyof T, e.target.value);
                            }
                          },
                        })}
                        showError={shouldShowError(field.name)}
                        errorMessage={
                          errors[field.name as keyof T]?.message as
                            | string
                            | undefined
                        }
                        disabled={field.disabled || disabled}
                        {...field.signbox}
                        styles={{
                          ...field.signbox?.styles,
                          labelStyle: css`
                            ${labelSize &&
                            css`
                              font-size: ${labelSize};
                            `};
                            ${mobileLabelStyle};

                            ${field.signbox?.styles?.labelStyle}
                          `,
                          containerStyle: css`
                            ${field.width &&
                            css`
                              width: ${field.width};
                            `};
                            ${field.signbox?.styles?.containerStyle}
                          `,
                          bodyStyle: css`
                            ${!field.title &&
                            hasFieldTitle &&
                            css`
                              margin-top: 26px;
                              justify-content: end;
                            `};

                            ${field.signbox?.styles?.bodyStyle}
                          `,
                        }}
                      />
                    );
                  }

                  case "money": {
                    return (
                      <Controller
                        key={index}
                        name={field.name as Path<T>}
                        control={control}
                        render={({ field: rhf, fieldState }) => (
                          <Moneybox
                            key={index}
                            mobile={mobile}
                            id={field.id}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            labelPosition={labelPosition}
                            className={field?.className}
                            ref={(el) => {
                              if (el) refs.current[field.name] = el;
                              rhf.ref(el);
                            }}
                            name={field.name}
                            label={label}
                            helper={field.helper}
                            placeholder={placeholder}
                            value={rhf.value ?? ""}
                            required={required}
                            disabled={field.disabled || disabled}
                            onChange={(e) => {
                              const { name, value } = e.target;

                              if (field.onChange) {
                                field.onChange(e);
                              }

                              if (onChange && name === "currency") {
                                onChange("currency", value);
                              } else {
                                onChange(field.name as keyof T, value);
                                setValue(field.name as Path<T>, value as any, {
                                  shouldValidate: true,
                                  shouldTouch: true,
                                  shouldDirty: true,
                                });
                              }
                            }}
                            onBlur={rhf.onBlur}
                            showError={!!fieldState.error}
                            errorMessage={fieldState.error?.message}
                            {...field.money}
                            styles={{
                              ...field.money?.styles,
                              inputWrapperStyle: css`
                                height: 34px;
                                ${mobileInputStyle};

                                ${field.money?.styles?.inputWrapperStyle}
                              `,
                              self: css`
                                ${fieldSize &&
                                css`
                                  font-size: ${fieldSize};
                                `};
                                padding: 0px;
                                ${field.money?.styles?.self};
                              `,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};
                                ${mobileLabelStyle};

                                ${field.money?.styles?.labelStyle}
                              `,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `};

                                ${field.money?.styles?.containerStyle}
                              `,
                              bodyStyle: css`
                                ${!field.title &&
                                hasFieldTitle &&
                                css`
                                  min-height: 60px;
                                  justify-content: end;
                                `};

                                ${field.money?.styles?.bodyStyle}
                              `,
                            }}
                          />
                        )}
                      />
                    );
                  }

                  case "date": {
                    return (
                      <Controller
                        key={index}
                        name={field.name as Path<T>}
                        control={control}
                        render={({ field: controllerField }) => {
                          const value = controllerField.value;

                          const hasValue = Array.isArray(value)
                            ? value.some((v) => v !== "" && v != null)
                            : value !== "" && value != null;

                          return (
                            <Datebox
                              key={index}
                              id={field.id}
                              name={field.name}
                              label={field.title}
                              placeholder={field.placeholder}
                              helper={field.helper}
                              required={required}
                              className={field?.className}
                              showError={shouldShowError(field.name)}
                              labelGap={field.labelGap}
                              labelWidth={field.labelWidth}
                              labelPosition={labelPosition}
                              mobile={mobile}
                              ref={(el) => {
                                if (el) refs.current[field.name] = el;
                                const { ref } = register(field.name as Path<T>);
                                if (ref) ref(el);
                              }}
                              errorMessage={
                                errors[field.name as keyof T]?.[0]?.message as
                                  | string
                                  | undefined
                              }
                              onChange={(e) => {
                                const inputValueEvent = {
                                  target: { name: field.name, value: e },
                                };
                                controllerField.onChange(inputValueEvent);
                                controllerField?.onBlur();
                                field.onChange?.(inputValueEvent);
                                if (onChange) {
                                  onChange(field.name as keyof T, e);
                                }
                              }}
                              selectedDates={controllerField.value}
                              disabled={field.disabled || disabled}
                              {...field.date}
                              styles={{
                                ...field?.date?.styles,
                                selectboxStyle: css`
                                  ${fieldSize &&
                                  css`
                                    font-size: ${fieldSize};
                                  `};

                                  ${mobileInputStyle};
                                  ${mobile &&
                                  field.title &&
                                  css`
                                    text-align: right;
                                    padding-right: 40px;
                                    ${hasValue &&
                                    css`
                                      padding-right: 55px;
                                    `}
                                  `};

                                  ${field?.date?.styles?.selectboxStyle}
                                `,
                                labelStyle: css`
                                  ${labelSize &&
                                  css`
                                    font-size: ${labelSize};
                                  `};
                                  ${mobileLabelStyle};

                                  ${field.date?.styles?.labelStyle}
                                `,
                                containerStyle: css`
                                  ${field.width &&
                                  css`
                                    width: ${field.width};
                                  `};

                                  ${field.date?.styles?.containerStyle}
                                `,
                                bodyStyle: css`
                                  ${!field.title &&
                                  hasFieldTitle &&
                                  css`
                                    min-height: 60px;
                                    justify-content: end;
                                  `};

                                  ${field.date?.styles?.bodyStyle}
                                `,
                              }}
                            />
                          );
                        }}
                      />
                    );
                  }

                  case "combo": {
                    return (
                      <Controller
                        key={index}
                        name={field.name as Path<T>}
                        control={control}
                        render={({ field: controllerField }) => (
                          <Combobox
                            id={field.id}
                            name={field.name}
                            mobile={mobile}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            labelPosition={labelPosition}
                            label={field.title}
                            placeholder={field.placeholder}
                            className={field?.className}
                            required={required}
                            showError={shouldShowError(field.name)}
                            ref={(el) => {
                              if (el) refs.current[field.name] = el;
                              const { ref } = register(field.name as Path<T>);
                              if (ref) ref(el);
                            }}
                            errorMessage={
                              errors[field.name as keyof T]?.message as
                                | string
                                | undefined
                            }
                            helper={field.helper}
                            onChange={(e) => {
                              const inputValueEvent = {
                                target: { name: field.name, value: e },
                              };
                              controllerField.onChange(inputValueEvent);
                              controllerField?.onBlur();
                              field.onChange?.(inputValueEvent);
                              if (onChange) {
                                onChange(field.name as keyof T, e);
                              }
                            }}
                            selectedOptions={controllerField.value}
                            disabled={field.disabled || disabled}
                            {...field.combobox}
                            strict={field?.combobox?.strict ?? true}
                            styles={{
                              ...field?.combobox?.styles,
                              bodyStyle: css`
                                ${!field.title &&
                                hasFieldTitle &&
                                css`
                                  min-height: 60px;
                                  justify-content: end;
                                `};

                                ${field.combobox?.styles?.bodyStyle}
                              `,
                              controlStyle: css`
                                ${field.title &&
                                css`
                                  ${mobileControlStyle}
                                  min-width: 140px;
                                `}

                                ${field.combobox?.styles?.controlStyle}
                              `,
                              selectboxStyle: css`
                                ${fieldSize &&
                                css`
                                  font-size: ${fieldSize};
                                `};

                                ${mobileInputStyle};
                                ${mobile &&
                                field.title &&
                                css`
                                  text-align: end;
                                  padding-right: 40px;
                                `};

                                ${field?.combobox?.styles?.selectboxStyle}
                              `,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `};

                                ${field.combobox?.styles?.containerStyle}
                              `,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};
                                ${mobileLabelStyle};

                                ${field.combobox?.styles?.labelStyle}
                              `,
                            }}
                          />
                        )}
                      />
                    );
                  }

                  case "chips": {
                    return (
                      <Controller
                        key={index}
                        name={field.name as Path<T>}
                        control={control}
                        render={({ field: controllerField }) => (
                          <Chips
                            id={id}
                            name={field.name}
                            mobile={mobile}
                            label={field.title}
                            helper={field.helper}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            labelPosition={labelPosition}
                            className={field?.className}
                            required={required}
                            filterPlaceholder={field.placeholder}
                            disabled={field.disabled || disabled}
                            inputValue={controllerField.value}
                            setInputValue={(e) => {
                              controllerField?.onChange(e);
                              controllerField?.onBlur();
                              field.onChange?.(e);

                              if (onChange) {
                                onChange(
                                  (field?.name as keyof T) ?? "chips",
                                  e.target.value
                                );
                              }
                            }}
                            onChange={(e) => {
                              controllerField?.onChange(e);
                              controllerField?.onBlur();
                              const inputValueEvent = {
                                target: { name: field.name, value: e },
                              };
                              field.onChange?.(inputValueEvent);

                              if (onChange) {
                                onChange(
                                  (field?.name as keyof T) ?? "chips",
                                  e
                                );
                              }
                            }}
                            {...field.chips}
                            styles={{
                              ...field.chips?.styles,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};

                                ${field.chips?.styles?.labelStyle}
                              `,
                              chipSelectedStyle: css`
                                ${fieldSize &&
                                css`
                                  font-size: ${fieldSize};
                                `};
                                ${field.chips?.styles?.chipSelectedStyle}
                              `,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `};
                                ${field.chips?.styles?.containerStyle}
                              `,
                              bodyStyle: css`
                                ${mobileBodyStyle};

                                ${field.chips?.styles?.bodyStyle}
                              `,
                              controlStyle: css`
                                ${mobileControlStyle};

                                ${field.chips?.styles?.controlStyle}
                              `,
                              chipsContainerStyle: css`
                                ${mobile &&
                                css`
                                  width: fit-content;
                                  justify-content: end;
                                  flex-direction: row-reverse;
                                `};
                                ${field.chips?.styles?.chipsContainerStyle}
                              `,
                            }}
                          />
                        )}
                      />
                    );
                  }

                  case "rating": {
                    return (
                      <Controller
                        key={index}
                        name={field.name as Path<T>}
                        control={control}
                        render={({ field: controllerField, fieldState }) => {
                          const size = mobile
                            ? (field?.rating?.size ?? "lg")
                            : field?.rating?.size;

                          return (
                            <Rating
                              editable
                              id={field.id}
                              labelGap={field.labelGap}
                              labelWidth={field.labelWidth}
                              size={size}
                              labelPosition={labelPosition}
                              className={field?.className}
                              label={field.title}
                              helper={field.helper}
                              required={required}
                              name={field.name}
                              rating={controllerField.value}
                              onChange={(e) => {
                                controllerField.onChange(e.target.value);
                                controllerField?.onBlur();
                                field.onChange?.(e);
                                if (onChange) {
                                  onChange(
                                    field.name as keyof T,
                                    e.target.value
                                  );
                                }
                              }}
                              showError={!!fieldState.error}
                              errorMessage={fieldState.error?.message}
                              disabled={field.disabled || disabled}
                              {...field.rating}
                              styles={{
                                ...field.rating?.styles,
                                labelStyle: css`
                                  ${labelSize &&
                                  css`
                                    font-size: ${labelSize};
                                  `};
                                  ${mobileLabelStyle};

                                  ${field.rating?.styles?.labelStyle}
                                `,
                                containerStyle: css`
                                  ${fieldSize &&
                                  css`
                                    font-size: ${fieldSize};
                                  `};
                                  ${field.width &&
                                  css`
                                    width: ${field.width};
                                  `};

                                  ${field.rating?.styles?.containerStyle}
                                `,
                                bodyStyle: css`
                                  ${mobileBodyStyle};
                                  ${field.rating?.styles?.bodyStyle}
                                `,
                                controlStyle: css`
                                  ${mobileControlStyle};
                                  ${field.rating?.styles?.controlStyle}
                                `,
                                starsWrapperStyle: css`
                                  ${mobile &&
                                  css`
                                    gap: 4px;
                                  `};
                                  ${field.rating?.styles?.starsWrapperStyle}
                                `,
                              }}
                            />
                          );
                        }}
                      />
                    );
                  }

                  case "thumbfield": {
                    return (
                      <Controller
                        key={index}
                        control={control}
                        name={field.name as Path<T>}
                        render={({ field: controllerField }) => (
                          <ThumbField
                            id={field.id}
                            label={field.title}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            labelPosition={labelPosition}
                            className={field?.className}
                            value={controllerField.value ?? false}
                            required={required}
                            helper={field.helper}
                            {...register(field.name as Path<T>, {
                              onChange: (e) => {
                                if (field.onChange) {
                                  field.onChange(e);
                                }
                                if (onChange) {
                                  onChange(
                                    field.name as keyof T,
                                    e.target.checked
                                  );
                                }
                              },
                            })}
                            onChange={(e) => {
                              controllerField?.onChange(e);
                              controllerField?.onBlur();
                              field.onChange?.(e);
                              if (onChange) {
                                onChange(field.name as keyof T, e.target.value);
                              }
                            }}
                            showError={shouldShowError(field.name)}
                            errorMessage={
                              errors[field.name as keyof T]?.message as
                                | string
                                | undefined
                            }
                            disabled={field.disabled || disabled}
                            {...field.thumbField}
                            styles={{
                              ...field.thumbField?.styles,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};
                                ${mobileLabelStyle};

                                ${field.thumbField?.styles?.labelStyle}
                              `,
                              triggerWrapperStyle: css`
                                ${fieldSize &&
                                css`
                                  font-size: ${fieldSize};
                                `};

                                ${field.thumbField?.styles?.triggerWrapperStyle}
                              `,
                              triggerStyle: css`
                                ${mobile &&
                                css`
                                  svg {
                                    width: 32px;
                                    height: 32px;
                                  }
                                `};

                                ${field.thumbField?.styles?.triggerStyle};
                              `,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `}
                                ${field.thumbField?.styles?.containerStyle}
                              `,
                              bodyStyle: css`
                                ${mobileBodyStyle};
                                ${field.thumbField?.styles?.bodyStyle}
                              `,
                              controlStyle: css`
                                ${mobileControlStyle};
                                ${field.thumbField?.styles?.controlStyle}
                              `,
                            }}
                          />
                        )}
                      />
                    );
                  }

                  case "toggle": {
                    return (
                      <Controller
                        key={index}
                        control={control}
                        name={field.name as Path<T>}
                        render={({ field: controllerField }) => (
                          <Toggle
                            id={field.id}
                            name={controllerField.name}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            labelPosition={labelPosition}
                            className={field?.className}
                            placeholder={field.placeholder}
                            checked={controllerField.value ?? false}
                            required={required}
                            helper={field.helper}
                            onChange={(e) => {
                              controllerField?.onChange(e);
                              controllerField?.onBlur();
                              field.onChange?.(e);
                              if (onChange) {
                                onChange(
                                  field.name as keyof T,
                                  e.target.checked
                                );
                              }
                            }}
                            onBlur={controllerField.onBlur}
                            showError={shouldShowError(field.name)}
                            errorMessage={
                              errors[field.name as keyof T]?.message as
                                | string
                                | undefined
                            }
                            disabled={field.disabled || disabled}
                            {...field.toggle}
                            title={field.title}
                            label={field.placeholder}
                            styles={{
                              ...field.toggle?.styles,
                              titleStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};
                                ${mobileLabelStyle};

                                ${field.toggle?.styles?.titleStyle}
                              `,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};

                                ${field.toggle?.styles?.labelStyle};
                              `,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `};
                                ${field.toggle?.styles?.containerStyle}
                              `,
                              controlStyle: css`
                                min-height: 34px;

                                ${mobileControlStyle};
                                ${field.toggle?.styles?.controlStyle}
                              `,
                              bodyStyle: css`
                                ${!field.title &&
                                hasFieldTitle &&
                                css`
                                  margin-top: 26px;
                                  justify-content: end;
                                `};

                                ${mobileBodyStyle};
                                ${field.toggle?.styles?.bodyStyle}
                              `,
                            }}
                          />
                        )}
                      />
                    );
                  }

                  case "capsule": {
                    return (
                      <Controller
                        key={index}
                        control={control}
                        name={field.name as Path<T>}
                        render={({ field: controllerField }) => (
                          <Capsule
                            id={field.id}
                            name={field.name}
                            label={field.title}
                            labelGap={field.labelGap}
                            labelWidth={field.labelWidth}
                            labelPosition={labelPosition}
                            className={field?.className}
                            required={required}
                            activeTab={controllerField.value}
                            helper={field.helper}
                            errorIconPosition={mobile ? "none" : "absolute"}
                            disabled={field.disabled || disabled}
                            onTabChange={(e) => {
                              const inputValueEvent = {
                                target: { name: field.name, value: e },
                              };
                              controllerField?.onChange(e);
                              controllerField?.onBlur();
                              field.onChange?.(inputValueEvent);
                              if (onChange) {
                                onChange(field.name as keyof T, e);
                              }
                            }}
                            showError={shouldShowError(field.name)}
                            errorMessage={
                              errors[field.name as keyof T]?.message as
                                | string
                                | undefined
                            }
                            {...field.capsule}
                            styles={{
                              ...field.capsule?.styles,
                              labelStyle: css`
                                ${labelSize &&
                                css`
                                  font-size: ${labelSize};
                                `};
                                ${mobileLabelStyle};

                                ${field.capsule?.styles?.labelStyle}
                              `,
                              capsuleWrapperStyle: css`
                                height: 34px;
                                ${mobile &&
                                css`
                                  transform: translateX(10px);
                                  background-color: transparent;
                                `}

                                ${field.capsule?.styles?.capsuleWrapperStyle}
                              `,
                              containerStyle: css`
                                ${field.width &&
                                css`
                                  width: ${field.width};
                                `};

                                ${!field.title &&
                                hasFieldTitle &&
                                css`
                                  min-height: 60px;
                                  justify-content: end;
                                `};

                                ${field.capsule?.styles?.containerStyle}
                              `,
                              bodyStyle: css`
                                ${mobileBodyStyle};

                                ${field.capsule?.styles?.bodyStyle}
                              `,
                              controlStyle: css`
                                ${mobileControlStyle};

                                ${field.capsule?.styles?.controlStyle}
                              `,
                            }}
                          />
                        )}
                      />
                    );
                  }

                  default:
                    return null;
                }
              })();

              return (
                <Fragment key={index}>
                  {fieldNode}
                  {showSeparator && <Separator $theme={statefulFormTheme} />}
                </Fragment>
              );
            })}
          </RowFormField>
        );
      })}
    </ContainerFormField>
  );
}

const Separator = styled.div<{ $theme?: StatefulFormThemeConfig }>`
  width: 100%;
  height: 1px;
  background-color: ${({ $theme }) =>
    $theme?.borderColor ?? "rgba(0,0,0,0.08)"};
`;

export interface StatefulFormLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "label" | "style"> {
  label?: string;
  helper?: string;
  styles: { self?: CSSProp };
  labelPosition?: FieldLaneProps["labelPosition"];
  labelWidth?: FieldLaneProps["labelWidth"];
  required?: boolean;
  disabled?: boolean;
}

function StatefulFormLabel({
  label,
  helper,
  styles,
  required,
  labelPosition,
  labelWidth,
  disabled,
  className,
  id,
  ...props
}: StatefulFormLabelProps) {
  return (
    <Label
      {...props}
      $disabled={disabled}
      id={id}
      className={applyClassName("label", className)}
      $labelPosition={labelPosition}
      $labelWidth={labelWidth}
      $style={styles?.self}
      aria-label="stateful-form-label-wrapper"
    >
      <LabelText aria-label="stateful-form-label-text">
        {label}
        {required && (
          <Asterisk aria-label="stateful-form-label-asterisk">*</Asterisk>
        )}
      </LabelText>

      {helper && <Helper value={helper} />}
    </Label>
  );
}

const Label = styled.label<{
  $style?: CSSProp;
  $labelWidth?: FieldLaneProps["labelWidth"];
  $labelPosition?: FieldLaneProps["labelPosition"];
  $disabled?: boolean;
}>`
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  min-width: 0;

  width: ${({ $labelWidth, $labelPosition }) =>
    $labelWidth ?? ($labelPosition === "left" ? "25%" : "100%")};
  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
    `}
  ${({ $style }) => $style}
`;

const Asterisk = styled.span`
  color: red;
  margin-left: 2px;
`;

const LabelText = styled.span`
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface StatefulFormSanitizeIdProps {
  name?: string;
  id?: string;
  prefix?: string;
}

function sanitizeId({
  name,
  id,
  prefix = "input",
}: StatefulFormSanitizeIdProps): string {
  const sanitize = (str: string) =>
    str
      .toLowerCase()
      .replace(/\s+/g, "_") // 1. spaces → underscores
      .replace(/[^0-9a-z_-]/g, ""); // 2. Remove all non-ASCII characters (allow only 0-9, a-z, A-Z, _ and -)

  if (id) return sanitize(id);
  if (name) return `${prefix}-${sanitize(name)}`;
  return prefix;
}

const ContainerFormField = styled.div<{ $style: CSSProp }>`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  display: flex;
  flex-direction: column;
  gap: 6px;

  ${({ $style }) => $style}
`;

const RowFormField = styled.div<{ $style: CSSProp }>`
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: start;
  justify-content: start;

  ${({ $style }) => $style}
`;

StatefulForm.Label = StatefulFormLabel;
StatefulForm.sanitizeId = sanitizeId;

export { StatefulForm };
