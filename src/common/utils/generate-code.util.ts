/**
 * Generates a numeric verification code in format: {year}{month}-{random}
 * Uses current Buddhist calendar year (last 2 digits of Gregorian + 543) and current month
 * @returns Numeric string with year (2 digits) + month (2 digits) + dash + random digits
 * @example For year 25 month 12: 2512-12345
 */
export const generateCode = () => {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  const buddhistYear = gregorianYear + 543; // Convert to Buddhist calendar year
  const year = String(buddhistYear).slice(-2); // Last 2 digits of year
  const month = String(now.getMonth() + 1).padStart(2, '0'); // 01-12

  // Format: YYMM- (4 digits + dash)
  const prefix = `${year}${month}-`; // e.g., "6812-" for December 2025

  // Generate 5 random digits after the dash
  const randomLength = 10;

  let randomDigits = '';
  for (let i = 0; i < randomLength; i++) {
    randomDigits += Math.floor(Math.random() * 10);
  }

  return `${prefix}${month}${randomDigits}`;
};
