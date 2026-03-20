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
import { Phonebox, CountryCodeProps, PhoneboxProps } from "./phonebox";
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
import { Togglebox, ToggleboxProps } from "./togglebox";
import { Capsule, CapsuleProps } from "./capsule";
import { Timebox, TimeboxProps } from "./timebox";
import { Button, ButtonProps } from "./button";
import { Radio, RadioProps } from "./radio";
import Helper from "./helper";
import { FigureProps } from "./figure";
import { Pinbox, PinboxProps } from "./pinbox";
import { FieldLaneProps } from "./field-lane";
import { Frame, FrameProps } from "./frame";

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
  | CountryCodeProps
  | string[]
  | number[];

export type FormFieldType =
  | "text"
  | "message"
  | "number"
  | "email"
  | "password"
  | "textarea"
  | "checkbox"
  | "radio"
  | "phone"
  | "color"
  | "file_drop_box"
  | "file"
  | "image"
  | "signbox"
  | "money"
  | "date"
  | "combo"
  | "chips"
  | "rating"
  | "thumbfield"
  | "toggle"
  | "capsule"
  | "time"
  | "button"
  | "pin"
  | "custom"
  | "frame";

export interface StatefulFormProps<Z extends ZodTypeAny> {
  fields: FormFieldGroup[];
  formValues: TypeOf<Z>;
  validationSchema?: Z;
  mode?: "onChange" | "onBlur" | "onSubmit";
  onValidityChange?: (e: boolean) => void;
  labelSize?: string;
  fieldSize?: string;
  onChange?: (args: { currentState: any }) => void;
  autoFocusField?: string;
  styles?: StatefulFormStylesProps;
}

export interface StatefulFormStylesProps {
  containerStyle?: CSSProp;
  rowStyle?: CSSProp;
}

export type FormFieldGroup = FormFieldProps | FormFieldProps[];

export interface FormFieldProps {
  name: string;
  id?: string;
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
  rowJustifyContent?: "center" | "start" | "end" | "between";
  rowAlignItems?: "center" | "start" | "end" | "between";
  onChange?: (e?: StatefulOnChangeType) => void;
  onClick?: (e?: React.MouseEvent) => void;
  textboxProps?: TextboxProps;
  textareaProps?: TextareaProps;
  checkboxProps?: CheckboxProps;
  radioProps?: RadioProps;
  phoneboxProps?: PhoneboxProps;
  colorboxProps?: ColorboxProps;
  moneyProps?: MoneyboxProps;
  fileDropBoxProps?: FileDropBoxProps;
  fileInputBoxProps?: FileInputBoxProps;
  imageboxProps?: ImageboxProps;
  signboxProps?: SignboxProps;
  dateProps?: DateboxProps;
  comboboxProps?: ComboboxProps;
  chipsProps?: ChipsProps;
  ratingProps?: RatingProps;
  thumbFieldProps?: ThumbFieldProps;
  toggleboxProps?: ToggleboxProps;
  capsuleProps?: CapsuleProps;
  timeboxProps?: TimeboxProps;
  buttonProps?: ButtonProps;
  pinboxProps?: PinboxProps;
  frameProps?: FrameProps;
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
}: StatefulFormProps<Z>) {
  const handleFieldChange = (name: keyof TypeOf<Z>, value: FormValueType) => {
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
  } = useForm<TypeOf<Z>>(formConfig);

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
    const fieldConfig = fields.flat().find((field) => field.name === name);

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

  return (
    <>
      <FormFields
        labelSize={labelSize}
        fieldSize={fieldSize}
        control={control}
        fields={fields}
        formValues={formValues}
        register={register}
        errors={errors}
        setValue={setValue}
        onChange={handleFieldChange}
        autoFocusField={autoFocusField}
        styles={styles}
        shouldShowError={shouldShowError}
      />
    </>
  );
}

