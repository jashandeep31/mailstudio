"use client"
import { useState } from "react";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { useUserBrandKitById } from "@/hooks/use-brandkits";
import { useParams } from "next/navigation";
import { brandKitsTable } from "@repo/db";

type BrandKit = typeof brandKitsTable.$inferSelect;

interface BrandKitFormData {
  name: string;
  website_url: string;
  brand_summary: string;
  brand_design_style: string;
  logo_url: string;
  icon_logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  address: string;
  copyright: string;
  desclaimer: string;
}

export default function ClientView() {
  const params = useParams();
  const { data: brandKit, isLoading } = useUserBrandKitById(params.id as string);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!brandKit) {
    return <div className="p-6">Brand kit not found</div>;
  }
  return <BrandKitForm brandKit={brandKit} />;
}

function BrandKitForm({ brandKit }: { brandKit: BrandKit }) {
  const [formData, setFormData] = useState<BrandKitFormData>({
    name: brandKit.name,
    website_url: brandKit.website_url,
    brand_summary: brandKit.brand_summary || "",
    brand_design_style: brandKit.brand_design_style || "",
    logo_url: brandKit.logo_url || "",
    icon_logo_url: brandKit.icon_logo_url || "",
    primary_color: brandKit.primary_color || "#000000",
    secondary_color: brandKit.secondary_color || "#ffffff",
    accent_color: brandKit.accent_color || "#ff0000",
    address: brandKit.address || "",
    copyright: brandKit.copyright || "",
    desclaimer: brandKit.desclaimer || "",
  });

  const handleInputChange = (field: keyof BrandKitFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <h1 className="mb-8 text-2xl font-semibold">Edit Brand Kit</h1>
      
      <form className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Basic Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              value={formData.website_url}
              onChange={(e) => handleInputChange("website_url", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand_summary">Brand Summary</Label>
            <Input
              id="brand_summary"
              value={formData.brand_summary}
              onChange={(e) => handleInputChange("brand_summary", e.target.value)}
              placeholder="Brief description of your brand"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand_design_style">Design Style</Label>
            <Input
              id="brand_design_style"
              value={formData.brand_design_style}
              onChange={(e) => handleInputChange("brand_design_style", e.target.value)}
              placeholder="Describe your brand's design style"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Brand Assets</h2>
          
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={(e) => handleInputChange("logo_url", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon_logo_url">Icon Logo URL</Label>
            <Input
              id="icon_logo_url"
              type="url"
              value={formData.icon_logo_url}
              onChange={(e) => handleInputChange("icon_logo_url", e.target.value)}
              placeholder="https://example.com/icon.png"
            />
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
                  value={formData.primary_color}
                  onChange={(e) => handleInputChange("primary_color", e.target.value)}
                  className="w-12 p-1 h-9"
                />
                <Input
                  value={formData.primary_color}
                  onChange={(e) => handleInputChange("primary_color", e.target.value)}
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary_color"
                  type="color"
                  value={formData.secondary_color}
                  onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                  className="w-12 p-1 h-9"
                />
                <Input
                  value={formData.secondary_color}
                  onChange={(e) => handleInputChange("secondary_color", e.target.value)}
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent_color">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accent_color"
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => handleInputChange("accent_color", e.target.value)}
                  className="w-12 p-1 h-9"
                />
                <Input
                  value={formData.accent_color}
                  onChange={(e) => handleInputChange("accent_color", e.target.value)}
                  placeholder="#000000"
                  maxLength={7}
                  className="font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Legal Information</h2>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Company address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input
              id="copyright"
              value={formData.copyright}
              onChange={(e) => handleInputChange("copyright", e.target.value)}
              placeholder="Copyright information"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="disclaimer">Disclaimer</Label>
            <Input
              id="disclaimer"
              value={formData.desclaimer}
              onChange={(e) => handleInputChange("desclaimer", e.target.value)}
              placeholder="Legal disclaimer"
            />
          </div>
        </div>
      </form>
    </div>
  );
}