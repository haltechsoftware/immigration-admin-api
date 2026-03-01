/**
 * Generates a numeric verification code in format: {year}{month}-{random}
 * Uses current Gregorian year (last 2 digits) and current month
 * @returns Numeric string with year (2 digits) + month (2 digits) + dash + random digits
 * @example For year 2025 month 12: 2512-1234567890
 */
export const generateCode = () => {
  const now = new Date();
  const gregorianYear = now.getFullYear();
  const year = String(gregorianYear).slice(-2); // e.g., "26"
  const month = String(now.getMonth() + 1).padStart(2, '0'); // e.g., "03"

  // Format: YYMM- (4 digits + dash)
  const prefix = `${month}${year}`;

  // 1. Generate a random number between 1 and 9,999,999
  const min = 1;
  const max = 9999999;
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  // 2. Pad the number with leading zeros to ensure it is always 7 digits long
  const randomDigits = String(randomNumber).padStart(7, '0');

  // Result: e.g., "2603-0000452"
  return `${prefix}${randomDigits}`;
};
