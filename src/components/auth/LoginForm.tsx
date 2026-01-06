"use client";

import { loginSchema, LoginValues } from "@/src/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form from "../forms/Form";
import Surface from "../ui/Surface";

export default function LoginForm() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (values: LoginValues) => {
    console.log("login submitted", values);
  };

  return (
    <Surface className="max-w-md mx-auto p-6">
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        LoginForm
      </Form>
    </Surface>
  );
}
