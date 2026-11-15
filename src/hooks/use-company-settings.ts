import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const companySettingsQuery = {
  queryKey: ["company-settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("company_settings").select("phone,whatsapp").eq("id", "company").maybeSingle();
    if (error) throw error;
    return data ?? { phone: "", whatsapp: "" };
  },
  staleTime: 60_000,
};

export function useCompanySettings() {
  return useQuery(companySettingsQuery);
}