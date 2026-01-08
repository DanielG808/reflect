"use client";

import * as React from "react";
import {
  AuthFormMode,
  loginSchema,
  signupSchema,
  type LoginValues,
  type SignupValues,
} from "@/src/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

import Form from "../forms/Form";
import Surface from "../ui/Surface";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import FormErrorContainer from "../forms/FormErrorContainer";
import AuthFormToggle from "./AuthFormToggle";

import { loginAction, signupAction } from "@/src/lib/auth/actions";
import { useAuthStore } from "@/src/stores/auth-store";

type AuthFormValues = LoginValues | SignupValues;

type AuthFormProps = {
  mode: AuthFormMode;
  redirectTo?: string;
};

export default function AuthForm({
  mode,
  redirectTo = "/entries",
}: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";

  const authLoading = useAuthStore((s) => s.authLoading);
  const setAuthLoading = useAuthStore((s) => s.setAuthLoading);
  const setAuthError = useAuthStore((s) => s.setAuthError);
  const clearAuthError = useAuthStore((s) => s.clearAuthError);
  const hydrateFromMe = useAuthStore((s) => s.hydrateFromMe);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: isSignup
      ? { email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" },
    mode: "onSubmit",
  });

  // If authError exists globally, also show it in RHF root (keeps your UI consistent)
  React.useEffect(() => {
    // don't overwrite field-level validation errors; only root
    // (Zustand is just mirroring what's already displayed)
  }, []);

  const onSubmit: SubmitHandler<AuthFormValues> = async (values) => {
    // clear prior errors
    form.clearErrors("root");
    clearAuthError();
    setAuthLoading(true);

    try {
      const { email, password } = values;

      const result = isSignup
        ? await signupAction(email, password)
        : await loginAction(email, password);

      if (!result.ok) {
        setAuthError(result.message);
        form.setError("root", { type: "server", message: result.message });
        return;
      }

      // ✅ Success: reset the form so the user sees something happened immediately
      form.reset(
        isSignup
          ? { email: "", password: "", confirmPassword: "" }
          : { email: "", password: "" }
      );

      // ✅ Refresh Zustand user from cookie-backed server state
      await hydrateFromMe();

      // ✅ Deterministic navigation
      router.replace(redirectTo);
      router.refresh();
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <Surface
      title={isSignup ? "Sign up:" : "Login:"}
      className="max-w-md mx-auto px-6 py-3"
    >
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        {/* <FormErrorContainer errors={form.formState.errors as any} /> */}

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
            hasError={!!(form.formState.errors as any).confirmPassword}
            {...form.register("confirmPassword" as const)}
          />
        )}

        <AuthFormToggle mode={mode} />

        <Button type="submit" className="w-full mb-1" disabled={authLoading}>
          {authLoading ? "Submitting..." : "Submit"}
        </Button>
      </Form>
    </Surface>
  );
}
