import {
  object,
  Output,
  optional,
} from 'valibot';
import { LanguageDto } from 'src/common/dtos/language.dto';

const GetByIdClientDto = object({
  lang: optional(LanguageDto.entries.lang),
});

type GetByIdClientDtoType = Output<typeof GetByIdClientDto>;

export { GetByIdClientDto, type GetByIdClientDtoType };
