import { z } from "zod";

const emptyToNull = z
  .string()
  .transform((v) => (v.trim() === "" ? null : v.trim()))
  .optional()
  .nullable();

export const createBrandkitSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  website_url: z.string().min(1, "Website URL is required"),

  brand_summary: emptyToNull,
  brand_design_style: emptyToNull,

  address: emptyToNull,
  copyright: emptyToNull,
  desclaimer: emptyToNull,

  logoId: z.string().nullable().optional(),
  iconLogoId: z.string().nullable().optional(),

  primary_color: emptyToNull,
  secondary_color: emptyToNull,
  accent_color: emptyToNull,

  font_family: emptyToNull,
});
