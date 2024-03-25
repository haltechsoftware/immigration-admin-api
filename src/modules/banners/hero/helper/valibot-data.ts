export function parseJsonValues(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        try {
          obj[key] = JSON.parse(obj[key]);
        } catch (error) {
          // If parsing fails, leave the value as is
          console.error(`Error parsing JSON for key "${key}":`, error);
        }
      }
    }
    return obj;
  }
  