import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { properties, projects } from "@/lib/sample-data";
import { companySettingsQuery } from "@/hooks/use-company-settings";
import { isAdminRole, validateImage, validPhone } from "@/lib/admin-rules";
import { ListingImage } from "@/components/site/ListingImage";
import { seo } from "@/lib/seo";
import { PropertyManager } from "@/components/admin/PropertyManager";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ ...seo("Administration", "Manage MAAK Enterprises inquiries, contact settings, and listing images.", "/admin"), meta: [...seo("Administration", "Manage MAAK Enterprises inquiries, contact settings, and listing images.", "/admin").meta, { name: "robots", content: "noindex,nofollow" }] }),
  component: Admin,
});

function Admin() {
  const access = useQuery({ queryKey: ["admin-access"], queryFn: async () => {
    const { data, error } = await supabase.from("user_roles").select("role");
    if (error) throw error;
    return isAdminRole(data);
  }});
  const [tab, setTab] = useState("inquiries");
  if (access.isPending) return <p role="status" className="p-10 text-center">Checking administrator access…</p>;
  if (access.isError) return <div className="p-10 text-center"><p role="alert">Unable to check access.</p><Button onClick={() => access.refetch()}>Try again</Button></div>;
  if (!access.data) return <section className="mx-auto max-w-xl px-4 py-16"><h1 className="text-3xl text-primary">Access denied</h1><p className="mt-4">This account does not have administrator permission.</p></section>;
  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <h1 className="text-4xl text-primary">Administration</h1>
    <div className="my-8 flex flex-wrap gap-2" role="tablist" aria-label="Administration">
      {["inquiries", "properties", "projects", "settings", "profile"].map((item) => <Button role="tab" aria-selected={tab === item} key={item} variant={tab === item ? "default" : "outline"} onClick={() => setTab(item)} className="capitalize">{item}</Button>)}
    </div>
    <div role="tabpanel">
      {tab === "inquiries" && <Inquiries />}
      {tab === "properties" && <PropertyManager />}
      {tab === "projects" && <Images kind="project" />}
      {tab === "settings" && <Settings />}
      {tab === "profile" && <Profile />}
    </div>
  </section>;
}

function Inquiries() {
  const queryClient = useQueryClient();
  const inquiries = useQuery({ queryKey: ["admin-inquiries"], queryFn: async () => {
    const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }});
  const update = useMutation({ mutationFn: async ({ id, status }: { id: string; status: string }) => {
    const { data, error } = await supabase.from("inquiries").update({ status }).eq("id", id).select("id").single();
    if (error || !data) throw error ?? new Error("Not saved");
  }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] }) });
  if (inquiries.isPending) return <p role="status">Loading inquiries…</p>;
  if (inquiries.isError) return <div><p role="alert">Inquiries could not be loaded.</p><Button onClick={() => inquiries.refetch()}>Try again</Button></div>;
  return <div>
    <h2 className="mb-6 text-2xl text-primary">Inquiries</h2>
    {update.isError && <p role="alert" className="text-destructive">The status could not be saved.</p>}
    {!inquiries.data.length && <p>No inquiries yet.</p>}
    <div className="grid gap-4">{inquiries.data.map((row) => <article key={row.id} className="rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap justify-between gap-4"><h3 className="text-xl">{row.name}</h3><label className="flex items-center gap-2 text-sm">Status<select aria-label={`Status for ${row.name}`} className="rounded border border-input bg-background p-2" value={row.status} disabled={update.isPending} onChange={(e) => update.mutate({ id: row.id, status: e.target.value })}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label></div>
      <p className="mt-2 break-words text-sm text-muted-foreground">{row.email} {row.phone} · {row.inquiry_type} · {new Date(row.created_at).toLocaleDateString()}</p>
      {row.reference && <p className="mt-2 text-sm">Regarding: {row.reference}</p>}
      <p className="mt-3 whitespace-pre-wrap break-words">{row.message}</p>
    </article>)}</div>
  </div>;
}

function Settings() {
  const settings = useQuery(companySettingsQuery);
  const queryClient = useQueryClient();
  const save = useMutation({ mutationFn: async (values: { phone: string; whatsapp: string }) => {
    if (!validPhone(values.phone) || !validPhone(values.whatsapp)) throw new Error("Enter valid phone numbers or leave the fields blank.");
    const { error } = await supabase.from("company_settings").upsert({ id: "company", ...values }).select("id").single();
    if (error) throw new Error("Settings could not be saved.");
  }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["company-settings"] }) });
  if (settings.isPending) return <p role="status">Loading settings…</p>;
  if (settings.isError) return <div><p role="alert">Settings could not be loaded.</p><Button onClick={() => settings.refetch()}>Try again</Button></div>;
  return <form className="max-w-lg space-y-5" onSubmit={(event) => {
    event.preventDefault(); const data = new FormData(event.currentTarget);
    save.mutate({ phone: String(data.get("phone")).trim(), whatsapp: String(data.get("whatsapp")).trim() });
  }}>
    <h2 className="text-2xl text-primary">Company contact settings</h2>
    <div className="space-y-2"><Label htmlFor="company-phone">Company phone</Label><Input id="company-phone" name="phone" type="tel" maxLength={30} defaultValue={settings.data.phone} /></div>
    <div className="space-y-2"><Label htmlFor="company-whatsapp">WhatsApp number</Label><Input id="company-whatsapp" name="whatsapp" type="tel" maxLength={30} defaultValue={settings.data.whatsapp} /><p className="text-sm text-muted-foreground">Include the country code. Leave blank if not supplied.</p></div>
    {save.isError && <p role="alert" className="text-destructive">{save.error.message}</p>}
    {save.isSuccess && <p role="status">Settings saved.</p>}
    <Button disabled={save.isPending}>{save.isPending ? "Saving…" : "Save settings"}</Button>
  </form>;
}

