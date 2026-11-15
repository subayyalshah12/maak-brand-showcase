export const SITE = {
  name: "MAAK Enterprises",
  tagline: "BUILD • DEVELOP • GROW",
  email: "maakentps@gmail.com",
  whatsapp: "" as string,

  offices: [
    { city: "Rawalpindi, Pakistan", focus: "Construction operations" },
    { city: "Gulberg Greens, Islamabad, Pakistan", focus: "Real Estate & Educational Consultancy" },
  ],

  leadership: [
    {
      name: "Uzair Ali Kazmi",
      role: "Chief Executive Officer (CEO)",
      phone: "03315342214",
    },
    {
      name: "Umair Ali Kazmi",
      role: "Chief Operating Officer (COO)",
      phone: "03105271306",
    },
    {
      name: "Shahzaib Anjum",
      role: "Project Director",
      phone: "03189862182",
    },
  ],

  contacts: [
    {
      division: "Construction",
      person: "Umair Ali Kazmi",
      phone: "03105271306",
    },
    {
      division: "Construction",
      person: "Uzair Ali Kazmi",
      phone: "03315342214",
    },
    {
      division: "Real Estate",
      person: "Uzair Ali Kazmi",
      phone: "03315342214",
    },
    {
      division: "Educational Consultancy",
      person: "Uzair Ali Kazmi",
      phone: "03315342214",
    },
    {
      division: "Educational Consultancy",
      person: "Shahzaib Anjum",
      phone: "03189862182",
    },
  ],
};

export function whatsappLink(text: string) {
  if (!SITE.whatsapp) return null;
  return `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}

export function contactWhatsappLink(phone: string, text: string) {
  const number = phone.replace(/\D/g, "").replace(/^0/, "92");
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function formatPKR(n: number) {
  return "PKR " + new Intl.NumberFormat("en-PK").format(n);
}
