import { Output, object } from 'valibot';
import { LostPassportTranslateSchema } from './lost-passport-translate.schema';

const UpdateLostPassportDto = object({
  lo: LostPassportTranslateSchema,
  en: LostPassportTranslateSchema,
  zh_cn: LostPassportTranslateSchema,
});

type UpdateLostPassportDtoType = Output<typeof UpdateLostPassportDto>;

export { UpdateLostPassportDto, UpdateLostPassportDtoType };
