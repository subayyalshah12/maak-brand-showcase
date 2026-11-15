import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export type InquiryType = "general" | "construction" | "real_estate" | "education";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  phone: z.string().trim().max(30).regex(/^[+\d\s()-]*$/, "Use digits only").optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Please write a message").max(2000),
}).refine((d) => d.phone || d.email, { message: "Give a phone number or email so we can reply", path: ["phone"] });

export function InquiryForm({ type, reference, title = "Send an inquiry" }: { type: InquiryType; reference?: string; title?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  type Errs = { name?: string; phone?: string; email?: string; message?: string };
  const [errors, setErrors] = useState<Errs>({});
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
      setErrors(errs as Errs); return;
    }
    setErrors({}); setServerError(""); setState("sending");
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name, phone: parsed.data.phone || null, email: parsed.data.email || null,
      message: parsed.data.message, inquiry_type: type, reference: reference ?? null,
    });
    if (error) { setServerError("Sorry, your message could not be sent. Please try again or email us."); setState("idle"); return; }
    form.reset(); setState("done");
  }

  if (state === "done") {
    return (
      <div role="status" className="rounded-lg border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
        <CheckCircle2 className="mx-auto size-10 text-gold" />
        <h3 className="mt-3 text-2xl text-primary">Thank you — we received your inquiry</h3>
        <p className="mt-2 text-sm text-muted-foreground">Our team will get back to you soon.</p>
        <Button variant="outline" className="mt-5" onClick={() => setState("idle")}>Send another</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
      <h3 className="text-2xl font-semibold text-primary">{title}</h3>
      {reference && <p className="text-sm text-muted-foreground">Regarding: <strong>{reference}</strong></p>}
      <Field id="name" label="Full name" error={errors.name}><Input id="name" name="name" maxLength={100} autoComplete="name" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="phone" label="Phone" error={errors.phone}><Input id="phone" name="phone" type="tel" maxLength={30} autoComplete="tel" /></Field>
        <Field id="email" label="Email" error={errors.email}><Input id="email" name="email" type="email" maxLength={255} autoComplete="email" /></Field>
      </div>
      <Field id="message" label="Message" error={errors.message}><Textarea id="message" name="message" rows={5} maxLength={2000} /></Field>
      {serverError && <p role="alert" className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={state === "sending"}>
        {state === "sending" ? <><Loader2 className="animate-spin" /> Sending…</> : "Send inquiry"}
      </Button>
    </form>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
