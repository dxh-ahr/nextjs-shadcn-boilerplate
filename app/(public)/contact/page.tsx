"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent } from "@/components/ui/field";
import { Form, FormField, useForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactInput = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(t("form.success"));
      form.reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          <h1 className="mb-6 animate-fade-in-up text-5xl font-light tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {t("title")}
          </h1>
          <p
            className="mx-auto mb-12 max-w-2xl animate-fade-in-up text-lg font-light leading-relaxed text-muted-foreground sm:text-xl"
            style={{ animationDelay: "100ms" }}
          >
            {t("subtitle")}
          </p>
        </div>
      </section>

      <Separator className="mx-auto w-full max-w-6xl" />

      {/* Contact Section */}
      <section className="mx-auto w-full px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 w-full lg:w-[900px] xl:w-[1200px] mx-auto">
          {/* Contact Form */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl font-light">
                {t("form.submit")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form form={form} onSubmit={onSubmit}>
                <div className="space-y-6">
                  <FormField name="name" label={t("form.name")}>
                    {(field) => (
                      <Field>
                        <FieldContent>
                          <Input
                            {...field}
                            placeholder={t("form.name_placeholder")}
                          />
                        </FieldContent>
                      </Field>
                    )}
                  </FormField>

                  <FormField name="email" label={t("form.email")}>
                    {(field) => (
                      <Field>
                        <FieldContent>
                          <Input
                            {...field}
                            type="email"
                            placeholder={t("form.email_placeholder")}
                          />
                        </FieldContent>
                      </Field>
                    )}
                  </FormField>

                  <FormField name="subject" label={t("form.subject")}>
                    {(field) => (
                      <Field>
                        <FieldContent>
                          <Input
                            {...field}
                            placeholder={t("form.subject_placeholder")}
                          />
                        </FieldContent>
                      </Field>
                    )}
                  </FormField>

                  <FormField name="message" label={t("form.message")}>
                    {(field) => (
                      <Field>
                        <FieldContent>
                          <Textarea
                            {...field}
                            placeholder={t("form.message_placeholder")}
                            rows={6}
                          />
                        </FieldContent>
                      </Field>
                    )}
                  </FormField>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full group"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      t("form.submitting")
                    ) : (
                      <>
                        {t("form.submit")}
                        <Send className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="flex flex-col gap-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-light">
                  {t("info.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("info.email")}
                    </p>
                    <p className="text-base font-light text-foreground">
                      {t("info.email_value")}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Clock className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {t("info.response")}
                    </p>
                    <p className="text-base font-light text-foreground">
                      {t("info.response_value")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
