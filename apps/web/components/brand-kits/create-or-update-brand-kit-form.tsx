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
import Image from "next/image";
import { useUploadMedia } from "@/hooks/use-media-upload";
import { useEffect, useState } from "react";
import { createManualBrandKit } from "@/services/brandkit-services";

export default function CreateOrUpdateBrandKitForm({
  defaultValues,
}: {
  defaultValues?: typeof brandKitsTable.$inferSelect;
}) {
  // Logo states
  const [logoId, setLogoId] = useState<null | string>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { uploadState: logoUploadState, uploadMediaFun: logoUploadFunc } =
    useUploadMedia();
  // logo small icons state
  const [iconLogoId, setIconLogoId] = useState<null | string>(null);
  const [iconLogoPreview, setIconLogoPreview] = useState<string | null>(null);
  const {
    uploadState: iconLogoUploadState,
    uploadMediaFun: logoIconUploadFunc,
  } = useUploadMedia();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof createBrandkitSchema>>({
    resolver: zodResolver(createBrandkitSchema),
    defaultValues: {
      ...defaultValues,
      name: "test website ",
      website_url: "https://jashan.dev",
    },
  });
  function onSubmit(data: z.infer<typeof createBrandkitSchema>) {
    if (logoId) data["logoId"] = logoId;
    if (iconLogoId) data["iconLogoId"] = iconLogoId;
    if (defaultValues) {
      // TODO: send to the updating funtion
    } else {
      //TODO: send to the new fuction
      const res = createManualBrandKit(data);
      console.log(res);
    }
  }
  const handleLogoUpload = (file: File) => {
    logoUploadFunc(file, "brandKitLogo");
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const handleIconLogoUpload = (file: File) => {
    logoIconUploadFunc(file, "brandKitIconLogo");
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  useEffect(() => {
    if (logoUploadState.state === "uploaded") setLogoId(logoUploadState.id);
    if (iconLogoUploadState.state === "uploaded")
      setIconLogoId(iconLogoUploadState.id);
    return () => {
      return;
    };
  }, [logoUploadState, iconLogoUploadState]);

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
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo URL</Label>
              <div className="mb-2 flex items-center gap-3">
                {logoPreview ? (
                  <div className="bg-muted relative h-20 w-20 overflow-hidden rounded border">
                    <Image
                      src={logoPreview}
                      alt="New logo preview"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : defaultValues?.logo_url ? (
                  <div className="bg-muted relative h-20 w-20 overflow-hidden rounded border">
                    <Image
                      src={defaultValues.logo_url}
                      alt="Current logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-20 w-20 items-center justify-center rounded border">
                    <span className="text-muted-foreground text-xs">
                      No logo
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="logoId"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleLogoUpload(file);
                    }}
                  />
                  {logoUploadState.state === "uploading" && (
                    <p className="mt-1 text-xs text-green-800">
                      Uploading {logoUploadState.percentage}%
                    </p>
                  )}
                  {logoUploadState.state === "uploaded" && (
                    <p className="mt-1 text-xs text-green-800">
                      Upload Success
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon_logo_url">Icon Logo URL</Label>
              <div className="mb-2 flex items-center gap-3">
                {iconLogoPreview ? (
                  <div className="bg-muted relative h-20 w-20 overflow-hidden rounded border">
                    <Image
                      src={iconLogoPreview}
                      alt="New icon preview"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : defaultValues?.icon_logo_url ? (
                  <div className="bg-muted relative h-20 w-20 overflow-hidden rounded border">
                    <Image
                      src={defaultValues.icon_logo_url}
                      alt="Current icon logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="bg-muted flex h-20 w-20 items-center justify-center rounded border">
                    <span className="text-muted-foreground text-xs">
                      No icon
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="iconLogoId"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleIconLogoUpload(file);
                    }}
                  />
                  {iconLogoUploadState.state === "uploading" && (
                    <p className="mt-1 text-xs text-green-800">
                      Uploading {iconLogoUploadState.percentage}%
                    </p>
                  )}
                  {iconLogoUploadState.state === "uploaded" && (
                    <p className="mt-1 text-xs text-green-800">
                      Upload Success
                    </p>
                  )}
                </div>
              </div>
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
