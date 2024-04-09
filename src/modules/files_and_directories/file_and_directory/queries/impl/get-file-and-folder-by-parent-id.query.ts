import { QueryFileAndFolderByParentIdDtoType } from '../../dtos/query-file-and-folder-by-parent-id.dto';

export class GetFileAndFolderByParentIdQuery {
  constructor(public readonly dto: QueryFileAndFolderByParentIdDtoType) {}
}
