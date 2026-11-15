
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

// Official MAAK Enterprises logo served from public assets.
export function Logo({ className, linked = true }: { className?: string; linked?: boolean }) {
  const img = (
    <img
      src="/maak-logo.png"
      alt="MAAK Enterprises Company"
      width={348}
      height={321}
      decoding="async"
      className={cn("logo-crisp h-14 w-auto object-contain", className)}
    />
  );
  return linked ? <Link to="/" aria-label="MAAK Enterprises home" className="inline-flex shrink-0">{img}</Link> : img;
}
