import z from "zod";

const stripHtml = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");

const hasMeaningfulText = (html: string) => {
  const text = stripHtml(html).replace(/\s+/g, " ").trim();
  return text.length > 0;
};

export const entryStatusSchema = z.enum(["DRAFT", "FINAL"]);

export const entryDTOSchema = z.object({
  id: z.string(),
  userId: z.string(),
  content: z.string(),
  status: entryStatusSchema,
  version: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const entryDTOListSchema = z.array(entryDTOSchema);

export const entryAutosaveSchema = z.object({
  content: z.string().max(200_000),
  fontFamily: z.string().max(2000),
});

export const entryFinalizeSchema = entryAutosaveSchema.refine(
  (v) => hasMeaningfulText(v.content),
  {
    path: ["content"],
    message: "Entry can’t be empty.",
  }
);

export type EntryAutosaveValues = z.infer<typeof entryAutosaveSchema>;
export type EntryFinalizeValues = z.infer<typeof entryFinalizeSchema>;
export type EntryDTOValidated = z.infer<typeof entryDTOSchema>;
