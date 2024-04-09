import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import {
  customAsync,
  maxLength,
  minLength,
  numberAsync,
  object,
  objectAsync,
  optional,
  optionalAsync,
  Output,
  string,
  stringAsync,
  transform,
} from 'valibot';

const RenameDirectoryDto = objectAsync({
  directory_id: optionalAsync(
    numberAsync('ຕ້ອງເປັນ number', [
      customAsync(async (input: number) => {
        if (input !== 0) {
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
  name: stringAsync('ຕ້ອງເປັນ string', [
    minLength(1, 'ບໍ່ຄວນວ່າງເປົ່າ'),
    maxLength(255, 'ຕົວອັກສອນບໍ່ເກີນ 255'),
  ]),
});

const RenameDirectoryParamDto = object({
  id: transform(string([minLength(1, 'ບໍ່ຄວນວ່າງເປົ່າ')]), (input) =>
    Number(input),
  ),
  dir_id: optional(transform(string(), (input) => Number(input))),
});

type RenameDirectoryDtoType = Output<typeof RenameDirectoryDto>;
type RenameDirectoryParamDtoType = Output<typeof RenameDirectoryParamDto>;

export {
  RenameDirectoryDto,
  RenameDirectoryDtoType,
  RenameDirectoryParamDto,
  RenameDirectoryParamDtoType,
};
