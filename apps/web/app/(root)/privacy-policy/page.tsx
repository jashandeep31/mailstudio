import React from "react";
import { Separator } from "@repo/ui/components/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <Separator className="my-8" />

      <div className="text-foreground/90 space-y-8 leading-relaxed">
        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We collect information you provide directly to us when you create an
            account, use our services, or communicate with us. This may include:
          </p>
          <ul className="text-muted-foreground list-disc space-y-2 pl-6">
            <li>
              Account information (name, email address, profile picture from
              Google).
            </li>
            <li>
              Content you create or upload (email templates, images, brand
              assets).
            </li>
            <li>
              Usage data (how you interact with our tools and AI features).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">We use the information we collect to:</p>
          <ul className="text-muted-foreground list-disc space-y-2 pl-6">
            <li>Provide, maintain, and improve our services.</li>
            <li>Process transactions and manage your account.</li>
            <li>
              Monitor and analyze trends, usage, and activities in connection
              with our services.
            </li>
            <li>
              Detect, investigate, and prevent fraudulent transactions and other
              illegal activities.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">3. Data Security</h2>
          <p className="text-muted-foreground">
            We take reasonable measures to help protect information about you
            from loss, theft, misuse, and unauthorized access, disclosure,
            alteration, and destruction. However, no internet transmission is
            completely secure, and we cannot guarantee the security of your
            data.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">
            4. Third-Party Services
          </h2>
          <p className="text-muted-foreground">
            We may use third-party providers (such as Google for authentication
            and AI processing) to help us operate our business and the Site or
            administer activities on our behalf. We may share your information
            with these third parties for those limited purposes.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">5. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact
            us at{" "}
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
