import { Output, arrayAsync, custom, customAsync, minLength, number, objectAsync, regex, special, string, stringAsync, transform } from "valibot";
import { MemoryStoredFile } from "nestjs-form-data";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { RequestContext } from "nestjs-request-context";

const CreateCountryDto = objectAsync({
  image: special(
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
  is_except_visa: transform(
    string('ຈະຕ້ອງເປັນ string', [regex(/^[0-9]+$/, 'ຄວນເປັນໂຕເລກ: 0-9.')]),
    (input) => Boolean(Number(input)),
  ),

  province_ids: stringAsync('ຕ້ອງເປັນຕົວເລກ.', [
    customAsync(async (input) => {
      const provinceIdsArray: number[] = JSON.parse(input)
      
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.provinces.findMany({
        where: ({ id }, { inArray }) => inArray(id, provinceIdsArray),
      });
      return res.length === provinceIdsArray.length;
    }, 'ຂໍ້ມຼນແຂວງບໍ່ມີໃນລະບົບ'),
  ]),

  lo_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async function (input: string) {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;
      const res = await drizzle.db().query.countryTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });
      return res ? false : true;
    }, 'ຊື່ປະເທດມີໃນລະບົບແລ້ວ'),
  ]),
  lo_description: string('ຈະຕ້ອງເປັນ string'),

  en_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.countryTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });

      return res ? false : true;
    }, 'ຊື່ປະເທດມີໃນລະບົບແລ້ວ'),
  ]),
  en_description: string('ຈະຕ້ອງເປັນ string'),

  zh_cn_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async function (input: string) {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;
      const res = await drizzle.db().query.countryTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });
      return res ? false : true;
    }, 'ຊື່ປະເທດມີໃນລະບົບແລ້ວ'),
  ]),
  zh_cn_description: string('ຈະຕ້ອງເປັນ string')
});

type CreateCountryDtoType = Output<typeof CreateCountryDto>;

export { CreateCountryDto, CreateCountryDtoType };