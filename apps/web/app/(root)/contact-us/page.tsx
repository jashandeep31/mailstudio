import React from "react";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/card";
import { Mail, Twitter } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Have questions, feedback, or just want to say hello? We'd love to hear
          from you.
        </p>
      </div>

      <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
        {/* Email Card */}
        <Card className="bg-card/50 border-muted hover:bg-card/80 transition-colors">
          <CardHeader className="text-center">
            <div className="bg-primary/10 mx-auto mb-2 rounded-full p-4">
              <Mail className="text-primary size-8" />
            </div>
            <CardTitle>Email Us</CardTitle>
            <CardDescription>For general inquiries and support</CardDescription>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <Link href="mailto:hi@jashan.dev">
              <Button variant="link" className="h-auto p-0 text-lg">
                hi@jashan.dev
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* X / Twitter Card */}
        <Card className="bg-card/50 border-muted hover:bg-card/80 transition-colors">
          <CardHeader className="text-center">
            <div className="bg-primary/10 mx-auto mb-2 rounded-full p-4">
              <Twitter className="text-primary size-8" />
            </div>
            <CardTitle>Follow on X</CardTitle>
            <CardDescription>
              For updates and quick interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 text-center">
            <Link href="https://x.com/jashandeep31" target="_blank">
              <Button variant="link" className="h-auto p-0 text-lg">
                @jashandeep31
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
