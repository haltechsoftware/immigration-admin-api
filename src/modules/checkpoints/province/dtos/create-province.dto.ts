import { Output, customAsync, mergeAsync, minLength, objectAsync, omitAsync, string, stringAsync } from "valibot";
import { DrizzleService } from "src/infrastructure/drizzle/drizzle.service";
import { RequestContext } from "nestjs-request-context";

const CreateProvinceDto = objectAsync({
  lo_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async function (input: string) {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;
      const res = await drizzle.db().query.provinceTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });
      return res ? false : true;
    }, 'ຊື່ແຂວງພາສາລາວນີ້ມີໃນລະບົບແລ້ວ'),
  ]),
  lo_description: string('ຈະຕ້ອງເປັນ string'),
  en_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async function (input: string) {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;
      const res = await drizzle.db().query.provinceTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });
      return res ? false : true;
    }, 'ຊື່ແຂວງພາສາອັງກິດນີ້ມີໃນລະບົບແລ້ວ'),
  ]),
  en_description: string('ຈະຕ້ອງເປັນ string'),
  zh_cn_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(2, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    customAsync(async function (input: string) {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;
      const res = await drizzle.db().query.provinceTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });
      return res ? false : true;
    }, 'ຊື່ແຂວງພາສາຈີນນີ້ໃນລະບົບແລ້ວ'),
  ]),
  zh_cn_description: string('ຈະຕ້ອງເປັນ string'),
});


type CreateProvinceDtoType = Output<typeof CreateProvinceDto>;

export { CreateProvinceDto, CreateProvinceDtoType };