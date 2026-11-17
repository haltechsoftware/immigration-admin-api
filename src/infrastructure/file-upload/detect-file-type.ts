export interface DetectedFileType {
  ext: 'jpg' | 'png' | 'webp' | 'pdf' | 'mp4';
  mime: string;
}

const startsWith = (buffer: Buffer, bytes: number[], offset = 0) =>
  buffer.length >= offset + bytes.length &&
  bytes.every((byte, i) => buffer[offset + i] === byte);

const ascii = (value: string) => [...value].map((c) => c.charCodeAt(0));

/**
 * Detects the file type from magic bytes. Returns undefined for anything that
 * is not one of the upload formats the API accepts.
 */
export function detectFileType(buffer: Buffer): DetectedFileType | undefined {
  if (startsWith(buffer, [0xff, 0xd8, 0xff]))
    return { ext: 'jpg', mime: 'image/jpeg' };

  if (startsWith(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return { ext: 'png', mime: 'image/png' };

  if (startsWith(buffer, ascii('RIFF')) && startsWith(buffer, ascii('WEBP'), 8))
    return { ext: 'webp', mime: 'image/webp' };

  if (startsWith(buffer, ascii('%PDF-')))
    return { ext: 'pdf', mime: 'application/pdf' };

  if (startsWith(buffer, ascii('ftyp'), 4))
    return { ext: 'mp4', mime: 'video/mp4' };

  return undefined;
}
