/**
 * Generates a numeric code in format: {year}{number}
 * Uses current Gregorian year (last 2 digits) only
 * @returns Numeric string with year (2 digits) + sequential number
 * @example For 2026: 261, 262, 263... For 2027: 271, 272, 273...
 */
export const generateCode = (lastFullCode: string | null) => {
  // Get current date
  const now = new Date();

  // Extract last 2 digits of the year (e.g., 2026 → "26", 2027 → "27")
  const year = String(now.getFullYear()).slice(-2);

  // Default to starting at 1 for new codes
  let nextNumber = 1;

  // Check if we have a previous code to continue from
  // We only want to increment if the previous code is from the same year
  if (
    lastFullCode &&
    typeof lastFullCode === 'string' &&
    lastFullCode.length >= 3 &&
    lastFullCode.startsWith(year)
  ) {
    // Extract the number part (everything after the first 2 characters)
    // Example: "2618473839" → "18473839"
    const lastNumberString = lastFullCode.substring(2);

    // Parse the number
    const parsed = parseInt(lastNumberString, 10);

    // If the parsed number is valid and positive, increment by 1
    if (!isNaN(parsed) && parsed > 0) {
      nextNumber = parsed + 1;
    }
  }

  // Return the final code: year + number (e.g., "261", "271")
  return `${year}${nextNumber}`;
};
