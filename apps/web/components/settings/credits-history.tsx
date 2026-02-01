"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { useUserCreditsHistory } from "@/hooks/use-user";

export const CreditsHistory = () => {
  const { data: creditsHistory } = useUserCreditsHistory();
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Credits History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount (Initial / Remaining)</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Expires At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creditsHistory?.map((grant) => (
              <TableRow key={grant.id}>
                <TableCell className="capitalize">{grant.type}</TableCell>
                <TableCell>
                  {grant.initial_amount} / {grant.remaining_amount}
                </TableCell>
                <TableCell>{grant.reason || "-"}</TableCell>
                <TableCell>
                  {new Date(grant.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(grant.expires_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
