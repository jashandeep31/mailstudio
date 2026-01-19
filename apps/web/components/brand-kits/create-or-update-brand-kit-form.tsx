"use client";
import { updateBrandkitSchema } from "@repo/shared";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Button } from "@repo/ui/components/button";
import { brandKitsTable } from "@repo/db";

export default function CreateOrUpdateBrandKitForm({
  defaultValues,
}: {
  defaultValues?: typeof brandKitsTable.$inferSelect;
}) {
  const {
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof updateBrandkitSchema>>({
    resolver: zodResolver(updateBrandkitSchema),
    defaultValues: { name: "thsi " },
  });

  function onSubmit(data: z.infer<typeof updateBrandkitSchema>) {
    console.log(data);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Basic Information</h2>

          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input id="name" placeholder="Enter company name" />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="website_url">Website URL</Label>
            <Input
              id="website_url"
              type="url"
              placeholder="https://example.com"
            />
            {errors.website_url && (
              <p className="text-destructive text-sm">
                {errors.website_url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand_summary">Brand Summary</Label>
            <Input id="brand_summary" />
            {errors.brand_summary && (
              <p className="text-destructive text-sm">
                {errors.brand_summary.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand_design_style">Design Style</Label>
            <Input id="brand_design_style" />
            {errors.brand_design_style && (
              <p className="text-destructive text-sm">
                {errors.brand_design_style.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Brand Assets</h2>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" placeholder="https://example.com/logo.png" />
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
            />
            {errors.icon_logo_url && (
              <p className="text-destructive text-sm">
                {errors.icon_logo_url.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="font_family">Font Family</Label>
            <Input id="font_family" placeholder="Inter, Arial, sans-serif" />
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
                  id="primary_color"
                  type="color"
                  // onChange={(e) => setValue("primary_color", e.target.value)}
                  className="h-9 w-12 p-1"
                />
                <Input
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
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
                  id="secondary_color"
                  type="color"
                  className="h-9 w-12 p-1"
                />
                <Input
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
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
                  id="accent_color"
                  type="color"
                  className="h-9 w-12 p-1"
                />
                <Input
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
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

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" placeholder="Company address" />
            {errors.address && (
              <p className="text-destructive text-sm">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input
              id="copyright"
              placeholder="© 2024 Company Name. All rights reserved."
            />
            {errors.copyright && (
              <p className="text-destructive text-sm">
                {errors.copyright.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="desclaimer">Disclaimer</Label>
            <Input id="desclaimer" placeholder="Legal disclaimer text" />
            {errors.desclaimer && (
              <p className="text-destructive text-sm">
                {errors.desclaimer.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
