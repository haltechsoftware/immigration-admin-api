export function generateNextCode() {
  // Get current date
  const now = new Date();

  // Extract last 2 digits of the year (e.g., 2026 → "26", 2027 → "27")
  const year = String(now.getFullYear()).slice(-2);

  return `${year}1`;
}
