import sharp from 'sharp';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type ImageFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'tiff';

export interface ImageOptions {
  scale?: number;
  width?: number;
  height?: number;
  format?: ImageFormat;
  quality?: number;
  max_file_size?: number; // in bytes
}

export interface ImageBuffer {
  buffer: Buffer;
  originalName?: string;
}

export async function optimizeImage(
  file: ImageBuffer,
  options: ImageOptions = {},
): Promise<Buffer> {
  const DEFAULT_SCALE = 1;
  const DEFAULT_QUALITY = 80;

  if (!file || !Buffer.isBuffer(file.buffer)) {
    throw new BadRequestException('ບັຟເຟີຮູບພາບບໍ່ຖືກຕ້ອງ');
  }

  let image = sharp(file.buffer);
  const metadata = await image.metadata();
  const originalFormat = metadata.format as ImageFormat;

  const formatToUse = options.format ?? originalFormat;
  const scale = options.scale ?? DEFAULT_SCALE;

  // Resize
  image = image.resize(
    options.width ?? Math.floor((metadata.width ?? 0) * scale),
    options.height ?? Math.floor((metadata.height ?? 0) * scale),
  );

  // Set format and quality
  const quality = options.quality ?? DEFAULT_QUALITY;
  switch (formatToUse) {
    case 'jpeg':
    case 'jpg':
      image = image.jpeg({ quality });
      break;
    case 'png':
      image = image.png({ quality });
      break;
    case 'webp':
      image = image.webp({ quality });
      break;
    case 'tiff':
      image = image.tiff({ quality });
      break;
    default:
      throw new NotFoundException('ຮູບແບບຮູບພາບບໍ່ຖືກຕ້ອງ');
  }

  return await image.toBuffer();
}
