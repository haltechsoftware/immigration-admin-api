import { NotFoundException } from '@nestjs/common';
import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, number, object, optional, partial, string, transform } from 'valibot';

const QueryProvinceCheckpointClientDto = merge([
    object({
        country: optional(string()),
      }),
      partial(LanguageDto),
      OffsetBasePaginateDto,
    ]);    

type QueryProvinceCheckpointClientDtoType = Output<typeof QueryProvinceCheckpointClientDto>;

export { QueryProvinceCheckpointClientDto, QueryProvinceCheckpointClientDtoType };
