"use client";

import { useUserBillings } from "@/hooks/use-user";

export default function BillingClientView() {
  const { data: billings, isLoading, error } = useUserBillings();

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
        <p className="text-red-800">Error loading billing information</p>
      </div>
    );
  }

  if (!billings || billings.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No billing history available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {billings.map((billing) => (
          <div key={billing.id} className="bg-background rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {billing.plan_type === "free" ? "Free Plan" : "Starter Pack"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {billing.created_at
                    ? new Date(billing.created_at).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  {billing.amount
                    ? `$${parseFloat(billing.amount).toFixed(2)}`
                    : "$0.00"}
                </p>
                {billing.payment && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      billing.payment.status === "succeeded"
                        ? "bg-green-100 text-green-700"
                        : billing.payment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : billing.payment.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {billing.payment.status}
                  </span>
                )}
              </div>
            </div>
            {billing.payment && (
              <div className="mt-3 border-t pt-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="font-medium">
                      {billing.payment.settlement_amount &&
                      billing.payment.tax_amount
                        ? `$${(parseFloat(billing.payment.settlement_amount) - parseFloat(billing.payment.tax_amount)).toFixed(2)}`
                        : billing.payment.settlement_amount
                          ? `$${parseFloat(billing.payment.settlement_amount).toFixed(2)}`
                          : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax</p>
                    <p className="font-medium">
                      {billing.payment.tax_amount
                        ? `$${parseFloat(billing.payment.tax_amount).toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Total</p>
                    <p className="font-semibold">
                      {billing.payment.settlement_amount
                        ? `$${parseFloat(billing.payment.settlement_amount).toFixed(2)}`
                        : "-"}
                    </p>
                  </div>
                </div>
                {billing.payment.payment_method && (
                  <div className="mt-3 pt-3">
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="font-medium">
                      {billing.payment.payment_method}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
