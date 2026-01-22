"use client";

import { useUserPayments } from "@/hooks/use-user";

export default function PaymentsClientView() {
  const { data: payments, isLoading, error } = useUserPayments();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-2 h-3 w-1/6 animate-pulse rounded bg-gray-200"></div>
              <div className="mt-4 h-3 w-1/5 animate-pulse rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Error loading payment information</p>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No payment history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {payments.map((payment) => (
          <div key={payment.id} className="bg-background rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium capitalize">{payment.provider}</h3>
                <p className="text-muted-foreground text-sm">
                  {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {payment.settlement_amount
                    ? `$${parseFloat(payment.settlement_amount).toFixed(2)}`
                    : "-"}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    payment.status === "succeeded"
                      ? "bg-green-100 text-green-700"
                      : payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : payment.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3 text-sm md:grid-cols-4">
              <div>
                <p className="text-muted-foreground">Subtotal</p>
                <p className="font-medium">
                  {payment.settlement_amount
                    ? `$${parseFloat(payment.settlement_amount).toFixed(2)}`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Tax</p>
                <p className="font-medium">
                  {payment.tax_amount
                    ? `$${parseFloat(payment.tax_amount).toFixed(2)}`
                    : "-"}
                </p>
              </div>
              {payment.payment_method && (
                <div>
                  <p className="text-muted-foreground">Method</p>
                  <p className="font-medium">{payment.payment_method}</p>
                </div>
              )}
              {payment.card_last_four && (
                <div>
                  <p className="text-muted-foreground">Card</p>
                  <p className="font-medium">
                    {payment.card_network ? `${payment.card_network} ` : ""}
                    •••• {payment.card_last_four}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
