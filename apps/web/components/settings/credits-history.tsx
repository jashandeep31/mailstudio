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

interface CreditGrant {
  id: string;
  type: "monthly" | "referral" | "purchased" | "promotional";
  initial_amount: string;
  remaining_amount: string;
  expires_at: string;
  created_at: string;
  reason: string | null;
}

const mockGrants: CreditGrant[] = [
  {
    id: "1",
    type: "monthly",
    initial_amount: "10.00",
    remaining_amount: "5.00",
    expires_at: new Date(
      new Date().setMonth(new Date().getMonth() + 1),
    ).toISOString(),
    created_at: new Date().toISOString(),
    reason: "Monthly allowance",
  },
  {
    id: "2",
    type: "referral",
    initial_amount: "5.00",
    remaining_amount: "5.00",
    expires_at: new Date(
      new Date().setMonth(new Date().getMonth() + 2),
    ).toISOString(),
    created_at: new Date(
      new Date().setDate(new Date().getDate() - 5),
    ).toISOString(),
    reason: "Referral bonus",
  },
  {
    id: "3",
    type: "purchased",
    initial_amount: "50.00",
    remaining_amount: "0.00",
    expires_at: new Date(
      new Date().setMonth(new Date().getMonth() - 1),
    ).toISOString(),
    created_at: new Date(
      new Date().setDate(new Date().getDate() - 40),
    ).toISOString(),
    reason: "Credit pack purchase",
  },
];

export const CreditsHistory = () => {
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
            {mockGrants.map((grant) => (
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
