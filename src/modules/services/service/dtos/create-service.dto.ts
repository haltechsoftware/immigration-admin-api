import { Output, object, omit } from 'valibot';
import { ServiceTranslateSchema } from './service-translate.schema';

const CreateServiceDto = object({
  lo: omit(ServiceTranslateSchema, ['id']),
  en: omit(ServiceTranslateSchema, ['id']),
  zh_cn: omit(ServiceTranslateSchema, ['id']),
});

type CreateServiceDtoType = Output<typeof CreateServiceDto>;

export { CreateServiceDto, CreateServiceDtoType };
