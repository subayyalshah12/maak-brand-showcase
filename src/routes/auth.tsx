import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/auth")({
  head: () => ({ ...seo("Administrator Sign In", "Secure administrator access to MAAK Enterprises.", "/auth"), meta: [...seo("Administrator Sign In", "Secure administrator access to MAAK Enterprises.", "/auth").meta, { name: "robots", content: "noindex,nofollow" }] }),
  component: Auth,
});

function Auth() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const result = await supabase.auth.signInWithPassword({ email: String(form.get("email")).trim(), password: String(form.get("password")) });
      if (result.error) throw result.error;
      await navigate({ to: "/admin" });
    } catch { setError("Sign-in failed. Check your email and password and try again."); }
    finally { setBusy(false); }
  }
  async function social(provider: "google" | "lovable") {
    setBusy(true); setError("");
    try {
      const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: `${window.location.origin}/auth` });
      if (result.error) throw result.error;
      const { data } = await supabase.auth.getUser();
      if (data.user) await navigate({ to: "/admin" });
    } catch { setError("Sign-in could not be completed. Please try again."); }
    finally { setBusy(false); }
  }
  return <section className="mx-auto max-w-md px-4 py-16">
    <div className="flex justify-center"><Logo className="h-28" /></div>
    <h1 className="my-6 text-center text-3xl text-primary">Administrator sign in</h1>
    <form className="space-y-4" onSubmit={submit}>
      <div className="space-y-2"><Label htmlFor="admin-email">Email</Label><Input id="admin-email" name="email" type="email" required autoComplete="username" /></div>
      <div className="space-y-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" name="password" type="password" required autoComplete="current-password" /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
    </form>
    <div className="mt-4 grid gap-3"><Button variant="outline" disabled={busy} onClick={() => social("google")}>Continue with Google</Button><Button variant="outline" disabled={busy} onClick={() => social("lovable")}>Sign in with Lovable</Button></div>
    <p className="mt-6 text-sm text-muted-foreground">Access is restricted to approved administrators.</p>
  </section>;
}