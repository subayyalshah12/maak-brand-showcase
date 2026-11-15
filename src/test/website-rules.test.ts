import { describe, expect, it } from "vitest";
import { filterProperties } from "@/lib/property-search";
import { properties, projects } from "@/lib/sample-data";
import { isAdminRole, validateImage, validPhone } from "@/lib/admin-rules";

const all = { q: "", purpose: "all", type: "all", beds: "0" };
describe("Property search", () => {
  it("matches trimmed case-insensitive locations", () => expect(filterProperties(properties, { ...all, q: "  RAWALPINDI  " }).map(p => p.id)).toEqual(["sample-plot"]));
  it("filters rent, apartment type, and bedrooms together", () => expect(filterProperties(properties, { ...all, purpose: "rent", type: "Apartment", beds: "2" }).map(p => p.id)).toEqual(["sample-apartment-rent"]));
  it("supports empty results", () => expect(filterProperties(properties, { ...all, purpose: "rent", beds: "5" })).toEqual([]));
  it("reset restores all four sample properties", () => expect(filterProperties(properties, all)).toHaveLength(4));
});
describe("Access and sample safeguards", () => {
  it("does not grant admin permission to ordinary users", () => expect(isAdminRole([{ role: "user" }])).toBe(false));
  it("requires an explicitly assigned admin role", () => expect(isAdminRole([{ role: "admin" }])).toBe(true));
  it("denies access without roles", () => expect(isAdminRole(null)).toBe(false));
  it("keeps every sample property and project explicitly classified", () => expect([...properties, ...projects].every(p => p.id.startsWith("sample-") && p.title.startsWith("[Sample]"))).toBe(true));
  it("allows phone settings to stay blank instead of inventing numbers", () => expect(validPhone("")).toBe(true));
  it("rejects malformed phone settings", () => expect(validPhone("not a phone")).toBe(false));
  it("rejects non-image uploads", () => expect(validateImage({ type: "text/plain", size: 30 })).toBe("Choose a JPEG, PNG, or WebP image."));
  it("enforces the storage size cap", () => expect(validateImage({ type: "image/jpeg", size: 5 * 1024 * 1024 + 1 })).toBe("Images must be 5 MB or smaller."));
});