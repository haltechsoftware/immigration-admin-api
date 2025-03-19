import { NotFoundException } from '@nestjs/common';
import { LanguageDto } from 'src/common/dtos/language.dto';
import { OffsetBasePaginateDto } from 'src/common/dtos/offset-base-paginate.dto';
import { Output, merge, object, optional, partial, string, transform } from 'valibot';

const QueryCategoryClientDto = merge([
  partial(LanguageDto),
  OffsetBasePaginateDto,
]);

type QueryCategoryClientDtoType = Output<typeof QueryCategoryClientDto>;

export { QueryCategoryClientDto, QueryCategoryClientDtoType };
