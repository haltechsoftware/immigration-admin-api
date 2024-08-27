import { LanguageDto } from 'src/common/dtos/language.dto';
import { Output, partial } from 'valibot';

export const QueryServiceByIdDto = partial(LanguageDto);

export type QueryServiceByIdDtoType = Output<typeof QueryServiceByIdDto>;
