/**
 * Generates a numeric code in format: {year}{month}{number}
 * Uses current Gregorian year (last 2 digits) and current month
 * @returns Numeric string with year (2 digits) + month (2 digits) + sequential number
 * @example For year 2026 month 03: 26031, 26032, 26033, etc.
 */
export const generateCode = (lastFullCode: string | null) => {
  // Get current date
  const now = new Date();

  // Extract last 2 digits of the year (e.g., 2026 → "26")
  const year = String(now.getFullYear()).slice(-2);

  // Get current month (0-11) and pad to 2 digits (e.g., March → "03")
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Create the prefix: year + month (e.g., "2603" for March 2026)
  const prefix = `${year}${month}`;

  // Default to starting at 1 for new codes
  let nextNumber = 1;

  // Check if we have a previous code to continue from
  // We only want to increment if the previous code is from the same month/year
  if (
    lastFullCode &&
    typeof lastFullCode === 'string' &&
    lastFullCode.length >= 5 &&
    lastFullCode.startsWith(prefix)
  ) {
    // Extract the number part (everything after the first 4 characters)
    // Example: "26035" → "5"
    const lastNumberString = lastFullCode.substring(4);

    // Parse the number
    const parsed = parseInt(lastNumberString, 10);

    // If the parsed number is valid and positive, increment by 1
    if (!isNaN(parsed) && parsed > 0) {
      nextNumber = parsed + 1;
    }
  }

  // Return the final code: prefix + number (e.g., "26032")
  return `${prefix}${nextNumber}`;
};
