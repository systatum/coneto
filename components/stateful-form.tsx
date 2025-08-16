import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodTypeAny, TypeOf } from "zod";
import { ChangeEvent, useEffect } from "react";
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
import { OptionsProps } from "./selectbox";
import { Combobox, ComboboxProps } from "./combobox";
import { Chips, ChipsProps } from "./chips";
import { Signbox, SignboxProps } from "./signbox";
import { Textarea, TextareaProps } from "./textarea";
import { css } from "styled-components";
import { Rating, RatingProps } from "./rating";
import { ThumbField, ThumbFieldProps } from "./thumb-field";
import { Togglebox, ToggleboxProps } from "./togglebox";

export type StatefulOnChangeType =
  | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  | FileList
  | OptionsProps
  | {
      target: {
        name: string;
        value: CountryCodeProps;
      };
    };

interface StatefulFormProps<Z extends ZodTypeAny> {
  fields: FormFieldProps[];
  formValues: TypeOf<Z>;
  validationSchema: Z;
  mode?: "onChange" | "onBlur" | "onSubmit";
  onValidityChange?: (e: boolean) => void;
  labelSize?: string;
  fieldSize?: string;
}

export interface FormFieldProps {
  name: string;
  title: string;
  required: boolean;
  type?: string;
  placeholder?: string;
  rows?: number;
  onChange?: (
    e?:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: CountryCodeProps } }
      | FileList
      | OptionsProps,
    type?: string
  ) => void;
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
}

function StatefulForm<Z extends ZodTypeAny>({
  fields,
  validationSchema,
  formValues,
  mode = "onChange",
  onValidityChange,
  fieldSize,
  labelSize,
}: StatefulFormProps<Z>) {
  const {
    register,
    control,
    formState: { errors, touchedFields, isValid },
  } = useForm<TypeOf<Z>>({
    resolver: zodResolver(validationSchema),
    mode,
    defaultValues: formValues,
  });

  useEffect(() => {
    if (onValidityChange) {
      onValidityChange(isValid);
    }
  }, [isValid, onValidityChange]);

  const shouldShowError = (field: keyof TypeOf<Z>): boolean => {
    const value = formValues[field];
    const touched = touchedFields[field];
    const error = errors[field];

    return (
      typeof value === "string" && value.length > 0 && !!touched && !!error
    );
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
        shouldShowError={(name) => shouldShowError(name as keyof TypeOf<Z>)}
      />
    </>
  );
}

