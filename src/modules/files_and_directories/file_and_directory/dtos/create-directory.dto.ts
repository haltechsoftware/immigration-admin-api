import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  Output,
  customAsync,
  maxLength,
  minLength,
  numberAsync,
  objectAsync,
  optionalAsync,
  string,
} from 'valibot';

const CreateDirectoryDto = objectAsync({
  directory_id: optionalAsync(
    numberAsync('ຕ້ອງເປັນ number', [
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
  name: string('ຕ້ອງເປັນ string', [
    minLength(1, 'ບໍ່ຄວນວ່າງເປົ່າ'),
    maxLength(255, 'ຕົວອັກສອນບໍ່ເກີນ 255'),
  ]),
});

type CreateDirectoryDtoType = Output<typeof CreateDirectoryDto>;

export { CreateDirectoryDto, type CreateDirectoryDtoType };
