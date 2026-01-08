"use client";

import { LoginValues } from "@/src/lib/validations/auth";
import type { FieldErrors, FieldError } from "react-hook-form";
import FormError from "./FormError";
import H1 from "../ui/H1";
import { AnimatePresence, motion } from "framer-motion";

type ErrorMessageContainerProps = {
  errors: FieldErrors<LoginValues>;
};

export default function FormErrorContainer({
  errors,
}: ErrorMessageContainerProps) {
  const errorArray = Object.entries(errors).filter(
    ([key, value]) =>
      key !== "root" && value && "message" in value && value.message
  );

  return (
    <AnimatePresence initial={false}>
      {errorArray.length > 0 && (
        <motion.section
          key="form-errors"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="flex flex-col border border-warn !bg-warn/20 text-red-700/55 text-sm rounded-md px-3 py-2">
            <H1 className="text-red-700/55 text-lg pb-1">Errors:</H1>
            <ul className="space-y-1">
              {errorArray.map(([field, error]) => (
                <li key={field}>
                  <FormError error={error as FieldError} />
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
