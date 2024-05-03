import { Output, mergeAsync, object, string, transform } from 'valibot';
import { CreateNewsCategorytDto } from './create-news-category.dto';

const UpdateNewsCategorytDto = mergeAsync([
  CreateNewsCategorytDto,
  object({
    lo_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
    en_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
    zh_cn_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
  }),
]);

type UpdateNewsCategorytDtoType = Output<
  typeof UpdateNewsCategorytDto
>;

export { UpdateNewsCategorytDto, UpdateNewsCategorytDtoType };
