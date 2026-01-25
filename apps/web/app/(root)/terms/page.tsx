import React from "react";
import { Separator } from "@repo/ui/components/separator";

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">
        Terms and Conditions
      </h1>
      <p className="text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <Separator className="my-8" />

      <div className="text-foreground/90 space-y-8 leading-relaxed">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground">
            By accessing or using MailStudio, you agree to be bound by these
            Terms. If you disagree with any part of the terms, then you may not
            access the service.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            2. Payments and Refunds
          </h2>
          <p className="text-muted-foreground mb-4">
            <strong>All sales are final.</strong> We do not offer refunds for
            any subscriptions, credits, or one-time purchases, regardless of
            usage.
          </p>
          <p className="text-muted-foreground">
            Please ensure that our services meet your needs before making a
            purchase. If you have any questions about the service, please
            contact us prior to subscribing.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            3. Account Suspension and Termination
          </h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to suspend or terminate your account
            immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className="mb-4 font-medium">
            Specific grounds for immediate suspension include, but are not
            limited to:
          </p>
          <ul className="text-muted-foreground list-disc space-y-2 pl-6">
            <li>
              <strong>Abnormal Behavior:</strong> Any use of the service that
              disrupts the normal operation of the system, attempts to bypass
              security measures, or constitutes harassment or abuse of other
              users or staff.
            </li>
            <li>
              <strong>Token Consumption Abuse:</strong> Attempting to
              manipulate, exploit, or "game" the credit/token consumption
              system. This includes using automated scripts to generate
              excessive requests, finding workarounds to avoid credit deduction,
              or any usage pattern that significantly exceeds typical human
              behavior and puts undue strain on our resources.
            </li>
            <li>
              <strong>Illegal Activity:</strong> Using the service for any
              unlawful purpose or to solicit others to perform or participate in
              any unlawful acts.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            4. Limitation of Liability
          </h2>
          <p className="text-muted-foreground">
            In no event shall MailStudio, nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, resulting from your access to or use of
            or inability to access or use the service.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">5. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. By continuing to access or use our Service
            after those revisions become effective, you agree to be bound by the
            revised terms.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">6. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us at{" "}
            <a
              href="mailto:hi@jashan.dev"
              className="text-primary hover:underline"
            >
              hi@jashan.dev
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
