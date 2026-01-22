"use client";
import { createBrandkitSchema } from "@repo/shared";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";
import { brandKitsTable } from "@repo/db";

export default function CreateOrUpdateBrandKitForm({
  defaultValues,
}: {
  defaultValues?: typeof brandKitsTable.$inferSelect;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createBrandkitSchema>>({
    resolver: zodResolver(createBrandkitSchema),
    defaultValues: { ...defaultValues },
  });
  function onSubmit(data: z.infer<typeof createBrandkitSchema>) {}

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Basic Information</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                placeholder="Enter company name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                type="url"
                placeholder="https://example.com"
                {...register("website_url")}
              />
              {errors.website_url && (
                <p className="text-destructive text-sm">
                  {errors.website_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_summary">Brand Summary</Label>
              <Input id="brand_summary" {...register("brand_summary")} />
              {errors.brand_summary && (
                <p className="text-destructive text-sm">
                  {errors.brand_summary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_design_style">Design Style</Label>
              <Input
                id="brand_design_style"
                {...register("brand_design_style")}
              />
              {errors.brand_design_style && (
                <p className="text-destructive text-sm">
                  {errors.brand_design_style.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Brand Assets</h2>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              placeholder="https://example.com/logo.png"
              {...register("logo_url")}
            />
            {errors.logo_url && (
              <p className="text-destructive text-sm">
                {errors.logo_url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon_logo_url">Icon Logo URL</Label>
            <Input
              id="icon_logo_url"
              placeholder="https://example.com/icon.png"
              {...register("icon_logo_url")}
            />
            {errors.icon_logo_url && (
              <p className="text-destructive text-sm">
                {errors.icon_logo_url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="font_family">Font Family</Label>
            <Input
              id="font_family"
              placeholder="Inter, Arial, sans-serif"
              {...register("font_family")}
            />
            {errors.font_family && (
              <p className="text-destructive text-sm">
                {errors.font_family.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Brand Colors</h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
                  {...register("primary_color")}
                />
              </div>
              {errors.primary_color && (
                <p className="text-destructive text-sm">
                  {errors.primary_color.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
                  {...register("secondary_color")}
                />
              </div>
              {errors.secondary_color && (
                <p className="text-destructive text-sm">
                  {errors.secondary_color.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
                  {...register("accent_color")}
                />
              </div>
              {errors.accent_color && (
                <p className="text-destructive text-sm">
                  {errors.accent_color.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Legal Information</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Company address"
                rows={3}
                {...register("address")}
              />
              {errors.address && (
                <p className="text-destructive text-sm">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="copyright">Copyright Text</Label>
              <Textarea
                id="copyright"
                placeholder="© 2024 Company Name. All rights reserved."
                rows={2}
                {...register("copyright")}
              />
              {errors.copyright && (
                <p className="text-destructive text-sm">
                  {errors.copyright.message}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desclaimer">Disclaimer</Label>
              <Textarea
                id="desclaimer"
                placeholder="Legal disclaimer text"
                rows={3}
                {...register("desclaimer")}
              />
              {errors.desclaimer && (
                <p className="text-destructive text-sm">
                  {errors.desclaimer.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
