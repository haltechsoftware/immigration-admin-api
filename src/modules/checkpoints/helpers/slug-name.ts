export function generateSlug(input: string): string {
    const slug = input.trim().toLowerCase().replace(/\s+/g, '-');
    return slug;
  }
  
  export function generateSlugs(input: any): { [key: string]: string } {
   const data = {
    lo_name: input.lo.name || input.lo.title,
    en_name: input.en.name || input.en.title,
    zh_cn_name: input.zh_cn.name || input.zh_cn.title
   }
    const slugs: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        slugs[key] = generateSlug(value);
      }
    }
  
    return slugs;
  }