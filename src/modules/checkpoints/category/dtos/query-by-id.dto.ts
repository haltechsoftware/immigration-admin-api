import { LanguageDto } from 'src/common/dtos/language.dto';
import { Output, partial } from 'valibot';

export const QueryCheckpointCategoryByIdDto = partial(LanguageDto);

export type QueryCheckpointCategoryByIdDtoType = Output<typeof QueryCheckpointCategoryByIdDto>;
