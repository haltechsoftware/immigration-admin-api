import { BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Move file from uploads folder to passport folder.
 * - Check if exists
 * - Copy to new folder
 * - Delete from uploads
 * - Return new path
 */
export async function moveFileToPassport(
  filePath: string,
  destinationDir: string,
): Promise<string> {
  const fileName = filePath.split('/').pop();

  const source = join(process.cwd(), 'client', 'uploads', fileName);
  //   const destinationDir = join(process.cwd(), 'client', 'document', 'passport');
  const destination = join(destinationDir, fileName);

  try {
    // ✅ 1. Check if file exists
    await fs.access(source).catch(() => {
      throw new BadRequestException(
        `File ${fileName} does not exist in uploads folder`,
      );
    });

    // ✅ 2. Ensure destination folder exists
    await fs.mkdir(destinationDir, { recursive: true });

    // ✅ 3. Copy file
    await fs.copyFile(source, destination);

    // ✅ 4. Delete original after copy
    await fs.unlink(source);

    // ✅ 5. Return new path for DB
    return fileName;
  } catch (error) {
    throw new BadRequestException(
      `Failed to move file ${fileName}: ${error.message}`,
    );
  }
}
