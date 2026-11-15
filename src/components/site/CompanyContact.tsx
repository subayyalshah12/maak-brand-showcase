import { useCompanySettings } from "@/hooks/use-company-settings";

export function CompanyContact() {
  const { data } = useCompanySettings();
  return <div className="mt-3 flex flex-wrap gap-3 text-sm">
    {data?.phone && <a className="hover:underline" href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}>{data.phone}</a>}
    {data?.whatsapp && <a className="hover:underline" href={`https://wa.me/${data.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
  </div>;
}