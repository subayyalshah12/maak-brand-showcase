import house from "@/assets/realestate.jpg";
import residentialOverview from "@/assets/house image 1.jpeg";
import residentialProgress from "@/assets/house 2.jpeg";
import building from "@/assets/hero-building.jpg";
import site from "@/assets/construction.jpg";

// SAMPLE DATA — for development only. Not real listings or completed projects.
// Will be replaced by records managed in the admin dashboard.
export type Property = {
  id: string; title: string; type: "House" | "Apartment" | "Plot" | "Commercial";
  purpose: "sale" | "rent"; price: number; location: string; size: string;
  bedrooms: number; bathrooms: number; description: string; image: string; featured: boolean;
};
export type Project = {
  id: string;
  title: string;
  location: string;
  category: string;
  status: "Completed" | "Ongoing";
  description: string;
  image: string;
  featured: boolean;
  floors?: string;
  designStyle?: string;
  groundFloorArea?: string;
  mumtyArea?: string;
  currentStage?: string;
  progressImage?: string;
};

export const properties: Property[] = [
  { id: "sample-house-gulberg", title: "[Sample] 1 Kanal Modern House", type: "House", purpose: "sale", price: 85000000, location: "Gulberg Greens, Islamabad", size: "1 Kanal", bedrooms: 5, bathrooms: 6, description: "Sample listing used for layout testing. A modern double-storey home with stone façade, open-plan living, and landscaped lawn.", image: house, featured: true },
  { id: "sample-apartment-rent", title: "[Sample] 2 Bed Apartment", type: "Apartment", purpose: "rent", price: 120000, location: "Islamabad", size: "1,200 sq ft", bedrooms: 2, bathrooms: 2, description: "Sample listing used for layout testing. Bright apartment with balcony and covered parking.", image: building, featured: true },
  { id: "sample-plot", title: "[Sample] 10 Marla Residential Plot", type: "Plot", purpose: "sale", price: 18000000, location: "Rawalpindi", size: "10 Marla", bedrooms: 0, bathrooms: 0, description: "Sample listing used for layout testing. Residential plot in a developed sector.", image: site, featured: false },
  { id: "sample-commercial-rent", title: "[Sample] Commercial Floor", type: "Commercial", purpose: "rent", price: 350000, location: "Gulberg Greens, Islamabad", size: "3,000 sq ft", bedrooms: 0, bathrooms: 2, description: "Sample listing used for layout testing. Open commercial floor suitable for offices.", image: building, featured: false },
];

export const projects: Project[] = [
  {
    id: "residential-construction-project",
    title: "Residential Construction Project",
    location: "Location available on request",
    category: "Residential",
    status: "Ongoing",
    description:
      "A modern luxury residential house project, covering architectural design and initial construction work, including site preparation, foundation and brickwork.",
    image: residentialOverview,
    featured: true,
    floors: "Ground + 1",
    designStyle: "Modern Luxury",
    groundFloorArea: "2,120 sq. ft.",
    mumtyArea: "470 sq. ft.",
    currentStage: "Foundation and brickwork progress",
    progressImage: residentialProgress,
  },
];
