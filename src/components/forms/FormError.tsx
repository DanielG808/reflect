import { FieldError } from "react-hook-form";

type FormErrorProps = {
  error: FieldError | undefined;
};

export default function FormError({ error }: FormErrorProps) {
  return <p>{error && error.message}</p>;
}
