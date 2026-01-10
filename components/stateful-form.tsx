import { useForm, UseFormProps, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { ZodTypeAny, TypeOf, ZodObject } from "zod";
import React, {
  ChangeEvent,
  Fragment,
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
import { RemixiconComponentType } from "@remixicon/react";
import { Radio, RadioProps } from "./radio";

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
  | string[]
  | null
  | undefined
  | CountryCodeProps;

interface StatefulFormProps<Z extends ZodTypeAny> {
  fields: FormFieldGroup[];
  formValues: TypeOf<Z>;
  validationSchema?: Z;
  mode?: "onChange" | "onBlur" | "onSubmit";
  onValidityChange?: (e: boolean) => void;
  labelSize?: string;
  fieldSize?: string;
  onChange?: (args: { currentState: any }) => void;
  containerStyle?: CSSProp;
  rowStyle?: CSSProp;
  autoFocusField?: string;
}

export type FormFieldGroup = FormFieldProps | FormFieldProps[];

export interface FormFieldProps {
  name: string;
  title?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  render?: ReactNode;
  hidden?: boolean;
  rows?: number;
  width?: string;
  icon?: RemixiconComponentType;
  disabled?: boolean;
  rowJustifyContent?: "center" | "start" | "end" | "between";
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
  containerStyle,
  rowStyle,
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

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid, onValidityChange]);

  const shouldShowError = (field: keyof TypeOf<Z>): boolean => {
    const fieldConfig = fields
      .flat()
      .find((f) => (f as FormFieldProps).name === field) as FormFieldProps;

    if (
      !fieldConfig ||
      fieldConfig.type === "custom" ||
      fieldConfig.type === "button" ||
      fieldConfig.hidden
    ) {
      return false;
    }

    const value = formValues[field];
    const touched = touchedFields[field];
    const error = errors[field];

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
        rowStyle={rowStyle}
        containerStyle={containerStyle}
        shouldShowError={(name) => shouldShowError(name as keyof TypeOf<Z>)}
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
  containerStyle?: CSSProp;
  rowStyle?: CSSProp;
  autoFocusField?: string;
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
  containerStyle,
  rowStyle,
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
    <ContainerFormField $style={containerStyle}>
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

        return (
          <RowFormField
            aria-label="stateful-form-row"
            $style={css`
              ${rowStyle}
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
            `}
            key={indexGroup}
          >
            {visibleFields.map((field: FormFieldProps, index: number) => {
              return field.type === "custom" ? (
                <Fragment key={index}>{field.render}</Fragment>
              ) : field.type === "text" ||
                field.type === "message" ||
                field.type === "number" ||
                field.type === "email" ||
                field.type === "password" ? (
                <Textbox
                  key={index}
                  label={field.title}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formValues[field.name as keyof T] ?? ""}
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
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.textboxProps?.styles?.labelStyle}
                    `,
                    style: css`
                      ${fieldSize &&
                      css`
                        font-size: ${fieldSize};
                      `}
                      height: 34px;
                      ${field.textboxProps?.styles?.style}
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.textboxProps?.styles?.containerStyle}
                    `,
                  }}
                />
              ) : field.type === "button" ? (
                <Button
                  key={index}
                  {...field.buttonProps}
                  title={
                    field.buttonProps?.title
                      ? field.buttonProps?.title
                      : field.placeholder
                  }
                  styles={{
                    buttonStyle: css`
                      ${field.icon &&
                      css`
                        gap: 2px;
                      `}
                      width:100%;
                      height: 34px;
                      font-size: ${labelSize ?? "12px"};
                      ${field.buttonProps?.styles?.buttonStyle};
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.buttonProps?.styles?.containerStyle}
                    `,
                  }}
                  onClick={field.onClick}
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
                  label={field.title}
                  value={formValues[field.name as keyof T] ?? ""}
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
                  disabled={field.disabled}
                  {...field.timeboxProps}
                  styles={{
                    inputStyle: css`
                      ${fieldSize &&
                      css`
                        font-size: ${fieldSize};
                      `}
                      height: 34px;
                      ${field.timeboxProps?.styles?.inputStyle}
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
                  label={field.title}
                  rows={field.rows}
                  placeholder={field.placeholder}
                  value={formValues[field.name as keyof T] ?? ""}
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
                    labelStyle: css`
                      ${labelSize &&
                      css`
                        font-size: ${labelSize};
                      `}
                      ${field.textareaProps?.styles?.labelStyle}
                    `,
                    style: css`
                      ${fieldSize &&
                      css`
                        font-size: ${fieldSize};
                      `}
                      ${field.textareaProps?.styles?.style}
                    `,
                    containerStyle: css`
                      ${field.width &&
                      css`
                        width: ${field.width};
                      `}
                      ${field.textareaProps?.styles?.containerStyle}
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
                      title={field.title}
                      label={field.placeholder}
                      name={field.name}
                      placeholder={field.placeholder}
                      checked={controllerField.value ?? false}
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
                        inputStyle: css`
                          ${labelSize &&
                          css`
                            width: calc(${labelSize} + 2px);
                            height: calc(${labelSize} + 2px);
                          `}
                          ${field.checkboxProps?.styles?.inputStyle}
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
                      label={field.placeholder}
                      name={field.name}
                      title={field.title}
                      placeholder={field.placeholder}
                      checked={controllerField.value ?? false}
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
                      {...field.radioProps}
                      styles={{
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.radioProps?.styles?.labelStyle}
                        `,
                        titleStyle: css`
                          ${labelSize && `font-size: ${labelSize};`}
                          ${field.radioProps?.styles?.titleStyle}
                        `,
                        inputStyle: css`
                          ${fieldSize &&
                          css`
                            width: ${fieldSize};
                            height: ${fieldSize};
                          `}
                          ${field.radioProps?.styles?.inputStyle}
                        `,
                        containerStyle: css`
                          width: 100%;
                          ${field.width &&
                          css`
                            width: ${field.width};
                          `}
                          ${field.radioProps?.styles?.containerStyle}
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
                      label={field.title}
                      value={controllerField.value}
                      ref={(el) => {
                        if (el) refs.current[field.name] = el;
                        const { ref } = register(field.name as Path<T>);
                        if (ref) ref(el);
                      }}
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
                          controllerField.onBlur();
                          onChange?.("phone", e.target.value);
                        } else if (e.target.name === "country_code") {
                          onChange?.("country_code", e.target.value);
                        }
                        field.onChange?.(e);
                      }}
                      labelStyle={css`
                        ${labelSize &&
                        css`
                          font-size: ${labelSize};
                        `}
                        ${field.phoneboxProps?.labelStyle}
                      `}
                      inputWrapperStyle={css`
                        ${fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `}
                        ${field.phoneboxProps?.inputWrapperStyle}
                      `}
                      containerStyle={css`
                        ${field.width &&
                        css`
                          width: ${field.width};
                        `}
                        ${field.phoneboxProps?.containerStyle}
                      `}
                      showError={!!errors["phone"]}
                      errorMessage={errors["phone"]?.message as string}
                      disabled={field.disabled}
                      {...field.phoneboxProps}
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
                      label={field.title}
                      required={field.required}
                      placeholder={field.placeholder}
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
                        style: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          height:34px;
                          ${field.colorboxProps?.styles?.style}
                        `,
                      }}
                    />
                  )}
                />
              ) : field.type === "file_drop_box" ? (
                <FileDropBox
                  key={index}
                  label={field.title}
                  placeholder={field.placeholder}
                  labelStyle={css`
                    ${labelSize &&
                    css`
                      font-size: ${labelSize};
                    `}
                    ${field.fileDropBoxProps?.labelStyle}
                  `}
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
                    ${field.fileDropBoxProps?.containerStyle}
                  `}
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
                />
              ) : field.type === "file" ? (
                <FileInputBox
                  key={index}
                  label={field.title}
                  placeholder={field.placeholder}
                  labelStyle={css`
                    ${labelSize &&
                    css`
                      font-size: ${labelSize};
                    `}
                    ${field.fileInputBoxProps?.labelStyle}
                  `}
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
                    ${field.fileInputBoxProps?.containerStyle}
                  `}
                  showError={shouldShowError(field.name)}
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
                />
              ) : field.type === "image" ? (
                <Imagebox
                  key={index}
                  name={field.name}
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
                    ${field.imageboxProps?.containerStyle}
                  `}
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
                  labelStyle={css`
                    ${labelSize &&
                    css`
                      font-size: ${labelSize};
                    `}
                    ${field.imageboxProps?.labelStyle}
                  `}
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
                />
              ) : field.type === "signbox" ? (
                <Signbox
                  key={index}
                  clearable
                  name={field.name}
                  label={field.title}
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
                  }}
                />
              ) : field.type === "money" ? (
                <Moneybox
                  key={index}
                  label={field.title}
                  placeholder={field.placeholder}
                  ref={(el) => {
                    if (el) refs.current[field.name] = el;
                    const { ref } = register(field.name as Path<T>);
                    if (ref) ref(el);
                  }}
                  labelStyle={css`
                    ${labelSize &&
                    css`
                      font-size: ${labelSize};
                    `}
                    ${field.moneyProps?.labelStyle}
                  `}
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
                    ${field.moneyProps?.containerStyle}
                  `}
                  value={formValues[field.name as keyof T] ?? ""}
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
                  disabled={field.disabled}
                  {...field.moneyProps}
                  style={css`
                    ${fieldSize &&
                    css`
                      font-size: ${fieldSize};
                    `}
                    height: 34px;
                    ${field.moneyProps.style}
                  `}
                />
              ) : field.type === "date" ? (
                <Controller
                  key={index}
                  name={field.name as Path<T>}
                  control={control}
                  render={({ field: controllerField }) => (
                    <Datebox
                      key={index}
                      label={field.title}
                      showError={shouldShowError(field.name)}
                      ref={(el) => {
                        if (el) refs.current[field.name] = el;
                        const { ref } = register(field.name as Path<T>);
                        if (ref) ref(el);
                      }}
                      labelStyle={css`
                        ${labelSize &&
                        css`
                          font-size: ${labelSize};
                        `}
                        ${field.dateProps?.labelStyle}
                      `}
                      containerStyle={css`
                        ${field.width &&
                        css`
                          width: ${field.width};
                        `}
                        ${field.dateProps?.containerStyle}
                      `}
                      errorMessage={
                        errors[field.name as keyof T]?.[0]?.message as
                          | string
                          | undefined
                      }
                      setSelectedDates={(e) => {
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
                      selectboxStyle={css`
                        ${fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `}
                        border: 1px solid #d1d5db;
                        max-height: 34px;
                        &:focus {
                          border-color: #61a9f9;
                          box-shadow: 0 0 0 1px #61a9f9;
                        }
                        ${field?.dateProps?.selectboxStyle}
                      `}
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
                      placeholder={field.placeholder}
                      label={field.title}
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
                      setSelectedOptions={(e) => {
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
                      {...field.comboboxProps}
                      styles={{
                        selectboxStyle: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          border: 1px solid #d1d5db;
                          max-height: 34px;
                          &:focus {
                            border-color: #61a9f9;
                            box-shadow: 0 0 0 1px #61a9f9;
                          }
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
                      filterPlaceholder={field.placeholder}
                      inputValue={controllerField.value}
                      setInputValue={(e) => {
                        controllerField?.onChange(e);
                        controllerField?.onBlur();
                        field.onChange?.(e);
                      }}
                      {...field.chipsProps}
                      styles={{
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
                      label={field.title}
                      rating={controllerField.value}
                      onChange={(e) => {
                        controllerField.onChange(e.target.value);
                        controllerField?.onBlur();
                        field.onChange?.(e);
                        if (onChange) {
                          onChange(field.name as keyof T, e.target.value);
                        }
                      }}
                      labelStyle={css`
                        ${labelSize &&
                        css`
                          font-size: ${labelSize};
                        `}
                        ${field.ratingProps?.labelStyle}
                      `}
                      containerStyle={css`
                        ${fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `}
                        ${field.width &&
                        css`
                          width: ${field.width};
                        `}
                        ${field.ratingProps?.containerStyle}
                      `}
                      showError={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                      disabled={field.disabled}
                      {...field.ratingProps}
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
                      label={field.title}
                      value={controllerField.value ?? false}
                      required={field.required}
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
                        labelStyle: css`
                          ${labelSize &&
                          css`
                            font-size: ${labelSize};
                          `}
                          ${field.thumbFieldProps?.styles?.labelStyle}
                        `,
                        style: css`
                          ${fieldSize &&
                          css`
                            font-size: ${fieldSize};
                          `}
                          ${field.thumbFieldProps?.styles?.style}
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
                      name={controllerField.name}
                      label={field.title}
                      checked={controllerField.value ?? false}
                      required={field.required}
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
                      styles={{
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
                      label={field.title}
                      activeTab={controllerField.value}
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

  ${({ $style }) => $style}
`;

export { StatefulForm };
