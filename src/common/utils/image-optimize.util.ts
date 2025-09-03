import sharp from 'sharp';
import { BadRequestException, NotFoundException } from '@nestjs/common';

type ImageFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'tiff';

export interface ImageOptions {
  scale?: number;
  width?: number;
  height?: number;
  format?: ImageFormat;
  quality?: number;
}

export interface ImageBuffer {
  buffer: Buffer;
  originalName?: string;
}

const ONE_MB = 1048576;

export async function optimizeImage(
  file: ImageBuffer,
  options: ImageOptions = {},
): Promise<Buffer> {
  if (!file || !Buffer.isBuffer(file.buffer)) {
    throw new BadRequestException('Invalid image buffer');
  }

  if (file.buffer.length <= ONE_MB) {
    // Already <= 1MB, return as is
    return file.buffer;
  }

  const image = sharp(file.buffer);
  const metadata = await image.metadata();
  const originalFormat = metadata.format as ImageFormat;
  const formatToUse = options.format ?? originalFormat;
  const scale = options.scale ?? 1;
  let width = options.width ?? Math.floor((metadata.width ?? 0) * scale);
  let height = options.height ?? Math.floor((metadata.height ?? 0) * scale);

  // Helper for applying format
  function applyFormat(img: sharp.Sharp, q: number) {
    switch (formatToUse) {
      case 'jpeg':
      case 'jpg':
        return img.jpeg({ quality: q });
      case 'png':
        return img.png({ quality: q });
      case 'webp':
        return img.webp({ quality: q });
      case 'tiff':
        return img.tiff({ quality: q });
      default:
        throw new NotFoundException('Invalid image format');
    }
  }

  // Try reducing quality first
  let minQ = 20;
  let maxQ = options.quality ?? 80;
  let bestBuffer: Buffer | null = null;

  while (minQ <= maxQ) {
    const midQ = Math.floor((minQ + maxQ) / 2);
    const resizedImage = sharp(file.buffer).resize(width, height);
    const buffer = await applyFormat(resizedImage, midQ).toBuffer();
    if (buffer.length <= ONE_MB) {
      bestBuffer = buffer;
      minQ = midQ + 1;
    } else {
      maxQ = midQ - 1;
    }
  }

  // If quality reduction is not enough, try resizing
  while (!bestBuffer || bestBuffer.length > ONE_MB) {
    width = Math.floor(width * 0.9);
    height = Math.floor(height * 0.9);
    if (width < 16 || height < 16) {
      throw new BadRequestException('Cannot reduce image below 1MB');
    }
    const resizedImage = sharp(file.buffer).resize(width, height);
    const buffer = await applyFormat(resizedImage, maxQ).toBuffer();
    if (buffer.length <= ONE_MB) {
      bestBuffer = buffer;
      break;
    }
  }

  if (!bestBuffer) {
    throw new BadRequestException('Failed to optimize image to <= 1MB');
  }
  return bestBuffer;
}
