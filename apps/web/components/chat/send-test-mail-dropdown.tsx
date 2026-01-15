import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@repo/ui/components/dropdown-menu";
import { Button, buttonVariants } from "@repo/ui/components/button";
import {
  SelectValue,
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectLabel,
  SelectItem,
} from "@repo/ui/components/select";
import { Label } from "@repo/ui/components/label";
import {
  useUserTestMails,
  useSendTemplateOnTestMail,
  type UserTestMail,
} from "@/hooks/use-user-test-mail";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useChatStore } from "@/zustand-store/chat-store";
import Link from "next/link";
export const SendTestMailDropdown = () => {
  const selectedVersionId = useChatStore((s) => s.selectedVersionId);

  const [open, setOpen] = useState<boolean>(false);
  const [selectedMailId, setSelectedMailId] = useState<string>("");
  const {
    data: mails,
    isLoading,
    isError,
    error,
  } = useUserTestMails({ enabled: open });

  const { mutate: sendTestMail, isPending: isSending } =
    useSendTemplateOnTestMail();
  const { verifiedMails, notVerifiedMails } = (mails ?? []).reduce(
    (acc, mail) => {
      if (mail.verified) {
        acc.verifiedMails.push(mail);
      } else {
        acc.notVerifiedMails.push(mail);
      }
      return acc;
    },
    {
      verifiedMails: [] as UserTestMail[],
      notVerifiedMails: [] as UserTestMail[],
    },
  );
  useEffect(() => {
    if (error) {
      toast.error(error.response?.data?.message || "Failed to load mails");
    }
  }, [error]);

  const handleSendMail = () => {
    if (!selectedMailId) {
      toast.error("Please select an email");
      return;
    }

    sendTestMail(
      { mailId: selectedMailId, versionId: selectedVersionId },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setOpen(false);
          setSelectedMailId("");
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message || "Failed to send test mail",
          );
        },
      },
    );
  };

  return (
    <DropdownMenu
      onOpenChange={(e) => {
        setOpen(e);
      }}
      open={open}
    >
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>Send Mail</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3 min-w-96">
        <div className="p-3">
          <Label className="mb-2">Select email</Label>
          <Select
            disabled={isLoading || isError}
            value={selectedMailId}
            onValueChange={setSelectedMailId}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={isLoading ? "Loading..." : "your@email.com"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>select email</SelectLabel>
                {verifiedMails?.map((mail) => (
                  <SelectItem key={mail.id} value={mail.id}>
                    {mail.mail}
                  </SelectItem>
                ))}
              </SelectGroup>
              {notVerifiedMails.length > 0 && (
                <SelectGroup className="border-t">
                  <SelectLabel>verification pending</SelectLabel>
                  {notVerifiedMails?.map((mail) => (
                    <SelectItem
                      className=""
                      disabled
                      key={mail.id}
                      value={mail.id}
                    >
                      {mail.mail}
                    </SelectItem>
                  ))}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          <div className="mt-3 flex justify-between gap-4">
            <Link
              className={buttonVariants({ variant: "link" })}
              href={"/dashboard/settings/test-mails"}
            >
              Manage Mails
            </Link>
            <Button
              onClick={handleSendMail}
              disabled={isSending || !selectedMailId}
            >
              {isSending ? "Sending..." : "Send Mail"}
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
