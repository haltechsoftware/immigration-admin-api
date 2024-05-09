import { LanguageDto } from 'src/common/dtos/language.dto';
import { Output, partial } from 'valibot';

export const QueryCheckpointByIdDto = partial(LanguageDto);

export type QueryCheckpointByIdDtoType = Output<typeof QueryCheckpointByIdDto>;
