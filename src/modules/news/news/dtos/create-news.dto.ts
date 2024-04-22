import { MemoryStoredFile } from 'nestjs-form-data';
import { RequestContext } from 'nestjs-request-context';
import { DrizzleService } from 'src/infrastructure/drizzle/drizzle.service';
import { Output, custom, customAsync, enum_, maxLength, minLength, objectAsync, special, string, stringAsync, transform } from 'valibot';

enum Type {
  Draft = 'draft',
  Public = 'published',
  Private = 'private',
}
const CreateNewsDto = objectAsync({
  category_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
  thumbail: special(
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
  status: enum_(Type, 'ຕ້ອງເປັນ draft ຫຼື published ແລະ private ເທົ່ານັ້ນ'),
  lo_title: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.newsTranslate.findFirst({
        where: ({ title }, { eq }) => eq(title, input),
      });

      return res ? false : true;
    }, 'ຊື່ນີ້ມີໃນລະບົບແລ້ວ'),
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  lo_description: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')
  ]),
  lo_content: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')
  ]),
  en_title: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.newsTranslate.findFirst({
        where: ({ title }, { eq }) => eq(title, input),
      });

      return res ? false : true;
    }, 'ຊື່ນີ້ມີໃນລະບົບແລ້ວ'),
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  en_description: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')
  ]),
  en_content: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')
  ]),
  zh_cn_title: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    customAsync(async (input: string) => {
      const drizzle: DrizzleService = RequestContext.currentContext.req.drizzle;

      const res = await drizzle.db().query.newsTranslate.findFirst({
        where: ({ title }, { eq }) => eq(title, input),
      });

      return res ? false : true;
    }, 'ຊື່ນີ້ມີໃນລະບົບແລ້ວ'),
    minLength(1, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.'),
    maxLength(255, 'ຄວາມຍາວສູງສຸດທີ່ອະນຸຍາດແມ່ນ 255 ຕົວອັກສອນ.'),
  ]),
  zh_cn_description: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')
  ]),
  zh_cn_content: stringAsync('ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.', [
    minLength(3, 'ຈະຕ້ອງບໍ່ຫວ່າງເປົ່າ.')
  ]),
  
});

type CreateNewsDtoType = Output<typeof CreateNewsDto>;

export { CreateNewsDto, CreateNewsDtoType, Type };
