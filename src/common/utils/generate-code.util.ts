/**
 * Generates a numeric verification code in format: {year}{month}-{random}
 * Uses current Gregorian year (last 2 digits) and current month
 * @returns Numeric string with year (2 digits) + month (2 digits) + dash + random digits
 * @example For year 2025 month 12: 2512-1234567890
 */
export const generateCode = (lastFullCode: string | null) => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // "26"
  const month = String(now.getMonth() + 1).padStart(2, '0'); // "03"
  const prefix = `${month}${year}`; // Result: "2603"

  let nextNumber = 1;

  if (lastFullCode && lastFullCode.length >= 11) {
    // lastFullCode is "26030000001"
    // .substring(4) takes everything after "2603", which is "0000001"
    const lastNumberString = lastFullCode.substring(4);
    const lastNumber = parseInt(lastNumberString, 10);

    nextNumber = lastNumber + 1;
  }

  // Safety reset if you exceed 7 digits
  if (nextNumber > 9999999) nextNumber = 1;

  // Pad to 7 digits
  const paddedNumber = String(nextNumber).padStart(7, '0');

  // Returns "26030000001"
  return `${prefix}${paddedNumber}`;
};