function getSchemaForVisibleFields<Z extends ZodTypeAny>(
  validationSchema?: Z,
  fields?: FormFieldGroup[]
) {
  if (!validationSchema) return undefined;

  if (!(validationSchema instanceof ZodObject)) {
    throw new Error("StatefulForm only supports Zod object schemas");
  }

  const objSchema = validationSchema as ZodObject<any>;

  const flatFields: FormFieldProps[] = fields.flatMap((f) =>
    Array.isArray(f) ? f : [f]
  );

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
  styles?: StatefulFormStylesProps;
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
}: FormFieldsProps<T>) {
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = refs.current[autoFocusField];
      el?.focus?.();
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ContainerFormField $style={styles?.containerStyle}>
      {fields.map((group: FormFieldGroup, indexGroup: number) => {
        const visibleFields = (Array.isArray(group) ? group : [group]).filter(
          (field) => !field.hidden
        );

        if (visibleFields.length === 0) {
          return;
        }

        const rowJustifiedContent = visibleFields.find(
          (f) => f.rowJustifyContent
        )?.rowJustifyContent;

        const rowAlignedItem = visibleFields.find(
          (f) => f.rowAlignItems
        )?.rowAlignItems;

        const rowStyleItem = visibleFields.find((f) => f.rowStyle)?.rowStyle;

        const nonButtonFields = visibleFields.filter(
          (f) => f.type !== "button"
        );
        const hasFieldTitle = nonButtonFields.some((f) => f.title);

        return (
          <RowFormField
            aria-label="stateful-form-row"
            $style={css`
              ${styles?.rowStyle}
              ${rowJustifiedContent &&
              css`
                justify-content: ${rowJustifiedContent === "end"
                  ? "flex-end"
                  : rowJustifiedContent === "start"
                    ? "flex-start"
                    : rowJustifiedContent === "between"
                      ? "space-between"
                      : "center"};
              `}


              ${rowAlignedItem &&
              css`
                align-items: ${rowAlignedItem === "end"
                  ? "end"
                  : rowAlignedItem === "start"
                    ? "start"
                    : rowAlignedItem === "between"
                      ? "space-between"
                      : "center"};
              `}

              ${rowStyleItem}
            `}
            key={indexGroup}
          >
            {visibleFields.map((field: FormFieldProps, index: number) => {
              if (field.type === "frame") {
                return (
                  <Frame
                    key={index}
                    title={field.title}
                    {...field?.frameProps}
                    styles={{
                      containerStyle: css`
                        margin-top: 10px;
                        min-width: 0;
                        ${field?.frameProps?.styles?.containerStyle}
                      `,
                      titleStyle: css`
                        font-size: 12px;
                        color: black;
                        left: 50%;
                        transform: translateX(-50%);
                        margin-top: 2px;

                        ${field?.frameProps?.styles?.titleStyle}
                      `,
                    }}
                  >
                    {field?.fields && (
                      <FormFields
                        labelSize={labelSize}
                        fieldSize={fieldSize}
                        control={control}
                        fields={field?.fields}
                        formValues={formValues}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        onChange={onChange}
                        autoFocusField={autoFocusField}
                        styles={styles}
                        shouldShowError={shouldShowError}
                      />
                    )}
                  </Frame>
                );
              }

              return field.type === "custom" ? (
                <Fragment key={index}>{field.render}</Fragment>
              ) : field.type === "text" ||
                field.type === "message" ||
                field.type === "number" ||
                field.type === "email" ||
                field.type === "password" ? (
                <Textbox
                  key={index}
                  id={field.id}
                  label={field.title}
                  type={field.type}
                  labelGap={field.labelGap}
                  labelWidth={field.labelWidth}
                  labelPosition={field.labelPosition}
                  placeholder={field.placeholder}
                  value={formValues[field.name as keyof T] ?? ""}
                  required={field.required}
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
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  disabled={field.disabled}
                  {...field.textboxProps}
                  styles={{
                    ...field.textboxProps?.styles,
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.textboxProps?.styles?.labelStyle}
                    `,
                    self: css`
                      ${fieldSize &&
                      css`
                        font-size: ${fieldSize};
                      `}
                      height: 34px;
                      ${field.textboxProps?.styles?.self}
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.textboxProps?.styles?.containerStyle}
                    `,
                    bodyStyle: css`
                      ${!field.title &&
                      hasFieldTitle &&
                      css`
                        min-height: 60px;
                        justify-content: end;
                      `}

                      ${field.textboxProps?.styles?.bodyStyle}
                    `,
                  }}
                />
              ) : field.type === "pin" ? (
                <Controller
                  key={index}
                  control={control}
                  name={field.name as Path<T>}
                  render={({ field: controllerField }) => (
                    <Pinbox
                      key={index}
                      id={field.id}
                      name={field.name}
                      labelPosition={field.labelPosition}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      required={field.required}
                      label={field.title}
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
                      disabled={field.disabled}
                      {...field.pinboxProps}
                      styles={{
                        ...field.pinboxProps?.styles,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.pinboxProps?.styles?.containerStyle}
                        `,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.pinboxProps?.styles?.labelStyle}
                        `,
                        bodyStyle: css`
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            margin-top: 30px;
                            justify-content: end;
                          `}
                          ${field.pinboxProps?.styles?.bodyStyle}
                        `,
                      }}
                      ref={controllerField.ref}
                    />
                  )}
                />
              ) : field.type === "button" ? (
                <Button
                  key={index}
                  {...field.buttonProps}
                  id={field.id}
                  title={
                    field.buttonProps?.title
                      ? field.buttonProps?.title
                      : field.placeholder
                  }
                  styles={{
                    ...field.buttonProps?.styles,
                    self: css`
                      ${field.icon &&
                      css`
                        gap: 2px;
                      `}
                      width:100%;
                      height: 34px;
                      font-size: ${labelSize ?? "12px"};
                      ${field.buttonProps?.styles?.self};
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}

                      ${hasFieldTitle &&
                      css`
                        margin-top: 26px;
                        justify-content: end;
                        align-items: end;
                      `}

                      ${field.buttonProps?.styles?.containerStyle};
                    `,
                  }}
                  onClick={(e) => {
                    if (field?.buttonProps?.onClick) {
                      field?.buttonProps?.onClick(e);
                    } else {
                      field.onClick(e);
                    }
                  }}
                  disabled={field.disabled}
                >
                  {field.icon && (
                    <field.icon size={fieldSize ? parseInt(fieldSize) : 16} />
                  )}

                  {field.title}
                </Button>
              ) : field.type === "time" ? (
                <Timebox
                  key={index}
                  id={field.id}
                  label={field.title}
                  labelGap={field.labelGap}
                  labelWidth={field.labelWidth}
                  labelPosition={field.labelPosition}
                  value={formValues[field.name as keyof T] ?? ""}
                  required={field.required}
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
                  showError={shouldShowError(field.name)}
                  errorMessage={
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  disabled={field.disabled}
                  {...field.timeboxProps}
                  styles={{
                    ...field.timeboxProps?.styles,
                    self: css`
                      ${fieldSize &&
                      css`
                        font-size: ${fieldSize};
                      `}
                      height: 34px;
                      ${field.timeboxProps?.styles?.self}
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.timeboxProps?.styles?.containerStyle}
                    `,
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.timeboxProps?.styles?.labelStyle}
                    `,
                    bodyStyle: css`
                      ${!field.title &&
                      hasFieldTitle &&
                      css`
                        min-height: 60px;
                        justify-content: end;
                      `}

                      ${field.timeboxProps?.styles?.bodyStyle}
                    `,
                  }}
                  ref={(el) => {
                    if (el) refs.current[field.name] = el;
                    const { ref } = register(field.name as Path<T>);
                    if (ref) ref(el);
                  }}
                />
              ) : field.type === "textarea" ? (
                <Textarea
                  key={index}
                  id={field.id}
                  label={field.title}
                  rows={field.rows}
                  labelGap={field.labelGap}
                  labelWidth={field.labelWidth}
                  labelPosition={field.labelPosition}
                  placeholder={field.placeholder}
                  value={formValues[field.name as keyof T] ?? ""}
                  required={field.required}
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
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  disabled={field.disabled}
                  {...field.textareaProps}
                  styles={{
                    ...field.textareaProps?.styles,
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.textareaProps?.styles?.labelStyle}
                    `,
                    self: css`
                      ${fieldSize &&
                      css`
                        font-size: ${fieldSize};
                      `}
                      ${field.textareaProps?.styles?.self}
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.textareaProps?.styles?.containerStyle}
                    `,
                    bodyStyle: css`
                      ${!field.title &&
                      hasFieldTitle &&
                      css`
                        min-height: 60px;
                        justify-content: end;

                        ${field.textareaProps?.styles?.bodyStyle}
                      `}
                    `,
                  }}
                />
              ) : field.type === "checkbox" ? (
                <Controller
                  key={index}
                  control={control}
                  name={field.name as Path<T>}
                  render={({ field: controllerField }) => (
                    <Checkbox
                      id={field.id}
                      title={field.title}
                      label={field.placeholder}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
                      name={field.name}
                      value={field.name}
                      placeholder={field.placeholder}
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
                      required={field.required}
                      showError={shouldShowError(field.name)}
                      onChange={(e) => {
                        controllerField?.onChange(e);
                        controllerField?.onBlur();
                        if (onChange) {
                          onChange(field.name as keyof T, e.target.checked);
                        }
                        field.onChange?.(e);
                      }}
                      disabled={field.disabled}
                      {...field.checkboxProps}
                      styles={{
                        ...field.checkboxProps?.styles,
                        titleStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.checkboxProps?.styles?.titleStyle}
                        `,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.checkboxProps?.styles?.labelStyle}
                        `,
                        self: css`
                          ${labelSize &&
                          css`
                            width: calc(${labelSize} + 2px);
                            height: calc(${labelSize} + 2px);
                          `}
                          ${field.checkboxProps?.styles?.self}
                        `,
                        iconStyle: css`
                          ${labelSize &&
                          css`
                            width: calc(${labelSize} - 4px);
                            height: calc(${labelSize} - 4px);
                          `}
                          ${field.checkboxProps?.styles?.iconStyle}
                        `,
                        containerStyle: css`
                          width: 100%;
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.checkboxProps?.styles?.containerStyle}
                        `,
                        boxStyle: css`
                          ${labelSize &&
                          css`
                            width: calc(${labelSize} + 2px);
                            height: calc(${labelSize} + 2px);
                          `}
                          ${field.checkboxProps?.styles?.boxStyle}
                        `,
                        bodyStyle: css`
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            min-height: 60px;
                            justify-content: end;
                          `}

                          ${field.checkboxProps?.styles?.bodyStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "radio" ? (
                <Controller
                  key={index}
                  control={control}
                  name={field.name as Path<T>}
                  render={({ field: controllerField }) => (
                    <Radio
                      id={field.id}
                      label={field.placeholder}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
                      name={field.name}
                      title={field.title}
                      placeholder={field.placeholder}
                      checked={controllerField.value ?? false}
                      errorMessage={
                        errors[field.name as keyof T]?.message as
                          | string
                          | undefined
                      }
                      helper={field.helper}
                      required={field.required}
                      showError={shouldShowError(field.name)}
                      onChange={(e) => {
                        controllerField?.onChange(e);
                        controllerField?.onBlur();
                        if (onChange) {
                          onChange(field.name as keyof T, e.target.checked);
                        }
                        field.onChange?.(e);
                      }}
                      disabled={field.disabled}
                      {...field.radioProps}
                      styles={{
                        ...field.radioProps?.styles,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.radioProps?.styles?.labelStyle}
                        `,
                        titleStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.radioProps?.styles?.titleStyle}
                        `,
                        self: css`
                          ${fieldSize &&
                          css`
                            width: ${fieldSize};
                            height: ${fieldSize};
                          `}
                          ${field.radioProps?.styles?.self}
                        `,
                        containerStyle: css`
                          width: 100%;
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.radioProps?.styles?.containerStyle}
                        `,
                        bodyStyle: css`
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            min-height: 60px;
                            justify-content: end;
                          `}

                          ${field.radioProps?.styles?.bodyStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "phone" ? (
                <Controller
                  key={index}
                  control={control}
                  name={"phone" as Path<T>}
                  render={({ field: controllerField }) => (
                    <Phonebox
                      id={field.id}
                      name={field.name}
                      label={field.title}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
                      required={field.required}
                      ref={(el) => {
                        if (el) refs.current[field.name] = el;
                        controllerField.ref(el);
                      }}
                      onBlur={controllerField.onBlur}
                      value={controllerField.value}
                      helper={field.helper}
                      placeholder={field.placeholder}
                      onChange={(
                        e:
                          | {
                              target: {
                                name: string;
                                value: CountryCodeProps;
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
                      disabled={field.disabled}
                      {...field.phoneboxProps}
                      styles={{
                        ...field.phoneboxProps?.styles,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.phoneboxProps?.styles?.labelStyle}
                        `,
                        self: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          ${field.phoneboxProps?.styles?.inputWrapperStyle}
                        `,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.phoneboxProps?.styles?.containerStyle}
                        `,
                        bodyStyle: css`
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            min-height: 60px;
                            justify-content: end;
                          `}

                          ${field.phoneboxProps?.styles?.bodyStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "color" ? (
                <Controller
                  key={index}
                  name={field.name as Path<T>}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <Colorbox
                      id={field.id}
                      name={field.name}
                      label={field.title}
                      required={field.required}
                      placeholder={field.placeholder}
                      helper={field.helper}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
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
                      disabled={field.disabled}
                      {...field.colorboxProps}
                      styles={{
                        ...field.colorboxProps?.styles,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.colorboxProps?.styles?.labelStyle}
                        `,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.colorboxProps?.styles?.containerStyle}
                        `,
                        self: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          height:34px;
                          ${field.colorboxProps?.styles?.self}
                        `,
                        bodyStyle: css`
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            min-height: 60px;
                            justify-content: end;
                          `}

                          ${field.colorboxProps?.styles?.bodyStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "file_drop_box" ? (
                <FileDropBox
                  key={index}
                  id={field.id}
                  label={field.title}
                  placeholder={field.placeholder}
                  labelGap={field.labelGap}
                  labelWidth={field.labelWidth}
                  labelPosition={field.labelPosition}
                  helper={field.helper}
                  name={field.name}
                  required={field.required}
                  disabled={field.disabled}
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
                  {...field.fileDropBoxProps}
                  styles={{
                    ...field.fileDropBoxProps?.styles,
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.fileDropBoxProps?.styles?.labelStyle}
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.fileDropBoxProps?.styles?.containerStyle}
                    `,
                  }}
                />
              ) : field.type === "file" ? (
                <FileInputBox
                  key={index}
                  id={field.id}
                  labelGap={field.labelGap}
                  labelWidth={field.labelWidth}
                  labelPosition={field.labelPosition}
                  label={field.title}
                  placeholder={field.placeholder}
                  required={field.required}
                  showError={shouldShowError(field.name)}
                  helper={field.helper}
                  name={field.name}
                  disabled={field.disabled}
                  errorMessage={
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  {...field.fileInputBoxProps}
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
                    ...field.fileInputBoxProps?.styles,
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.fileInputBoxProps?.styles?.labelStyle}
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.fileInputBoxProps?.styles?.containerStyle}
                    `,
                    bodyStyle: css`
                      ${!field.title &&
                      hasFieldTitle &&
                      css`
                        margin-top: 26px;
                        justify-content: end;
                      `}

                      ${field.fileInputBoxProps?.styles?.bodyStyle}
                    `,
                  }}
                />
              ) : field.type === "image" ? (
                <Imagebox
                  key={index}
                  id={field.id}
                  labelGap={field.labelGap}
                  labelWidth={field.labelWidth}
                  labelPosition={field.labelPosition}
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
                      target: { name: field.name, value: file ?? undefined },
                    });
                    if (onChange) {
                      onChange(field.name as keyof T, file ?? undefined);
                    }
                  }}
                  label={field.title}
                  disabled={field.disabled}
                  required={field.required}
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
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  {...field.imageboxProps}
                  styles={{
                    ...field.imageboxProps?.styles,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.imageboxProps?.styles?.containerStyle}
                    `,
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.imageboxProps?.styles?.labelStyle}
                    `,
                    bodyStyle: css`
                      ${!field.title &&
                      hasFieldTitle &&
                      css`
                        margin-top: 26px;
                        justify-content: end;
                      `}

                      ${field.imageboxProps?.styles?.bodyStyle}
                    `,
                  }}
                />
              ) : field.type === "signbox" ? (
                <Signbox
                  key={index}
                  id={field.id}
                  clearable
                  name={field.name}
                  label={field.title}
                  labelGap={field.labelGap}
                  labelWidth={field.labelWidth}
                  labelPosition={field.labelPosition}
                  helper={field.helper}
                  required={field.required}
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
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  disabled={field.disabled}
                  {...field.signboxProps}
                  styles={{
                    ...field.signboxProps?.styles,
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.signboxProps?.styles?.labelStyle}
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.signboxProps?.styles?.containerStyle}
                    `,
                    bodyStyle: css`
                      ${!field.title &&
                      hasFieldTitle &&
                      css`
                        margin-top: 26px;
                        justify-content: end;
                      `}

                      ${field.signboxProps?.styles?.bodyStyle}
                    `,
                  }}
                />
              ) : field.type === "money" ? (
                <Controller
                  key={index}
                  name={field.name as Path<T>}
                  control={control}
                  render={({ field: rhf, fieldState }) => (
                    <Moneybox
                      key={index}
                      id={field.id}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
                      ref={(el) => {
                        if (el) refs.current[field.name] = el;
                        rhf.ref(el);
                      }}
                      name={field.name}
                      label={field.title}
                      helper={field.helper}
                      placeholder={field.placeholder}
                      value={rhf.value ?? ""}
                      required={field.required}
                      disabled={field.disabled}
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
                      {...field.moneyProps}
                      styles={{
                        ...field.moneyProps?.styles,
                        inputWrapperStyle: css`
                          height: 34px;
                          ${field.moneyProps?.styles?.inputWrapperStyle}
                        `,
                        self: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          ${field.moneyProps?.styles?.self}
                        `,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.moneyProps?.styles?.labelStyle}
                        `,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.moneyProps?.styles?.containerStyle}
                        `,
                        bodyStyle: css`
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            min-height: 60px;
                            justify-content: end;
                          `}

                          ${field.moneyProps?.styles?.bodyStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "date" ? (
                <Controller
                  key={index}
                  name={field.name as Path<T>}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Datebox
                      key={index}
                      id={field.id}
                      name={field.name}
                      label={field.title}
                      helper={field.helper}
                      required={field.required}
                      showError={shouldShowError(field.name)}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
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
                      placeholder={field.placeholder}
                      selectedDates={controllerField.value}
                      disabled={field.disabled}
                      {...field.dateProps}
                      styles={{
                        ...field?.dateProps?.styles,
                        selectboxStyle: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}

                          ${field?.dateProps?.styles?.selectboxStyle}
                        `,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.dateProps?.styles?.labelStyle}
                        `,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.dateProps?.styles?.containerStyle}
                        `,
                        self: field?.dateProps?.styles?.self,
                        bodyStyle: css`
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            min-height: 60px;
                            justify-content: end;
                          `}

                          ${field.dateProps?.styles?.bodyStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "combo" ? (
                <Controller
                  key={index}
                  name={field.name as Path<T>}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Combobox
                      id={field.id}
                      name={field.name}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
                      placeholder={field.placeholder}
                      label={field.title}
                      required={field.required}
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
                      disabled={field.disabled}
                      {...field.comboboxProps}
                      styles={{
                        ...field?.comboboxProps?.styles,
                        bodyStyle: css`
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            min-height: 60px;
                            justify-content: end;
                          `}

                          ${field.comboboxProps?.styles?.bodyStyle}
                        `,
                        selectboxStyle: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}

                          ${field?.comboboxProps?.styles?.selectboxStyle}
                        `,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.comboboxProps?.styles?.containerStyle}
                        `,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.comboboxProps?.styles?.labelStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "chips" ? (
                <Controller
                  key={index}
                  name={field.name as Path<T>}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Chips
                      label={field.title}
                      helper={field.helper}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
                      required={field.required}
                      filterPlaceholder={field.placeholder}
                      disabled={field.disabled}
                      inputValue={controllerField.value}
                      setInputValue={(e) => {
                        controllerField?.onChange(e);
                        controllerField?.onBlur();
                        field.onChange?.(e);
                      }}
                      {...field.chipsProps}
                      styles={{
                        ...field.chipsProps?.styles,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.chipsProps?.styles?.labelStyle}
                        `,
                        chipSelectedStyle: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          ${field.chipsProps?.styles?.chipSelectedStyle}
                        `,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.chipsProps?.styles?.containerStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "rating" ? (
                <Controller
                  key={index}
                  name={field.name as Path<T>}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <Rating
                      editable
                      id={field.id}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
                      label={field.title}
                      helper={field.helper}
                      required={field.required}
                      rating={controllerField.value}
                      onChange={(e) => {
                        controllerField.onChange(e.target.value);
                        controllerField?.onBlur();
                        field.onChange?.(e);
                        if (onChange) {
                          onChange(field.name as keyof T, e.target.value);
                        }
                      }}
                      showError={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      disabled={field.disabled}
                      {...field.ratingProps}
                      styles={{
                        ...field.ratingProps?.styles,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.ratingProps?.styles?.labelStyle}
                        `,
                        containerStyle: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.ratingProps?.styles?.containerStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "thumbfield" ? (
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
                      labelPosition={field.labelPosition}
                      value={controllerField.value ?? false}
                      required={field.required}
                      helper={field.helper}
                      {...register(field.name as Path<T>, {
                        onChange: (e) => {
                          if (field.onChange) {
                            field.onChange(e);
                          }
                          if (onChange) {
                            onChange(field.name as keyof T, e.target.checked);
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
                      disabled={field.disabled}
                      {...field.thumbFieldProps}
                      styles={{
                        ...field.thumbFieldProps?.styles,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.thumbFieldProps?.styles?.labelStyle}
                        `,
                        triggerWrapperStyle: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          ${field.thumbFieldProps?.styles?.triggerWrapperStyle}
                        `,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.thumbFieldProps?.styles?.containerStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "toggle" ? (
                <Controller
                  key={index}
                  control={control}
                  name={field.name as Path<T>}
                  render={({ field: controllerField }) => (
                    <Togglebox
                      id={field.id}
                      name={controllerField.name}
                      labelGap={field.labelGap}
                      labelWidth={field.labelWidth}
                      labelPosition={field.labelPosition}
                      placeholder={field.placeholder}
                      checked={controllerField.value ?? false}
                      required={field.required}
                      helper={field.helper}
                      onChange={(e) => {
                        controllerField?.onChange(e);
                        controllerField?.onBlur();
                        field.onChange?.(e);
                        if (onChange) {
                          onChange(field.name as keyof T, e.target.checked);
                        }
                      }}
                      onBlur={controllerField.onBlur}
                      showError={shouldShowError(field.name)}
                      errorMessage={
                        errors[field.name as keyof T]?.message as
                          | string
                          | undefined
                      }
                      disabled={field.disabled}
                      {...field.toggleboxProps}
                      title={field.title}
                      label={field.placeholder}
                      styles={{
                        ...field.toggleboxProps?.styles,
                        titleStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.toggleboxProps?.styles?.titleStyle}
                        `,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.toggleboxProps?.styles?.labelStyle}
                        `,
                        containerStyle: css`
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.toggleboxProps?.styles?.containerStyle}
                        `,
                        bodyStyle: css`
                          min-height: 34px;
                          ${!field.title &&
                          hasFieldTitle &&
                          css`
                            margin-top: 26px;
                            justify-content: end;
                          `}

                          ${field.toggleboxProps?.styles?.bodyStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "capsule" ? (
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
                      labelPosition={field.labelPosition}
                      required={field.required}
                      activeTab={controllerField.value}
                      helper={field.helper}
                      disabled={field.disabled}
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
                      {...field.capsuleProps}
                      styles={{
                        ...field.capsuleProps?.styles,
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.capsuleProps?.styles?.labelStyle}
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
                          `}

                          ${field.capsuleProps?.styles?.containerStyle}
                        `,
                      }}
                    />
                  )}
                />
              ) : null;
            })}
          </RowFormField>
        );
      })}
    </ContainerFormField>
  );
}

export interface StatefulFormLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "label" | "style"> {
  label?: string;
  helper?: string;
  styles: { self?: CSSProp };
  labelPosition?: FieldLaneProps["labelPosition"];
  labelWidth?: FieldLaneProps["labelWidth"];
  required?: boolean;
}

function StatefulFormLabel({
  label,
  helper,
  styles,
  required,
  labelPosition,
  labelWidth,
  ...props
}: StatefulFormLabelProps) {
  return (
    <Label
      {...props}
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
}>`
  font-size: 0.75rem;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  min-width: 0;

  width: ${({ $labelWidth, $labelPosition }) =>
    $labelWidth ?? ($labelPosition === "left" ? "25%" : "100%")};
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
