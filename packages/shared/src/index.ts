export * from "./event-schemas.js";
import z from "zod";

export const updateBrandkitSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Company name is required"),
  website_url: z.string().min(1, "Website URL is required"),

  brand_summary: z.string().nullable().optional(),
  brand_design_style: z.string().nullable().optional(),

  address: z.string().nullable().optional(),
  copyright: z.string().nullable().optional(),
  desclaimer: z.string().nullable().optional(),

  logo_url: z.string().nullable().optional(),
  icon_logo_url: z.string().nullable().optional(),

  primary_color: z.string().nullable().optional(),
  secondary_color: z.string().nullable().optional(),
  accent_color: z.string().nullable().optional(),

  font_family: z.string().nullable().optional(),
});
