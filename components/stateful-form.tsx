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
import Phonebox from "./phonebox";
import Checkbox from "./checkbox";
import Textbox from "./textbox";

interface StatefulFormProps<Z extends ZodTypeAny> {
  fields: FormFieldProps[];
  formValues: TypeOf<Z>;
  validationSchema: Z;
  mode?: "onChange" | "onBlur" | "onSubmit";
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onValidityChange: (e: boolean) => void;
}

export interface FieldNameProps {
  email: string;
  password?: string;
  first_name: string;
  last_name?: string;
  organization_name?: string;
  phone_number?: number;
  note?: string;
  access?: boolean;
  division_name?: string;
  country_code?: CountryCodeProps;
}

export interface FormFieldProps {
  name: keyof FieldNameProps;
  title: string;
  required: boolean;
  type?: string;
  placeholder?: string;
  rows?: number;
}

export interface CountryCodeProps {
  id: string;
  code: string;
  name: string;
  flag: string;
}

export default function StatefulForm<Z extends ZodTypeAny>({
  fields,
  onChange,
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
        onChange={onChange}
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
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  shouldShowError: (name: string) => boolean;
  control: Control<T>;
}

function FormFields<T extends FieldValues>({
  fields,
  formValues,
  onChange,
  register,
  errors,
  shouldShowError,
  control,
}: FormFieldsProps<T>) {
  return (
    <>
      {fields.map((field: FormFieldProps, index: number) => {
        if (field.type === "hidden") {
          return (
            <input
              key={index}
              type={field.type}
              value={formValues[field.name as keyof T] ?? ""}
              required={field.required}
              {...register(field.name as Path<T>, { onChange })}
              className="hidden"
            />
          );
        }
        return field.type === "text" ||
          field.title === "message" ||
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
            {...register(field.name as Path<T>, { onChange })}
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
                onChange={(e) => {
                  controllerField.onChange(e);
                  onChange(e);
                }}
                required={field.required}
                showError={shouldShowError(field.name)}
              />
            )}
          />
        ) : field.type === "tel" ? (
          <Controller
            key={index}
            control={control}
            name={field.name as Path<T>}
            render={({ field: controllerField }) => (
              <>
                <Phonebox
                  phoneNumber={controllerField.value}
                  label={field.title}
                  value={controllerField.value}
                  onChange={(field, value) => {
                    onChange?.({
                      target: {
                        name: field,
                        value,
                        type: "text",
                      },
                    } as ChangeEvent<HTMLInputElement>);
                  }}
                  showError={shouldShowError(field.name)}
                  errorMessage={
                    errors[field.name as keyof T]?.message as string | undefined
                  }
                />
              </>
            )}
          />
        ) : null;
      })}
    </>
  );
}
