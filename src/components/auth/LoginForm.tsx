"use client";

import { loginSchema, LoginValues } from "@/src/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Form from "../forms/Form";
import Surface from "../ui/Surface";
import { Input } from "../ui/Input";

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
    <Surface title="Login:" className="max-w-md mx-auto px-6 py-3">
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email..."
          autoComplete="email"
          hasError={!!form.formState.errors.email}
          {...form.register("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password..."
          autoComplete="password"
          hasError={!!form.formState.errors.email}
          {...form.register("password")}
        />
      </Form>
    </Surface>
  );
}
