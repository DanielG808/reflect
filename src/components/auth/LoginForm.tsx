"use client";

import { loginSchema, LoginValues } from "@/src/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form from "../forms/Form";

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
    <Form
      form={form}
      onSubmit={onSubmit}
      className="border border-white/25 bg-white/15 space-y-4 w-60 h-96 rounded-md py-2 px-4"
    >
      LoginForm
    </Form>
  );
}
