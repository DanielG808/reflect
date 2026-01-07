import { AuthFormMode } from "@/src/lib/validations/auth";
import Link from "next/link";

type AuthFormToggleProps = {
  mode: AuthFormMode;
};

export default function AuthFormToggle({ mode }: AuthFormToggleProps) {
  return (
    <div className="flex justify-between text-xs">
      <p>{mode === "login" ? "New to Reflect?" : "Already have an account?"}</p>
      <Link
        href={mode === "login" ? "/signup" : "/login"}
        className="hover:underline"
      >
        {mode === "login" ? "Sign up" : "Login"}
      </Link>
    </div>
  );
}