interface FormFieldsProps<T extends FieldValues> {
  fields: FormFieldProps[];
  formValues: T;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  shouldShowError: (name: string) => boolean;
  control: Control<T>;
  labelSize?: string;
  fieldSize?: string;
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
}: FormFieldsProps<T>) {
  return (
    <>
      {fields.map((field: FormFieldProps, index: number) => {
        return field.type === "text" ||
          field.type === "message" ||
          field.type === "number" ||
          field.type === "email" ||
          field.type === "password" ? (
          <Textbox
            key={index}
            {...field.textboxProps}
            label={field.title}
            type={field.type}
            value={formValues[field.name as keyof T] ?? ""}
            required={field.required}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
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
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
          />
        ) : field.type === "textarea" ? (
          <Textarea
            key={index}
            {...field.textareaProps}
            label={field.title}
            rows={field.rows}
            value={formValues[field.name as keyof T] ?? ""}
            required={field.required}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
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
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
          />
        ) : field.type === "checkbox" ? (
          <Controller
            key={index}
            control={control}
            name={field.name as Path<T>}
            render={({ field: controllerField }) => (
              <Checkbox
                {...field.checkboxProps}
                label={field.title}
                name={field.name}
                checked={controllerField.value ?? false}
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
                wrapperStyle={
                  fieldSize &&
                  css`
                    width: ${fieldSize};
                    height: ${fieldSize};
                  `
                }
                {...register(field.name as Path<T>, {
                  onChange: field.onChange,
                })}
                required={field.required}
                showError={shouldShowError(field.name)}
              />
            )}
          />
        ) : field.type === "phone" ? (
          <Controller
            key={index}
            control={control}
            name={"phone" as Path<T>}
            render={({ field: controllerField }) => (
              <>
                <Phonebox
                  {...field.phoneboxProps}
                  label={field.title}
                  value={controllerField.value}
                  onChange={(e) => {
                    if (e.target.name === "phone") {
                      controllerField.onChange(e);
                    }
                    field.onChange?.(e);
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
                  showError={!!errors["phone"]}
                  errorMessage={errors["phone"]?.message as string}
                />
              </>
            )}
          />
        ) : field.type === "color" ? (
          <Controller
            key={index}
            name={field.name as Path<T>}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <Colorbox
                {...field.colorboxProps}
                label={field.title}
                required={field.required}
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
                value={controllerField.value}
                onChange={(e, kind) => {
                  const newVal =
                    kind === "color-text"
                      ? e.target.value.startsWith("#")
                        ? e.target.value
                        : `#${e.target.value}`
                      : e.target.value;

                  field.onChange?.(e, kind);
                  controllerField.onChange(newVal);
                }}
                showError={shouldShowError(field.name)}
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        ) : field.type === "file_drop_box" ? (
          <FileDropBox
            key={index}
            {...field.fileDropBoxProps}
            label={field.title}
            labelStyle={
              labelSize &&
              css`
                font-size: ${labelSize};
              `
            }
            {...register(field.name as Path<T>, { onChange: field.onChange })}
          />
        ) : field.type === "file" ? (
          <FileInputBox
            key={index}
            {...field.fileInputBoxProps}
            onFilesSelected={(e) => field.onChange(e, "file")}
            label={field.title}
            labelStyle={
              labelSize &&
              css`
                font-size: ${labelSize};
              `
            }
            {...register(field.name as Path<T>, { onChange: field.onChange })}
            showError={shouldShowError(field.name)}
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
          />
        ) : field.type === "image" ? (
          <Imagebox
            key={index}
            {...field.imageboxProps}
            name={field.name}
            onFilesSelected={(e) => field.onChange(e, "image")}
            label={field.title}
            labelStyle={
              labelSize &&
              css`
                font-size: ${labelSize};
              `
            }
            required={field.required}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
            showError={shouldShowError(field.name)}
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
          />
        ) : field.type === "signbox" ? (
          <Signbox
            key={index}
            {...field.signboxProps}
            clearable
            name={field.name}
            label={field.title}
            labelStyle={
              labelSize &&
              css`
                font-size: ${labelSize};
              `
            }
            required={field.required}
            value={formValues[field.name as keyof T] ?? ""}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
            showError={shouldShowError(field.name)}
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
          />
        ) : field.type === "money" ? (
          <Moneybox
            key={index}
            {...field.moneyProps}
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
            value={formValues[field.name as keyof T] ?? ""}
            required={field.required}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
            showError={shouldShowError(field.name)}
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
          />
        ) : field.type === "date" ? (
          <Controller
            key={index}
            name={field.name as Path<T>}
            control={control}
            render={({ field: controllerField }) => (
              <Datebox
                key={index}
                {...field.dateProps}
                label={field.title}
                showError={shouldShowError(field.name)}
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
                  (
                    errors[field.name as keyof T] as {
                      text?: {
                        message?: string;
                      };
                    }
                  )?.text?.message
                }
                setInputValue={(e) => {
                  controllerField.onChange(e);
                  field.onChange(e);
                }}
                inputValue={controllerField.value}
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
                {...field.comboboxProps}
                label={field.title}
                showError={shouldShowError(field.name)}
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
                  (
                    errors[field.name as keyof T] as {
                      text?: {
                        message?: string;
                      };
                    }
                  )?.text?.message
                }
                setInputValue={(e) => {
                  controllerField.onChange(e);
                  field.onChange(e);
                }}
                inputValue={controllerField.value}
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
                {...field.chipsProps}
                label={field.title}
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
                  controllerField.onChange(e);
                  field.onChange(e, "chips");
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
                {...field.ratingProps}
                label={field.title}
                rating={controllerField.value}
                onChange={(e) => {
                  controllerField.onChange(e.target.value);
                  field.onChange?.(e);
                }}
                labelStyle={
                  labelSize &&
                  css`
                    font-size: ${labelSize};
                  `
                }
                containerStyle={
                  fieldSize &&
                  css`
                    font-size: ${fieldSize};
                  `
                }
                showError={!!fieldState.error}
                errorMessage={fieldState.error?.message}
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
                {...field.thumbFieldProps}
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
                value={controllerField.value ?? false}
                required={field.required}
                {...register(field.name as Path<T>, {
                  onChange: field.onChange,
                })}
                showError={shouldShowError(field.name)}
                errorMessage={
                  errors[field.name as keyof T]?.message as string | undefined
                }
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
                {...field.toggleboxProps}
                label={field.title}
                labelStyle={
                  labelSize &&
                  css`
                    font-size: ${labelSize};
                  `
                }
                checked={controllerField.value ?? false}
                required={field.required}
                {...register(field.name as Path<T>, {
                  onChange: field.onChange,
                })}
                showError={shouldShowError(field.name)}
                errorMessage={
                  errors[field.name as keyof T]?.message as string | undefined
                }
              />
            )}
          />
        ) : null;
      })}
    </>
  );
}

export { StatefulForm };
