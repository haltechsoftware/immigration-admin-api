import { NotFoundException } from '@nestjs/common';
import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, partial, string, transform } from 'valibot';

const QueryCheckpointClientDto = merge([
  object({
    country: optional(string()),
    province_id: optional(string()),
  }),
  partial(LanguageDto),
  OffsetBasePaginateDto,
]);

type QueryCheckpointClientDtoType = Output<typeof QueryCheckpointClientDto>;

export { QueryCheckpointClientDto, QueryCheckpointClientDtoType };
