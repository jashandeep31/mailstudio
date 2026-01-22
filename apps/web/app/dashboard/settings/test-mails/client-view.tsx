"use client";

import React from "react";
import { SettingsNav } from "@/components/settings/settings-nav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@repo/ui/components/table";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import {
  useCreateUserTestMail,
  useDeleteUserTestMail,
  useUserTestMails,
  useVerifyUserTestMail,
} from "@/hooks/use-user-test-mail";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { OtpVerificationDialog } from "@/components/dialogs/otp-verification-dialog";
import { AddTestMailDialog } from "@/components/dialogs/add-test-mail-dialog";
import { MoreVertical, RefreshCcw, ShieldCheck, Plus } from "lucide-react";

const statusStyles = {
  verified: "text-green-600 bg-green-50 border border-green-200",
  pending: "text-amber-600 bg-amber-50 border border-amber-200",
};

const TestMailsClientView = () => {
  const { data: mails, isLoading } = useUserTestMails({ enabled: true });
  const { mutate: createUserTestMail, isPending: isCreating } =
    useCreateUserTestMail();
  const { mutateAsync: deleteUserTestMail } = useDeleteUserTestMail();
  const { mutateAsync: verifyUserTestMail, isPending: isVerifying } =
    useVerifyUserTestMail();
  const [resendingId, setResendingId] = React.useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const handleVerify = async (data: { mailId: string; otp: string }) => {
    await verifyUserTestMail(data);
  };

  const handleResend = async (mailId: string) => {
    setResendingId(mailId);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setResendingId(null);
  };

  const handleDelete = async (mailId: string) => {
    await deleteUserTestMail(mailId);
  };

  const handleCreateMail = (email: string) => {
    console.log("handleCreateMail called with:", email);
    createUserTestMail({ email });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>

      <SettingsNav />

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add test mail
          </Button>

          <AddTestMailDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddMail={handleCreateMail}
            isCreating={isCreating}
          />
        </div>

        <Table className="bg-background">
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={3}>Loading test mails…</TableCell>
              </TableRow>
            )}
            {!isLoading && (!mails || mails.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-muted-foreground text-center"
                >
                  No test emails found. Add your first test email to get
                  started.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              mails &&
              mails.map((mail) => {
                const status = mail.verified ? "verified" : "pending";
                const label = mail.verified ? "Verified" : "Pending";
                return (
                  <TableRow key={mail.id}>
                    <TableCell className="font-medium">{mail.mail}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
                      >
                        {label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {!mail.verified && (
                          <OtpVerificationDialog
                            email={mail.mail}
                            mailId={mail.id}
                            onVerify={handleVerify}
                            isVerifying={isVerifying}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Verify
                            </Button>
                          </OtpVerificationDialog>
                        )}
                        {/* <Button
                          size="sm"
                          variant="secondary"
                          className="gap-1"
                          onClick={() => handleResend(mail.id)}
                          disabled={resendingId === mail.id}
                        >
                          <RefreshCcw className="h-3.5 w-3.5" />
                          {resendingId === mail.id ? "Resending…" : "Resend"}
                        </Button> */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <ConfirmationDialog
                              title="Delete test email"
                              description="Are you sure you want to remove this test email? This action cannot be undone."
                              confirmText="Delete"
                              variant="destructive"
                              onConfirm={() => handleDelete(mail.id)}
                            >
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(event) => event.preventDefault()}
                              >
                                Delete
                              </DropdownMenuItem>
                            </ConfirmationDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
          <TableCaption>
            {mails && mails.length > 0
              ? `${mails.length} test email${mails.length === 1 ? "" : "s"}`
              : ""}
          </TableCaption>
        </Table>
      </div>
    </div>
  );
};

export default TestMailsClientView;
