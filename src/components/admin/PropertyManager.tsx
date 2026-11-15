import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ListingImage } from "@/components/site/ListingImage";
import { validateImage } from "@/lib/admin-rules";
import houseImage from "@/assets/realestate.jpg";

type PropertyRow = {
  id: string;
  title: string;
  type: "House" | "Apartment" | "Plot" | "Commercial";
  purpose: "sale" | "rent";
  price: number;
  location: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  featured: boolean;
  status: "draft" | "published";
  created_at: string;
};

const db = supabase as any;

const emptyForm = {
  title: "",
  type: "House",
  purpose: "sale",
  price: "",
  location: "",
  size: "",
  bedrooms: "0",
  bathrooms: "0",
  description: "",
  featured: false,
  status: "draft",
};

export function PropertyManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const listings = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await db
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PropertyRow[];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const values = {
        title: form.title.trim(),
        type: form.type,
        purpose: form.purpose,
        price: Number(form.price),
        location: form.location.trim(),
        size: form.size.trim(),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        description: form.description.trim(),
        featured: form.featured,
        status: form.status,
        updated_at: new Date().toISOString(),
      };

      if (
        !values.title || values.title.length > 150 ||
        !values.location || values.location.length > 200 ||
        !values.size || values.size.length > 50 ||
        !values.description || values.description.length > 3000 ||
        !Number.isSafeInteger(values.price) || values.price <= 0 ||
        !Number.isInteger(values.bedrooms) || values.bedrooms < 0 ||
        !Number.isInteger(values.bathrooms) || values.bathrooms < 0
      ) {
        throw new Error("Please check all fields and enter valid values.");
      }

      let propertyId = editing;

      if (editing) {
        const { error } = await db
          .from("properties")
          .update(values)
          .eq("id", editing);
        if (error) throw error;
      } else {
        const { data, error } = await db
          .from("properties")
          .insert(values)
          .select("id")
          .single();
        if (error) throw error;
        propertyId = data.id;
      }

      if (selectedImage && propertyId) {
        const invalid = validateImage(selectedImage);
        if (invalid) throw new Error(invalid);

        const ext = selectedImage.type === "image/jpeg"
          ? "jpg"
          : selectedImage.type === "image/png" ? "png" : "webp";

        const path = `property/${propertyId}/${crypto.randomUUID()}.${ext}`;

        const previous = await supabase.from("listing_images")
          .select("storage_path")
          .eq("kind", "property")
          .eq("reference_id", propertyId)
          .maybeSingle();

        if (previous.error) throw previous.error;

        const uploaded = await supabase.storage
          .from("listing-images")
          .upload(path, selectedImage, { contentType: selectedImage.type });

        if (uploaded.error) throw uploaded.error;

        const attached = await supabase.from("listing_images").upsert({
          kind: "property",
          reference_id: propertyId,
          storage_path: path,
        }, { onConflict: "kind,reference_id" });

        if (attached.error) {
          await supabase.storage.from("listing-images").remove([path]);
          throw attached.error;
        }

        if (previous.data) {
          await supabase.storage.from("listing-images")
            .remove([previous.data.storage_path]);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      queryClient.invalidateQueries({ queryKey: ["listing-image"] });
      setForm(emptyForm);
      setEditing(null);
      setSelectedImage(null);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from("properties").delete().eq("id", id);
      if (error) throw error;
      await supabase.from("listing_images")
        .delete().eq("kind", "property").eq("reference_id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
    },
  });

  function startEdit(item: PropertyRow) {
    setEditing(item.id);
    setForm({
      title: item.title,
      type: item.type,
      purpose: item.purpose,
      price: String(item.price),
      location: item.location,
      size: item.size,
      bedrooms: String(item.bedrooms),
      bathrooms: String(item.bathrooms),
      description: item.description,
      featured: item.featured,
      status: item.status,
    });
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setSelectedImage(null);
  }

  function field(name: keyof typeof emptyForm, value: string | boolean) {
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  if (listings.isPending) return <p role="status">Loading properties…</p>;

  if (listings.isError) {
    return <div>
      <p role="alert">Properties could not be loaded.</p>
      <Button onClick={() => listings.refetch()}>Try again</Button>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl text-primary">Property Management</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Add genuine client listings, update details, upload images and control publication.
        </p>
      </div>

      <form
        className="max-w-3xl space-y-5 rounded-lg border border-border bg-card p-5"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        <h3 className="text-xl font-semibold">
          {editing ? "Edit property" : "Add new property"}
        </h3>

        <div className="space-y-2">
          <Label htmlFor="property-title">Property title</Label>
          <Input id="property-title" required maxLength={150}
            value={form.title} onChange={(e) => field("title", e.target.value)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="property-type">Property type</Label>
            <select id="property-type" className="h-10 w-full rounded-md border border-input bg-background px-3"
              value={form.type} onChange={(e) => field("type", e.target.value)}>
              <option>House</option><option>Apartment</option>
              <option>Plot</option><option>Commercial</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="property-purpose">Purpose</Label>
            <select id="property-purpose" className="h-10 w-full rounded-md border border-input bg-background px-3"
              value={form.purpose} onChange={(e) => field("purpose", e.target.value)}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="property-price">Price (PKR)</Label>
            <Input id="property-price" type="number" min="1" step="1" required
              value={form.price} onChange={(e) => field("price", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property-location">Location</Label>
            <Input id="property-location" required maxLength={200}
              value={form.location} onChange={(e) => field("location", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property-size">Property size</Label>
            <Input id="property-size" required maxLength={50} placeholder="e.g. 10 Marla"
              value={form.size} onChange={(e) => field("size", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property-bedrooms">Bedrooms</Label>
            <Input id="property-bedrooms" type="number" min="0" step="1"
              value={form.bedrooms} onChange={(e) => field("bedrooms", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="property-bathrooms">Bathrooms</Label>
            <Input id="property-bathrooms" type="number" min="0" step="1"
              value={form.bathrooms} onChange={(e) => field("bathrooms", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="property-description">Description</Label>
          <Textarea id="property-description" required maxLength={3000} rows={5}
            value={form.description}
            onChange={(e) => field("description", e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="property-image">Property image</Label>
          <Input id="property-image" type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)} />
          <p className="text-xs text-muted-foreground">
            Optional. JPG, PNG or WebP, maximum 5 MB.
          </p>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured}
            onChange={(e) => field("featured", e.target.checked)} />
          Feature this property
        </label>

        <div className="space-y-2">
          <Label htmlFor="property-status">Publication status</Label>
          <select id="property-status" className="h-10 w-full rounded-md border border-input bg-background px-3"
            value={form.status} onChange={(e) => field("status", e.target.value)}>
            <option value="draft">Draft — hidden from visitors</option>
            <option value="published">Published — visible on website</option>
          </select>
        </div>

        {save.isError && <p role="alert" className="text-sm text-destructive">
          {save.error.message}
        </p>}
        {save.isSuccess && <p role="status" className="text-sm text-green-700">
          Property saved successfully.
        </p>}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : editing ? "Update property" : "Add property"}
          </Button>
          {editing && <Button type="button" variant="outline" onClick={resetForm}>
            Cancel edit
          </Button>}
        </div>
      </form>

      <section>
        <h3 className="mb-4 text-xl font-semibold">
          Existing properties ({listings.data.length})
        </h3>

        {listings.data.length === 0 && <p className="text-muted-foreground">
          No properties added yet. Use the form above to add the first listing.
        </p>}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.data.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <ListingImage kind="property" referenceId={item.id}
                src={houseImage} alt={item.title}
                className="aspect-[4/3] w-full object-cover" />
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-muted px-2 py-1">{item.type}</span>
                  <span className={`rounded px-2 py-1 ${item.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                    {item.status}
                  </span>
                </div>
                <h4 className="font-semibold">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.location}</p>
                <p className="font-semibold">PKR {Number(item.price).toLocaleString("en-PK")}</p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(item)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive"
                    disabled={remove.isPending}
                    onClick={() => {
                      if (window.confirm(`Delete "${item.title}" permanently?`)) {
                        remove.mutate(item.id);
                      }
                    }}>
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {remove.isError && <p role="alert" className="mt-3 text-sm text-destructive">
          Property could not be deleted.
        </p>}
      </section>
    </div>
  );
}
