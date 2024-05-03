import { Output, mergeAsync, object, string, transform } from 'valibot';
import { CreateNewsDto } from './create-news.dto';
const UpdateNewsDto = mergeAsync([
  CreateNewsDto,
  object({
    lo_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
    en_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
    zh_cn_id: transform(string('ຈະຕ້ອງເປັນ string'), (input) => Number(input)),
  }),
]);

type UpdateNewsDtoType = Output<typeof UpdateNewsDto>;

export { UpdateNewsDto, UpdateNewsDtoType };
