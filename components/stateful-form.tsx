import { useForm, UseFormSetValue } from "react-hook-form";
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
  | {
      target: {
        name: string;
        value: CountryCodeProps | FileList | File | null | OptionsProps;
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
    setValue,
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

    console.log(field, touched, error);

    const isFile = (val: unknown): val is File => val instanceof File;
    const isFileList = (val: unknown): val is FileList =>
      val instanceof FileList;

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

    if (isFile(value) || isFileList(value)) {
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
  setValue?: UseFormSetValue<T>;
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
            label={field.title}
            type={field.type}
            placeholder={field.placeholder}
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
              <>
                <Phonebox
                  label={field.title}
                  value={controllerField.value}
                  placeholder={field.placeholder}
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
                  {...field.phoneboxProps}
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
                label={field.title}
                required={field.required}
                placeholder={field.placeholder}
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
                onChange={(e) => {
                  field.onChange?.(e);
                  controllerField.onChange(e);
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
            {...register(field.name as Path<T>, { onChange: field.onChange })}
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
            showError={shouldShowError(field.name)}
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
            {...field.fileInputBoxProps}
            onFilesSelected={(files: FileList | undefined) => {
              const file = files?.[0];

              const isFile = file instanceof File;
              if (isFile) {
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

              field.onChange({
                target: { name: field.name, value: file ?? undefined },
              });
            }}
          />
        ) : field.type === "image" ? (
          <Imagebox
            key={index}
            name={field.name}
            onFileSelected={(e) => {
              const file = e;
              const isFile = file instanceof File;
              if (isFile) {
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

              field.onChange({
                target: { name: field.name, value: file ?? undefined },
              });
            }}
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
            required={field.required}
            value={formValues[field.name as keyof T] ?? ""}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
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
                  const inputValueEvent = {
                    target: {
                      name: field.name,
                      value: e,
                    },
                  };
                  controllerField.onChange(inputValueEvent);
                  controllerField.onBlur();
                  field.onChange(inputValueEvent);
                }}
                inputValue={controllerField.value}
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
                  const inputValueEvent = {
                    target: {
                      name: field.name,
                      value: e,
                    },
                  };
                  controllerField.onChange(inputValueEvent);
                  controllerField.onBlur();
                  field.onChange(inputValueEvent);
                }}
                inputValue={controllerField.value}
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
                  controllerField.onChange(e);
                  controllerField.onBlur();
                  field.onChange(e);
                }}
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
                value={controllerField.value ?? false}
                required={field.required}
                {...register(field.name as Path<T>, {
                  onChange: field.onChange,
                })}
                onChange={(e) => {
                  field.onChange?.(e);
                  controllerField.onBlur();
                  controllerField.onChange(e);
                }}
                showError={shouldShowError(field.name)}
                errorMessage={
                  errors[field.name as keyof T]?.message as string | undefined
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
            render={({ field: controllerField }) => {
              return (
                <Togglebox
                  name={controllerField.name}
                  label={field.title}
                  labelStyle={
                    labelSize &&
                    css`
                      font-size: ${labelSize};
                    `
                  }
                  checked={controllerField.value ?? false}
                  required={field.required}
                  onChange={(e) => {
                    field.onChange?.(e);
                    controllerField.onBlur();
                    controllerField.onChange(e);
                  }}
                  onBlur={controllerField.onBlur}
                  showError={shouldShowError(field.name)}
                  errorMessage={
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                  {...field.toggleboxProps}
                />
              );
            }}
          />
        ) : null;
      })}
    </>
  );
}

export { StatefulForm };
