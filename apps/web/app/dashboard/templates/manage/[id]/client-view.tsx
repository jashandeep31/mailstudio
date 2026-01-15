"use client";

import { useEffect, useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  ArrowLeft,
  Eye,
  Save,
  Globe,
  Lock,
  Calendar,
  Clock,
  ImageIcon,
  DollarSign,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useChat, useUpdateChat } from "@/hooks/use-chats";

interface ChatFormData {
  name: string;
  public: boolean;
  price: string;
}

export default function ClientView({ id }: { id: string }) {
  const { data: chat, isLoading } = useChat(id);
  const { mutate: updateChatMutation, isPending: isUpdating } = useUpdateChat();

  // Form state
  const [formData, setFormData] = useState<ChatFormData>({
    name: "",
    public: false,
    price: "0",
  });
  const [isDirty, setIsDirty] = useState(false);

  // Sync form data with chat data when loaded
  useEffect(() => {
    if (chat) {
      setFormData({
        name: chat.name,
        public: chat.public,
        price: chat.price || "0",
      });
    }
  }, [chat]);

  const handleInputChange = (field: keyof ChatFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    updateChatMutation(
      {
        chatId: id,
        name: formData.name,
        public: formData.public,
        price: formData.price,
      },
      {
        onSuccess: () => {
          setIsDirty(false);
        },
      },
    );
  };

  const handleCancel = () => {
    if (chat) {
      setFormData({
        name: chat.name,
        public: chat.public,
        price: chat.price || "0",
      });
      setIsDirty(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Template not found</p>
        <Button asChild>
          <Link href="/dashboard/templates">Back to Templates</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted flex min-h-screen flex-col">
      <main className="container mx-auto flex-1 px-4 py-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column: Preview / Thumbnail */}
          <div className="space-y-8 lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button asChild variant={"link"}>
                  <Link href="/dashboard/templates">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Templates
                  </Link>
                </Button>
                <h2 className="text-lg font-medium">Preview</h2>
              </div>

              <div className="bg-card group relative aspect-[16/10] overflow-hidden rounded-xl border shadow-sm">
                {chat.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={chat.thumbnail}
                    alt={chat.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="bg-muted/20 text-muted-foreground flex h-full w-full flex-col items-center justify-center">
                    <div className="bg-background h-3/4 w-3/4 space-y-4 rounded-lg border p-4 opacity-50 shadow-lg">
                      <div className="bg-muted h-8 w-1/3 animate-pulse rounded" />
                      <div className="space-y-2">
                        <div className="bg-muted/50 h-4 w-full animate-pulse rounded" />
                        <div className="bg-muted/50 h-4 w-5/6 animate-pulse rounded" />
                        <div className="bg-muted/50 h-4 w-4/6 animate-pulse rounded" />
                      </div>
                      <div className="bg-muted/20 border-muted flex h-32 w-full items-center justify-center rounded border-2 border-dashed">
                        <ImageIcon className="h-10 w-10 opacity-20" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-medium">
                      No custom thumbnail generated
                    </p>
                  </div>
                )}

                <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="bg-background/80 rounded border px-2 py-1 text-xs shadow-sm backdrop-blur">
                    Read-only Preview
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium">Analytics</h2>
              <div className="grid grid-cols-3 gap-8 border-t pt-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Likes
                  </p>
                  <p className="text-2xl font-bold">{chat.like_count}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Total Sales
                  </p>
                  <p className="text-2xl font-bold">--</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Revenue
                  </p>
                  <p className="text-2xl font-bold">--</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Configuration</h2>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                    General Details
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        placeholder="E.g. Monthly Newsletter"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Template ID</Label>
                      <div className="bg-muted text-muted-foreground truncate rounded border p-2 font-mono text-xs select-all">
                        {chat.id}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1">
                        <Label className="text-muted-foreground text-xs">
                          Created
                        </Label>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="text-muted-foreground h-3 w-3" />
                          {new Date(chat.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-muted-foreground text-xs">
                          Updated
                        </Label>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="text-muted-foreground h-3 w-3" />
                          {new Date(chat.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                    Marketplace Settings
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-card flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow-sm">
                      <Checkbox
                        id="public-mode"
                        checked={formData.public}
                        onCheckedChange={(checked) =>
                          handleInputChange("public", checked === true)
                        }
                      />
                      <div className="space-y-1 leading-none">
                        <Label htmlFor="public-mode">Public Marketplace</Label>
                        <p className="text-muted-foreground text-xs">
                          Allow other users to discover and purchase this
                          template.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (USD)</Label>
                      <div className="relative">
                        <DollarSign className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          className="pl-8"
                          value={formData.price}
                          onChange={(e) =>
                            handleInputChange("price", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-muted-foreground text-[0.8rem]">
                        Set to 0 for free distribution. Platform fees may apply.
                      </p>
                    </div>
                    <div className="mt-12 flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        disabled={!isDirty || isUpdating}
                        onClick={handleCancel}
                      >
                        Discard
                      </Button>
                      <Button
                        disabled={!isDirty || isUpdating}
                        onClick={handleSave}
                        className="gap-2"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
