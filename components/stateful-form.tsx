import { useForm, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { ZodTypeAny, TypeOf, ZodObject } from "zod";
import { ChangeEvent, ReactNode, useEffect, useRef } from "react";
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
  | string[]
  | null
  | undefined
  | CountryCodeProps;

interface StatefulFormProps<Z extends ZodTypeAny> {
  fields: FormFieldGroup[];
  formValues: TypeOf<Z>;
  validationSchema: Z;
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
  onChange?: (e?: StatefulOnChangeType) => void;
  textboxProps?: TextboxProps;
  textareaProps?: TextareaProps;
  checkboxProps?: CheckboxProps;
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

  const {
    register,
    control,
    setValue,
    formState: { errors, touchedFields, isValid },
  } = useForm<TypeOf<Z>>({
    resolver: zodResolver(finalSchema),
    mode,
    defaultValues: formValues,
  });

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid, onValidityChange]);

  const shouldShowError = (field: keyof TypeOf<Z>): boolean => {
    const fieldConfig = fields
      .flat()
      .find((f) => (f as FormFieldProps).name === field) as FormFieldProps;

    if (!fieldConfig || fieldConfig.type === "custom" || fieldConfig.hidden) {
      return false;
    }

    const value = formValues[field];
    const touched = touchedFields[field];
    const error = errors[field];

    const isFile = (val: unknown): val is File => val instanceof File;

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

    if (isFile(value)) {
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
  validationSchema: Z,
  fields: FormFieldGroup[]
) {
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

        return (
          <RowFormField
            aria-label="stateful-form-row"
            $style={rowStyle}
            key={indexGroup}
          >
            {visibleFields.map((field: FormFieldProps, index: number) => {
              return field.type === "custom" ? (
                field.render
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
                  labelStyle={
                    labelSize &&
                    css`
                      font-size: ${labelSize};
                    `
                  }
                  style={
                    fieldSize &&
                    css`
                      font-size: ${fieldSize};
                    `
                  }
                  containerStyle={
                    field.width &&
                    css`
                      width: ${field.width};
                    `
                  }
                  errorMessage={
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  {...field.textboxProps}
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
                  labelStyle={
                    labelSize &&
                    css`
                      font-size: ${labelSize};
                    `
                  }
                  style={css`
                    ${fieldSize &&
                    css`
                      font-size: ${fieldSize};
                    `}
                  `}
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
                  `}
                  errorMessage={
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  {...field.textareaProps}
                />
              ) : field.type === "checkbox" ? (
                <Controller
                  key={index}
                  control={control}
                  name={field.name as Path<T>}
                  render={({ field: controllerField }) => (
                    <Checkbox
                      label={field.title}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      inputStyle={
                        fieldSize &&
                        css`
                          width: ${fieldSize};
                          height: ${fieldSize};
                        `
                      }
                      iconStyle={
                        fieldSize &&
                        css`
                          width: ${fieldSize}-2;
                          height: ${fieldSize}-2;
                        `
                      }
                      containerStyle={
                        field.width &&
                        css`
                          width: ${field.width};
                        `
                      }
                      wrapperStyle={
                        fieldSize &&
                        css`
                          width: ${fieldSize};
                          height: ${fieldSize};
                        `
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
                      {...field.checkboxProps}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      style={css`
                        ${fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `}
                      `}
                      containerStyle={
                        field.width &&
                        css`
                          width: ${field.width};
                        `
                      }
                      showError={!!errors["phone"]}
                      errorMessage={errors["phone"]?.message as string}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      style={
                        fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `
                      }
                      containerStyle={
                        field.width &&
                        css`
                          width: ${field.width};
                        `
                      }
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
                      {...field.colorboxProps}
                    />
                  )}
                />
              ) : field.type === "file_drop_box" ? (
                <FileDropBox
                  key={index}
                  label={field.title}
                  placeholder={field.placeholder}
                  labelStyle={
                    labelSize &&
                    css`
                      font-size: ${labelSize};
                    `
                  }
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
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
                  labelStyle={
                    labelSize &&
                    css`
                      font-size: ${labelSize};
                    `
                  }
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
                  `}
                  showError={shouldShowError(field.name)}
                  errorMessage={
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  {...field.fileInputBoxProps}
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
                    if (onChange) {
                      if (file) {
                        onChange(field.name, file);
                      } else {
                        onChange(field.name, undefined);
                      }
                    }

                    field.onChange?.({
                      target: { name: field.name, value: file ?? undefined },
                    });
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
                  labelStyle={
                    labelSize &&
                    css`
                      font-size: ${labelSize};
                    `
                  }
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
                  labelStyle={
                    labelSize &&
                    css`
                      font-size: ${labelSize};
                    `
                  }
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
                  `}
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
                  {...field.signboxProps}
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
                  labelStyle={
                    labelSize &&
                    css`
                      font-size: ${labelSize};
                    `
                  }
                  style={
                    fieldSize &&
                    css`
                      font-size: ${fieldSize};
                    `
                  }
                  containerStyle={css`
                    ${field.width &&
                    css`
                      width: ${field.width};
                    `}
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
                  {...field.moneyProps}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      containerStyle={css`
                        ${field.width &&
                        css`
                          width: ${field.width};
                        `}
                      `}
                      selectboxStyle={
                        fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `
                      }
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
                      selectedDates={controllerField.value}
                      {...field.dateProps}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      selectboxStyle={
                        fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `
                      }
                      errorMessage={
                        errors[field.name as keyof T]?.[0]?.message as
                          | string
                          | undefined
                      }
                      containerStyle={css`
                        ${field.width &&
                        css`
                          width: ${field.width};
                        `}
                      `}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      chipSelectedStyle={
                        fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `
                      }
                      inputValue={controllerField.value}
                      setInputValue={(e) => {
                        controllerField?.onChange(e);
                        controllerField?.onBlur();
                        field.onChange?.(e);
                      }}
                      containerStyle={css`
                        ${field.width &&
                        css`
                          width: ${field.width};
                        `}
                      `}
                      {...field.chipsProps}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      containerStyle={css`
                        ${fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `}
                        ${field.width &&
                        css`
                          width: ${field.width};
                        `}
                      `}
                      showError={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      style={
                        fieldSize &&
                        css`
                          font-size: ${fieldSize};
                        `
                      }
                      containerStyle={
                        field.width &&
                        css`
                          width: ${field.width};
                        `
                      }
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
                      {...field.thumbFieldProps}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
                      containerStyle={
                        field.width &&
                        css`
                          width: ${field.width};
                        `
                      }
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
                      {...field.toggleboxProps}
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
                      labelStyle={
                        labelSize &&
                        css`
                          font-size: ${labelSize};
                        `
                      }
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
                      containerStyle={
                        field.width &&
                        css`
                          width: ${field.width};
                        `
                      }
                      showError={shouldShowError(field.name)}
                      errorMessage={
                        errors[field.name as keyof T]?.message as
                          | string
                          | undefined
                      }
                      {...field.capsuleProps}
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
