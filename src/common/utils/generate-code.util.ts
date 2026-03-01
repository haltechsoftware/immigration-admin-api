/**
 * Generates a numeric verification code in format: {year}{month}-{random}
 * Uses current Gregorian year (last 2 digits) and current month
 * @returns Numeric string with year (2 digits) + month (2 digits) + dash + random digits
 * @example For year 2025 month 12: 2512-1234567890
 */
export const generateCode = (lastFullCode: string | null) => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `${year}${month}`; // "2603"

  let nextNumber = 1;

  // Basic validation: ensure it's a string and has the expected length
  if (
    lastFullCode &&
    typeof lastFullCode === 'string' &&
    lastFullCode.length >= 11
  ) {
    const lastNumberString = lastFullCode.substring(4);
    const parsed = parseInt(lastNumberString, 10);

    // If parsed is NaN (invalid string) or <= 0, we stay at 1
    if (!isNaN(parsed) && parsed > 0) {
      nextNumber = parsed + 1;
    }
  }

  // If we hit the limit, wrap back to 1
  if (nextNumber > 9999999) nextNumber = 1;

  const paddedNumber = String(nextNumber).padStart(7, '0');
  return `${prefix}${paddedNumber}`;
};
