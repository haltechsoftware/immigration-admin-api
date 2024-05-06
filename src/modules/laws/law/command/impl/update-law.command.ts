import { UpdateLawDtoType } from '../../dto/update-law.dto';

export default class UpdateLawCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateLawDtoType,
  ) {}
}
