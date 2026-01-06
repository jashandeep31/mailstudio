import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@repo/ui/components/dropdown-menu";
import { Button } from "@repo/ui/components/button";
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
import { useUserTestMails } from "@/hooks/use-user-test-mail";
interface Mail {
  id: string;
  mail: string;
  verified: boolean;
}
export const SendTestMailDropdown = () => {
  const { data: mails } = useUserTestMails();

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
      verifiedMails: [] as Mail[],
      notVerifiedMails: [] as Mail[],
    },
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"}>Send Mail</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3 min-w-96">
        <div className="p-3">
          <Label className="mb-2">Select email</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="your@email.com" />
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
            <Button variant={"link"}>Manage Mails</Button>
            <Button>Send Mail</Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
