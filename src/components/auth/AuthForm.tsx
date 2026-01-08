"use client";

import * as React from "react";
import {
  AuthFormMode,
  loginSchema,
  signupSchema,
} from "@/src/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";

import Form from "../forms/Form";
import Surface from "../ui/Surface";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import AuthFormToggle from "./AuthFormToggle";

import { useAuthStore } from "@/src/stores/auth-store";

/**
 * Single form type that supports both login + signup.
 * confirmPassword exists only for signup, so it's optional here.
 */
type AuthFormValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

type AuthFormProps = {
  mode: AuthFormMode;
  redirectTo?: string;
};

// Extend login schema so resolver matches the form type (confirmPassword optional)
const loginSchemaWithOptionalConfirm = loginSchema.extend({
  confirmPassword: z.string().optional(),
});

export default function AuthForm({
  mode,
  redirectTo = "/entries",
}: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const status = useAuthStore((s) => s.status);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const clearAuthError = useAuthStore((s) => s.clearError);

  const isLoading = status === "loading";

  /**
   * IMPORTANT:
   * This is safe as long as your toggle navigates between routes (login <-> signup),
   * which remounts the component. If you *don’t* remount, you’d key the component by mode.
   */
  const resolver = zodResolver(
    isSignup ? signupSchema : loginSchemaWithOptionalConfirm
  );

  const form = useForm<AuthFormValues>({
    resolver,
    defaultValues: {
      email: "",
      password: "",
      ...(isSignup ? { confirmPassword: "" } : {}),
    },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<AuthFormValues> = async ({
    email,
    password,
  }) => {
    form.clearErrors("root");
    clearAuthError();

    const res = isSignup
      ? await signup(email, password)
      : await login(email, password);

    if (!res.ok) {
      form.setError("root", { type: "server", message: res.message });
      return;
    }

    form.reset({
      email: "",
      password: "",
      ...(isSignup ? { confirmPassword: "" } : {}),
    });

    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <Surface
      title={isSignup ? "Sign up:" : "Login:"}
      className="max-w-md mx-auto px-6 py-3"
    >
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
          autoComplete={isSignup ? "new-password" : "current-password"}
          hasError={!!form.formState.errors.password}
          {...form.register("password")}
        />

        {isSignup && (
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password..."
            autoComplete="new-password"
            hasError={!!form.formState.errors.confirmPassword}
            {...form.register("confirmPassword")}
          />
        )}

        <AuthFormToggle mode={mode} />

        <Button type="submit" className="w-full mb-1" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </Surface>
  );
}
