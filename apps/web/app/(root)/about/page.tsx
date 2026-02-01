import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Mail, Zap, Smartphone, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      {/* Mission Section */}
      <section className="mb-20 grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Email remains the most powerful communication channel, yet designing
            responsive emails has always been a struggle. Compatibility issues,
            complex table structures, and lack of modern tools make it a painful
            process.
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            At MailStudio, we're changing that. We combine the reliability of
            MJML with the intelligence of generative AI to provide a seamless,
            drag-and-drop experience that ensures your emails look perfect on
            every device.
          </p>
        </div>
        <div className="bg-muted/50 flex aspect-video items-center justify-center rounded-2xl p-8">
          <Mail className="text-primary/20 size-32" />
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-20">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Why MailStudio?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-card/50 border-muted">
            <CardHeader>
              <Zap className="text-primary mb-2 size-10" />
              <CardTitle>AI-Powered Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate compelling copy and layouts instantly with our
                integrated AI assistant. Say goodbye to writer's block.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-muted">
            <CardHeader>
              <Smartphone className="text-primary mb-2 size-10" />
              <CardTitle>Responsive by Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built on top of MJML, ensuring your emails render perfectly
                across all major email clients and devices.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-muted">
            <CardHeader>
              <Users className="text-primary mb-2 size-10" />
              <CardTitle>Developer Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Export clean code, customize components, and integrate
                seamlessly into your existing workflow.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
