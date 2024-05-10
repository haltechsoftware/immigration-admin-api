import { Output, custom, customAsync, email, maxLength, minLength, numberAsync, objectAsync, special, string, stringAsync, transform } from "valibot";
import { MemoryStoredFile } from "nestjs-form-data";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { RequestContext } from "nestjs-request-context";

const CreateCheckpointDto = objectAsync({
  category_id: stringAsync('ບໍ່ຕ້ອງຫວ່າງເປົ່າ', [
    customAsync(async (input) => {
      const cateId = Number(input)
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.checkpointCategories.findFirst({
        where: ({ id }, { eq }) => eq(id, cateId),
      });

      return !!res;
    }, 'ປະເພດດ່ານບໍ່ມີໃນລະບົບ'),
  ]),


  country_id: stringAsync('ບໍ່ຕ້ອງຫວ່າງເປົ່າ', [
    customAsync(async (input) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;
      const countryId = Number(input)
      
      const res = await drizzle.db().query.countries.findFirst({
        where: ({ id }, { eq }) => eq(id, countryId),
      });
      return !!res;
    }, 'ຂໍ້ມູນປະເທດບໍ່ມີໃນລະບົບ'),
  ]),
  province_id: stringAsync('ບໍ່ຕ້ອງຫວ່າງເປົ່າ', [
    customAsync(async (input) => {
      const provinceId = Number(input)
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.provinces.findFirst({
        where: ({ id }, { eq }) => eq(id, provinceId),
      });

      return !!res;
    }, 'ຂໍ້ມູນແຂວງບໍ່ມີໃນລະບົບ'),
  ]),

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
  link_map: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ບໍ່ສາມາດປ້ອນເບີຫຼາຍກວ່າ 20 ຫຼັກ.'),
  ]),
  phone_number: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(20, 'ບໍ່ສາມາດປ້ອນເບີຫຼາຍກວ່າ 20 ຫຼັກ.'),
  ]),
  email: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    email('ຕ້ອງເປັນຮູບແບບອີເມວທີ່ຖືກຕ້ອງ.')
  ]),
  lo_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async function (input: string) {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;
      const res = await drizzle.db().query.checkpointTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });
      return res ? false : true;
    }, 'ຊື່ດ່ານນີ້ມີໃນລະບົບແລ້ວ'),
  ]),
  lo_content: string('ຈະຕ້ອງເປັນ string'),
  lo_address: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ບໍ່ສາມາດປ້ອນເບີຫຼາຍກວ່າ 20 ຫຼັກ.'),
  ]),

  en_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.checkpointTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });

      return res ? false : true;
    }, 'ຊື່ດ່ານນີ້ມີໃນລະບົບແລ້ວ'),
  ]),
  en_content: string('ຈະຕ້ອງເປັນ string'),
  en_address: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ບໍ່ສາມາດປ້ອນເບີຫຼາຍກວ່າ 20 ຫຼັກ.'),
  ]),

  zh_cn_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async function (input: string) {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;
      const res = await drizzle.db().query.checkpointTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });
      return res ? false : true;
    }, 'ຊື່ດ່ານນີ້ມີໃນລະບົບແລ້ວ'),
  ]),
  zh_cn_content: string('ຈະຕ້ອງເປັນ string'),
  zh_cn_address: string('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ບໍ່ສາມາດປ້ອນເບີຫຼາຍກວ່າ 20 ຫຼັກ.'),
  ]),
});

type CreateCheckpointDtoType = Output<typeof CreateCheckpointDto>;

export { CreateCheckpointDto, CreateCheckpointDtoType };