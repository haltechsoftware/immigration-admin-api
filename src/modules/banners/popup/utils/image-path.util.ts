import { join } from "path";

export function getProfileURL(image: string): string {
  // Construct profile URL using path.join or path.resolve
  return join(process.cwd(), 'client', image);
}