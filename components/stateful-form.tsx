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
import { Phonebox, CountryCodeProps } from "./phonebox";
import { Checkbox } from "./checkbox";
import { Textbox } from "./textbox";
import { Colorbox } from "./colorbox";
import { FileDropBox, FileDropBoxProps } from "./file-drop-box";
import { FileInputBox } from "./file-input-box";
import { Imagebox } from "./imagebox";
import { Moneybox, MoneyboxProps } from "./moneybox";
import { Datebox, DateboxProps } from "./datebox";
import { OptionsProps } from "./selectbox";
import { Combobox, ComboboxProps } from "./combobox";
import { Chips, ChipsProps } from "./chips";

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
  moneyProps?: MoneyboxProps;
  fileDropBoxProps?: FileDropBoxProps;
  dateProps?: DateboxProps;
  comboboxProps?: ComboboxProps;
  chipsProps?: ChipsProps;
}

function StatefulForm<Z extends ZodTypeAny>({
  fields,
  validationSchema,
  formValues,
  mode = "onChange",
  onValidityChange,
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
}

function FormFields<T extends FieldValues>({
  fields,
  formValues,
  register,
  errors,
  shouldShowError,
  control,
}: FormFieldsProps<T>) {
  return (
    <>
      {fields.map((field: FormFieldProps, index: number) => {
        return field.type === "text" ||
          field.type === "message" ||
          field.type === "number" ||
          field.type === "email" ||
          field.type === "password" ||
          field.type === "textarea" ? (
          <Textbox
            key={index}
            label={field.title}
            type={field.type}
            rows={field.rows}
            value={formValues[field.name as keyof T] ?? ""}
            required={field.required}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
            showError={shouldShowError(field.name)}
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
                label={field.title}
                name={field.name}
                checked={controllerField.value ?? false}
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
                  label={field.title}
                  value={controllerField.value}
                  onChange={(e) => {
                    if (e.target.name === "phone") {
                      controllerField.onChange(e);
                    }
                    field.onChange?.(e);
                  }}
                  showError={!!errors["phone"]}
                  errorMessage={errors["phone"]?.message as string}
                />
              </>
            )}
          />
        ) : field.type === "color" ? (
          <Controller
            name={field.name as Path<T>}
            control={control}
            render={({ field: controllerField, fieldState }) => (
              <Colorbox
                key={index}
                label={field.title}
                required={field.required}
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
            label={field.title}
            {...field.fileDropBoxProps}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
          />
        ) : field.type === "file" ? (
          <FileInputBox
            onFilesSelected={(e) => field.onChange(e, "file")}
            key={index}
            label={field.title}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
            showError={shouldShowError(field.name)}
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
          />
        ) : field.type === "image" ? (
          <Imagebox
            name={field.name}
            onFilesSelected={(e) => field.onChange(e, "image")}
            key={index}
            label={field.title}
            required={field.required}
            {...register(field.name as Path<T>, { onChange: field.onChange })}
            showError={shouldShowError(field.name)}
            errorMessage={
              errors[field.name as keyof T]?.message as string | undefined
            }
          />
        ) : field.type === "money" ? (
          <Moneybox
            key={index}
            label={field.title}
            {...field.moneyProps}
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
                label={field.title}
                showError={shouldShowError(field.name)}
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
                key={index}
                label={field.title}
                showError={shouldShowError(field.name)}
                {...field.comboboxProps}
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
                key={index}
                label={field.title}
                inputValue={controllerField.value}
                {...field.chipsProps}
                setInputValue={(e) => {
                  controllerField.onChange(e);
                  field.onChange(e, "chips");
                }}
              />
            )}
          />
        ) : null;
      })}
    </>
  );
}

export { StatefulForm };
