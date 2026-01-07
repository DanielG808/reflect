import { LoginValues } from "@/src/lib/validations/auth";
import type { FieldErrors, FieldError } from "react-hook-form";
import FormError from "./FormError";

type ErrorMessageContainerProps = {
  errors: FieldErrors<LoginValues>;
};

export default function ErrorMessageContainer({
  errors,
}: ErrorMessageContainerProps) {
  const entries = Object.entries(errors).filter(
    ([key, value]) =>
      key !== "root" && value && "message" in value && value.message
  );

  if (entries.length === 0) return null;

  return (
    <section className="flex flex-col border border-warn bg-warn/50 text-warn rounded-md px-3 py-2">
      <ul className="space-y-1">
        {entries.map(([field, error]) => (
          <li key={field}>
            <FormError error={error as FieldError} />
          </li>
        ))}
      </ul>
    </section>
  );
}
