import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { Logo } from "./Logo";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <Logo className="h-24" />
          <p className="mt-4 text-xs font-bold tracking-[0.25em] text-gold">{SITE.tagline}</p>
        </div>
        <div>
          <h3 className="text-lg text-gold">Divisions</h3>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/construction" className="hover:text-gold">Construction</Link></li>
            <li><Link to="/real-estate" className="hover:text-gold">Real Estate</Link></li>
            <li><Link to="/education" className="hover:text-gold">Educational Consultancy</Link></li>
            <li><Link to="/projects" className="hover:text-gold">Projects</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg text-gold">Offices</h3>
          <ul className="mt-3 space-y-3 text-sm text-primary-foreground/80">
            {SITE.offices.map((o) => (
              <li key={o.city} className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-gold" /><span>{o.city}<br /><span className="text-primary-foreground/60">{o.focus}</span></span></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg text-gold">Contact</h3>
          <a href={`mailto:${SITE.email}`} className="mt-3 flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-gold"><Mail className="size-4 text-gold" />{SITE.email}</a>
          <ul className="mt-3 space-y-1 text-sm text-primary-foreground/70">
            {SITE.contacts.map((c) => <li key={c.division}>{c.division}: {c.person}</li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/60 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} MAAK Enterprises. All rights reserved.</span>
          <Link to="/privacy" className="hover:text-gold">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
