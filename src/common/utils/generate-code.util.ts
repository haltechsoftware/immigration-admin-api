/**
 * Generates a numeric verification code in format: {year}{month}-{random}
 * Uses current Gregorian year (last 2 digits) and current month
 * @returns Numeric string with year (2 digits) + month (2 digits) + dash + random digits
 * @example For year 2025 month 12: 2512-1234567890
 */
export const generateCode = () => {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  const year = String(gregorianYear).slice(-2); // Last 2 digits of Gregorian year (2025 → 25)
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 01-12

  // Format: YYMM- (4 digits + dash)
  const prefix = `${year}${month}-`; // e.g., "2512-" for December 2025

  // Generate 10 random digits after the dash
  const randomLength = 8;

  let randomDigits = '';
  for (let i = 0; i < randomLength; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }

  return `${prefix}${year}${randomDigits}`;
};
