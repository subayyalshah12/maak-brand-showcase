import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => seo("Privacy Policy", "How MAAK Enterprises collects and uses the information you send through this website.", "/privacy"),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-semibold text-primary md:text-5xl">Privacy Policy</h1>
      <div className="mt-8 space-y-5 text-muted-foreground">
        <p>This policy explains what information MAAK Enterprises collects through this website and how we use it.</p>
        <h2 className="text-2xl text-primary">Information you send us</h2>
        <p>When you submit an inquiry form, we store your name, phone number, email address and message so our team can reply to you. We only use it to respond to your inquiry and do not sell it.</p>
        <h2 className="text-2xl text-primary">Contact</h2>
        <p>To ask about or remove your information, email <a className="text-primary underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
        <p className="text-sm">Draft — to be reviewed and completed before launch.</p>
      </div>
    </article>
  );
}
