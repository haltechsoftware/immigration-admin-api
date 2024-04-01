import * as fs from 'fs';
import * as path from 'path';

function formatNumberWithCommas(number: number): string {
  return number.toLocaleString();
}

export function getFolderSize(folderPath: string): { sizeInKB: number; sizeInBytes: number; formattedSize: string; category: string } {
  let totalSize = 0;

  try {
    const files = fs.readdirSync(folderPath, { withFileTypes: true });

    files.forEach((file) => {
      const filePath = path.join(folderPath, file.name);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const subFolderSize = getFolderSize(filePath);
        totalSize += subFolderSize.sizeInBytes;
      } else {
        totalSize += stats.size;
      }
    });

    // Convert bytes to kilobytes
    const sizeInKB = totalSize / 1024;
    const sizeInBytes = totalSize;
    const formattedSize = formatNumberWithCommas(sizeInBytes);

    let category = '';
    if (sizeInBytes < 1024) {
      category = 'Bytes';
    } else if (sizeInBytes < 1048576) {
      category = 'KB';
    } else if (sizeInBytes < 1073741824) {
      category = 'MB';
    } else {
      category = 'GB';
    }

    return { sizeInKB, sizeInBytes, formattedSize, category };
  } catch (error) {
    console.error(`Error calculating folder size: ${error}`);
    return { sizeInKB: 0, sizeInBytes: 0, formattedSize: '0', category: '' };
  }
}

