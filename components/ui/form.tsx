"use client";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import * as React from "react";
import {
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";

const FormContext = React.createContext<UseFormReturn<FieldValues> | null>(
  null
);

function useFormContext<T extends FieldValues>(): UseFormReturn<T> {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("FormField must be used within a Form component");
  }
  return context as UseFormReturn<T>;
}

type FormProps<T extends FieldValues> = Readonly<{
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
}>;

function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
}: FormProps<T>) {
  return (
    <FormContext.Provider value={form as UseFormReturn<FieldValues>}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}

type FormFieldProps<T extends FieldValues> = Readonly<{
  name: FieldPath<T>;
  label?: string;
  description?: string;
  children: (field: ControllerRenderProps<T, FieldPath<T>>) => React.ReactNode;
  className?: string;
}>;

function FormField<T extends FieldValues>({
  name,
  label,
  description,
  children,
  className,
}: FormFieldProps<T>) {
  const form = useFormContext<T>();
  const { control } = form;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const fieldError = fieldState.error;
        return (
          <Field className={className}>
            {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
            <FieldContent>
              {children(field)}
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
              {fieldError && (
                <FieldError
                  errors={[
                    {
                      message:
                        typeof fieldError.message === "string"
                          ? fieldError.message
                          : "Validation error",
                    },
                  ]}
                />
              )}
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}

export { useForm } from "react-hook-form";
export { Form, FormField, useFormContext };
