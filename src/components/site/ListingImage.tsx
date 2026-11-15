import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ImgHTMLAttributes } from "react";

export function ListingImage({ kind, referenceId, src, ...props }: ImgHTMLAttributes<HTMLImageElement> & { kind: "property" | "project"; referenceId: string }) {
  const image = useQuery({
    queryKey: ["listing-image", kind, referenceId],
    queryFn: async () => {
      const { data, error } = await supabase.from("listing_images").select("storage_path").eq("kind", kind).eq("reference_id", referenceId).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const result = await supabase.storage.from("listing-images").createSignedUrl(data.storage_path, 3600);
      if (result.error) throw result.error;
      return result.data.signedUrl;
    },
    staleTime: 30 * 60_000,
    refetchInterval: 30 * 60_000,
  });
  return <img {...props} src={image.data ?? src} decoding="async" onError={(event) => { if (src && event.currentTarget.src !== new URL(src, window.location.origin).href) event.currentTarget.src = src; }} />;
}