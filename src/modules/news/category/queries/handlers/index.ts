import { Provider } from '@nestjs/common';
import { GetCategoryByIdHandler } from './news-category-get-by-id.repository';
import { GetCategoryOffsetBasePaginateQueryHandler } from './news-category-get-paginate.repository';

export const newCategoryQuery: Provider[] = [
  GetCategoryOffsetBasePaginateQueryHandler,
  GetCategoryByIdHandler,
];
