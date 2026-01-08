"use client";

import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";
import FormErrorContainer from "./FormErrorContainer";

type FormProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  className: string;
  children: React.ReactNode;
};

export default function Form<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  className,
  children,
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        <FormErrorContainer errors={form.formState.errors} />
        {children}
      </form>
    </FormProvider>
  );
}
