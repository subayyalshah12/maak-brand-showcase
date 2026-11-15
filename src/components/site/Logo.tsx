import { Link } from "@tanstack/react-router";
import logo from "@/assets/maak-logo.png.asset.json";
import { cn } from "@/lib/utils";

// Official MAAK Enterprises logo — always rendered with its original proportions (348×321).
export function Logo({ className, linked = true }: { className?: string; linked?: boolean }) {
  const img = (
    <img
      src={logo.url}
      alt="MAAK Enterprises Company"
      width={348}
      height={321}
      decoding="async"
      className={cn("logo-crisp h-14 w-auto object-contain", className)}
    />
  );
  return linked ? <Link to="/" aria-label="MAAK Enterprises home" className="inline-flex shrink-0">{img}</Link> : img;
}