function Images({ kind }: { kind: "property" | "project" }) {
  const items = kind === "property" ? properties : projects;
  return <div><h2 className="text-2xl text-primary">{kind === "property" ? "Property" : "Project"} images</h2><p className="mt-2 text-sm text-muted-foreground">These remain sample records, not genuine company listings or work.</p>
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <ImageEditor key={`${kind}-${item.id}`} kind={kind} item={item} />)}</div>
  </div>;
}

function ImageEditor({ kind, item }: { kind: "property" | "project"; item: { id: string; title: string; image: string } }) {
  const queryClient = useQueryClient();
  const upload = useMutation({ mutationFn: async (file: File) => {
    const invalid = validateImage(file); if (invalid) throw new Error(invalid);
    const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
    const path = `${kind}/${item.id}/${crypto.randomUUID()}.${ext}`;
    const previous = await supabase.from("listing_images").select("storage_path").eq("kind", kind).eq("reference_id", item.id).maybeSingle();
    if (previous.error) throw new Error("Previous image could not be checked.");
    const result = await supabase.storage.from("listing-images").upload(path, file, { contentType: file.type });
    if (result.error) throw new Error("Image upload failed. Please try again.");
    const record = await supabase.from("listing_images").upsert({ kind, reference_id: item.id, storage_path: path }, { onConflict: "kind,reference_id" }).select("id").single();
    if (record.error) { await supabase.storage.from("listing-images").remove([path]); throw new Error("Image could not be attached to the listing."); }
    if (previous.data) await supabase.storage.from("listing-images").remove([previous.data.storage_path]);
  }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["listing-image", kind, item.id] }) });
  return <article className="overflow-hidden rounded-lg border border-border bg-card">
    <ListingImage kind={kind} referenceId={item.id} src={item.image} alt={item.title} className="aspect-[4/3] w-full object-cover" />
    <div className="space-y-3 p-4"><h3 className="text-xl">{item.title}</h3>
      <Label htmlFor={`image-${item.id}`}>Replace image</Label><Input id={`image-${item.id}`} aria-label={`Image for ${item.title}`} type="file" accept="image/jpeg,image/png,image/webp" disabled={upload.isPending} onChange={(e) => { const file = e.target.files?.[0]; if (file) upload.mutate(file); e.target.value = ""; }} />
      {upload.isPending && <p role="status">Uploading…</p>}{upload.isSuccess && <p role="status">Image saved.</p>}{upload.isError && <p role="alert" className="text-sm text-destructive">{upload.error.message}</p>}
    </div>
  </article>;
}

function Profile() {
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: ["admin-profile"], queryFn: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not signed in");
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single();
    if (error) throw error; return data;
  }});
  const save = useMutation({ mutationFn: async (values: { display_name: string; avatar_url: string }) => {
    if (!profile.data) throw new Error("Profile unavailable");
    if (values.avatar_url && !values.avatar_url.startsWith("https://")) throw new Error("Use an HTTPS avatar address.");
    const { error } = await supabase.from("profiles").update({ ...values, avatar_url: values.avatar_url || null }).eq("id", profile.data.id).select("id").single();
    if (error) throw new Error("Profile could not be saved.");
  }, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-profile"] }) });
  if (profile.isPending) return <p role="status">Loading profile…</p>;
  if (profile.isError) return <p role="alert">Profile could not be loaded.</p>;
  return <form className="max-w-lg space-y-4" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); save.mutate({ display_name: String(data.get("display_name")).trim(), avatar_url: String(data.get("avatar_url")).trim() }); }}>
    <h2 className="text-2xl text-primary">Your profile</h2>
    <Label htmlFor="display-name">Display name</Label><Input id="display-name" name="display_name" maxLength={100} defaultValue={profile.data.display_name} />
    <Label htmlFor="avatar-url">Avatar URL</Label><Input id="avatar-url" name="avatar_url" type="url" defaultValue={profile.data.avatar_url ?? ""} />
    {save.isSuccess && <p role="status">Profile saved.</p>}{save.isError && <p role="alert" className="text-destructive">{save.error.message}</p>}
    <Button disabled={save.isPending}>{save.isPending ? "Saving…" : "Save profile"}</Button>
  </form>;
}
