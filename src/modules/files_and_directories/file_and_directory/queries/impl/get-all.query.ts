import { QueryFileAndDirectoryDtoType } from '../../dtos/query-file-and-directory.dto';

export class GetAllFilesAndDirectoryQuery {
  constructor(public readonly input: QueryFileAndDirectoryDtoType) {}
}
