export const isNotEmpty = (input: string): boolean => {
    return input.trim() !== '';
};
  
export const isValidUrl = (input: string): boolean => {
return input.startsWith('http://') || input.startsWith('https://');
};

export const IsDate = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const isToday = (input) => {
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    return input === today;
};
