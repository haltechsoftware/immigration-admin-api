import { MemoryStoredFile } from 'nestjs-form-data';
import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  Output,
  custom,
  customAsync,
  objectAsync,
  optionalAsync,
  special,
  stringAsync,
  transformAsync,
} from 'valibot';

const CreateFileDto = objectAsync({
  directory_id: optionalAsync(
    transformAsync(stringAsync('ຕ້ອງເປັນ string'), (input) => Number(input), [
      customAsync(async (input: number) => {
        if (input) {
          const drizzle: DrizzleService =
            RequestContext.currentContext.req.drizzle;

          const res = await drizzle.db().query.filesAndDirectories.findFirst({
            where: (fields, operators) =>
              operators.and(
                operators.eq(fields.id, input),
                operators.eq(fields.type, 'directory'),
              ),
          });

          return !!res;
        }
        return true;
      }, 'directory_id ບໍ່ມີໃນລະບົບ'),
    ]),
  ),
  file: special(
    (input) => input instanceof MemoryStoredFile,
    'ຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
    [
      custom(
        (input: MemoryStoredFile) =>
          ['image/jpeg', 'image/png', 'image/webp'].includes(input.mimeType),
        'ກະລຸນາເລືອກໄຟລ໌ JPEG ຫຼື PNG ຫຼື Webp.',
      ),
      custom(
        (input: MemoryStoredFile) => input.size <= 1024 * 1024 * 10,
        'ກະລຸນາເລືອກໄຟລ໌ທີ່ນ້ອຍກວ່າ 10 MB.',
      ),
    ],
  ),
});

type CreateFileDtoType = Output<typeof CreateFileDto>;

export { CreateFileDto, type CreateFileDtoType };
