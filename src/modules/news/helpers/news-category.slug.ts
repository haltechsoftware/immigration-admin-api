import { omit } from "valibot";

export function generateSlug(input: string): string {
    const slug = input.trim().toLowerCase().replace(/\s+/g, '-');
    return slug;
  }
  
  export function generateSlugs(input: any): { [key: string]: string } {
    const slugs: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(input)) {
      if (typeof value === 'string') {
        slugs[key] = generateSlug(value);
      }
    }
  
    return slugs;
  }
  