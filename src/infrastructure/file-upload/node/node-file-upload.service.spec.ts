import { BadRequestException } from '@nestjs/common';
import { mkdtemp, readdir, rm } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { detectFileType } from '../detect-file-type';
import { NodeFileUploadService } from './node-file-upload.service';

const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]);
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0]);
const WEBP = Buffer.concat([
  Buffer.from('RIFF'),
  Buffer.from([0, 0, 0, 0]),
  Buffer.from('WEBPVP8 '),
]);
const PDF = Buffer.from('%PDF-1.7\n');
const MP4 = Buffer.concat([
  Buffer.from([0, 0, 0, 0x18]),
  Buffer.from('ftypmp42'),
]);

describe('detectFileType', () => {
  it.each([
    [PNG, 'png'],
    [JPEG, 'jpg'],
    [WEBP, 'webp'],
    [PDF, 'pdf'],
    [MP4, 'mp4'],
  ])('detects %#', (buffer, ext) => {
    expect(detectFileType(buffer)?.ext).toBe(ext);
  });

  it.each([
    Buffer.from('console.log("test")'),
    Buffer.from('<html></html>'),
    Buffer.alloc(0),
    Buffer.from('RIFF'),
  ])('rejects unsupported content %#', (buffer) => {
    expect(detectFileType(buffer)).toBeUndefined();
  });
});

describe('NodeFileUploadService', () => {
  let cwd: string;
  const service = new NodeFileUploadService();

  beforeEach(async () => {
    cwd = await mkdtemp(join(tmpdir(), 'upload-spec-'));
    vi.spyOn(process, 'cwd').mockReturnValue(cwd);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(cwd, { recursive: true, force: true });
  });

  it('uses the detected extension, not the client file name', async () => {
    const url = await service.upload('banner/hero/', PNG, 'photo.html');

    expect(url).toMatch(/^client\/banner\/hero\/\d+-[a-z0-9]+\.png$/);
  });

  it('adds an extension when the client name has none', async () => {
    const url = await service.upload('banner/hero/', JPEG, 'photo');

    expect(url).toMatch(/\.jpg$/);
  });

  it('rejects unsupported content and writes nothing', async () => {
    await expect(
      service.upload('feedback/media/', Buffer.from('console.log(1)'), 'x.png'),
    ).rejects.toThrow(BadRequestException);

    await expect(readdir(join(cwd, 'client'))).rejects.toThrow();
  });

  it('rejects paths that escape the client directory', async () => {
    await expect(
      service.upload('editor/../../dist/', PNG, 'x.png'),
    ).rejects.toThrow(BadRequestException);

    await expect(readdir(join(cwd, 'dist'))).rejects.toThrow();
  });
});
