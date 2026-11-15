export function isAdminRole(roles: { role: string }[] | null) {
  return roles?.some((row) => row.role === "admin") === true;
}

export function validateImage(file: { type: string; size: number }) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Choose a JPEG, PNG, or WebP image.";
  if (file.size > 5 * 1024 * 1024) return "Images must be 5 MB or smaller.";
  return null;
}

export function validPhone(value: string) {
  return value.length <= 30 && (!value || /^[+\d\s()-]+$/.test(value) && /\d/.test(value));
}