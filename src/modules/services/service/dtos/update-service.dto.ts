import { Output, object } from 'valibot';
import { ServiceTranslateSchema } from './service-translate.schema';

const UpdateServiceDto = object({
  lo: ServiceTranslateSchema,
  en: ServiceTranslateSchema,
  zh_cn: ServiceTranslateSchema,
});

type UpdateServiceDtoType = Output<typeof UpdateServiceDto>;

export { UpdateServiceDto, UpdateServiceDtoType };
