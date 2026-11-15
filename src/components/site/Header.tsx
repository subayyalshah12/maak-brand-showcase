import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/real-estate", label: "Real Estate" },
  { to: "/construction", label: "Construction" },
  { to: "/projects", label: "Projects" },
  { to: "/education", label: "Education" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useEffect(() => {
    let active = true;
    const update = () => { supabase.auth.getUser().then(({ data }) => { if (active) setSignedIn(Boolean(data.user)); }); };
    update();
    window.addEventListener("maak-auth-change", update);
    return () => { active = false; window.removeEventListener("maak-auth-change", update); };
  }, []);
  async function signOut() {
    setSigningOut(true);
    try {
      await queryClient.cancelQueries(); queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSignedIn(false);
      await navigate({ to: "/auth", replace: true });
    } finally { setSigningOut(false); }
  }
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Logo className="h-14 sm:h-16 lg:h-[4.5rem]" />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary data-[status=active]:underline data-[status=active]:decoration-gold data-[status=active]:decoration-2 data-[status=active]:underline-offset-8">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Button asChild><Link to="/contact">Get in touch</Link></Button>
          {signedIn && <><Button asChild variant="outline"><Link to="/admin">Admin</Link></Button><Button variant="ghost" disabled={signingOut} onClick={signOut}>Sign out</Button></>}
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </Button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-border bg-background px-4 pb-4 lg:hidden">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} activeOptions={{ exact: n.to === "/" }}
              className="block border-b border-border py-3 font-medium data-[status=active]:text-primary">
              {n.label}
            </Link>
          ))}
          {signedIn && <div className="mt-3 flex gap-2"><Button asChild variant="outline"><Link to="/admin" onClick={() => setOpen(false)}>Admin</Link></Button><Button variant="ghost" disabled={signingOut} onClick={signOut}>Sign out</Button></div>}
        </nav>
      )}
    </header>
  );
}
