"use client";

import {
  AuthFormMode,
  loginSchema,
  signupSchema,
  type LoginValues,
  type SignupValues,
} from "@/src/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import Form from "../forms/Form";
import Surface from "../ui/Surface";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import FormErrorContainer from "../forms/FormErrorContainer";
import AuthFormToggle from "./AuthFormToggle";

type AuthFormProps = {
  mode: AuthFormMode;
  onLoginSubmit?: (values: LoginValues) => void | Promise<void>;
  onSignupSubmit?: (values: SignupValues) => void | Promise<void>;
};

export default function AuthForm({
  mode,
  onLoginSubmit,
  onSignupSubmit,
}: AuthFormProps) {
  const isSignup = mode === "signup";

  const form = useForm<LoginValues | SignupValues>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: isSignup
      ? { email: "", password: "", confirmPassword: "" }
      : { email: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<LoginValues | SignupValues> = async (
    values
  ) => {
    if (isSignup) {
      await onSignupSubmit?.(values as SignupValues);
      console.log("signup submitted", values);
      return;
    }

    await onLoginSubmit?.(values as LoginValues);
    console.log("login submitted", values);
  };

  return (
    <Surface
      title={isSignup ? "Sign up:" : "Login:"}
      className="max-w-md mx-auto px-6 py-3"
    >
      <Form form={form} onSubmit={onSubmit} className="space-y-4">
        <FormErrorContainer errors={form.formState.errors} />

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

        <Button type="submit" className="w-full mb-1">
          Submit
        </Button>
      </Form>
    </Surface>
  );
}
