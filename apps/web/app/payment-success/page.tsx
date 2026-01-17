"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";

const PaymentSuccessPage = () => {
  useEffect(() => {
    // Wait for 3 seconds then hard redirect
    const timer = setTimeout(() => {
      window.location.href = "/dashboard/settings";
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-background text-foreground flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div
        className="flex max-w-md flex-col items-center space-y-6 text-center"
        style={{ animation: "fadeInZoom 0.7s ease-out forwards" }}
      >
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20 duration-1000" />
          <div className="relative rounded-full bg-green-100 p-4 dark:bg-green-900/30">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your account has been upgraded.
            <br />
            Redirecting you to settings...
          </p>
        </div>

        {/* Progress bar animation */}
        <div className="bg-secondary h-1 w-full max-w-[200px] overflow-hidden rounded-full">
          <div
            className="h-full bg-green-600 dark:bg-green-500"
            style={{
              animation: "progress 3s linear forwards",
              width: "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
