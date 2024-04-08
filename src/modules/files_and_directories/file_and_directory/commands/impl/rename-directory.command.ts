import { RenameDirectoryDtoType } from '../../dtos/rename-directory.dto';

export class RenameDirectoryCommand {
  constructor(
    public readonly id: number,
    public readonly input: RenameDirectoryDtoType,
  ) {}
}
