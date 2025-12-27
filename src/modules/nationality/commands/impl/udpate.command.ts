import { UpdateNationalityDtoType } from '../../dto/update.dto';

export default class UpdateNationalityCommand {
  constructor(
    public readonly id: number,
    public readonly input: UpdateNationalityDtoType,
  ) {}
}
