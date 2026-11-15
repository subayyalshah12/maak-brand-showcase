// Contact details from the client brief. Phone/WhatsApp numbers are not yet supplied;
// they will become editable in the admin settings (Phase 2/3).
export const SITE = {
  name: "MAAK Enterprises",
  tagline: "BUILD • DEVELOP • GROW",
  email: "maakentps@gmail.com",
  whatsapp: "" as string, // intentionally empty until the client supplies a number
  offices: [
    { city: "Rawalpindi, Pakistan", focus: "Construction operations" },
    { city: "Gulberg Greens, Islamabad, Pakistan", focus: "Real Estate & Educational Consultancy" },
  ],
  contacts: [
    { division: "Construction", person: "Umair Kazmi" },
    { division: "Real Estate", person: "Uzair Kazmi" },
    { division: "Educational Consultancy", person: "Shahzaib" },
  ],
};

export function whatsappLink(text: string) {
  if (!SITE.whatsapp) return null;
  return `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function formatPKR(n: number) {
  return "PKR " + new Intl.NumberFormat("en-PK").format(n);
}
