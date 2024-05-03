import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { Output, customAsync, maxLength, minLength, object, objectAsync, string, stringAsync } from 'valibot';

const CreateNewsCategorytDto = objectAsync({
  en_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.newsCategoriesTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });

      return res ? false : true;
    }, 'ຊື່ນີ້ມີໃນລະບົບແລ້ວ'),
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  lo_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.newsCategoriesTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });

      return res ? false : true;
    }, 'ຊື່ນີ້ມີໃນລະບົບແລ້ວ'),
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  zh_cn_name: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.newsCategoriesTranslate.findFirst({
        where: ({ name }, { eq }) => eq(name, input),
      });

      return res ? false : true;
    }, 'ຊື່ນີ້ມີໃນລະບົບແລ້ວ'),
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
});

type CreateNewsCategorytDtoType = Output<
  typeof CreateNewsCategorytDto
>;

export { CreateNewsCategorytDto, CreateNewsCategorytDtoType };
